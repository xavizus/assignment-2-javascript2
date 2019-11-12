import 'bootstrap/js/dist/util';
import 'bootstrap/js/dist/tab';
import 'bootstrap/js/dist/tooltip';
import '../css/custom.scss';
import * as $ from 'jquery';
import * as Settings from './classes/settings.class.js';

/**
 * Configs
 */

const largeScreenWidth = 1200; // Large screens (from Bootstrap https://getbootstrap.com/docs/4.0/layout/grid/#grid-options)
let settings = "";
//Git-hub api: https://api.github.com/users/xavizus/repos

//When DOMContent is loaded, call main-function
$().ready(main);

/**
 * Main function, it's main. It contains everything the site uses.
 */
async function main() {

    // Container of Settings
    settings = new Settings.Settings();
    await settings.loadLanguageContent();

    //Initialize settings. 
    Initialize();

    // Update site language
    updateLanguageContent(settings.languageContent);
}
/**
 * Update the whole website based of langauge chosen.
 * @param {class Settings} settings 
 */
function updateLanguageContent(settings) {
    let contactData = settings.contact;

    //Loop through all keys in contactData
    for (let contactType in contactData) {
        //Find the ID of the contactType, and set text of the key-value.
        $(`#${contactType}`).text(contactData[contactType]);

        // If the key is named phone
        if (contactType == 'phone') {
            // change href-attribute with the key-value
            $(`#${contactType}-link`).attr('href', `tel:${contactData[contactType]}`);
        }
        /// else if key is named mail
        else if (contactType == 'mail') {
            // change href-attribute with the key-value
            $(`#${contactType}-link`).attr('href', `mailto:${contactData[contactType]}`);
        }
    }

    // Change href-attribute with the address (Used to link to Google maps.)
    $("#findMe").attr("href", `https://www.google.com/maps/search/?api=1&query=${contactData.address} ${contactData.zipCode}`);


}


/**
 * Initializing following components:
 *  tooltip
 *  changes of screensize
 *  EventListener on rezise.
 */
function Initialize() {

    //Enable tooltip from Popper.js
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    });

    //Changes the layout of tab depending on width of screen.
    changeTabLayoutBasedOfScreenSize();

    // Eventlistner for rezise of the screen. (For example flipping the phone).
    $(window).resize(changeTabLayoutBasedOfScreenSize);

    $('#chooseLanguage').click(changeLanguage);

    setLanguageIcon(settings.userLanguage);
}

function setLanguageIcon(languageToBeSet) {
        $('#languageToggleIcon').attr('value', languageToBeSet);
        (languageToBeSet == 'sv-SE')? $('#languageToggleIcon').text("toggle_on") : $('#languageToggleIcon').text("toggle_off");
}

async function changeLanguage() {
    // store value of id: languageToggleIcon
    let languageToChangeFrom = $('#languageToggleIcon').attr('value');

    // Declare variable
    let newLanguage = '';
    // If the current language is en-GB, then the user want to change to Swedish
    if (languageToChangeFrom == 'en-GB') {
        newLanguage = 'sv-SE';
    } else {
        newLanguage = 'en-GB';
    }

    setLanguageIcon(newLanguage);
    settings.changeUserLanguage(newLanguage);
    await settings.loadLanguageContent();
    updateLanguageContent(settings.languageContent);
}



/**
 * Changes the tablayout depending on the width of the screen.
 * If it's larger than "largeScreenWidth", 
 * make the tab horisontell,
 * else make the tab vertical
 */
function changeTabLayoutBasedOfScreenSize() {
    if ($(window).width() >= largeScreenWidth) {
        if ($('#pills-tab.flex-column').length) {
            $('#pills-tab').removeClass('flex-column');
        }
    } else {
        if (!$('#pills-tab.flex-column').length) {
            $('#pills-tab').addClass('flex-column');
        }
    }
}