$(function(){
    $('#upload_btn').on('click', function(){
        uploadFile();
    });
});


function uploadFile(){

    var formData = new FormData();
    formData.append("file",document.getElementById("file").files[0]);
    formData.append("gender", $("input[type='radio'][name='gender']:checked").val());

    var xhr_upload = new XMLHttpRequest();
    var xhr_face = new XMLHttpRequest();
    var xhr_voice = new XMLHttpRequest();

    xhr_upload.open("POST","http://13.209.142.58:8000/upload/",true);
    xhr_face.open("POST","http://3.36.222.252:8000/face/",true);
    xhr_voice.open("POST","http://13.209.142.58:8000/voice/",true);

    xhr_upload.responseType='json';
    xhr_face.responseType='json';
    xhr_voice.responseType='json';

    xhr_upload.send(formData);
    xhr_face.send(formData);
    xhr_voice.send(formData);

    xhr_face.onreadystatechange = function (e) {
        // status는 response 상태 코드를 반환 : 200 => 정상 응답
        if(xhr_face.status === 200) {
            xhr_face.onload = () => {

                var data = xhr_face.response;
                console.log(data);
                console.log(typeof(data));

                var face_label = []
                var face_limit = data.face_json.face.mouth.x
                var i = 0
                do{
                    face_label.push(i);
                    i += 50;
                }
                while (i <= face_limit)

                var mouth = data.face_json.face.mouth.y
                var brow = data.face_json.face.brow.y
                var clown = data.face_json.face.clown.y
                var nasolabial_folds = data.face_json.face.nasolabial_folds.y

                // Face : line Chart
                let faceChartData = {
                    labels: [0, 50, 100, 150, 200, 250, 300, 340],
                    datasets: [{
                        label : 'mouth',
                        data: mouth,
                        backgroundColor : '#a5dff9',
                        borderColor : '#a5dff9'
                    },
                    {
                        label : 'clown',
                        data: clown,
                        backgroundColor : '#ec7079',
                        borderColor : '#ec7079'
                    },
                    {
                        label : 'brow',
                        data: brow,
                        backgroundColor : '#bb9ecb',
                        borderColor : '#bb9ecb'
                    },
                    {
                        label : 'nasolabial_folds',
                        data: nasolabial_folds,
                        backgroundColor : '#ffdfa2',
                        borderColor : '#ffdfa2'
                    }
                    ]
                };
                faceChartDraw(faceChartData)

            }
        }
        else {
                console.log('Face engine Error!');
                console.log(e);
        }
    };
}


function faceChartDraw(face_data) {
    let facectx = document.getElementById('FaceChartCanvas').getContext('2d');

    window.faceChart = new Chart(facectx, {
        type: 'line',
        labels : 'mouth',
        data: face_data,
        options: {
            plugins: {
                      legend: {
                               display : false,
                              },
                      title: {
                               display: true,
                               text: '얼굴 표정 변화율',
                               position : 'bottom',
                              }
                            },
            scales: {
                x: {
                    beginAtZero: true
                }
            }
        }
    });
}