angular.module('threatsCtrls', [])

    .controller('threatsChartCtrl', ['$scope', function ($scope) {
        Highcharts.getOptions().colors = Highcharts.map(Highcharts.getOptions().colors, function (color) {
            return {
                radialGradient: {cx: 0.5, cy: 0.3, r: 0.7},
                stops: [
                    [0, color],
                    [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
                ]
            };
        });
        $('#threatsRealChart').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: 'The real-time Condition of computers with and without alerts',
                style: {
                    color: '#3E576F',
                    fontSize: '16px'
                }
            },
            tooltip: {
                pointFormat: '{series.name} Ratio: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        color: '#317eac',
                        connectorColor: '#317eac',
                        formatter: function () {
                            return '<b>' + this.series.name + ' ' + this.point.name + '</b>: ' + this.y;
                        }
                    },
                    showInLegend: true
                }
            },
            credits:{
                enabled:false
            },
            colors: ['#ED561B', '#64E572'],
            series: [{
                type: 'pie',
                name: 'Computers',
                data: [
                    ['With ALert', 11],
                    {
                        name: 'Without ALert',
                        y: 89,
                        sliced: true,
                        selected: true
                    }
                ]
            }]
        });
    }])

    .controller('threatsAlerts', ['$scope', function ($scope) {
        $scope.alertStyle = {
            'new': 'warning',
            'unsolved': 'danger',
            'solved': 'success',
            'exception': 'primary',
        };
        $scope.alerts = test_data;
        $scope.historyAlerts = test_data;
        $scope.currSlnAlerts = test_data;
        $scope.changeAlertStatus = changeAlertStatus;
        $scope.exceptAlert = exceptAlert;

        function changeAlertStatus(alert) {
            if(alert.status === 'exception') {
                removeExcept(alert);
                return
            }

            process = ['new', 'unsolved', 'solved'];

            for(var i=0; i<=(process.length-1); i++) {
                if(alert.status === process[i] && i < (process.length -1)) {
                    var nextStatus = process[i+1];
                    alert.status = nextStatus;

                    // if (nextStatus === 'solved') {
                    //     $scope.alerts.splice($scope.alerts.indexOf(alert), 1);
                    // }

                    break
                }
            }
        }

        function exceptAlert(alert) {
            if (alert.type.toLowerCase() === 'action') {
                alert.status = 'exception';
                // $scope.alerts.splice($scope.alerts.indexOf(alert), 1);
            }
        }

        function removeExcept(alert) {
            alert.status = 'unsolved';
            // $scope.historyAlerts.splice($scope.historyAlerts.indexOf(alert), 1);
        }
    }])
;


var test_data = [
    {
        'sensor': {name: 'AASDFASDF-ASDFASDF-ASDFASDF-ASDFASDF'},
        'type': 'File',
        'timestamp': 123123123123,
        'level': 10,
        'status': 'new'
    },
    {
        'sensor': {name: 'AASDFASDF-ASDFASDF-ASDFASDF-ASDFASDF'},
        'type': 'Action',
        'timestamp': 123123123123,
        'level': 10,
        'status': 'new'
    },
    {
        'sensor': {name: 'AASDFASDF-ASDFASDF-ASDFASDF-ASDFASDF'},
        'type': 'Action',
        'timestamp': 123123123123,
        'level': 10,
        'status': 'new'
    },
    {
        'sensor': {name: 'AASDFASDF-ASDFASDF-ASDFASDF-ASDFASDF'},
        'type': 'Action',
        'timestamp': 123123123123,
        'level': 10,
        'status': 'new'
    },
    {
        'sensor': {name: 'AASDFASDF-ASDFASDF-ASDFASDF-ASDFASDF'},
        'type': 'File',
        'timestamp': 123123123123,
        'level': 100,
        'status': 'new'
    },
    {
        'sensor': {name: 'AASDFASDF-ASDFASDF-ASDFASDF-ASDFASDF'},
        'type': 'File',
        'timestamp': 123123123123,
        'level': 10,
        'status': 'new'
    },
    {
        'sensor': {name: 'AASDFASDF-ASDFASDF-ASDFASDF-ASDFASDF'},
        'type': 'File',
        'timestamp': 123123123123,
        'level': 100,
        'status': 'new'
    },
    {
        'sensor': {name: 'AASDFASDF-ASDFASDF-assadfDFASDF-ASDFASDF'},
        'type': 'File',
        'timestamp': 123123123123,
        'level': 100,
        'status': 'new'
    },
    {
        'sensor': {name: 'AASDFASDF-ASDFASDF-ASDFASDF-ASDFASDF'},
        'type': 'File',
        'timestamp': 123123123123,
        'level': 10,
        'status': 'test'
    },
    {
        'sensor': {name: 'AASDFASDF-ASDFASDFasdf-ASDFASDF-ASDFASDF'},
        'type': 'File',
        'timestamp': 123123123123,
        'level': 10,
        'status': 'new'
    },
];