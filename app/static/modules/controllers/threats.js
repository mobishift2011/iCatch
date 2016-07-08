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

            var option = {
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
            };

            $('#threatsRealChart').highcharts(option);
            $('#threatsRealChartTemp').highcharts(option);
        }])

    .controller('threatsAlerts', ['$scope', '$timeout',
        function ($scope, $timeout) {
            $scope.alerts = test_data;
        }]
    )
    .controller('historyAlerts', ['$scope', '$timeout',
        function ($scope, $timeout) {
            $scope.historyAlerts = test_data1;
        }]
    )
    .controller('currSlnAlerts', ['$scope', '$timeout',
        function ($scope, $timeout) {
            $scope.currSlnAlerts = test_data2;
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

            // $scope.sideDetailShow = true;

        }
    ])

    .controller('threatsAction', ['$scope', '$stateParams', '$timeout',
        function ($scope, $stateParams, $timeout) {
            var action_id = $stateParams.id;

            $scope.closeSideDetail = function (type) {
                $scope['show' + type + 'ThreatDetail'] = false;
            };

            $scope.showSideDetail = function (data, type) {
                $scope['show' + type + 'ThreatDetail'] = true;
                $scope['selected' + type + 'Node'] = data;
            }

            $timeout(function () {
                var storyLineChart = echarts.init(document.getElementById('storyLineChart'));
                option = {
                    // title: {
                    //     text: '',
                    //     subtext: '',
                    //     x: 'right',
                    //     y: 'bottom'
                    // },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} : {b}'
                    },
                    // toolbox: {
                    //     show: true,
                    //     feature: {
                    //         restore: {show: true},
                    //         magicType: {show: true, type: ['force', 'chord']},
                    //         saveAsImage: {show: true}
                    //     }
                    // },
                    legend: {
                        x: 'left',
                        data: []
                    },
                    series: [
                        {
                            type: 'force',
                            name: "",
                            ribbonType: false,
                            categories: [
                                {
                                    name: 'threats'
                                },
                                {
                                    name: 'threated'
                                },

                            ],
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: true,
                                        textStyle: {
                                            color: '#333'
                                        }
                                    },
                                    nodeStyle: {
                                        brushType: 'both',
                                        borderColor: 'rgba(255,0,0,0.4)',
                                        borderWidth: 3
                                    },
                                    linkStyle: {
                                        type: 'curve'
                                    }
                                },
                                emphasis: {
                                    label: {
                                        show: false
                                        // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
                                    },
                                    nodeStyle: {
                                        //r: 30
                                    },
                                    linkStyle: {}
                                }
                            },
                            useWorker: false,
                            minRadius: 15,
                            maxRadius: 25,
                            gravity: 1.1,
                            scaling: 1.1,
                            roam: 'move',
                            linkSymbol: 'arrow',
                            nodes: [
                                {category: 0, name: '乔布斯', value: 10, label: '乔布斯'},
                                {category: 1, name: '丽萨-乔布斯', value: 2},
                                {category: 1, name: '保罗-乔布斯', value: 3},
                                {category: 1, name: '克拉拉-乔布斯', value: 3},
                                {category: 1, name: '劳伦-鲍威尔', value: 7},
                                {category: 1, name: '史蒂夫-沃兹尼艾克', value: 5},
                                {category: 1, name: '奥巴马', value: 8},
                                {category: 1, name: '比尔-盖茨', value: 9},
                                {category: 1, name: '乔纳森-艾夫', value: 4},
                                {category: 1, name: '蒂姆-库克', value: 4},
                                {category: 1, name: '龙-韦恩', value: 1},
                            ],
                            links: [
                                {source: '乔布斯', target: '乔布斯', weight: 1, name: '女儿'},
                                {source: '丽萨-乔布斯', target: '丽萨-乔布斯', weight: 1},
                                {source: '丽萨-乔布斯', target: '乔布斯', weight: 1, name: '女儿'},
                                {source: '保罗-乔布斯', target: '乔布斯', weight: 2, name: '父亲'},
                                {source: '克拉拉-乔布斯', target: '乔布斯', weight: 1, name: '母亲'},
                                {source: '劳伦-鲍威尔', target: '乔布斯', weight: 2},
                                {source: '史蒂夫-沃兹尼艾克', target: '乔布斯', weight: 3, name: '合伙人'},
                                {source: '奥巴马', target: '乔布斯', weight: 1},
                            ]
                        }
                    ]
                };
                var ecConfig = echarts.config;

                function focus(param) {
                    var data = param.data;
                    var links = option.series[0].links;
                    var nodes = option.series[0].nodes;
                    if (
                        data.source !== undefined
                        && data.target !== undefined
                    ) { //点击的是边
                        var sourceNode = nodes.filter(function (n) {
                            return n.name == data.source
                        })[0];
                        var targetNode = nodes.filter(function (n) {
                            return n.name == data.target
                        })[0];
                        console.log("选中了边 " + sourceNode.name + ' -> ' + targetNode.name + ' (' + data.weight + ')');
                    } else { // 点击的是点
                        $scope.$apply(function () {
                            $scope.showSideDetail(data.value, 'Chart');
                        });
                        console.log("选中了" + data.name + '(' + data.value + ')');
                    }
                }

                storyLineChart.on(ecConfig.EVENT.CLICK, focus);

                storyLineChart.on(ecConfig.EVENT.FORCE_LAYOUT_END, function () {
                    console.log(storyLineChart.chart.force.getPosition());
                });

                storyLineChart.setOption(option);
            }, 0);

        }])
