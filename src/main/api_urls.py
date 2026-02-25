from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CalorieEntryViewSet,
    EstimateCaloriesViewSet,
    MonthlyDashboardViewSet,
    PersonGoalViewSet,
)

router = DefaultRouter()
router.register(r"entries", CalorieEntryViewSet, basename="entries")
router.register(r"estimate-calories", EstimateCaloriesViewSet, basename="estimate-calories")
router.register(r"dashboard", MonthlyDashboardViewSet, basename="dashboard")
router.register(r"goals", PersonGoalViewSet, basename="goals")

urlpatterns = [
    path("", include(router.urls)),
]
