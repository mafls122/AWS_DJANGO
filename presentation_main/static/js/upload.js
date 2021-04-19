$(function(){

    $('#upload_btn').on('click', function(){
        uploadFile();
    });

});

function uploadFile(){

    var sendingData = new FormData();
    sendingData.append('file',1234);

   console.log(sendingData);

    $.ajax({
        url : 'http://13.209.142.58:8000/upload/',
        type : 'POST',
        data : sendingData,
        contentType : false,
        processData : false,
        success: function(result){
                                console.log(result);
                            },
        error : function(e){
    console.log(e);
    }
    });
}

