angular.module('overviewCtrls', ['ngResource'])
    .controller('overview', ['$scope', '$resource', '$filter', 'sys',
        function ($scope, $resource, $filter, sys) {
            translate = $filter('translate');

            var Data = (function () {
                var url = sys.API + '/data/:action';
                var resource = $resource(url, {}, {
                    'stats': {
                        'method': "GET",
                        'params': {action: 'stats'},
                    }
                });

                return {
                    'stats': resource.stats,
                }
            })();


            Data.stats(function (data) {
                chartSusComThreeMonths(data.most_alarmed_coms);
                chartSusComTwoWeeks(test_datad1);

                chartSusFileThreeMonths(data.most_alarmed_files);
                chartSusFileTwoWeeks(test_datad1);

                chartStatsByOs(data.os_alarmed_stats);
                chartStatsByGroup(test_data4);
            });
        }])
;

var translate = null;

function chartSusComTwoWeeks(data) {
    //”可疑计算机数量“，统计显示过去两周内有告警的计算机的数量。
    // 横坐标为日期（两周内的每一天），纵坐标为两周内每一天发生告警的计算机数量总和。
    var categories = Object.keys(data);

    $('#susComTwoWeeksChart').highcharts({
        chart: {
            type: 'spline'
        },
        title: {
            text: translate('The alarmed computers daily')
        },
        subtitle: {
            text: translate('In the latest 2 weeks')
        },
        xAxis: {
            categories: categories
        },
        yAxis: {
            title: {
                text: translate('The amount of computers')
            },
            labels: {
                formatter: function () {
                    return this.value
                }
            }
        },
        tooltip: {
            crosshairs: true,
            shared: true
        },
        plotOptions: {
            spline: {
                marker: {
                    radius: 4,
                    lineColor: '#666666',
                    lineWidth: 1
                }
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            name: translate('Date Series'),
            marker: {
                symbol: 'diamond'
            },
            data: categories.map(function (x) {
                return data[x]
            })
        }]
    });
}

function chartSusComThreeMonths(arrayData) {
    //”可疑行为/被感染次数最多的计算机“，横坐标为计算机名，纵坐标为次数
    // 统计时间维度为过去90天内被发现有可疑行为或者被感染的次数最多的计算机
    // var test_data = {
    //     'com1': num1,
    //     'com2': num2,
    // };
    var data = {};
    for(var i in arrayData){
        var item = arrayData[i];
        data[item[0]] = item[1];
    }

    var colors = Highcharts.getOptions().colors,
        categories = Object.keys(data);
    name = translate('Computer Names');
    data = categories.map(function (e, i) {
        return {
            y: data[e],
            color: colors[i],
        }
    });

    function setChart(name, categories, data, color) {
        chart.xAxis[0].setCategories(categories, false);
        chart.series[0].remove(false);
        chart.addSeries({
            name: name,
            data: data,
            color: color || 'white'
        }, false);
        chart.redraw();
    }

    var chart = $('#susComThreeMonthsChart').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: translate('The most alarmed computers')
        },
        subtitle: {
            text: translate('In the latest 3 months')
        },
        xAxis: {
            categories: categories
        },
        yAxis: {
            title: {
                text: translate('The amount of alarms')
            }
        },
        plotOptions: {
            column: {
                cursor: 'pointer',
                point: {},
                dataLabels: {
                    enabled: false,
                    color: colors[0],
                    style: {
                        fontWeight: 'bold'
                    },
                    formatter: function () {
                        return this.y + '%';
                    }
                }
            }
        },
        tooltip: {
            formatter: function () {
                return this.x + ': <b>' + this.y;
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            name: name,
            data: data,
            color: 'white'
        }],
        exporting: {
            enabled: true
        }
    }).highcharts(); // return chart
}

function chartSusFileTwoWeeks(data) {
    //前面两周内每天在网内发现的可疑文件数量统计
    //（统计不同计算机内的可疑文件（不同或者相同）数量
    // 如果是同一个可疑文件，如果是在不同的机器上发现的，也算一个）
    var categories = Object.keys(data);
    $('#susFileTwoWeeksChart').highcharts({
        chart: {
            type: 'spline'
        },
        title: {
            text: translate('The threat files daily')
        },
        subtitle: {
            text: translate('In the latest 2 weeks') + '(' + translate('The same file on different computers will be considered as once every day') + ')'
        },
        xAxis: {
            categories: categories,
            labels: {
                formatter: function () {
                    return this.value; // clean, unformatted number for year
                }
            }
        },
        yAxis: {
            title: {
                text: translate('The amount of files')
            },
            labels: {
                formatter: function () {
                    return this.value;
                }
            }
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.y}</b>'
        },
        plotOptions: {
            area: {
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 2,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            }
        },
//        colors: [Highcharts.getOptions().colors[1]],
        credits: {
            enabled: false
        },
        series: [{
            name: translate('Date Series'),
            data: categories.map(function (x) {
                return data[x];
            })
        }]
    });
}

