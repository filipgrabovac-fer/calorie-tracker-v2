from django.contrib import admin
from .models import CalorieEntry, Ingredient, PersonGoal


class IngredientInline(admin.TabularInline):
    model = Ingredient
    extra = 1


@admin.register(CalorieEntry)
class CalorieEntryAdmin(admin.ModelAdmin):
    list_display = ["title", "person_type", "calories", "eaten_at"]
    list_filter = ["person_type", "eaten_at"]
    inlines = [IngredientInline]


@admin.register(PersonGoal)
class PersonGoalAdmin(admin.ModelAdmin):
    list_display = ["person_type", "daily_goal_calories", "updated_at"]
