import calendar
from datetime import date, timedelta
from django.db.models import Sum, Count
from django.db.models.functions import TruncDate
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

from .models import CalorieEntry, PersonGoal
from .serializers import (
    CalorieEntrySerializer,
    EstimateCaloriesRequestSerializer,
    EstimateCaloriesResponseSerializer,
    MonthlyDashboardSerializer,
    PersonGoalSerializer,
)

try:
    from graph.calorie_estimation import estimate_calories
except Exception:
    estimate_calories = None


class CalorieEntryViewSet(viewsets.ModelViewSet):
    serializer_class = CalorieEntrySerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        qs = CalorieEntry.objects.prefetch_related("ingredients")
        person_type = self.request.query_params.get("person_type")
        year = self.request.query_params.get("year")
        month = self.request.query_params.get("month")
        if person_type:
            qs = qs.filter(person_type=person_type)
        if year:
            qs = qs.filter(eaten_at__year=year)
        if month:
            qs = qs.filter(eaten_at__month=month)
        return qs

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context


class MonthlyDashboardViewSet(viewsets.ViewSet):
    @extend_schema(
        parameters=[
            OpenApiParameter("person_type", OpenApiTypes.STR, required=True),
            OpenApiParameter("year", OpenApiTypes.INT, required=False),
            OpenApiParameter("month", OpenApiTypes.INT, required=False),
        ],
        responses=MonthlyDashboardSerializer,
    )
    def list(self, request):
        person_type = request.query_params.get("person_type", "")
        today = date.today()
        year = int(request.query_params.get("year", today.year))
        month = int(request.query_params.get("month", today.month))

        goal_obj, _ = PersonGoal.objects.get_or_create(
            person_type=person_type,
            defaults={"daily_goal_calories": 2000},
        )
        daily_goal = goal_obj.daily_goal_calories
        days_in_month = calendar.monthrange(year, month)[1]
        monthly_goal = daily_goal * days_in_month

        entries_qs = CalorieEntry.objects.filter(
            person_type=person_type,
            eaten_at__year=year,
            eaten_at__month=month,
        )

        daily_summaries_raw = list(
            entries_qs
            .annotate(summary_date=TruncDate("eaten_at"))
            .values("summary_date")
            .annotate(total_calories=Sum("calories"), entry_count=Count("id"))
            .order_by("summary_date")
        )

        daily_summaries = [
            {
                "date": row["summary_date"],
                "total_calories": row["total_calories"],
                "entry_count": row["entry_count"],
            }
            for row in daily_summaries_raw
        ]

        total_calories = entries_qs.aggregate(total=Sum("calories"))["total"] or 0

        days_with_entries = len(daily_summaries)
        avg_calories_this_month = (
            round(total_calories / days_with_entries, 1) if days_with_entries > 0 else 0.0
        )

        week_start = today - timedelta(days=today.weekday())
        week_end = week_start + timedelta(days=6)
        week_daily = list(
            CalorieEntry.objects.filter(
                person_type=person_type,
                eaten_at__date__gte=week_start,
                eaten_at__date__lte=week_end,
            )
            .annotate(summary_date=TruncDate("eaten_at"))
            .values("summary_date")
            .annotate(day_total=Sum("calories"))
            .values_list("day_total", flat=True)
        )
        avg_calories_this_week = (
            round(sum(week_daily) / len(week_daily), 1) if week_daily else 0.0
        )

        year_daily = list(
            CalorieEntry.objects.filter(
                person_type=person_type,
                eaten_at__year=year,
            )
            .annotate(summary_date=TruncDate("eaten_at"))
            .values("summary_date")
            .annotate(day_total=Sum("calories"))
            .values_list("day_total", flat=True)
        )
        avg_calories_this_year = (
            round(sum(year_daily) / len(year_daily), 1) if year_daily else 0.0
        )

        data = {
            "person_type": person_type,
            "year": year,
            "month": month,
            "daily_goal": daily_goal,
            "monthly_goal": monthly_goal,
            "total_calories": total_calories,
            "daily_summaries": daily_summaries,
            "avg_calories_this_week": avg_calories_this_week,
            "avg_calories_this_month": avg_calories_this_month,
            "avg_calories_this_year": avg_calories_this_year,
        }
        serializer = MonthlyDashboardSerializer(data)
        return Response(serializer.data)


class EstimateCaloriesViewSet(viewsets.ViewSet):
    parser_classes = [JSONParser]

    @extend_schema(
        request=EstimateCaloriesRequestSerializer,
        responses={200: EstimateCaloriesResponseSerializer},
    )
    def create(self, request):
        if estimate_calories is None:
            return Response(
                {"detail": "Calorie estimation is not available."},
                status=503,
            )
        serializer = EstimateCaloriesRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        title = data.get("title") or None
        if title is not None and not title.strip():
            title = None
        ingredients = [
            {"name": ing["name"], "weight_grams": ing.get("weight_grams")}
            for ing in data["ingredients"]
        ]
        try:
            estimated = estimate_calories(title=title, ingredients=ingredients)
        except ValueError as e:
            return Response({"detail": str(e)}, status=400)
        except Exception as e:
            return Response(
                {"detail": "Calorie estimation failed."},
                status=503,
            )
        return Response(
            EstimateCaloriesResponseSerializer({"estimated_calories": estimated}).data
        )


class PersonGoalViewSet(viewsets.ModelViewSet):
    serializer_class = PersonGoalSerializer
    queryset = PersonGoal.objects.all()
    http_method_names = ["get", "post", "put", "patch", "head", "options"]

    @extend_schema(
        parameters=[
            OpenApiParameter("person_type", OpenApiTypes.STR, required=True),
        ],
        responses=PersonGoalSerializer,
    )
    @action(detail=False, methods=["get", "patch"], url_path="by-person")
    def by_person(self, request):
        person_type = request.query_params.get("person_type", "")
        obj, _ = PersonGoal.objects.get_or_create(
            person_type=person_type,
            defaults={"daily_goal_calories": 2000},
        )
        if request.method == "GET":
            return Response(PersonGoalSerializer(obj).data)
        serializer = PersonGoalSerializer(obj, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
