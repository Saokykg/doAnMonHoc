# Generated by Django 3.2.6 on 2021-09-26 06:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('index', '0006_auto_20210926_1308'),
    ]

    operations = [
        migrations.AddField(
            model_name='chuyenxe',
            name='gio_chay',
            field=models.DateTimeField(null=True),
        ),
    ]