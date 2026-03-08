from django.db import models
from django.utils import timezone


class PersonType(models.TextChoices):
    FILIP = "filip", "Filip"
    KLARA = "klara", "Klara"


class PersonGoal(models.Model):
    person_type = models.CharField(
        max_length=10,
        choices=PersonType.choices,
        unique=True,
    )
    daily_goal_calories = models.PositiveIntegerField(default=2000)
    auto_add_meal_plan = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "person_goal"

    def __str__(self):
        return f"{self.person_type} - {self.daily_goal_calories} kcal/day"


class Category(models.Model):
    name = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "category"
        ordering = ["name"]

    def __str__(self):
        return self.name


class PredefinedMeal(models.Model):
    name = models.CharField(max_length=200)
    calories = models.PositiveIntegerField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="meals")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "predefined_meal"
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} ({self.calories} kcal)"


class PredefinedMealIngredient(models.Model):
    meal = models.ForeignKey(PredefinedMeal, on_delete=models.CASCADE, related_name="ingredients")
    name = models.CharField(max_length=200)
    weight_grams = models.DecimalField(max_digits=7, decimal_places=2, blank=True, null=True)

    class Meta:
        db_table = "predefined_meal_ingredient"
        ordering = ["id"]

    def __str__(self):
        if self.weight_grams:
            return f"{self.name} ({self.weight_grams}g)"
        return self.name


class MealPlan(models.Model):
    person_type = models.CharField(max_length=10, choices=PersonType.choices)
    date = models.DateField()
    predefined_meal = models.ForeignKey(
        PredefinedMeal, on_delete=models.CASCADE, related_name="meal_plans"
    )
    is_processed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "meal_plan"
        ordering = ["date", "id"]

    def __str__(self):
        return f"{self.person_type} - {self.predefined_meal.name} on {self.date}"


class CalorieEntry(models.Model):
    person_type = models.CharField(max_length=10, choices=PersonType.choices)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, default="")
    calories = models.PositiveIntegerField()
    image = models.ImageField(upload_to="entries/%Y/%m/", blank=True, null=True)
    eaten_at = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    predefined_meal = models.ForeignKey(
        "PredefinedMeal",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="entries",
    )

    class Meta:
        db_table = "calorie_entry"
        ordering = ["-eaten_at"]

    def __str__(self):
        return f"{self.person_type} - {self.title} ({self.calories} kcal)"


class Ingredient(models.Model):
    entry = models.ForeignKey(
        CalorieEntry,
        on_delete=models.CASCADE,
        related_name="ingredients",
    )
    name = models.CharField(max_length=200)
    weight_grams = models.DecimalField(
        max_digits=7, decimal_places=2, blank=True, null=True
    )

    class Meta:
        db_table = "ingredient"
        ordering = ["id"]

    def __str__(self):
        if self.weight_grams:
            return f"{self.name} ({self.weight_grams}g)"
        return self.name
