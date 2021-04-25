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
    xhr_face.open("POST","http://54.180.68.1:8000/face/",true);

    xhr_speech.responseType='json';
    xhr_voice.responseType='json';
    xhr_pose.responseType='json';
    xhr_face.responseType='json';

    xhr_speech.send(formData);
    xhr_voice.send(formData);
    xhr_pose.send(formData);
    xhr_face.send(formData);

    // Voice
    xhr_voice.onreadystatechange = function (e) { //콜백 함수 생성
        // status는 response 상태 코드를 반환 : 200 => 정상 응답
        if(xhr_voice.status === 200) {
            xhr_voice.onload = () => {

                var voice_data = xhr_voice.response;
                imgcanhide('img_v','voiceChartCanvas');
                voiceChartDraw(voice_data);
                voice_txt(voice_data);

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

                imghide('img_s');
                imgcanhide('img_s2','sttChartCanvas');
                imghide('img_s3');
                imghide('img_s4');
                imghide('img_s5');

                TTR_txt(speech_data);
                WordCloud(speech_data);
                pronunciation(speech_data);
                sylab(speech_data);
                fillerwords(speech_data);
                sttChartDraw(speech_data);

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

                var canvas = document.getElementById('poseChartCanvas');
                canvas.style.position = 'relative';
                imgcanhide('img_p','shoulderChartCanvas');

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

                var fcanvas = document.getElementById('Face2ChartCanvas');
                fcanvas.style.position = 'relative';
                imgcanhide('img_f','FaceChartCanvas');
                imgcanhide('img_f2','eyeblinkChartCanvas');

                cheekChartDraw(face_data);
                nasolabialChartDraw(face_data);
                mouthChartDraw(face_data);
                browChartDraw(face_data);

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
                        borderColor : '#a5dff9',
                        borderWidth: 1
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
                               text: '목소리의 Hz',
                               position : 'bottom',
                              }
                            },
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    display: true,
                    title: {
                      display: true,
                      text: 'Hz'
                    }
                  }
            }
        }
    });
}

// 표정변화율 차트
//function faceChartDraw(fdata) {
//    let facectx = document.getElementById('FaceChartCanvas').getContext('2d');
//
//    var face_label = []
//    var face_limit = fdata.face_json.face.mouth.x
//    var i = 0
//    do{
//       face_label.push(i);
//       i += 50;
//    }
//    while (i <= face_limit)
//
//    var mouth = fdata.face_json.face.mouth.y
//    var brow = fdata.face_json.face.brow.y
//    var cheekbones_list = fdata.face_json.face.cheekbones_list.y
//    var nasolabial_folds = fdata.face_json.face.nasolabial_folds.y
//
//    // Face : line Chart
//    let faceChartData = {
//                    labels: face_label,
//                    datasets: [{
//                        label : '입 주변',
//                        data: mouth,
//                        backgroundColor : '#a5dff9',
//                        borderColor : '#a5dff9'
//                    },
//                    {
//                        label : '광대 주변',
//                        data: cheekbones_list,
//                        backgroundColor : '#ec7079',
//                        borderColor : '#ec7079'
//                    },
//                    {
//                        label : '미간',
//                        data: brow,
//                        backgroundColor : '#bb9ecb',
//                        borderColor : '#bb9ecb'
//                    },
//                    {
//                        label : '팔자 주변',
//                        data: nasolabial_folds,
//                        backgroundColor : '#ffdfa2',
//                        borderColor : '#ffdfa2'
//                    }
//                    ]
//                };
//
//    window.faceChart = new Chart(facectx, {
//        type: 'line',
//        labels : 'face',
//        data: faceChartData,
//        options: {
//            plugins: {
//                      legend: {
//                               display : false,
//                              },
//                      title: {
//                               display: true,
//                               text: '얼굴 표정 변화율',
//                               position : 'bottom',
//                              }
//                            },
//            scales: {
//                x: {
//                    beginAtZero: true
//                }
//            }
//        }
//    });
//}

