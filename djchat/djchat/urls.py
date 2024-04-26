"""
URL configuration for djchat project.

"""
from django.contrib import admin
from django.urls import path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView
)
from django.conf import settings
from django.conf.urls.static import static
from server.views import ServerListViewSet, CategoryListViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register("api/servers/select", ServerListViewSet, basename="server")
router.register("api/servers/categories", CategoryListViewSet, basename="category")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/docs/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/schema/ui", SpectacularSwaggerView.as_view(url_name="schema")),
] + router.urls

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
