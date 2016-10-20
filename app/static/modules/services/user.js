angular.module('userServices', ['ngResource'])
.factory('User', ['$resource', 'sys',
    function($resource, sys){
        var listUrl = sys.API + '/user/list';
        var listResource = $resource(listUrl);

        var addUrl = sys.API + '/user/add';
        var addResource = $resource(addUrl);

        var deleteUrl = sys.API + '/user/delete';
        var deleteResource = $resource(deleteUrl);

        var loginLogUrl = sys.API + '/user/loginlog';
        var loginLogResource = $resource(loginLogUrl);
        
        return {
            list: listResource.get,
            add: addResource.save,
            loginlog: loginLogResource.get,
            delete: deleteResource.save,
        }
    }
])
;