// 표정변화율 광대 차트
function cheekChartDraw(fdata) {
    let facectx = document.getElementById('FaceChartCanvas').getContext('2d');

    var face_label = []
    var face_limit = fdata.face_json.face.cheekbones_list.x
    var i = 0
    do{
       face_label.push(i);
       i += 50;
    }
    while (i <= face_limit)

    var cheekbones_list = fdata.face_json.face.cheekbones_list.y

    // Face : line Chart
    let faceChartData = {
                    labels: face_label,
                    datasets: [
                    {
                        label : '광대',
                        data: cheekbones_list,
                        backgroundColor : '#ec7079',
                        borderColor : '#ec7079'
                    },
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
                               text: '광대 주변 변화율',
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

// 표정변화율 팔자 차트
function nasolabialChartDraw(fdata) {
    let face2ctx = document.getElementById('Face2ChartCanvas').getContext('2d');

    var face_label = []
    var face_limit = fdata.face_json.face.nasolabial_folds.x
    var i = 0
    do{
       face_label.push(i);
       i += 50;
    }
    while (i <= face_limit)

    var nasolabial_folds = fdata.face_json.face.nasolabial_folds.y

    // Face : line Chart
    let faceChartData = {
                    labels: face_label,
                    datasets: [
                    {
                        label : '팔자',
                        data: nasolabial_folds,
                        backgroundColor : '#ffdfa2',
                        borderColor : '#ffdfa2'
                    }
                    ]
                };

    window.faceChart = new Chart(face2ctx, {
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
                               text: '팔자 주름 주변 변화율',
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

// 표정변화율 입 차트
function mouthChartDraw(fdata) {
    let face3ctx = document.getElementById('Face3ChartCanvas').getContext('2d');

    var face_label = []
    var face_limit = fdata.face_json.face.mouth.x
    var i = 0
    do{
       face_label.push(i);
       i += 50;
    }
    while (i <= face_limit)

    var mouth = fdata.face_json.face.mouth.y

    // Face : line Chart
    let faceChartData = {
                    labels: face_label,
                    datasets: [{
                        label : '입',
                        data: mouth,
                        backgroundColor : '#a5dff9',
                        borderColor : '#a5dff9'
                    },
                    ]
                };

    window.faceChart = new Chart(face3ctx, {
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
                               text: '입 주변 변화율',
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

// 표정변화율 미간 차트
function browChartDraw(fdata) {
    let face4ctx = document.getElementById('Face4ChartCanvas').getContext('2d');

    var face_label = []
    var face_limit = fdata.face_json.face.brow.x
    var i = 0
    do{
       face_label.push(i);
       i += 50;
    }
    while (i <= face_limit)

    var brow = fdata.face_json.face.brow.y
    // Face : line Chart
    let faceChartData = {
                    labels: face_label,
                    datasets: [
                    {
                        label : '미간',
                        data: brow,
                        backgroundColor : '#bb9ecb',
                        borderColor : '#bb9ecb'
                    },
                    ]
                };

    window.faceChart = new Chart(face4ctx, {
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
                               text: '미간 주변 변화율',
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
    labels: [ '올바른 자세','흐트러진 자세', 'None',],
    datasets: [{
        data: [balance, unbalance, none, ],
        backgroundColor : ['#a5dff9', '#fecaca', '#b4b6b8', ],
        offset: [0,5,0]
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
    labels: [ '올바른 자세','흐트러진 자세', 'None',],
    datasets: [{
        data: [balance, unbalance, none, ],
        backgroundColor : ['#a5dff9', '#fecaca', '#b4b6b8', ],
        offset: [0,5,0]
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
    labels: [ '올바른 자세','흐트러진 자세', 'None',],
    datasets: [{
        data: [balance, unbalance, none, ],
        backgroundColor : ['#a5dff9', '#fecaca', '#b4b6b8', ],
        offset: [0,5,0]
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
    labels: [ '올바른 자세','흐트러진 자세', 'None',],
    datasets: [{
        data: [balance, unbalance, none, ],
        backgroundColor : ['#a5dff9', '#fecaca', '#b4b6b8', ],
        offset: [0,5,0]
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

// 어미 분석 차트
function sttChartDraw(sdata) {
    let sttctx = document.getElementById('sttChartCanvas').getContext('2d');

    var formal = sdata.stt_json.speak_end.formal_speak
    var question = sdata.stt_json.speak_end.question_speak

    let sttChartData = {
    labels: ['참여유도형 화법', '공식적 화법'],
    datasets: [{
        data: [question, formal],
        backgroundColor : ['#fecaca', '#a5dff9'],
        }]
    };

    window.pieChart = new Chart(sttctx, {
        type: 'pie',
        data: sttChartData,
         options: {
                    responsive: true,
                    plugins: {
                              legend: {
                                        display : false,
                              },
                              title: {
                                        display: true,
                                        text: '화법 비율',
                                        position : 'bottom',
                              }
                            },
                  },
    });
};

// 로딩 이미지,캔바스 숨기기
function imgcanhide(imgname, canvasname){

    var load = document.getElementById(imgname);
    load.style.display = 'none';

    var canvas = document.getElementById(canvasname);
    canvas.style.position = 'relative';

}

// 로딩 이미지만 숨기기
function imghide(imgname){

    var load = document.getElementById(imgname);
    load.style.display = 'none';

}

// 목소리 헤르츠 결과 출력
function voice_txt(vdata){

    var vstd = vdata.voice_json.voice_std
    var vavg = vdata.voice_json.voice_mean
    var vres = vdata.voice_json.voice_check
    var res_txt = ''

    if(vres == 1){
        res_txt = '- 목소리의 높낮이가 너무 단조롭습니다. 조금만 더 목소리의 음성의 높낮이를 다양하게 해보세요.'
    }
    else if(vres == 2){
        res_txt = '- 목소리의 높낮이가 적정합니다. 핵심 단어는 적절히 강조해 주세요.'
    }
    else if(vres == 3){
        res_txt = '- 목소리의 높낮이가 아나운서와 유사합니다. 긴장하지마시고 이대로만 하세요.'
    }
    else {
        res_txt = '- 목소리의 높낮이가 너무 산만합니다. 마음을 가라앉히고 침착하게 해보세요.'
    }

    // 아나운서 유사 출력
    var vinfo = document.getElementById("vinfo");
    var res_node = document.createTextNode(res_txt);
    vinfo.appendChild(res_node);

    // 평균 헤르츠 출력
    var v_hz = document.getElementById("v_hz");
    var avg_node = document.createTextNode(vavg);
    v_hz.appendChild(avg_node);

}

// fillerwords 테이블 생성
function fillerwords(sdata) {

    var fw = sdata.stt_json.fillerwords;
    var table = document.getElementById('filler_table')

    for (var i=0; i < fw.length; i++) {
        var row = `<tr>
                    <td>${fw[i].text}</td>
                    <td>${fw[i].weight}</td>
                    </tr>`
                    table.innerHTML += row
    }
}

// speech TTR 텍스트 출력
function TTR_txt(sdata){

    var ttr = sdata.stt_json.ttr_check;

    var ttr_div = document.getElementById('ttr');
    var ttr_res = '';
    ttr_res +=" <p class='res_p'> " + ttr + " %</p>";

    $('#ttr').append(ttr_res);


}

// speech Word Cloud
function WordCloud(sdata){

    var wc = sdata.stt_json.word_list;

    $("#wordcloud").jQCloud(wc);

}

// speech 발음정확도 출력
function pronunciation(sdata){

    var res = sdata.stt_json.pronunciation;
    var proun_div = document.getElementById('pro');
    var proun = '';
    proun +=" <p class='res_p'> " + res + " %</p>";

    $('#pro').append(proun);

}

// sppech 속도
function sylab(sdata){
    var sylab_min = sdata.stt_json.sylab_per_min;

    var myConfig = {
 	type: "gauge",
 	globals: {
 	  fontSize: 25
 	},
 	plotarea:{
 	  marginTop:80
 	},
 	plot:{
 	  size:'100%',
 	  valueBox: {
 	    placement: 'center',
 	    text:'%v', //default
 	    fontSize:30,
 	    rules:[
 	      {
 	        rule: '%v > 300 && %v < 550',
 	        text: '%v<br>Fast'
 	      },
 	      {
 	        rule: '%v <= 300  && %v >= 240',
 	        text: '%v<br>Good'
 	      },
 	      {
 	        rule: '%v <  240',
 	        text: '%v<br>Slow'
 	      }
 	    ]
 	  }
 	},
  tooltip:{
    borderRadius:5
  },
 	scaleR:{
	  aperture:180,
	  minValue:0,
	  maxValue:400,
	  step:50,
	  center:{
	    visible:false
	  },
	  tick:{
	    visible:false
	  },
	  item:{
	    offsetR:0,
	    rules:[
	      {
	        rule:'%i == 9',
	        offsetX:15
	      }
	    ]
	  },
	  labels:['0','','','','','240','300','','400'],
	  ring:{
	    size:60,
	    rules:[
	      {
	        rule:'%v <= 240',
	        backgroundColor:'#ffd573'
	      },
	      {
	        rule:'%v < 300 && %v > 240',
	        backgroundColor:'#29B6F6'
	      },
	      {
	        rule:'%v >= 300',
	        backgroundColor:'#EF5350'
	      }
	    ]
	  }
 	},
	series : [
		{
			values : [sylab_min], // starting value
			backgroundColor:'black',
	    indicator:[10,10,10,10,0.5],
	    animation:{
        effect:2,
        method:1,
        sequence:4,
        speed: 1000
     },
		}
	]
};

zingchart.render({
	id : 'sylab_chart',
	data : myConfig,
	height: 350,
	width: '100%',
});


}

(function( $ ) {
  "use strict";
  $.fn.jQCloud = function(word_array, options) {
    // Reference to the container element
    var $this = this;
    // Namespace word ids to avoid collisions between multiple clouds
    var cloud_namespace = $this.attr('id') || Math.floor((Math.random()*1000000)).toString(36);

    // Default options value
    var default_options = {
      width: $this.width(),
      height: $this.height(),
      center: {
        x: ((options && options.width) ? options.width : $this.width()) / 2.0,
        y: ((options && options.height) ? options.height : $this.height()) / 2.0
      },
      delayedMode: word_array.length > 50,
      shape: false, // It defaults to elliptic shape
      encodeURI: true,
      removeOverflowing: true
    };

    options = $.extend(default_options, options || {});

    // Add the "jqcloud" class to the container for easy CSS styling, set container width/height
    $this.addClass("jqcloud").width(options.width).height(options.height);

    // Container's CSS position cannot be 'static'
    if ($this.css("position") === "static") {
      $this.css("position", "relative");
    }

    var drawWordCloud = function() {
      // Helper function to test if an element overlaps others
      var hitTest = function(elem, other_elems) {
        // Pairwise overlap detection
        var overlapping = function(a, b) {
          if (Math.abs(2.0*a.offsetLeft + a.offsetWidth - 2.0*b.offsetLeft - b.offsetWidth) < a.offsetWidth + b.offsetWidth) {
            if (Math.abs(2.0*a.offsetTop + a.offsetHeight - 2.0*b.offsetTop - b.offsetHeight) < a.offsetHeight + b.offsetHeight) {
              return true;
            }
          }
          return false;
        };
        var i = 0;
        // Check elements for overlap one by one, stop and return false as soon as an overlap is found
        for(i = 0; i < other_elems.length; i++) {
          if (overlapping(elem, other_elems[i])) {
            return true;
          }
        }
        return false;
      };

      // Make sure every weight is a number before sorting
      for (var i = 0; i < word_array.length; i++) {
        word_array[i].weight = parseFloat(word_array[i].weight, 10);
      }

      // Sort word_array from the word with the highest weight to the one with the lowest
      word_array.sort(function(a, b) { if (a.weight < b.weight) {return 1;} else if (a.weight > b.weight) {return -1;} else {return 0;} });

      var step = (options.shape === "rectangular") ? 18.0 : 2.0,
          already_placed_words = [],
          aspect_ratio = options.width / options.height;

      // Function to draw a word, by moving it in spiral until it finds a suitable empty place. This will be iterated on each word.
      var drawOneWord = function(index, word) {
        // Define the ID attribute of the span that will wrap the word, and the associated jQuery selector string
        var word_id = cloud_namespace + "_word_" + index,
            word_selector = "#" + word_id,
            angle = 6.28 * Math.random(),
            radius = 0.0,

            // Only used if option.shape == 'rectangular'
            steps_in_direction = 0.0,
            quarter_turns = 0.0,

            weight = 5,
            custom_class = "",
            inner_html = "",
            word_span;

        // Extend word html options with defaults
        word.html = $.extend(word.html, {id: word_id});

        // If custom class was specified, put them into a variable and remove it from html attrs, to avoid overwriting classes set by jQCloud
        if (word.html && word.html["class"]) {
          custom_class = word.html["class"];
          delete word.html["class"];
        }

        // Check if min(weight) > max(weight) otherwise use default
        if (word_array[0].weight > word_array[word_array.length - 1].weight) {
          // Linearly map the original weight to a discrete scale from 1 to 10
          weight = Math.round((word.weight - word_array[word_array.length - 1].weight) /
                              (word_array[0].weight - word_array[word_array.length - 1].weight) * 9.0) + 1;
        }
        word_span = $('<span>').attr(word.html).addClass('w' + weight + " " + custom_class);

        // Append link if word.url attribute was set
        if (word.link) {
          // If link is a string, then use it as the link href
          if (typeof word.link === "string") {
            word.link = {href: word.link};
          }

          // Extend link html options with defaults
          if ( options.encodeURI ) {
            word.link = $.extend(word.link, { href: encodeURI(word.link.href).replace(/'/g, "%27") });
          }

          inner_html = $('<a>').attr(word.link).text(word.text);
        } else {
          inner_html = word.text;
        }
        word_span.append(inner_html);

        // Bind handlers to words
        if (!!word.handlers) {
          for (var prop in word.handlers) {
            if (word.handlers.hasOwnProperty(prop) && typeof word.handlers[prop] === 'function') {
              $(word_span).bind(prop, word.handlers[prop]);
            }
          }
        }

        $this.append(word_span);

        var width = word_span.width(),
            height = word_span.height(),
            left = options.center.x - width / 2.0,
            top = options.center.y - height / 2.0;

        // Save a reference to the style property, for better performance
        var word_style = word_span[0].style;
        word_style.position = "absolute";
        word_style.left = left + "px";
        word_style.top = top + "px";

        while(hitTest(word_span[0], already_placed_words)) {
          // option shape is 'rectangular' so move the word in a rectangular spiral
          if (options.shape === "rectangular") {
            steps_in_direction++;
            if (steps_in_direction * step > (1 + Math.floor(quarter_turns / 2.0)) * step * ((quarter_turns % 4 % 2) === 0 ? 1 : aspect_ratio)) {
              steps_in_direction = 0.0;
              quarter_turns++;
            }
            switch(quarter_turns % 4) {
              case 1:
                left += step * aspect_ratio + Math.random() * 2.0;
                break;
              case 2:
                top -= step + Math.random() * 2.0;
                break;
              case 3:
                left -= step * aspect_ratio + Math.random() * 2.0;
                break;
              case 0:
                top += step + Math.random() * 2.0;
                break;
            }
          } else { // Default settings: elliptic spiral shape
            radius += step;
            angle += (index % 2 === 0 ? 1 : -1)*step;

            left = options.center.x - (width / 2.0) + (radius*Math.cos(angle)) * aspect_ratio;
            top = options.center.y + radius*Math.sin(angle) - (height / 2.0);
          }
          word_style.left = left + "px";
          word_style.top = top + "px";
        }

        // Don't render word if part of it would be outside the container
        if (options.removeOverflowing && (left < 0 || top < 0 || (left + width) > options.width || (top + height) > options.height)) {
          word_span.remove()
          return;
        }


        already_placed_words.push(word_span[0]);

        // Invoke callback if existing
        if ($.isFunction(word.afterWordRender)) {
          word.afterWordRender.call(word_span);
        }
      };

      var drawOneWordDelayed = function(index) {
        index = index || 0;
        if (!$this.is(':visible')) { // if not visible then do not attempt to draw
          setTimeout(function(){drawOneWordDelayed(index);},10);
          return;
        }
        if (index < word_array.length) {
          drawOneWord(index, word_array[index]);
          setTimeout(function(){drawOneWordDelayed(index + 1);}, 10);
        } else {
          if ($.isFunction(options.afterCloudRender)) {
            options.afterCloudRender.call($this);
          }
        }
      };

      // Iterate drawOneWord on every word. The way the iteration is done depends on the drawing mode (delayedMode is true or false)
      if (options.delayedMode){
        drawOneWordDelayed();
      }
      else {
        $.each(word_array, drawOneWord);
        if ($.isFunction(options.afterCloudRender)) {
          options.afterCloudRender.call($this);
        }
      }
    };

    // Delay execution so that the browser can render the page before the computatively intensive word cloud drawing
    setTimeout(function(){drawWordCloud();}, 10);
    return $this;
  };
})(jQuery);