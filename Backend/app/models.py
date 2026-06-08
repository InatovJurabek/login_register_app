from django.contrib.auth.models import AbstractUser
from django.db import models
 
class User(AbstractUser):
    USERNAME_FIELD = 'username'
    email = models.EmailField(unique=True)
    
    
    def __str__(self):
        return self.username