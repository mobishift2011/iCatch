angular.module('configServices', ['ngResource'])
    .factory('Config', ['$resource', 'sys',
        function($resource, sys){
            var url = sys.API + '/config/:configId/';
            var resource = $resource(url, {configId: '@id'}, {
                'testMail': {
                    'method': 'POST',
                    'params': {configId: 'test_mail'}
                }
            });

            return {
                get: resource.get,
                add: resource.save,
                testMail: resource.testMail,
            }
        }
    ])
;