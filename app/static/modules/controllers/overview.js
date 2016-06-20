angular.module('overviewCtrls', [])
.controller('overview', ['$scope', function ($scope) {
    $('#susFileTwoWeeksChart').highcharts({
        chart: {
            type: 'spline'
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
            title: {
                text: 'Number of Endpoints'
            },
            labels: {
                formatter: function() {
                    return this.value +'°'
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
        series: [{
            name: 'Latest Two Weeks',
            marker: {
                symbol: 'square'
            },
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, {
                y: 26.5,
                marker: {
                    symbol: 'url(/demo/img/sun.png)'
                }
            }, 23.3, 18.3, 13.9, 9.6]

        }]
    });
    $('#susFileThreeMonthsChart').highcharts({
        chart: {
            type: 'spline'
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
            title: {
                text: 'Number of Endpoints'
            },
            labels: {
                formatter: function() {
                    return this.value +'°'
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
        series: [{
            name: 'Latest Three Months',
            marker: {
                symbol: 'diamond'
            },
            data: [{
                y: 3.9,
                marker: {
                    symbol: 'url(/demo/img/snow.png)'
                }
            }, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
        }]
    });
    $('#statsByOsChart').highcharts({
        chart: {
            type: 'bar'
        },
        title: {
            text: 'By OS'
        },
        xAxis: {
            categories: ['Windows', 'Linux', 'Ubuntu', 'Mac OS'],
            title: {
                text: null
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Number of Endpoints',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
        },
        tooltip: {
            valueSuffix: ' millions'
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            data: [107, 31, 635, 203, 2]
        }]

    });

        $('#statsByGroup').highcharts({
        chart: {
            type: 'bar'
        },
        title: {
            text: 'By Group'
        },
        xAxis: {
            categories: ['Group1', 'Group2', 'Group3', 'Group4'],
            title: {
                text: null
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Number of Endpoints',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
        },
        tooltip: {
            valueSuffix: ' millions'
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            data: [107, 31, 635, 203, 2],
            color:"#00aa00"
        }]

    });
}]);