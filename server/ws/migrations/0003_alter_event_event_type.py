# Generated by Django 5.0.2 on 2024-05-05 15:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("ws", "0002_alter_event_event_type_delete_eventtype"),
    ]

    operations = [
        migrations.AlterField(
            model_name="event",
            name="event_type",
            field=models.CharField(
                choices=[
                    ("init", "init"),
                    ("move", "move"),
                    ("suggestion", "suggestion"),
                    ("accusation", "accusation"),
                    ("disprove", "disprove"),
                    ("end_turn", "end_turn"),
                    ("query_game", "query_game"),
                    ("chat", "chat"),
                    ("win", "win"),
                    ("lose", "lose"),
                    ("all losers", "all losers"),
                ],
                max_length=20,
            ),
        ),
    ]
