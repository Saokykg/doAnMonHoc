# Generated by Django 3.2.6 on 2021-10-17 14:17

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('index', '0014_auto_20211017_2101'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chuyenxe',
            name='tuyen_duong',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='index.tuyenduong'),
        ),
        migrations.AlterField(
            model_name='chuyenxe',
            name='xe',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='index.xe'),
        ),
    ]