function chartSusFileThreeMonths(arrayData) {
    //”最常见的恶意文件“，统计也是统计过去三个月（从当天数过去90天）内的最常见恶意文件
    // 横坐标为恶意文件名，纵坐标为统计数量
    //    var test_data = {
    //        'file1': num1,
    //        'file2': num2,
    //    };

    var data = {};
    for(var i in arrayData){
        var item = arrayData[i];
        data[item[0]] = item[2];
    }

    var colors = Highcharts.getOptions().colors,
        categories = Object.keys(data);
    name = translate('Threat File Names'),
    data = categories.map(function (e, i) {
        return {
            y: data[e],
            color: colors[i],
        }
    });

    function setChart(name, categories, data, color) {
        chart.xAxis[0].setCategories(categories, false);
        chart.series[0].remove(false);
        chart.addSeries({
            name: name,
            data: data,
            color: color || 'white'
        }, false);
        chart.redraw();
    }

    var chart = $('#susFileThreeMonthsChart').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: translate('The most common threat files')
        },
        subtitle: {
            text: translate('In the latest 3 months')
        },
        xAxis: {
            categories: categories
        },
        yAxis: {
            title: {
                text: translate('The amount of alarms')
            }
        },
        plotOptions: {
            column: {
                cursor: 'pointer',
                point: {},
                dataLabels: {
                    enabled: false,
                    color: colors[0],
                    style: {
                        fontWeight: 'bold'
                    },
                    formatter: function () {
                        return this.y + '%';
                    }
                }
            }
        },
        tooltip: {
            formatter: function () {
                return this.x + ': <b>' + this.y;
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            name: name,
            data: data,
            color: 'white'
        }],
        exporting: {
            enabled: true
        }
    }).highcharts(); // return chart
}

function chartStatsByOs(arrayData) {

    chartStats($('#statsByOsChart'), arrayData);
}

function chartStatsByGroup(data) {
    chartStats($('#statsByGroup'), data);
}

function chartStats(chartObj, data) {
    //    var test_data = {
    //        'windows7': 40,
    //        'Linux': 39,
    //        'java': 33,
    //        'Mac os': 22,
    //        'python': 21
    //    };
    var keys = Object.keys(data);
    var with_alarms = keys.map(function(e){
        return data[e].alarmed;
    });
    var without_alarms = keys.map(function(e){
        return data[e].without_alarmed;
    });


    var categories = Object.keys(data);
    colors = ['#f7a35c', '#90ed7d', '#e4d354', '#f15c80', '#7cb5ec', '#434348',
        '#8085e9', '#2b908f', '#f45b5b', '#91e8e1'];
    chartObj.highcharts({
        chart: {
            type: 'bar'
        },
        title: {
            text: translate('In the latest 3 months')
        },
        xAxis: {
            categories: categories,
            tickLength: 0,
            tickWidth: 0,
        },
        yAxis: {
            min: 0,
            title: {
                text: translate('Total Amount')
            },
            gridLineWidth: 0,
        },
        legend: {
            backgroundColor: '#FFFFFF',
            reversed: true
        },
        plotOptions: {
            series: {
                stacking: 'normal',
                pointWidth: 12,
            }
        },
        colors: colors,
        credits: {
            enabled: false
        },
        series: [
            {
                name: translate('With Alarm'),
                data: with_alarms
            },
            {
                name: translate('Without Alarm'),
                data: without_alarms
            }
        ]
    });
}

var test_datad1 = {
    '2016-6-15': 40,
    '2016-6-16': 32,
    '2016-6-17': 84,
    '2016-6-18': 32,
    '2016-6-19': 98,
    '2016-6-20': 77,
    '2016-6-21': 66,
    '2016-6-22': 54,
    '2016-6-23': 34,
    '2016-6-24': 65,
    '2016-6-25': 89,
    '2016-6-26': 98,
    '2016-6-27': 101,
    '2016-6-28': 42,
};

var test_data3 = {
    'windows7': 40,
    'Linux': 39,
    'java': 33,
    'Mac os': 22,
    'python': 21
};

var test_data4 = {
    'Tony Team': [20, 30],
    'John Team': [40, 50],
    'Bubby Team': [60, 70],
};