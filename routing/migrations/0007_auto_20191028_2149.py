# Generated by Django 2.2.4 on 2019-10-28 21:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('routing', '0006_auto_20191028_1002'),
    ]

    operations = [
        migrations.RenameField(
            model_name='drivetimequery',
            old_name='pending_polygon',
            new_name='polygon_pending',
        ),
    ]