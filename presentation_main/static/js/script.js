window.onload = function () {
    pieChartDraw();
    faceChartDraw();
}

// Pose : pie Chart
let pieChartData = {
    labels: ['흐트러진 자세', 'None', '올바른 자세'],
    datasets: [{
        data: [50, 2, 14],
        backgroundColor : ['#a5dff9', 'darkgray', 'lightgray'],
        offset: [5,0,0]
    }]
};

let pieChartDraw = function () {
    let ctx = document.getElementById('pieChartCanvas').getContext('2d');

    window.pieChart = new Chart(ctx, {
        type: 'pie',
        data: pieChartData,
         options: {
                    responsive: true,
                    plugins: {
                              legend: {
                                        display : false,
                              },
                              title: {
                                        display: true,
                                        text: '자세 흐트러짐 비율',
                                        position : 'bottom',
                              }
                            }
                  },
    });
};

// Face : line Chart
let faceChartData = {
    labels: [0, 50, 100, 150, 200, 250, 300, 340],
    datasets: [{
        label : 'mouth',
        data: [36, 41, 38, 39, 38, 38, 36, 34, 36, 36, 36, 34, 39, 39, 39, 39, 39, 39, 39, 38, 38, 38, 37, 35, 36, 38, 37, 37, 38, 37, 37, 38, 37, 38, 38, 38, 38, 37, 36, 37, 38, 40, 40, 40, 40, 40, 38, 39, 38, 38, 40, 38, 39, 38, 38, 37, 38, 37, 38, 39, 39, 39, 39, 39, 40, 38, 38, 37, 37, 37, 38, 37, 37, 36, 37, 37, 37, 37, 38, 38, 41, 40, 40, 37, 37, 38, 37, 36, 37, 39, 40, 40, 40, 41, 40, 39, 38, 37, 37, 39, 38, 38, 37, 37, 38, 39, 41, 41, 39, 38, 37, 37, 36, 37, 37, 36, 36, 36, 35, 36, 37, 38, 38, 37, 38, 41, 40, 42, 41, 41, 42, 40, 40, 40, 40, 37, 37, 38, 39, 39, 42, 43, 33, 40, 39, 41, 40, 44, 39, 39, 40, 39, 39, 39, 39, 40, 40, 42, 43, 43, 41, 42, 43, 43, 43, 44, 43, 44, 43, 44, 44, 45, 45, 46, 45, 45, 44, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 45, 45, 45, 46, 46, 45, 45, 46, 46, 46, 46, 46, 45, 45, 45, 45, 45, 45, 46, 46, 46, 46, 46, 45, 45, 45, 45, 46, 46, 47, 46, 47, 48, 46, 47, 46, 45, 44, 43, 40, 36, 38, 39, 40, 41, 43, 47, 46, 46, 46, 46, 46, 46, 45, 46, 46, 46, 46, 45, 45, 47, 45, 45, 46, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 44, 43, 43, 43, 42, 42, 41, 42, 42, 40, 40, 39, 40, 40, 40, 40, 40, 40, 41, 41, 41, 41, 40, 41, 41, 41, 41, 41, 40, 41, 40, 40, 41, 41, 40, 41, 41, 41, 41, 41, 41, 41, 41, 41, 41, 42, 42, 42, 42, 42, 42, 42, 44, 42, 44, 42, 43, 43, 43, 43, 44, 43, 43, 43, 43, 43, 43, 43, 43, 43, 44, 43, 43, 43, 43],
        backgroundColor : '#a5dff9',
        borderColor : '#a5dff9'
    }]
};



let faceChartDraw = function () {
    let facectx = document.getElementById('FaceChartCanvas').getContext('2d');

    window.faceChart = new Chart(facectx, {
        type: 'line',
        labels : 'mouth',
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