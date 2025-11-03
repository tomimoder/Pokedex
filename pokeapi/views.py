from django.shortcuts import render
from rest_framework import viewsets, status
from .serializer import pokeapiSerializer
from .models import pokemon
from rest_framework.response import Response
from rest_framework.decorators import api_view
import requests

POKEAPI_BASE = "https://pokeapi.co/api/v2"

# Create your views here.
class pokeapiViewSet(viewsets.ModelViewSet):
    queryset = pokemon.objects.all()
    serializer_class = pokeapiSerializer
    lookup_field = 'name' #Hace referencia a buscar por nombre en vez de ID
    
    def retrieve(self, request, name=None):
        """Busca en DB o PokéAPI"""
        try:
            poke = pokemon.objects.get(name=name.lower())
        except pokemon.DoesNotExist:
            data = get_pokemon_data(name)
            if not data:
                return Response(
                    {"error": "Pokemon not found"}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            poke = pokemon.objects.create(**data)
        
        serializer = self.get_serializer(poke)
        return Response(serializer.data)


def extract_evolutions(chain):
    evolutions = [chain['species']['name']]
    while chain['evolves_to']:
        chain = chain['evolves_to'][0]
        evolutions.append(chain['species']['name'])
    return evolutions


def get_pokemon_data(name):
    res = requests.get(f"{POKEAPI_BASE}/pokemon/{name.lower()}")
    if res.status_code != 200:
        return None
    
    data = res.json()
    
    name = data['name']
    types = []

    for t in data['types']:
        types.append(t['type']['name']) 

    image = data['sprites']['front_default']

    weaknesses = []

    for t in types:
        type_res = requests.get(f"{POKEAPI_BASE}/type/{t}")
        if type_res.status_code == 200:
            w_data = type_res.json()
            for w in w_data['damage_relations']['double_damage_from']:
                weaknesses.append(w['name'])
    
    weaknesses = list(set(weaknesses))  # Remove duplicates

    species_res = requests.get(f"{POKEAPI_BASE}/pokemon-species/{name.lower()}")
    evolutions = []  

    if species_res.status_code == 200:
        evo_url = species_res.json()['evolution_chain']['url']
        evo_res = requests.get(evo_url)
        if evo_res.status_code == 200:
            evolutions = extract_evolutions(evo_res.json()['chain'])  
    return {
        'name': name,
        'image': image,
        'types': types,
        'weaknesses': weaknesses,
        'evolutions': evolutions  
    }


@api_view(['GET'])
def pokemon_detail(request, name):
    try:
        poke = pokemon.objects.get(name=name.lower())  
        
    except pokemon.DoesNotExist:
        data = get_pokemon_data(name)
        if not data:
            return Response({'error': 'Pokemon not found'}, status=404)
        poke = pokemon.objects.create(**data)  

    serializer = pokeapiSerializer(poke)  
    return Response(serializer.data)