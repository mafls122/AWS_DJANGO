from django.urls import path
from . import views
from presentation_main.views import FileUp

urlpatterns = [
    path('', views.index, name='index'),
    path('upload_file/', FileUp.as_view()),
    path('upload/', views.upload_image, name='upload_image'),
path("ajax_file_upload/",views.ajax_file_upload_save),
]
