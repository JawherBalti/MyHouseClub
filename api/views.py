from django.http.response import JsonResponse
from django.shortcuts import render
from .models import Room
from .serializers import RoomSerializer, CreateRoomSerializer, UpdateRoomSerializer
from rest_framework import generics, status #status get access to http status when returning response
from rest_framework.views import APIView #overwrite default methods
from rest_framework.response import Response #send response from view
# Create your views here.

#generics.CreateAPIView (post) this view is already setup to return all the rooms
#you can alse use generics.ListAPIView: (get)
class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer
    
    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            host = self.request.session.session_key
            queryset = Room.objects.filter(host=host)
            if queryset.exists():
                room = queryset[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.save(update_fields=['guest_can_pause','votes_to_skip'])
                self.request.session['room_code'] = room.code #check if user is in room
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            else:
                room = Room(host=host, guest_can_pause=guest_can_pause, votes_to_skip=votes_to_skip )
                room.save()
                self.request.session['room_code'] = room.code #check if user is in room
                return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)

        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

class GetRoom(APIView):
    serializer_class = RoomSerializer
    lookup_url_kwarg = 'code' #parameter to pass to url
    
    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)
        if code != None:
            room = Room.objects.filter(code=code)
            if len(room) > 0:
                data = RoomSerializer(room[0]).data
                data['is_host'] = self.request.session.session_key == room[0].host
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Room Not Found': 'Invalid Room Code'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({'Bad Request': 'Code Not found in request'}, status=status.HTTP_400_BAD_REQUEST)

class JoinRoom(APIView):
    
    lookup_url_kwarg = 'code' #parameter to pass to url

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        code = request.data.get(self.lookup_url_kwarg)
        if code != None:
            room_result = Room.objects.filter(code=code)
            if len(room_result) > 0: # we can also use if not room_result.exists():
                room = room_result[0]
                self.request.session['room_code'] = code #check if user is in room
                return Response({'Message': 'Room joined'}, status=status.HTTP_200_OK)

            return Response({'Bad Request': 'Invalid Room Code'}, status=status.HTTP_400_BAD_REQUEST)
   
        return Response({'Bad Request': 'Did Not Find A Code Key'}, status=status.HTTP_400_BAD_REQUEST)

class UserInRoom(APIView):
    def get(self, request, format=None):
        
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        data = {'code': self.request.session.get('room_code')}

        return JsonResponse(data, status=status.HTTP_200_OK) #serialize a python dictionnary to json

class LeaveRoom(APIView):
    def post(self, request, format=None):
        if 'room_code' in self.request.session:
            self.request.session.pop('room_code')
            host_id = self.request.session.session_key
            room_results = Room.objects.filter(host=host_id)
            if len(room_results) > 0: #if host leaves room, delete it
                room = room_results[0]
                room.delete()

        return Response({'Message': 'Success'}, status=status.HTTP_200_OK)

class UpdateRoom(APIView):
    serializer_class = UpdateRoomSerializer

    def patch(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            code = serializer.data.get('code')

            queryset = Room.objects.filter(code=code)
            if not queryset.exists():
                return Response({'msg': 'Room not found.'}, status=status.HTTP_404_NOT_FOUND)

            room = queryset[0]
            user_id = self.request.session.session_key
            if room.host != user_id:
                return Response({'msg': 'You are not the host of this room.'}, status=status.HTTP_403_FORBIDDEN)

            room.guest_can_pause = guest_can_pause
            room.votes_to_skip = votes_to_skip
            room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
            return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)

        return Response({'Bad Request': "Invalid Data..."}, status=status.HTTP_400_BAD_REQUEST)