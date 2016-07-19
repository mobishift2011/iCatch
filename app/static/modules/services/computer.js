angular.module('computerServices', ['ngResource'])
    .factory('Computer', ['$resource', 'sys',
        function($resource, sys){
            var url = sys.API + '/computer/:computerId/';
            var resource = $resource(url, {computerId: '@id'}, {
                sensorList: {
                    method: 'GET',
                    params: {computerId: 'sensor'},
                    isArray: true
                }
            });

            return {
                get: resource.get,
                add: resource.save,
                sensorList: resource.sensorList
            }
        }
    ])
;