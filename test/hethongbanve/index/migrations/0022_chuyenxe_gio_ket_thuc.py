# Generated by Django 3.2.6 on 2021-10-28 14:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('index', '0021_vexe_code'),
    ]

    operations = [
        migrations.AddField(
            model_name='chuyenxe',
            name='gio_ket_thuc',
            field=models.DateTimeField(null=True),
        ),
    ]
