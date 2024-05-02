from rest_framework import viewsets
from rest_framework.response import Response
from webchat.models import Conversation, Message
from webchat.serializers import MessageSerializer
from webchat.schema import list_message_docs


class MessageViewSet(viewsets.ViewSet):
    @list_message_docs
    def list(self, request, *args, **kwargs):
        channel_id = request.query_params.get("channel_id")
        try:
            conversation = Conversation.objects.get(channel_id=channel_id)
            messages = conversation.messages.all()
            serializer = MessageSerializer(messages, many=True)
            return Response(serializer.data)
        except Conversation.DoesNotExist:
            return Response([])
