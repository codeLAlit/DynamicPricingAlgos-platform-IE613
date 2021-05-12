"""IE_Project URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from Platform.views import ChartDataThompson, ChartDataUCB, HomeView, RunView, ThompsonView, UCBView
from django.contrib import admin
from django.urls import path, include
from . import views 

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', HomeView, name="home"),
    path('run', RunView.as_view()),
    path('api', ChartDataThompson.as_view()),
    path('thompson', ThompsonView, name="thompson"),
    path('ucb1', UCBView, name="ucb1"),
    path('api2', ChartDataUCB.as_view())
    # path('api2', Api2, name='api_two'),
]
