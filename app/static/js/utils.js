var ht = (function () {
    var ht_noty = function (text, params) {
        var options = {
            "text": text,
            "layout": "topCenter",
            "type": "alert",
            "animateOpen": {"opacity": "show"}
        };
        if (params) {
            for (var k in params) {
                options[k] = params[k];
            }
        }
        noty(options);
    };

    return {
        noty: ht_noty,
    }
})();