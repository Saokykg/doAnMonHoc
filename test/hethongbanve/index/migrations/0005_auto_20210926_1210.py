# Generated by Django 3.2.6 on 2021-09-26 05:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('index', '0004_auto_20210925_1544'),
    ]

    operations = [
        migrations.AddField(
            model_name='modelsxe',
            name='mo_ta',
            field=models.TextField(null=True),
        ),
        migrations.AddField(
            model_name='xe',
            name='ghi_chu',
            field=models.TextField(null=True),
        ),
    ]
