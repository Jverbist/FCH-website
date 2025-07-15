jQuery(document).ready(function ($) {
    var $links = jQuery(".jq-iframe");

    $links.each(function (index) {
        var $current = jQuery(this);
        var h = 300;
        var w = 500;
        if ($current.attr("Height") != "") {
            h = $current.attr("Height");
        }
        if ($current.attr("Width") != "") {
            w = $current.attr("Width");
        }
        $current.colorbox({
            iframe: true,
            height: h,
            width: w,
            close: $globalDictionaryValues[0]
        });
    });
});

function CloseIframeAndRefreshParent() {
    CloseIframeWindow([window.top.location.protocol, '//', window.top.location.host, window.top.location.pathname].join(''));
}

function CloseIframeWindow(redirectPath) {
    parent.jQuery.fn.colorbox.close();
    if (redirectPath != "") {
        window.top.location.href = redirectPath;
    }
}

function OpenColorBoxWithIframe(redirectPath, h, w) {
    //    parent.jQuery.fn.colorbox.close();
    parent.jQuery.colorbox({
        iframe: true,
        height: h,
        width: w,
        close: $globalDictionaryValues[0],
        href: redirectPath,
        open: true
    });
}