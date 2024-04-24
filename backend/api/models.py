from django.db import models

class Todo(models.Model):
    title = models.CharField(max_length=225)
    descriptions = models.TextField()
    amount = models.PositiveIntegerField()

    def __self__(self):
        return self.title