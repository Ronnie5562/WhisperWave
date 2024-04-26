from django.contrib import admin

from server.models import Category, Server, Channel

admin.site.register(Category)
admin.site.register(Server)
admin.site.register(Channel)