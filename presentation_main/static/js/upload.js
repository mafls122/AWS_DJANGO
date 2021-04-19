$(function(){

    $('#upload_btn').on('click', function(){
        uploadFile();
    });

});

function uploadFile(){

    var form = $('#uploadForm')[0];
    var formData = new FormData(form);

    $.ajax({
        url : '13.209.142.58:8000/upload',
        type : 'POST',
        data : formData,
        contentType : false,
        processData : false
    }).done(function(data){
        alter('성공');
    });
}

