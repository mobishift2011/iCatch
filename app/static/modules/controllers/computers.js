angular.module('computerCtrls', ['profileServices', 'computerServices'])
    .controller('computers', ['$scope', 'Profile', 'Computer',
        function ($scope, Profile, Computer) {
            $scope.comTabs = [
                {title: 'Protected', state: 'computers_protected'},
                {title: 'Isolated', state: 'computers_isolated'}
            ];

            getProfiles($scope, Profile);
            getSensors($scope, Computer);
            getComputers($scope, Computer);

            $scope.query = {};
            $scope.activateQuery = function (title) {
                $scope.queryTitle = title;
            };
            $scope.search = function () {
                var query = $scope.queryTitle + '=' + $scope.query[$scope.queryTitle];
                alert(query);
            }
        }])

    .controller('protectedComs', ['$scope', 'Profile',
        function ($scope, Profile) {
            getComputers($scope, Computer);
        }])


    .controller('isolatedComs', ['$scope',
        function ($scope) {
            $scope.queryTitle = '';
            $scope.tableCheckHide = true;
            getComputers($scope, Computer);
        }])


    .controller('computerDetail', ['$scope', '$stateParams',
        function ($scope, $stateParams) {
            id = $stateParams.id;
            $scope.computer = test_com;
            test_com.id = id;
        }])
;

function getProfiles($scope, Profile) {
    Profile.get(function (data) {
        $scope.profiles = data.objects || [];
    });
}

function getSensors($scope, Computer) {
    Computer.sensorList(function(data){
        $scope.sensors = data || [];
        alert($scope.sensors);
    });
}

function getComputers($scope, Computer) {
    var _comCallback = function (data) {
        $scope.pagination = data.meta || {};
        $scope.coms = data.objects || [];
    };

    $scope.pageChanged = function (page) {
        Computer.get({page: page}, _comCallback);
    };
    
    Computer.get(_comCallback);

}