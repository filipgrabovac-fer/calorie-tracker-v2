# Generated migration for Cloudinary image_url support

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0004_persongoal_estimation_notes'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='calorieentry',
            name='image',
        ),
        migrations.AddField(
            model_name='calorieentry',
            name='image_url',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
        migrations.AddField(
            model_name='predefinedmeal',
            name='image_url',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
    ]
