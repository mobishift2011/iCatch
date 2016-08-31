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

    .controller('investigate_file', ['$scope', function ($scope) {
        
    }])

    .controller('investigate_ip', ['$scope', function ($scope) {
        $scope.results = [];
    }])

    .controller('investigate_user', ['$scope', function ($scope) {
        $scope.results = [];
    }])
    
    .controller('investigate_ioc', ['$scope', function ($scope) {
    }])
;