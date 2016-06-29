angular.module('threatsCtrls', [])

    .controller('threatsChartCtrl', ['$scope',
        function ($scope) {
            Highcharts.getOptions().colors = Highcharts.map(Highcharts.getOptions().colors, function (color) {
                return {
                    radialGradient: {cx: 0.5, cy: 0.3, r: 0.7},
                    stops: [
                        [0, color],
                        [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
                    ]
                };
            });

            option = {
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
                credits: {
                    enabled: false
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
            }
            $('#threatsRealChart').highcharts(option);
            $('#threatsRealChartTemp').highcharts(option);
        }])

    .controller('threatsAlerts', ['$scope', '$state',
        function ($scope, $state) {
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
                if (alert.status === 'exception') {
                    removeExcept(alert);
                    return
                }

                process = ['new', 'unsolved', 'solved'];

                for (var i = 0; i <= (process.length - 1); i++) {
                    if (alert.status === process[i] && i < (process.length - 1)) {
                        var nextStatus = process[i + 1];
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

            $scope.clickAlert = function (alert) {
                if (alert.type === 'File') {
                    $state.go('threatsFile', {id: alert.fileId});
                }
                else if (alert.type === 'Action') {
                    $state.go('threatsAction', {id: alert.actionId});
                }
            }
        }]
    )

    .controller('threatsFile', ['$scope', '$stateParams',
        function ($scope, $stateParams) {
            $scope.file = test_file;
            test_file.id = $stateParams.id;

            $scope.affectTabs = [
                {title: 'Affected Path', state: 'file_affected_path'},
                {title: 'Current Affected Computer', state: ''},
                {title: 'History Affected Computer', state: ''}
            ]

            $scope.clickTab = function (tab) {
                $scope.selectedTab = tab.title;
            }

            $scope.addToWhitelist = function (file) {
                if (confirm('Are you sure to add ' + file.name + ' to whitelist?')) {

                }
            }

            $scope.currAffectedComs = test_coms2;
            $scope.histAffectedComs = test_coms1;
        }
    ])
;

var test_coms2 = [
    {
        'name': 'Lunar21',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
<<<<<<< HEAD
        'ip': '128.196.3.1',
        'status': 'on',
        'profile': 'shide',
        'group': 'asdfasdfasfd',
        'sensor': 0.1,
        'os': 'windows'
=======
        'threatsCount': 16,
        'status': 'on',
        'profile': 'shide',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
>>>>>>> 5d4fd3318aef67b34ed821dccbecbc2e2b774092
    },
    {
        'name': 'Lunar32',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
<<<<<<< HEAD
        'ip': '128.196.3.1',
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1,
        'os': 'windows'
=======
        'threatsCount': 16,
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
>>>>>>> 5d4fd3318aef67b34ed821dccbecbc2e2b774092
    },
    {
        'name': 'Lunar44',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
<<<<<<< HEAD
        'ip': '128.196.3.1',
=======
        'threatsCount': 16,
>>>>>>> 5d4fd3318aef67b34ed821dccbecbc2e2b774092
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },
    {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
<<<<<<< HEAD
        'ip': '128.196.3.1',
=======
        'threatsCount': 16,
>>>>>>> 5d4fd3318aef67b34ed821dccbecbc2e2b774092
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },
    {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
<<<<<<< HEAD
        'ip': '128.196.3.1',
=======
        'threatsCount': 16,
>>>>>>> 5d4fd3318aef67b34ed821dccbecbc2e2b774092
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },
    {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
<<<<<<< HEAD
        'ip': '128.196.3.1',
=======
        'threatsCount': 16,
>>>>>>> 5d4fd3318aef67b34ed821dccbecbc2e2b774092
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },
    {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
<<<<<<< HEAD
        'ip': '128.196.3.1',
=======
        'threatsCount': 16,
>>>>>>> 5d4fd3318aef67b34ed821dccbecbc2e2b774092
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },
    {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
<<<<<<< HEAD
        'ip': '128.196.3.1',
=======
        'threatsCount': 16,
>>>>>>> 5d4fd3318aef67b34ed821dccbecbc2e2b774092
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },
    {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
<<<<<<< HEAD
        'ip': '128.196.3.1',
=======
        'threatsCount': 16,
>>>>>>> 5d4fd3318aef67b34ed821dccbecbc2e2b774092
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },    {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
<<<<<<< HEAD
        'ip': '128.196.3.1',
=======
        'threatsCount': 16,
>>>>>>> 5d4fd3318aef67b34ed821dccbecbc2e2b774092
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },    {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
<<<<<<< HEAD
        'ip': '128.196.3.1',
=======
        'threatsCount': 16,
>>>>>>> 5d4fd3318aef67b34ed821dccbecbc2e2b774092
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },    {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
<<<<<<< HEAD
        'ip': '128.196.3.1',
=======
        'threatsCount': 16,
>>>>>>> 5d4fd3318aef67b34ed821dccbecbc2e2b774092
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },    {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
<<<<<<< HEAD
        'ip': '128.196.3.1',
=======
        'threatsCount': 16,
>>>>>>> 5d4fd3318aef67b34ed821dccbecbc2e2b774092
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },    {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
<<<<<<< HEAD
        'ip': '128.196.3.1',
=======
        'threatsCount': 16,
>>>>>>> 5d4fd3318aef67b34ed821dccbecbc2e2b774092
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },    {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
<<<<<<< HEAD
        'ip': '128.196.3.1',
=======
        'threatsCount': 16,
>>>>>>> 5d4fd3318aef67b34ed821dccbecbc2e2b774092
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },    {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
<<<<<<< HEAD
        'ip': '128.196.3.1',
=======
        'threatsCount': 16,
>>>>>>> 5d4fd3318aef67b34ed821dccbecbc2e2b774092
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },    {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
<<<<<<< HEAD
        'ip': '128.196.3.1',
=======
        'threatsCount': 16,
>>>>>>> 5d4fd3318aef67b34ed821dccbecbc2e2b774092
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },    {
        'name': 'Lunarhaha',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
<<<<<<< HEAD
        'ip': '128.196.3.1',
=======
        'threatsCount': 16,
>>>>>>> 5d4fd3318aef67b34ed821dccbecbc2e2b774092
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },
];


var test_coms1 = [
    {
        id: 111,
        'name': 'Lunar11',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
<<<<<<< HEAD
        'ip': '128.196.3.1',
=======
        'threatsCount': 16,
>>>>>>> 5d4fd3318aef67b34ed821dccbecbc2e2b774092
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },
    {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
<<<<<<< HEAD
        'ip': '128.196.3.1',
=======
        'threatsCount': 16,
>>>>>>> 5d4fd3318aef67b34ed821dccbecbc2e2b774092
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },
    {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
<<<<<<< HEAD
        'ip': '128.196.3.1',
=======
        'threatsCount': 16,
>>>>>>> 5d4fd3318aef67b34ed821dccbecbc2e2b774092
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },
    {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
<<<<<<< HEAD
        'ip': '128.196.3.1',
=======
        'threatsCount': 16,
>>>>>>> 5d4fd3318aef67b34ed821dccbecbc2e2b774092
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },
    {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
<<<<<<< HEAD
        'ip': '128.196.3.1',
=======
        'threatsCount': 16,
>>>>>>> 5d4fd3318aef67b34ed821dccbecbc2e2b774092
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },
    {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
<<<<<<< HEAD
        'ip': '128.196.3.1',
=======
        'threatsCount': 16,
>>>>>>> 5d4fd3318aef67b34ed821dccbecbc2e2b774092
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },
    {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
<<<<<<< HEAD
        'ip': '128.196.3.1',
=======
        'threatsCount': 16,
>>>>>>> 5d4fd3318aef67b34ed821dccbecbc2e2b774092
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },
    {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
<<<<<<< HEAD
        'ip': '128.196.3.1',
=======
        'threatsCount': 16,
>>>>>>> 5d4fd3318aef67b34ed821dccbecbc2e2b774092
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },
    {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
<<<<<<< HEAD
        'ip': '128.196.3.1',
=======
        'threatsCount': 16,
>>>>>>> 5d4fd3318aef67b34ed821dccbecbc2e2b774092
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },    {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
<<<<<<< HEAD
        'ip': '128.196.3.1',
=======
        'threatsCount': 16,
>>>>>>> 5d4fd3318aef67b34ed821dccbecbc2e2b774092
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },    {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
<<<<<<< HEAD
        'ip': '128.196.3.1',
=======
        'threatsCount': 16,
>>>>>>> 5d4fd3318aef67b34ed821dccbecbc2e2b774092
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },    {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
<<<<<<< HEAD
        'ip': '128.196.3.1',
=======
        'threatsCount': 16,
>>>>>>> 5d4fd3318aef67b34ed821dccbecbc2e2b774092
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },    {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
<<<<<<< HEAD
        'ip': '128.196.3.1',
=======
        'threatsCount': 16,
>>>>>>> 5d4fd3318aef67b34ed821dccbecbc2e2b774092
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },    {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
<<<<<<< HEAD
        'ip': '128.196.3.1',
=======
        'threatsCount': 16,
>>>>>>> 5d4fd3318aef67b34ed821dccbecbc2e2b774092
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },    {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
<<<<<<< HEAD
        'ip': '128.196.3.1',
=======
        'threatsCount': 16,
>>>>>>> 5d4fd3318aef67b34ed821dccbecbc2e2b774092
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },    {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
<<<<<<< HEAD
        'ip': '128.196.3.1',
=======
        'threatsCount': 16,
>>>>>>> 5d4fd3318aef67b34ed821dccbecbc2e2b774092
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },    {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
<<<<<<< HEAD
        'ip': '128.196.3.1',
=======
        'threatsCount': 16,
>>>>>>> 5d4fd3318aef67b34ed821dccbecbc2e2b774092
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },    {
        'name': 'Lunar88',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
<<<<<<< HEAD
        'ip': '128.196.3.1',
=======
        'threatsCount': 16,
>>>>>>> 5d4fd3318aef67b34ed821dccbecbc2e2b774092
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },
];

var test_file = {
    name: '234234-asdfasf-asf.exe'
}

var test_data = [
    {
        'sensor': {name: 'AASDFASDF-ASDFASDF-ASDFASDF-ASDFASDF'},
        'type': 'File',
        'timestamp': 123123123123,
        'level': 10,
        'status': 'new',
        fileId: 235,
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
        'status': 'new',
        fileId: 234,
    },
    {
        'sensor': {name: 'AASDFASDF-ASDFASDF-ASDFASDF-ASDFASDF'},
        'type': 'File',
        'timestamp': 123123123123,
        'level': 100,
        'status': 'new',
        fileId: 234,
    },
    {
        'sensor': {name: 'AASDFASDF-ASDFASDF-assadfDFASDF-ASDFASDF'},
        'type': 'File',
        'timestamp': 123123123123,
        'level': 100,
        'status': 'new',
        fileId: 234,
    },
    {
        'sensor': {name: 'AASDFASDF-ASDFASDF-ASDFASDF-ASDFASDF'},
        'type': 'File',
        'timestamp': 123123123123,
        'level': 10,
        'status': 'test',
        fileId: 234,
    },
    {
        'sensor': {name: 'AASDFASDF-ASDFASDFasdf-ASDFASDF-ASDFASDF'},
        'type': 'File',
        'timestamp': 123123123123,
        'level': 10,
        'status': 'new',
        fileId: 234,
    },
];