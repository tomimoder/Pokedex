from django.urls import path, include
from rest_framework import routers
from pokeapi import views

router = routers.DefaultRouter()
router.register(r'pokemon', views.pokeapiViewSet, 'pokemon')
urlpatterns = [
    path("api/", include(router.urls)),
]