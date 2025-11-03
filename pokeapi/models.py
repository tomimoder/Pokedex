from django.db import models

# Create your models here.
class pokemon(models.Model):
    name = models.CharField(max_length=100, unique=True)
    image = models.URLField(blank=True, null=True)
    types = models.JSONField()
    weaknesses = models.JSONField(blank=True, null=True)
    evolutions = models.JSONField(blank=True, null=True)   


    def __str__(self):
        return self.name