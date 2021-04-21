$(function(){
    $('#upload_btn').on('click', function(){
        uploadFile();
    });
});


function uploadFile(){

    var formData = new FormData();
    formData.append("file",document.getElementById("file").files[0]);
    formData.append("gender", $("input[type='radio'][name='gender']:checked").val());

    var xhr_voice = new XMLHttpRequest();
    var xhr_speech = new XMLHttpRequest();
    var xhr_pose = new XMLHttpRequest();
    var xhr_face = new XMLHttpRequest();

    xhr_speech.open("POST","http://13.209.142.58:8000/upload/",true);
    xhr_voice.open("POST","http://13.209.142.58:8000/voice/",true);
    xhr_pose.open("POST","http://3.35.213.193:8000/pose/",true);
    xhr_face.open("POST","http://3.36.222.252:8000/face/",true);

    xhr_speech.responseType='json';
    xhr_voice.responseType='json';
    xhr_pose.responseType='json';
    xhr_face.responseType='json';

    xhr_speech.send(formData);
    xhr_voice.send(formData);
    xhr_pose.send(formData);
    xhr_face.send(formData);

    // Voice
    xhr_voice.onreadystatechange = function (e) {
        // status는 response 상태 코드를 반환 : 200 => 정상 응답
        if(xhr_voice.status === 200) {
            xhr_voice.onload = () => {

                var voice_data = xhr_voice.response;
                console.log('voice');
                console.log(voice_data);
                console.log(typeof(voice_data));

                voiceChartDraw(voice_data);

            }
        }
        else {
                console.log('Voice engine Error!');
                console.log(e);
        }
    };

    // Speech
    xhr_speech.onreadystatechange = function (e) {
        // status는 response 상태 코드를 반환 : 200 => 정상 응답
        if(xhr_speech.status === 200) {
            xhr_speech.onload = () => {

                var speech_data = xhr_speech.response;
                console.log('speech');
                console.log(speech_data);

//                faceChartDraw(face_data);

            }
        }
        else {
                console.log('Speech engine Error!');
                console.log(e);
        }
    };

    // Pose
    xhr_pose.onreadystatechange = function (e) {
        // status는 response 상태 코드를 반환 : 200 => 정상 응답
        if(xhr_pose.status === 200) {
            xhr_pose.onload = () => {

                var pose_data = xhr_pose.response;

                poseChartDraw(pose_data);
                shoulderChartDraw(pose_data);
                pelvisChartDraw(pose_data);
                eyeposeChartDraw(pose_data);

            }
        }
        else {
                console.log('Pose engine Error!');
                console.log(e);
        }
    };

    // Face
    xhr_face.onreadystatechange = function (e) {
        // status는 response 상태 코드를 반환 : 200 => 정상 응답
        if(xhr_face.status === 200) {
            xhr_face.onload = () => {

                var face_data = xhr_face.response;

                faceChartDraw(face_data);
                eyeChartDraw(face_data);

            }
        }
        else {
                console.log('Face engine Error!');
                console.log(e);
        }
    };

}

