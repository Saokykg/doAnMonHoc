# Generated by Django 3.2.6 on 2021-10-06 13:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('index', '0007_chuyenxe_gio_chay'),
    ]

    operations = [
        migrations.CreateModel(
            name='Banner',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('updated_date', models.DateTimeField(auto_now=True)),
                ('active', models.BooleanField(default=True)),
                ('banner', models.ImageField(upload_to='banners/%Y/%m')),
                ('content', models.TextField()),
                ('description', models.TextField()),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
