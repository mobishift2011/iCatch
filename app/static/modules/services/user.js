angular.module('userServices', ['ngResource'])
.factory('User', ['$resource', 'sys',
    function($resource, sys){
        var listUrl = sys.API + '/user/list';
        var listResource = $resource(listUrl);

        var addUrl = sys.API + '/user/add';
        var addResource = $resource(addUrl);
        
        return {
            list: listResource.get,
            add: addResource.save,
        }
    }
])
;