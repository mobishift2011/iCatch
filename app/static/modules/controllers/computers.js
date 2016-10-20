angular.module('computerCtrls', ['profileServices', 'computerServices'])
    .controller('computers', ['$scope', '$timeout', 'Profile', 'Computer',
        function ($scope, $timeout, Profile, Computer) {
            $scope.comTabs = [
                {title: 'Protected', state: 'computers_protected'},
                {title: 'Isolated', state: 'computers_isolated'}
            ];

            getProfiles($scope, Profile);
            getSensors($scope, Computer);
            getComputers($scope, Computer, {is_quarantine: false}, $timeout);
        }])

    .controller('protectedComs', ['$scope', 'Profile', 'Computer',
        function ($scope, Profile, Computer) {
            
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
    Computer.sensorList(function (data) {
        $scope.sensors = data || [];
    });
}

function getComputers($scope, Computer, params, $timeout) {
    var params = params || {};
    var intervals = 7000;

    var getList = function() {
        Computer.get(params,
            function (data) {
                $scope.pagination = data.meta || {};
                $scope.coms = data.objects || [];

//                if($timeout) {
//                    $timeout(getList, intervals);
//                }
            },
            function(error){
                console.log(error);

//                if($timeout) {
//                    $timeout(getList, intervals);
//                }
            }
        );
    };

    $scope.pageChanged = function (page) {
        params.page = page;
        getList();
    };

    $scope.query = {};
    $scope.activateQuery = function (title) {
        $scope.queryTitle = title;
    };
    $scope.search = function () {
        var query = {is_quarantine: false};
        var queryTitle = $scope.queryTitle
        var queryValue = $scope.query[queryTitle];

        if (queryValue || queryValue === 0) {
            if (queryTitle.endsWith('__like')) {
                queryValue = '%' + queryValue + '%'
            }
            query[$scope.queryTitle] = queryValue;
        }

        params = query;
        getList();
    };

    getList();
}