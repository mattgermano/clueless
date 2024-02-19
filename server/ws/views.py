from django.shortcuts import render
from django.http import HttpRequest, HttpResponse


def index(request: HttpRequest):
    return render("Hello World!")


def hello(request: HttpRequest):
    return HttpResponse("hello!")
