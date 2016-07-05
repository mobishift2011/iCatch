angular.module('investigateCtrls', [])

    .controller('investigates', ['$state', '$scope', function ($state, $scope) {
        $scope.sidebar = {
            title: 'Investigates',
            items: [
                {title: 'Computer', state: 'investigate_computer', icon: 'glyphicon glyphicon-hdd'},
                {title: 'File', state: 'investigate_file', icon: 'glyphicon glyphicon-file'},
                {title: 'IP', state: 'investigate_ip', icon: 'glyphicon glyphicon-globe'},
                {title: 'User', state: 'investigate_user', icon: 'glyphicon glyphicon-user'},
                {title: 'IOC', state: 'investigate_ioc', icon: 'glyphicon glyphicon-cloud-upload'}

            ]
        }
        $state.go('investigate_computer');
    }])

    .controller('investigate_computer', ['$scope', function ($scope) {

    }])

    .controller('investigate_ip', ['$scope', function ($scope) {
        $scope.results = testdata;
    }])

    .controller('investigate_user', ['$scope', function ($scope) {
        $scope.results = testdata;
    }])
    
    .controller('investigate_ioc', ['$scope', function ($scope) {
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