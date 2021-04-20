from django.shortcuts import render, redirect
from django.core.files.storage import default_storage
from django.views import View
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

def index(request):
    return render(request, 'pages/index.html', {})

def upload_image(request):
    return render(request, 'pages/upload.html', {})



class FileUp(View):
    def post(self, request):
        video_file = request.FILES['file']
        default_storage.save(video_file.name, video_file)

        return redirect('../upload/#work')

@csrf_exempt
def ajax_file_upload_save(request):
    print(request.POST)
    print(request.FILES)
    file1=request.FILES['file1']
    return HttpResponse('<h1>success</h1>')