angular.module('investigateCtrls', [])

    .controller('investigates', ['$state', '$scope', function ($state, $scope) {
        $state.go('investigate_computer');
        $scope.comStatStyle = {
            'on': 'success',
            'pause': 'primary',
            'off': 'default',
            'uninstall': 'danger',
        }
    }])

    .controller('investigate_computer', ['$scope', function ($scope) {

    }])

    .controller('investigate_ip', ['$scope', function ($scope) {
        $scope.results = testdata;
    }])
    .controller('investigate_user', ['$scope', function ($scope) {
        $scope.results = testdata;
    }])
;


var testdata = [
    {
        username: 'Ethan',
        domain: 'http://www.baidu.com',
        time: '2015-7-6',
        computer: 'adf-asdf-asdfasdf-ksadf',
        name: 'adf-asdf-asdfasdf-ksadf',
        status: 'ON',
        ip: '192.168.2.1',
        os: 'windows 7',
        earliestVisit: '2015-7-6',
        latestVisit: '2016-6-6'
    },
    {
        username: 'Ethan',
        domain: 'http://www.baidu.com',
        time: '2015-7-6',
        computer: 'adf-asdf-asdfasdf-ksadf',
        name: 'adf-asdf-asdfasdf-ksadf',
        status: 'ON',
        ip: '192.168.2.1',
        os: 'windows 7',
        earliestVisit: '2015-7-6',
        latestVisit: '2016-6-6'
    },
    {
        username: 'Ethan',
        domain: 'http://www.baidu.com',
        time: '2015-7-6',
        computer: 'adf-asdf-asdfasdf-ksadf',
        name: 'adf-asdf-asdfasdf-ksadf',
        status: 'Uninstall',
        ip: '192.168.2.1',
        os: 'windows 7',
        earliestVisit: '2015-7-6',
        latestVisit: '2016-6-6'
    },
    {
        username: 'Ethan',
        domain: 'http://www.baidu.com',
        time: '2015-7-6',
        computer: 'adf-asdf-asdfasdf-ksadf',
        name: 'adf-asdf-asdfasdf-ksadf',
        status: 'PAUSE',
        ip: '192.168.2.1',
        os: 'windows 7',
        earliestVisit: '2015-7-6',
        latestVisit: '2016-6-6'
    },
    {
        username: 'Ethan',
        domain: 'http://www.baidu.com',
        time: '2015-7-6',
        computer: 'adf-asdf-asdfasdf-ksadf',
        name: 'adf-asdf-asdfasdf-ksadf',
        status: 'ON',
        ip: '192.168.2.1',
        os: 'windows 7',
        earliestVisit: '2015-7-6',
        latestVisit: '2016-6-6'
    },
    {
        username: 'Ethan',
        domain: 'http://www.baidu.com',
        time: '2015-7-6',
        computer: 'adf-asdf-asdfasdf-ksadf',
        name: 'adf-asdf-asdfasdf-ksadf',
        status: 'OFF',
        ip: '192.168.2.1',
        os: 'windows 7',
        earliestVisit: '2015-7-6',
        latestVisit: '2016-6-6'
    },
    {
        username: 'Ethan',
        domain: 'http://www.baidu.com',
        time: '2015-7-6',
        computer: 'adf-asdf-asdfasdf-ksadf',
        name: 'adf-asdf-asdfasdf-ksadf',
        status: 'ON',
        ip: '192.168.2.1',
        os: 'windows 7',
        earliestVisit: '2015-7-6',
        latestVisit: '2016-6-6'
    },
    {
        username: 'Ethan',
        domain: 'http://www.baidu.com',
        time: '2015-7-6',
        computer: 'adf-asdf-asdfasdf-ksadf',
        name: 'adf-asdf-asdfasdf-ksadf',
        status: 'ON',
        ip: '192.168.2.1',
        os: 'windows 8',
        earliestVisit: '2015-7-6',
        latestVisit: '2016-6-6'
    },
    {
        username: 'Ethan',
        domain: 'http://www.baidu.com',
        time: '2015-7-6',
        computer: 'adf-asdf-asdfasdf-ksadf',
        name: 'adf-asdf-asdfasdf-ksadf',
        status: 'ON',
        ip: '192.168.2.1',
        os: 'windows 7',
        earliestVisit: '2015-7-6',
        latestVisit: '2016-6-6'
    },
    {
        username: 'Ethan',
        domain: 'http://www.baidu.com',
        time: '2015-7-6',
        computer: 'adf-asdf-asdfasdf-ksadf',
        name: 'adf-asdf-asdfasdf-ksadf',
        status: 'ON',
        ip: '192.168.2.1',
        os: 'windows 7',
        earliestVisit: '2015-7-6',
        latestVisit: '2016-6-6'
    },
    {
        username: 'Ethan',
        domain: 'http://www.baidu.com',
        time: '2015-7-6',
        computer: 'adf-asdf-asdfasdf-ksadf',
        name: 'adf-asdf-asdfasdf-ksadf',
        status: 'ON',
        ip: '192.168.2.1',
        os: 'linux',
        earliestVisit: '2015-7-6',
        latestVisit: '2016-6-6'
    },
    {
        username: 'Ethan',
        domain: 'http://www.baidu.com',
        time: '2015-7-6',
        computer: 'adf-asdf-asdfasdf-ksadf',
        name: 'adf-asdf-asdfasdf-ksadf',
        status: 'ON',
        ip: '192.168.2.1',
        os: 'windows 7',
        earliestVisit: '2015-7-6',
        latestVisit: '2016-6-6'
    },
    {
        username: 'Ethan',
        domain: 'http://www.baidu.com',
        time: '2015-7-6',
        computer: 'adf-asdf-asdfasdf-ksadf',
        name: 'adf-asdf-asdfasdf-ksadf',
        status: 'ON',
        ip: '192.168.2.1',
        os: 'windows 7',
        earliestVisit: '2015-7-6',
        latestVisit: '2016-6-6'
    },
];