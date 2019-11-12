import 'bootstrap';
import '../css/custom.scss';
import * as $ from 'jquery'

//Git-hub api: https://api.github.com/users/xavizus/repos

$().ready(() => {
    $(function() {
        $('[data-toggle="tooltip"]').tooltip()
    });
    if ($(window).width() > 992) {
        if ($('#pills-tab.flex-column').length) {
            $('#pills-tab').removeClass('flex-column');
        }
    } else {
        if (!$('#pills-tab.flex-column').length) {
            $('#pills-tab').addClass('flex-column');
        }
    }

    $(window).resize(() => {
        if ($(window).width() > 992) {
            if ($('#pills-tab.flex-column').length) {
                $('#pills-tab').removeClass('flex-column');
            }
        } else {
            if (!$('#pills-tab.flex-column').length) {
                $('#pills-tab').addClass('flex-column');
            }
        }
    });
});