from django.contrib import admin
from users.models import User, Confession

class ConfessionInLine(admin.TabularInline):
    model = Confession
    extra = 2

class UserAdmin(admin.ModelAdmin):
    inlines = [ConfessionInLine]
    list_display = ('vk_id',)

admin.site.register(User, UserAdmin)
