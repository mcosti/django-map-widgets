(function ($) {
    DjangoMapPolyWidgetBase = $.Class.extend({
        init: function (options) {
            $.extend(this, options);
            this.initializeMap();
        },
        initializeMap: function () {
            console.warn("Implement initializeMap method.");
        },
    });
})(jQuery || django.jQuery);