;

var test_coms2 = [
    {
        'name': 'Lunar21',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
        'ip': '128.196.3.1',
        'status': 'on',
        'profile': 'shide',
        'group': 'asdfasdfasfd',
        'sensor': 0.1,
        'os': 'windows',
        'threatsCount': 16,
        'status': 'on',
        'profile': 'shide',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },
    {
        'name': 'Lunar32',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
        'ip': '128.196.3.1',
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1,
        'os': 'windows',
        'threatsCount': 16,
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },
    {
        'name': 'Lunar44',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
        'ip': '128.196.3.1',
        'threatsCount': 16,
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },
    {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
        'ip': '128.196.3.1',
        'threatsCount': 16,
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },
    {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
        'ip': '128.196.3.1',
        'threatsCount': 16,
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },
    {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
        'ip': '128.196.3.1',
        'threatsCount': 16,
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },
    {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
        'ip': '128.196.3.1',
        'threatsCount': 16,
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },
    {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
        'ip': '128.196.3.1',
        'threatsCount': 16,
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },
    {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
        'ip': '128.196.3.1',
        'threatsCount': 16,
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    }, {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
        'ip': '128.196.3.1',
        'threatsCount': 16,
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    }, {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
        'ip': '128.196.3.1',
        'threatsCount': 16,
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    }, {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
        'ip': '128.196.3.1',
        'threatsCount': 16,
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    }, {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
        'ip': '128.196.3.1',
        'threatsCount': 16,
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    }, {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
        'ip': '128.196.3.1',
        'threatsCount': 16,
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    }, {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
        'ip': '128.196.3.1',
        'threatsCount': 16,
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    }, {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
        'ip': '128.196.3.1',
        'threatsCount': 16,
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    }, {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
        'ip': '128.196.3.1',
        'threatsCount': 16,
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    }, {
        'name': 'Lunarhaha',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
        'ip': '128.196.3.1',
        'threatsCount': 16,
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
        'ip': '128.196.3.1',
        'threatsCount': 16,
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },
    {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
        'ip': '128.196.3.1',
        'threatsCount': 16,
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },
    {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
        'ip': '128.196.3.1',
        'threatsCount': 16,
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },
    {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
        'ip': '128.196.3.1',
        'threatsCount': 16,
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },
    {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
        'ip': '128.196.3.1',
        'threatsCount': 16,
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },
    {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
        'ip': '128.196.3.1',
        'threatsCount': 16,
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },
    {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
        'ip': '128.196.3.1',
        'threatsCount': 16,
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },
    {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
        'ip': '128.196.3.1',
        'threatsCount': 16,
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    },
    {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
        'ip': '128.196.3.1',
        'threatsCount': 16,
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    }, {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
        'ip': '128.196.3.1',
        'threatsCount': 16,
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    }, {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
        'ip': '128.196.3.1',
        'threatsCount': 16,
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    }, {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
        'ip': '128.196.3.1',
        'threatsCount': 16,
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    }, {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
        'ip': '128.196.3.1',
        'threatsCount': 16,
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    }, {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
        'ip': '128.196.3.1',
        'threatsCount': 16,
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    }, {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
        'ip': '128.196.3.1',
        'threatsCount': 16,
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    }, {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
        'ip': '128.196.3.1',
        'threatsCount': 16,
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    }, {
        'name': 'Lunar',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
        'ip': '128.196.3.1',
        'threatsCount': 16,
        'status': 'on',
        'profile': 'adfasdfasdf',
        'group': 'asdfasdfasfd',
        'sensor': 0.1
    }, {
        'name': 'Lunar88',
        'lastCommunicated': '2016-12-1 15:00',
        'addedTime': '2016-12-1 15:00',
        'ip': '128.196.3.1',
        'threatsCount': 16,
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
        'sensor': {name: 'AASDFASDF-ASDFASDF-ASDFASDF-ASDFASDF1'},
        'type': 'File',
        'timestamp': 123123123123,
        'level': 10,
        'status': 'new',
        fileId: 235,
    },
    {
        'sensor': {name: 'AASDFASDF-ASDFASDF-ASDFASDF-ASDFASDF2'},
        'type': 'Action',
        'timestamp': 123123123123,
        'level': 10,
        'status': 'new'
    },
    {
        'sensor': {name: 'AASDFASDF-ASDFASDF-ASDFASDF-ASDFASDF3'},
        'type': 'Action',
        'timestamp': 123123123123,
        'level': 10,
        'status': 'new'
    },
    {
        'sensor': {name: 'AASDFASDF-ASDFASDF-ASDFASDF-ASDFASDF4'},
        'type': 'Action',
        'timestamp': 123123123123,
        'level': 10,
        'status': 'new'
    },
    {
        'sensor': {name: 'AASDFASDF-ASDFASDF-ASDFASDF-ASDFASDF5'},
        'type': 'File',
        'timestamp': 123123123123,
        'level': 100,
        'status': 'new'
    },
    {
        'sensor': {name: 'AASDFASDF-ASDFASDF-ASDFASDF-ASDFASDF6'},
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

var test_data1 = test_data.slice(0, 3);
var test_data2 = test_data.slice(3, 6);