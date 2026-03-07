from django.contrib import admin
from .models import CalorieEntry, Category, Ingredient, PersonGoal, PredefinedMeal, PredefinedMealIngredient


class IngredientInline(admin.TabularInline):
    model = Ingredient
    extra = 1


class PredefinedMealIngredientInline(admin.TabularInline):
    model = PredefinedMealIngredient
    extra = 1


@admin.register(CalorieEntry)
class CalorieEntryAdmin(admin.ModelAdmin):
    list_display = ["title", "person_type", "calories", "eaten_at"]
    list_filter = ["person_type", "eaten_at"]
    inlines = [IngredientInline]


@admin.register(PersonGoal)
class PersonGoalAdmin(admin.ModelAdmin):
    list_display = ["person_type", "daily_goal_calories", "updated_at"]


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "created_at"]


@admin.register(PredefinedMeal)
class PredefinedMealAdmin(admin.ModelAdmin):
    list_display = ["name", "category", "calories", "created_at"]
    list_filter = ["category"]
    inlines = [PredefinedMealIngredientInline]
