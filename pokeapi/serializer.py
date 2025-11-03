from rest_framework import serializers
from .models import pokemon

class pokeapiSerializer(serializers.ModelSerializer):
    class Meta:
        model = pokemon
        fields = '__all__' # Serialize all fields of the pokemon model