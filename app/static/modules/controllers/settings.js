angular.module('settingsCtrls', [])
    .controller('settings', ['$state', function ($state) {
        $state.go('settings_basic');
    }])

    .controller('settings_basic', ['$scope',
        function ($scope) {
        }
    ])

    .controller('settings_user', ['$scope',
        function ($scope) {
            $scope.users = [
                {
                    'username': 'ethan',
                    'email': 'sorrowkid@163.com',
                    'role': 'admin',
                    'dateAdded': '1927-07-12'
                },
                {
                    'username': 'ethan',
                    'email': 'sorrowkid@163.com',
                    'role': 'admin',
                    'dateAdded': '1927-07-12'
                },
                {
                    'username': 'ethan',
                    'email': 'sorrowkid@163.com',
                    'role': 'admin',
                    'dateAdded': '1927-07-12'
                },
                {
                    'username': 'ethan',
                    'email': 'sorrowkid@163.com',
                    'role': 'admin',
                    'dateAdded': '1927-07-12'
                },
                {
                    'username': 'ethan',
                    'email': 'sorrowkid@163.com',
                    'role': 'admin',
                    'dateAdded': '1927-07-12'
                },
                {
                    'username': 'ethan',
                    'email': 'sorrowkid@163.com',
                    'role': 'admin',
                    'dateAdded': '1927-07-12'
                },
                {
                    'username': 'ethan',
                    'email': 'sorrowkid@163.com',
                    'role': 'admin',
                    'dateAdded': '1927-07-12'
                },
                {
                    'username': 'ethan',
                    'email': 'sorrowkid@163.com',
                    'role': 'admin',
                    'dateAdded': '1927-07-12'
                },
                {
                    'username': 'ethan',
                    'email': 'sorrowkid@163.com',
                    'role': 'admin',
                    'dateAdded': '1927-07-12'
                },
                {
                    'username': 'ethan',
                    'email': 'sorrowkid@163.com',
                    'role': 'admin',
                    'dateAdded': '1927-07-12'
                },
                {
                    'username': 'ethan',
                    'email': 'sorrowkid@163.com',
                    'role': 'admin',
                    'dateAdded': '1927-07-12'
                },
            ];

            $scope.checkAll = function () {
                for (var i in $scope.users) {
                    $scope.users[i].toRemove = $scope.toRemoveAll;
                }
            };

            $scope.removeUsers = function () {
                for (var i = ($scope.users.length - 1); i >= 0; i--) {
                    if ($scope.users[i].toRemove) {
                        $scope.users.splice(i, 1, 0);
                    }
                }
            }
        }
    ])
;