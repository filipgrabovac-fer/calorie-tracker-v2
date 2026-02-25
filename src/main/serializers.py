import json
import calendar
from datetime import date, timedelta
from django.db.models import Sum, Count
from django.db.models.functions import TruncDate
from rest_framework import serializers
from .models import CalorieEntry, Ingredient, PersonGoal


class EstimateCaloriesIngredientSerializer(serializers.Serializer):
    name = serializers.CharField(allow_blank=False)
    weight_grams = serializers.IntegerField(allow_null=True, required=False)


class EstimateCaloriesRequestSerializer(serializers.Serializer):
    title = serializers.CharField(allow_blank=True, required=False, default="")
    ingredients = EstimateCaloriesIngredientSerializer(many=True)

    def validate_ingredients(self, value):
        if not value:
            raise serializers.ValidationError("At least one ingredient is required.")
        names = [ing.get("name", "").strip() for ing in value if ing.get("name")]
        if not any(names):
            raise serializers.ValidationError(
                "At least one ingredient must have a non-empty name."
            )
        return value


class EstimateCaloriesResponseSerializer(serializers.Serializer):
    estimated_calories = serializers.IntegerField(min_value=0)


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ["id", "name", "weight_grams"]


class CalorieEntrySerializer(serializers.ModelSerializer):
    ingredients = IngredientSerializer(many=True, required=False)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = CalorieEntry
        fields = [
            "id",
            "person_type",
            "title",
            "description",
            "calories",
            "image",
            "image_url",
            "ingredients",
            "eaten_at",
            "created_at",
        ]
        read_only_fields = ["id", "created_at", "image_url"]
        extra_kwargs = {"image": {"write_only": True, "required": False}}

    def get_image_url(self, obj):
        request = self.context.get("request")
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None

    def _parse_ingredients(self, data):
        """Parse ingredients from either a JSON string (multipart) or a list (JSON)."""
        raw = data.get("ingredients")
        if raw is None:
            return []
        if isinstance(raw, str):
            try:
                return json.loads(raw)
            except (json.JSONDecodeError, TypeError):
                return []
        if isinstance(raw, list):
            return raw
        return []

    def create(self, validated_data):
        ingredients_data = validated_data.pop("ingredients", [])
        # Re-parse from raw request data if empty (handles multipart FormData)
        if not ingredients_data and self.initial_data:
            ingredients_data = self._parse_ingredients(self.initial_data)
        entry = CalorieEntry.objects.create(**validated_data)
        for ingredient_data in ingredients_data:
            Ingredient.objects.create(entry=entry, **ingredient_data)
        return entry

    def update(self, instance, validated_data):
        ingredients_data = validated_data.pop("ingredients", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if ingredients_data is not None:
            instance.ingredients.all().delete()
            for ingredient_data in ingredients_data:
                Ingredient.objects.create(entry=instance, **ingredient_data)
        return instance


class DailyCalorieSummarySerializer(serializers.Serializer):
    date = serializers.DateField()
    total_calories = serializers.IntegerField()
    entry_count = serializers.IntegerField()


class MonthlyDashboardSerializer(serializers.Serializer):
    person_type = serializers.CharField()
    year = serializers.IntegerField()
    month = serializers.IntegerField()
    daily_goal = serializers.IntegerField()
    monthly_goal = serializers.IntegerField()
    total_calories = serializers.IntegerField()
    daily_summaries = DailyCalorieSummarySerializer(many=True)
    avg_calories_this_week = serializers.FloatField()
    avg_calories_this_month = serializers.FloatField()
    avg_calories_this_year = serializers.FloatField()


class PersonGoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonGoal
        fields = ["id", "person_type", "daily_goal_calories", "updated_at"]
        read_only_fields = ["id", "updated_at"]
