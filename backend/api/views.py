from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import TodoSerializers
from .models import Todo

class TodoView(APIView):
    def get(self, request, format=None):
        Todos = Todo.objects.all()
        serializer = TodoSerializers(Todos, many=True)
        return Response(serializer.data)
    
    def post(self, request,  format=None):
        serializer = TodoSerializers(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
    
    def put(self, request, pk):
        Todo = self.get_object(pk)
        serializer = TodoSerializers(Todo, request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        Todo = self.get_object(pk=pk)
        Todo.delete()
        return Response("Todo deleted",status=status.HTTP_200_OK)
       
    
    def get_object(self, pk):
        try:
            Todo = Todo.objects.get(pk=pk)
            return Todo
        except Todo.DoseNotExit:
            raise Http404
