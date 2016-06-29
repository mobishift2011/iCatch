angular.module('computerCtrls', [])
    .controller('computers', ['$scope',
        function ($scope) {
            $scope.comTabs = [
                {title: 'Protected', state: 'computers_protected'},
                {title: 'Isolated', state: 'computers_isolated'}
            ];
            $scope.coms = test_coms1;
            $scope.query = {};
            $scope.activateQuery = function (title) {
                $scope.queryTitle = title;
            };
            $scope.search = function () {
                var query = $scope.queryTitle + '=' + $scope.query[$scope.queryTitle];
                alert(query);
            }
        }])

    .controller('protectedComs', ['$scope',
        function ($scope) {
            $scope.coms = test_coms1;
        }])


    .controller('isolatedComs', ['$scope',
        function ($scope) {
            $scope.queryTitle = '';
            $scope.coms = test_coms2;
        }])
    
    
    .controller('computerDetail', ['$scope', '$stateParams',
        function ($scope, $stateParams) {
            id = $stateParams.id;
            $scope.computer = test_com;
            test_com.id = id;
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