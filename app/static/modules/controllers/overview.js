angular.module('overviewCtrls', [])
    .controller('overview', ['$scope', function ($scope) {
        chartSusComTwoWeeks(test_datad1);
        chartSusComThreeMonths(test_datad2);
        chartSusFileTwoWeeks(test_datad1);
        chartSusFileThreeMonths(test_datad2);
        chartStatsByOs(test_data3);
        chartStatsByGroup(test_data4);
    }])
;

function chartSusComTwoWeeks(data) {
    //”可疑计算机数量“，统计显示过去两周内有告警的计算机的数量。
    // 横坐标为日期（两周内的每一天），纵坐标为两周内每一天发生告警的计算机数量总和。
    var categories = Object.keys(data);

    $('#susComTwoWeeksChart').highcharts({
        chart: {
            type: 'spline'
        },
        title: {
            text: 'The alerted computers daily'
        },
        subtitle: {
            text: 'In the latest 2 weeks'
        },
        xAxis: {
            categories: categories
        },
        yAxis: {
            title: {
                text: 'Number of Computers'
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
            name: 'Alert Computers',
            marker: {
                symbol: 'diamond'
            },
            data: categories.map(function (x) {
                return data[x]
            })
        }]
    });
}

function chartSusComThreeMonths(data) {
    //”可疑行为/被感染次数最多的计算机“，横坐标为计算机名，纵坐标为次数
    // 统计时间维度为过去90天内被发现有可疑行为或者被感染的次数最多的计算机
    var colors = Highcharts.getOptions().colors,
        categories = Object.keys(data);
    name = 'Computer Names',
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
            text: 'The most alerted computers'
        },
        subtitle: {
            text: 'In the latest 3 months'
        },
        xAxis: {
            categories: categories
        },
        yAxis: {
            title: {
                text: 'Numbers of Alerts'
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
            type: 'area'
        },
        title: {
            text: 'The suspect files daily in the latest 2 weeks'
        },
        subtitle: {
            text: 'The same file on different computers will be considered as once every day'
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
                text: 'Numbers of files'
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
        colors: [Highcharts.getOptions().colors[1]],
        credits: {
            enabled: false
        },
        series: [{
            name: 'Suspect Files',
            data: categories.map(function (x) {
                return data[x];
            })
        }]
    });
}

function chartSusFileThreeMonths(data) {
    //”最常见的恶意文件“，统计也是统计过去三个月（从当天数过去90天）内的最常见恶意文件
    // 横坐标为恶意文件名，纵坐标为统计数量
    var colors = Highcharts.getOptions().colors,
        categories = Object.keys(data);
    name = 'Threat File Names',
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
            text: 'The most common threat files'
        },
        subtitle: {
            text: 'In the latest 3 months'
        },
        xAxis: {
            categories: categories
        },
        yAxis: {
            title: {
                text: 'Numbers of Computers'
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

function chartStatsByOs(data) {
    chartStats($('#statsByOsChart'), data);
}

function chartStatsByGroup(data) {
    chartStats($('#statsByGroup'), data);
}

function chartStats(chartObj, data) {
    var categories = Object.keys(data);
    colors = ['#f7a35c', '#90ed7d', '#e4d354', '#f15c80', '#7cb5ec', '#434348',
        '#8085e9', '#2b908f', '#f45b5b', '#91e8e1'];
    chartObj.highcharts({
        chart: {
            type: 'bar'
        },
        title: {
            text: 'In the latest 3 months'
        },
        xAxis: {
            categories: categories,
            tickLength: 0,
            tickWidth: 0,
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Total Number'
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
                name: 'Action',
                data: [2, 2, 3, 2, 1]
            },
            {
                name: 'File',
                data: [5, 3, 4, 7, 2]
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

var test_datad2 = {
    'adfasdf-dsfa-adf1': 40,
    'adfasdf-dsfa-adf2': 39,
    'adfasdf-dsfa-adf3': 33,
    'adfasdf-dsfa-adf4': 22,
    'adfasdf-dsfa-adf5': 21,
    'adfasdf-dsfa-adf6': 14,
    'adfasdf-dsfa-adf7': 13,
    'adfasdf-dsfa-adf8': 11,
    'adfasdf-dsfa-adf9': 9,
    'adfasdf-dsfa-adf10': 7,
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