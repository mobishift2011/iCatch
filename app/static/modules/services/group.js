angular.module('groupServices', ['ngResource'])
    .factory('Group', ['$resource', 'sys',
        function($resource, sys){
            var url = sys.API + '/group/:groupId/';
            var resource = $resource(url, {computerId: '@id'});

            return {
                get: resource.get,
                add: resource.save,
            }
        }
    ])
;