# Generated by Django 2.2.4 on 2019-11-10 20:05

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bridges', '0006_auto_20190721_1520'),
    ]

    operations = [
        migrations.AddField(
            model_name='newyorkbridge',
            name='drive_time_queries',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), null=True, size=None),
        ),
    ]