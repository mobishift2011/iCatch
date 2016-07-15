var ht = (function () {
    var ht_noty = function (text) {
        var options = {
            "text": text,
            "layout": "topCenter",
            "type": "alert",
            "animateOpen": {"opacity": "show"}
        };
        noty(options);
    };

    return {
        noty: ht_noty,
    }
})();