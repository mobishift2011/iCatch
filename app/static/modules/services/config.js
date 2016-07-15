angular.module('configServices', ['ngResource'])
    .factory('Config', ['$resource', 'sys',
        function ($resource, sys) {
            var url = sys.API + '/config/:configId/';
            var resource = $resource(url, {configId: '@id'}, {
                'testMail': {
                    'method': 'POST',
                    'params': {configId: 'test_mail'}
                }
            });

            var get = function (key, fn) {
                resource.get({title: key}, function (data) {
                    if (data.objects && data.objects.length) {
                        fn(data.objects[0]);
                    }else {
                        fn(null);
                    }
                });
            }

            return {
                get: get,
                add: resource.save,
                testMail: resource.testMail,
            }
        }
    ])
;