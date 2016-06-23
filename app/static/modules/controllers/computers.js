angular.module('computerCtrls', [])
    .controller('computerDetail', ['$scope',
        function ($scope) {
            $scope.computer = test_com;
        }])
;


var test_com = {
    name: 'Ehtan"s computer',
    domain: 'www.baidu.com',
    ip: '192.168.0.1',
    profile: 'profile api',
    groups: ['Group1', 'group2', 'group3'],
    status: 'resume',
    version: '1.2.1',
    sensorID: '123',
    quarantine: true,
}