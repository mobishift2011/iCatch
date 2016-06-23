angular.module('settingsCtrls', [])
    .controller('settings', ['$scope', '$state', function ($scope, $state) {
        $scope.sidebar = {
            title: 'Settings',
            items: [
                {title: 'Basic Settings', state: 'settings_basic', icon: 'glyphicon-home'},
                {title: 'Users Management', state: 'settings_user', icon: 'glyphicon-user'},
                {title: 'Profiles Management', state: 'settings_profile', icon: 'glyphicon-file'},
                {title: 'Groups Management', state: 'settings_group', icon: 'glyphicon-folder-close'}
            ]
        }
        $state.go('settings_basic');
    }])

    .controller('settings_basic', ['$scope',
        function ($scope) {
        }
    ])

    .controller('settings_user', ['$scope',
        function ($scope) {
            $scope.users = test_users;

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

    .controller('settings_profile', ['$scope',
        function ($scope) {
        }
    ])

    .controller('settings_group', ['$scope',
        function ($scope) {
            $scope.groupRules = ['Added Manually', 'Added by Rules'];
            
            $('#groupTree').treeview({
                data: test_group_data,
                nodeIcon: "glyphicon glyphicon-folder-close",
            });
        }
    ])
;

var test_users = [
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

var test_group_data = [
    {
        text: 'group1',
        'nodes': [
            {'text': 'group2'},
            {'text': 'group3'},
        ]
    }
]