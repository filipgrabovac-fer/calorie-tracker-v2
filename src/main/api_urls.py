from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CalorieEntryViewSet,
    CategoryViewSet,
    EstimateCaloriesViewSet,
    MealPlanViewSet,
    MonthlyDashboardViewSet,
    PersonGoalViewSet,
    PredefinedMealViewSet,
    RecipeViewSet,
)

router = DefaultRouter()
router.register(r"entries", CalorieEntryViewSet, basename="entries")
router.register(r"estimate-calories", EstimateCaloriesViewSet, basename="estimate-calories")
router.register(r"dashboard", MonthlyDashboardViewSet, basename="dashboard")
router.register(r"goals", PersonGoalViewSet, basename="goals")
router.register(r"categories", CategoryViewSet, basename="categories")
router.register(r"predefined-meals", PredefinedMealViewSet, basename="predefined-meals")
router.register(r"meal-plans", MealPlanViewSet, basename="meal-plans")
router.register(r"recipes", RecipeViewSet, basename="recipes")

urlpatterns = [
    path("", include(router.urls)),
]
