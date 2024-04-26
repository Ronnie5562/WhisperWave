from server.models import Server, Category
from django.db.models import Count
from rest_framework import viewsets
from server.schema import server_list_docs
from rest_framework.response import Response
from server.serializers import ServerSerializer, CategorySerializer
from rest_framework.exceptions import (
    ValidationError,
    AuthenticationFailed
)
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema


class CategoryListViewSet(viewsets.ViewSet):
    queryset = Category.objects.all()

    @extend_schema(responses=CategorySerializer)
    def list(self, request):
        serializer = CategorySerializer(self.queryset, many=True)
        return Response(serializer.data)



class ServerListViewSet(viewsets.ViewSet):
    """
    A ViewSet for retrieving a list of servers with optional filtering options.

    Attributes:
        queryset (QuerySet): The queryset containing all servers.

    Methods:
        list(request): Retrieves a list of servers based on optional query parameters.

    Raises:
        AuthenticationFailed: If the request is made by an unauthenticated user for specific filtering options.
        ValidationError: If invalid query parameters are provided or if a server with the specified ID does not exist.
    """

    # permission_classes = [IsAuthenticated]
    queryset = Server.objects.all()

    @server_list_docs
    def list(self, request):
        """
        Retrieve a list of servers based on optional query parameters.

        - `category`: Filter servers by category name.
        - `qty`: Limit the number of servers returned.
        - `by_user`: Filter servers by the authenticated user if set to true.
        - `by_server_id`: Filter servers by server ID.
        - `with_num_members`: Include the number of members in each server if set to true.

        Args:
            request (Request): The HTTP request object.

        Returns:
            Response: A JSON response containing a list of serialized server data.

        Raises:
            AuthenticationFailed: If the request is made by an unauthenticated user for specific filtering options.
            ValidationError: If invalid query parameters are provided or if a server with the specified ID does not exist.
        """

        category = request.query_params.get("category", None)
        qty = request.query_params.get("qty", None)
        by_user = request.query_params.get("by_user") == "true"
        by_server_id = request.query_params.get("by_server_id", None)
        with_num_members = request.query_params.get(
            "with_num_members") == "true"

        if by_user or by_server_id and not request.user.is_authenticated:
            raise AuthenticationFailed(
                "Authentication required for user-based filtering.")

        if category:
            self.queryset = self.queryset.filter(category__name=category)

        if by_user:
            user_id = request.user.id
            self.queryset = self.queryset.filter(owner=user_id)

        if with_num_members:
            self.queryset = self.queryset.annotate(
                num_members=Count("members"))

        if qty:
            try:
                qty = int(qty)
                if qty <= 0:
                    raise ValueError("Quantity must be a positive integer.")
                self.queryset = self.queryset[:qty]
            except ValueError:
                raise ValidationError(
                    "Invalid value for 'qty' parameter. Must be a positive integer.")

        if by_server_id:
            try:
                by_server_id = int(by_server_id)
                self.queryset = self.queryset.filter(id=by_server_id)
                if not self.queryset.exists():
                    raise ValidationError(
                        detail=f"Server with id {by_server_id} not found")
            except ValueError:
                raise ValidationError(
                    "Invalid value for 'by_server_id' parameter. Must be an integer.")

        serializer = ServerSerializer(self.queryset, many=True, context={
                                      "num_members": with_num_members})
        return Response(serializer.data)
