angular.module('threatsCtrls', [])
    .controller('threatsChartCtrl', ['$scope', '$timeout', '$filter', 'Alarm',
        function ($scope, $timeout, $filter, Alarm) {
            var translate = $filter('translate');

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
                    text: '',
                    style: {
                        color: '#3E576F',
                        fontSize: '16px'
                    }
                },
                tooltip: {
                    pointFormat: '{series.name} : <b>{point.percentage:.1f}%</b>'
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
                                return this.point.name + '</b>: ' + this.y;
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
                    name: '',
                    data: []
                }]
            };

            var comData = {
                with_alarm: 0,
                without_alarm: 0
            };
            var comStats = function () {
                Alarm.getStats({object: 'computer'}, function (data) {
                    var refresh = false;
                    var keys = Object.keys(comData);

                    for (var i in keys) {
                        var item = keys[i];
                        if(comData[item] != data[item]) {
                            refresh = true;
                        }
                        comData[item] = data[item];
                    }


                    if (refresh) {
                        var series = option.series[0];
                        series.name = translate('Computer');
                        series.data = [
                            [translate('With Alarm'), data.with_alarm || 0],
                            {
                                name: translate('Without Alarm'),
                                y: data.without_alarm || 0,
                                sliced: true,
                                selected: true
                            }
                        ];

                        option.title.text = translate('The real-time condition of computers with and without alarms');
                        $('#threatsRealChart').highcharts(option);
                    }

                    $timeout(comStats, 5000);
                });
            };

            var typeData = {
                Action: 0,
                File: 0
            };
            var typeStats = function () {
                Alarm.getStats({object: 'type'}, function (data) {
                    if(!data.Action && !data.File) {
                        return;
                    }
                    var refresh = false;
                    var keys = Object.keys(typeData);

                    for (var i in keys) {
                        var item = keys[i];
                        if(typeData[item] != data[item]) {
                            refresh = true;
                        }
                        typeData[item] = data[item];
                    }

                    if (refresh) {
                        var series = option.series[0];
                        series.name = translate('Type');
                        series.data = [
                            [translate('Suspect Action'), data.Action || 0],
                            {
                                name: translate('Suspect File'),
                                y: data.File || 0,
                                sliced: true,
                                selected: true
                            }
                        ];
                        option.colors = ['#ED561B', '#f7a35c'],
                        option.title.text = translate("The real-time condition of unsolved alarms' type");
                        $('#threatsRealChartTemp').highcharts(option);
                    }

                    $timeout(typeStats, 5000);
                });
            };

            comStats();
            typeStats();

        }])

    .controller('threatsAlerts', ['$scope', '$timeout', 'Alarm',
        function ($scope, $timeout, Alarm) {
            getAlarms($scope, Alarm, {has_solutions: false, status__in: 'new,unsolved'}, $timeout);
        }]
    )

    .controller('historyAlerts', ['$scope', '$timeout', 'Alarm',
        function ($scope, $timeout, Alarm) {
            var timestamp = parseInt(new Date().getTime() / 1000) - 3600 * 24 * 90;
            getAlarms($scope, Alarm, {
                has_solutions: false,
                status__nin: 'new,unsolved',
                timestamp__gt: timestamp
            }, $timeout);
        }]
    )

    .controller('currSlnAlerts', ['$scope', '$timeout', 'Alarm',
        function ($scope, $timeout, Alarm) {
            var timestamp = parseInt(new Date().getTime() / 1000) - 3600 * 24 * 90;
            getAlarms($scope, Alarm, {has_solutions: true, timestamp__gt: timestamp}, $timeout);
        }]
    )

    .controller('threatsFile', ['$scope', '$stateParams', '$timeout', 'Alarm', 'Computer',
        function ($scope, $stateParams, $timeout, Alarm, Computer) {
            var id = $stateParams.id
            Alarm.get({alarmId: id}, function(data){
                $scope.alarm = data;

                getComputers($scope, Computer, {alarm_id: data.alarmID, is_current:1});
                getComputers($scope, Computer, {alarm_id: data.alarmID, is_current:0});

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
                                // nodes: [
                                //     {category: 0, name: '乔布斯', value: 10, label: '乔布斯'},
                                //     {category: 1, name: '丽萨-乔布斯', value: 2},
                                //     {category: 1, name: '保罗-乔布斯', value: 3},
                                //     {category: 1, name: '克拉拉-乔布斯', value: 3},
                                //     {category: 1, name: '劳伦-鲍威尔', value: 7},
                                //     {category: 1, name: '史蒂夫-沃兹尼艾克', value: 5},
                                //     {category: 1, name: '奥巴马', value: 8},
                                //     {category: 1, name: '比尔-盖茨', value: 9},
                                //     {category: 1, name: '乔纳森-艾夫', value: 4},
                                //     {category: 1, name: '蒂姆-库克', value: 4},
                                //     {category: 1, name: '龙-韦恩', value: 1},
                                // ],
                                // links: [
                                //     {source: '乔布斯', target: '乔布斯', weight: 1, name: '女儿'},
                                //     {source: '丽萨-乔布斯', target: '丽萨-乔布斯', weight: 1},
                                //     {source: '丽萨-乔布斯', target: '乔布斯', weight: 1, name: '女儿'},
                                //     {source: '保罗-乔布斯', target: '乔布斯', weight: 2, name: '父亲'},
                                //     {source: '克拉拉-乔布斯', target: '乔布斯', weight: 1, name: '母亲'},
                                //     {source: '劳伦-鲍威尔', target: '乔布斯', weight: 2},
                                //     {source: '史蒂夫-沃兹尼艾克', target: '乔布斯', weight: 3, name: '合伙人'},
                                //     {source: '奥巴马', target: '乔布斯', weight: 1},
                                // ]
                                links: []
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
                            //console.log("选中了边 " + sourceNode.name + ' -> ' + targetNode.name + ' (' + data.weight + ')');
                        } else { // 点击的是点
                            $scope.$apply(function () {
                                $scope.showSideDetail(data.value, 'Chart');
                            });
                            //console.log("选中了" + data.name + '(' + data.value + ')');
                        }
                    }

                    storyLineChart.on(ecConfig.EVENT.CLICK, focus);

                    storyLineChart.on(ecConfig.EVENT.FORCE_LAYOUT_END, function () {
                        //console.log(storyLineChart.chart.force.getPosition());
                    });

                    storyLineChart.setOption(option);
                }, 0);






            });

            $scope.affectTabs = [
                {title: 'Affected Path', state: 'file_affected_path'},
                {title: 'Current Affected Computer', state: ''},
                {title: 'History Affected Computer', state: ''}
            ];

            $scope.clickTab = function (tab) {
                $scope.selectedTab = tab.title;
            };

            $scope.addToWhitelist = function (file) {
                if (confirm('Are you sure to add ' + file.name + ' to whitelist?')) {

                }
            };

            function getComputers($scope, Computer, params) {
                params = params || {};

                var getList = function() {
                    Computer.get(params,
                        function (data) {
                            $scope.pagination = data.meta || {};
                            if(params.is_current){
                                $scope.currAffectedComs = data.objects || [];
                            }
                            else{
                                $scope.histAffectedComs = data.objects || [];
                            }
                        },
                        function(error){
                            console.log(error);
                        }
                    );
                };

                $scope.pageChanged = function (page) {
                    params.page = page;
                    getList();
                };
                getList();
            }
        }
    ])

    .controller('threatsAction', ['$scope', '$stateParams', '$timeout', 'Alarm',
        function ($scope, $stateParams, $timeout, Alarm) {
            var action_id = $stateParams.id;

            Alarm.get({alarmId: $stateParams.id}, function(data){
                $scope.alarm = data;

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
                                // nodes: [
                                //     {category: 0, name: '乔布斯', value: 10, label: '乔布斯'},
                                //     {category: 1, name: '丽萨-乔布斯', value: 2},
                                //     {category: 1, name: '保罗-乔布斯', value: 3},
                                //     {category: 1, name: '克拉拉-乔布斯', value: 3},
                                //     {category: 1, name: '劳伦-鲍威尔', value: 7},
                                //     {category: 1, name: '史蒂夫-沃兹尼艾克', value: 5},
                                //     {category: 1, name: '奥巴马', value: 8},
                                //     {category: 1, name: '比尔-盖茨', value: 9},
                                //     {category: 1, name: '乔纳森-艾夫', value: 4},
                                //     {category: 1, name: '蒂姆-库克', value: 4},
                                //     {category: 1, name: '龙-韦恩', value: 1},
                                // ],
                                // links: [
                                //     {source: '乔布斯', target: '乔布斯', weight: 1, name: '女儿'},
                                //     {source: '丽萨-乔布斯', target: '丽萨-乔布斯', weight: 1},
                                //     {source: '丽萨-乔布斯', target: '乔布斯', weight: 1, name: '女儿'},
                                //     {source: '保罗-乔布斯', target: '乔布斯', weight: 2, name: '父亲'},
                                //     {source: '克拉拉-乔布斯', target: '乔布斯', weight: 1, name: '母亲'},
                                //     {source: '劳伦-鲍威尔', target: '乔布斯', weight: 2},
                                //     {source: '史蒂夫-沃兹尼艾克', target: '乔布斯', weight: 3, name: '合伙人'},
                                //     {source: '奥巴马', target: '乔布斯', weight: 1},
                                // ]
                                nodes: $scope.alarm.events.map(function(e){return {category:1, name:e.action, event:e}}),
                                links: $scope.alarm.events.map(function(e){return {source: e.sourceObj.type, target:e.targetObj.type, name:e.action}}),
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
                                $scope.showSideDetail(data.event, 'Chart');
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


            });

            $scope.closeSideDetail = function (type) {
                $scope['show' + type + 'ThreatDetail'] = false;
            };

            $scope.showSideDetail = function (data, type) {
                $scope['show' + type + 'ThreatDetail'] = true;
                var key = 'selected' + type + 'Node'
                $scope[key] = data;
                $scope[key+'_title'] = data.action + ' (ID: '+data.eventID+')';
                $scope[key+'_srcObj'] = JSON.parse((data.sourceObj || {}).content || '{}');
                $scope[key+'_tarObj'] = JSON.parse((data.targetObj || {}).content || '{}');
                $scope[key+'_srcObj_keys'] = [];
                $scope[key+'_tarObj_keys'] = [];
                for(var k in $scope[key+'_srcObj']) {
                    $scope[key+'_srcObj_keys'].push(k)
                }
                for(var k in $scope[key+'_tarObj']) {
                    $scope[key+'_tarObj_keys'].push(k)
                }
            };
        }])
;

function getAlarms($scope, Alarm, params, $timeout) {
    function getList() {
        Alarm.get(params, function (data) {
            $scope.pagination = data.meta || {};
            $scope.alarms = data.objects || [];

            if($timeout) {
                $timeout(getList, 7000);
            }
        }, function (error){
            console.log(error);

            if($timeout) {
                $timeout(getList, 7000);
            }
        });
    }

    $scope.pageChanged = function (page) {
        params.page = page;
        getList()
    };


    $scope.changeAlarmStatus = function(alarm, status) {
        Alarm.add({id:alarm.id, status:status}, function(data){
            alarm.status = data.status;
        });
    };

    $scope.removeExcept= function(alarm) {
        if(alarm.status == 'exception'){
            Alarm.add({id:alarm.id, status: 'unsolved'}, function(data){
                alarm.status = data.status;
            });
        }
    };

    getList();

}