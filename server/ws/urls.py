from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("hello-django", views.hello, name="hello-django"),
]
