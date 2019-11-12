import 'bootstrap/js/dist/util';
import 'bootstrap/js/dist/tab';
import 'bootstrap/js/dist/tooltip';
import '../css/custom.scss';
import * as $ from 'jquery';
import * as Settings from './classes/settings.class.js';

/**
 * Configs
 */

const largeScreenWidth = 992; // Large screens (from Bootstrap https://getbootstrap.com/docs/4.0/layout/grid/#grid-options)

//Git-hub api: https://api.github.com/users/xavizus/repos

//When DOMContent is loaded, call main-function
$().ready(main);

/**
 * Start of the whole site.
 */
async function main() {
    //Initialize default settings. 
    Initialize();

    //load settings
    let settings = new Settings.Settings();
    await settings.loadLanguageContent();

    updateLanguageContent(settings.languageContent);
}

function updateLanguageContent(settings) {
    let contactInfo = settings.contact;
    for(let contact in contactInfo) {
        $(`#${contact}`).text(contactInfo[contact]);
    }
    $("#findMe").attr("href",`https://www.google.com/maps/search/?api=1&query=${contactInfo.address} ${contactInfo.zipCode}`);
}


function Initialize() {

    //Enable tooltip from Popper.js
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    });

    //Changes the layout of tab depending on width of screen.
    changeTabLayoutBasedOfScreenSize();

    // Eventlistner for rezise of the screen. (For example flipping the phone).
    $(window).resize(changeTabLayoutBasedOfScreenSize);

}



/**
 * Changes the tablayout depending on the width of the screen.
 * If it's larger than "largeScreenWidth", 
 * make the tab horisontell,
 * else make the tab vertical
 */
function changeTabLayoutBasedOfScreenSize() {
    if ($(window).width() > largeScreenWidth) {
        if ($('#pills-tab.flex-column').length) {
            $('#pills-tab').removeClass('flex-column');
        }
    } else {
        if (!$('#pills-tab.flex-column').length) {
            $('#pills-tab').addClass('flex-column');
        }
    }
}