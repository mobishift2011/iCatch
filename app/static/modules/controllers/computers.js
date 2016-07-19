angular.module('computerCtrls', ['profileServices', 'computerServices'])
    .controller('computers', ['$scope', 'Profile', 'Computer',
        function ($scope, Profile, Computer) {
            $scope.comTabs = [
                {title: 'Protected', state: 'computers_protected'},
                {title: 'Isolated', state: 'computers_isolated'}
            ];

            getProfiles($scope, Profile);
            getSensors($scope, Computer);
            getComputers($scope, Computer, {is_quarantine: false});

            $scope.query = {};
            $scope.activateQuery = function (title) {
                $scope.queryTitle = title;
            };
            $scope.search = function () {
                var query = $scope.queryTitle + '=' + $scope.query[$scope.queryTitle];
                alert(query);
            }
        }])

    .controller('protectedComs', ['$scope', 'Profile', 'Computer',
        function ($scope, Profile, Computer) {
            getComputers($scope, Computer, {is_quarantine: false});
        }])


    .controller('isolatedComs', ['$scope', 'Computer',
        function ($scope, Computer) {
            $scope.queryTitle = '';
            $scope.tableCheckHide = true;
            getComputers($scope, Computer, {is_quarantine: true});
        }])


    .controller('computerDetail', ['$scope', '$stateParams',
        function ($scope, $stateParams) {
            id = $stateParams.id;
            // $scope.computer = test_com;
            // test_com.id = id;
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
    });
}

function getComputers($scope, Computer, params) {
    params = params || {};

    var _comCallback = function (data) {
        $scope.pagination = data.meta || {};
        $scope.coms = data.objects || [];
    };

    $scope.pageChanged = function (page) {
        params.page = page;
        Computer.get(params, _comCallback);
    };

    console.log(params);
    Computer.get(params, _comCallback);

}