// 목소리 차트
function voiceChartDraw(vdata) {
    let voicectx = document.getElementById('voiceChartCanvas').getContext('2d');

    var voice_label = vdata.voice_json.voice.x
    var voice = vdata.voice_json.voice.y

    let voiceChartData = {
                    labels: voice_label,
                    datasets: [{
                        label : 'voice',
                        data: voice,
                        backgroundColor : '#a5dff9',
                        borderColor : '#a5dff9'
                    },
                    ]
                };

    window.voiceChart = new Chart(voicectx, {
        type: 'line',
        labels : 'voice',
        data: voiceChartData,
        options: {
            plugins: {
                      legend: {
                               display : false,
                              },
                      title: {
                               display: true,
                               text: '목소리의 높낮이',
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

// 표정변화율 차트
function faceChartDraw(fdata) {
    let facectx = document.getElementById('FaceChartCanvas').getContext('2d');

    var face_label = []
    var face_limit = fdata.face_json.face.mouth.x
    var i = 0
    do{
       face_label.push(i);
       i += 50;
    }
    while (i <= face_limit)

    var mouth = fdata.face_json.face.mouth.y
    var brow = fdata.face_json.face.brow.y
    var clown = fdata.face_json.face.clown.y
    var nasolabial_folds = fdata.face_json.face.nasolabial_folds.y

    // Face : line Chart
    let faceChartData = {
                    labels: face_label,
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

    window.faceChart = new Chart(facectx, {
        type: 'line',
        labels : 'face',
        data: faceChartData,
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

// 눈 깜박임 차트
function eyeChartDraw(edata) {
    let eyectx = document.getElementById('eyeblinkChartCanvas').getContext('2d');

    var eye_label = []
    var eye_limit = edata.face_json.eye.x
    var eye = edata.face_json.eye.y
    var j = 1
    while (j <= eye_limit){
        eye_label.push(j);
        j += 1;
    }

    let eyeChartData = {
                    labels: eye_label,
                    datasets: [{
                        label : 'eye_blink',
                        data: eye,
                        backgroundColor : '#a5dff9',
                        borderColor : '#a5dff9',
                        borderWidth: 1
                    },
                    ]
                };

    window.eyeChart = new Chart(eyectx, {
        type: 'bar',
        labels : 'eye',
        data: eyeChartData,
        options: {
            plugins: {
                      legend: {
                               display : false,
                              },
                      title: {
                               display: true,
                               text: '눈 깜박임 횟수',
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

// 전체 자세 차트
function poseChartDraw(pdata) {
    let posectx = document.getElementById('poseChartCanvas').getContext('2d');

    var unbalance = pdata.pose_json.all_pose.unbalance
    var balance = pdata.pose_json.all_pose.balance
    var none = pdata.pose_json.all_pose.none
    var alllen = pdata.pose_json.all_pose.len

    unbalance = (unbalance/alllen) * 100
    balance = (balance/alllen) * 100
    none = (none/alllen) * 100

    let poseChartData = {
    labels: ['흐트러진 자세', 'None', '올바른 자세'],
    datasets: [{
        data: [unbalance, none, balance],
        backgroundColor : ['#a5dff9', 'darkgray', 'lightgray'],
        offset: [5,0,0]
        }]
    };

    window.pieChart = new Chart(posectx, {
        type: 'pie',
        data: poseChartData,
         options: {
                    responsive: true,
                    plugins: {
                              legend: {
                                        display : false,
                              },
                              title: {
                                        display: true,
                                        text: '전체적인 자세',
                                        position : 'bottom',
                              }
                            },
                  },
    });
};

// 어깨 대칭 차트
function shoulderChartDraw(pdata) {
    let shoulderctx = document.getElementById('shoulderChartCanvas').getContext('2d');

    var unbalance = pdata.pose_json.shoulder.unbalance
    var balance = pdata.pose_json.shoulder.balance
    var none = pdata.pose_json.shoulder.none
    var alllen = pdata.pose_json.shoulder.len

    unbalance = (unbalance/alllen) * 100
    balance = (balance/alllen) * 100
    none = (none/alllen) * 100

    let shoulderChartData = {
    labels: ['흐트러진 자세', 'None', '올바른 자세'],
    datasets: [{
        data: [unbalance, none, balance],
        backgroundColor : ['#a5dff9', 'darkgray', 'lightgray'],
        offset: [5,0,0]
        }]
    };

    window.pieChart = new Chart(shoulderctx, {
        type: 'pie',
        data: shoulderChartData,
         options: {
                    responsive: true,
                    plugins: {
                              legend: {
                                        display : false,
                              },
                              title: {
                                        display: true,
                                        text: '상체 자세',
                                        position : 'bottom',
                              }
                            },
                  },
    });
};
// 골반 대칭 차트
function pelvisChartDraw(pdata) {
    let pelvisctx = document.getElementById('pelvisChartCanvas').getContext('2d');

    var unbalance = pdata.pose_json.pelvis.unbalance
    var balance = pdata.pose_json.pelvis.balance
    var none = pdata.pose_json.pelvis.none
    var alllen = pdata.pose_json.pelvis.len

    unbalance = (unbalance/alllen) * 100
    balance = (balance/alllen) * 100
    none = (none/alllen) * 100

    let pelvisChartData = {
    labels: ['흐트러진 자세', 'None', '올바른 자세'],
    datasets: [{
        data: [unbalance, none, balance],
        backgroundColor : ['#a5dff9', 'darkgray', 'lightgray'],
        offset: [5,0,0]
        }]
    };

    window.pieChart = new Chart(pelvisctx, {
        type: 'pie',
        data: pelvisChartData,
         options: {
                    responsive: true,
                    plugins: {
                              legend: {
                                        display : false,
                              },
                              title: {
                                        display: true,
                                        text: '하체 자세',
                                        position : 'bottom',
                              }
                            },
                  },
    });
};
// 눈 대칭 차트
function eyeposeChartDraw(pdata) {
    let eyeposectx = document.getElementById('eyeChartCanvas').getContext('2d');

    var unbalance = pdata.pose_json.eye.unbalance
    var balance = pdata.pose_json.eye.balance
    var none = pdata.pose_json.eye.none
    var alllen = pdata.pose_json.eye.len

    unbalance = (unbalance/alllen) * 100
    balance = (balance/alllen) * 100
    none = (none/alllen) * 100

    let eyeposeChartData = {
    labels: ['흐트러진 자세', 'None', '올바른 자세'],
    datasets: [{
        data: [unbalance, none, balance],
        backgroundColor : ['#a5dff9', 'darkgray', 'lightgray'],
        offset: [5,0,0]
        }]
    };

    window.pieChart = new Chart(eyeposectx, {
        type: 'pie',
        data: eyeposeChartData,
         options: {
                    responsive: true,
                    plugins: {
                              legend: {
                                        display : false,
                              },
                              title: {
                                        display: true,
                                        text: '고개 수평도',
                                        position : 'bottom',
                              }
                            },
                  },
    });
};