# Generated by Django 3.2.6 on 2021-10-26 08:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('index', '0017_auto_20211018_1432'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='role',
            field=models.CharField(default='costumer', max_length=10),
        ),
    ]