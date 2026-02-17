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
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "person_goal"

    def __str__(self):
        return f"{self.person_type} - {self.daily_goal_calories} kcal/day"


class CalorieEntry(models.Model):
    person_type = models.CharField(max_length=10, choices=PersonType.choices)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, default="")
    calories = models.PositiveIntegerField()
    image = models.ImageField(upload_to="entries/%Y/%m/", blank=True, null=True)
    eaten_at = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)

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
