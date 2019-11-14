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
 * Main function, starts the site :D
 */
async function main() {

    // Container for Settings
    settings = new Settings.Settings();

    // Load language
    await settings.loadLanguageContent();

    //Initialize settings. 
    Initialize();

    // Update site language
    updateLanguageContent(settings.languageContent);
}


/**
 * Initializing following components:
 *  tooltip
 *  changes of screensize
 *  EventListener on rezise.
 */
function Initialize() {

    //Enable tooltip from Popper.js
    $(function() {
        $('[data-toggle="tooltip"]').tooltip();
    });

    //Changes the layout of tab depending on width of screen.
    changeTabLayoutBasedOfScreenSize();

    // Eventlistner for rezise of the screen. (For example flipping the phone).
    $(window).resize(changeTabLayoutBasedOfScreenSize);

    // Click event for language selection
    $('#chooseLanguage').click(changeLanguage);

    // Changes the toggle icon based of which language that's selected.
    setLanguageIcon(settings.userLanguage);
}

/**
 * Changes the toggle icon based of which language that's selected.
 * @param {string} languageToBeSet 
 */
function setLanguageIcon(languageToBeSet) {
    $('#languageToggleIcon').attr('value', languageToBeSet);
    (languageToBeSet == 'sv-SE') ? $('#languageToggleIcon').text("toggle_on"): $('#languageToggleIcon').text("toggle_off");
}

/**
 * Changes the language of the site
 */
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

    // Change the toggle icon
    setLanguageIcon(newLanguage);

    // Update user language in settings
    settings.changeUserLanguage(newLanguage);

    // Load the other language file.
    await settings.loadLanguageContent();

    // update the content based of language loaded.
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

/**
 * Update the whole website based of langauge chosen.
 * @param {class Settings} settings 
 */
function updateLanguageContent(settings) {

    // Remove initialized tooltips
    $(function() {
        $('[data-toggle="tooltip"]').tooltip('dispose');
    });

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

    let educationData = settings.education;

    // Set education Heading
    $("#educationHeading").text(educationData.educationHeading);

    // Clear all content of id 
    $("#educationList").empty();

    //for each education of educations
    for (let education of educationData.educations) {
        let educationHTMLItem = `
        <li class="list-group-item flex-column align-items-start" data-toggle="tooltip"
        data-placement="right" title="${educationData.examinationDateText} : ${education.examinationDate}">
            <h6>${education.schoolName}<br>
                <p class="text-muted">${education.Programme}</p>
            </h6>
        </li>
        `;
        // Append id with list item
        $('#educationList').append(educationHTMLItem);
    }

    let tabListData = settings.tabList;

    // For each key in object tabListData
    for (let tabListKey in tabListData) {

        // Store the data which the tabListKey contains
        let shortTabList = tabListData[tabListKey];

        // Find the id and set the the content to the value of tabLink
        $(`#${tabListKey}-tab`).text(shortTabList.tabLink);

        // Clear the content in the id.
        $(`#${tabListKey}`).empty();

        // Warning, ugly solution ahead. Couldn't find any appropriate solution to make the code cleaner.

        switch (tabListKey) {

            case "profile":

                // find id, set html string content.
                $(`#${tabListKey}`).html(shortTabList.contents);

                break;

            case "experience": {
                // currentIndex used to keep track of <hr/>
                let currentIndex = 0;

                // For each object in contents
                for (let experience of shortTabList.contents) {

                    // HTML-string with all data from the current company
                    let experienceHTML = `
                    <div class="media">
                        <div class="media-body">
                            <small class="text-muted mb-0">${experience.started} - ${experience.ended}</small>
                            <h5 class="mt-0">${experience.company}</h5>
                            <p class="text-muted font-italic">${experience.title}</p>
                            <p>${experience.shortDescription}</p>
                        </div>
                    </div>
                    `;

                    // If current index is less than the length of array and (-1)
                    if (currentIndex < (shortTabList.contents.length) - 1) {
                        // Add a horizontal divider 
                        experienceHTML += `<hr/>`;
                    }
                    // Append id with experienceHTML
                    $(`#${tabListKey}`).append(experienceHTML);

                    // Increase index
                    currentIndex++;
                }

                break;

            }

            case "skills": {

                // Start of un-order list
                let skillsHTML = `
                <ul>
                `;

                // for each skill in contents
                for (let skill of shortTabList.contents) {

                    // append skillsHTML with list-item
                    skillsHTML += `<li>${skill}</li>`;
                }

                // End of un-order list
                skillsHTML += `</ul>`;

                // append id with skillsHTML (Could use html instead of append)
                $(`#${tabListKey}`).append(skillsHTML);

                break;
            }

            case "certificates": {

                // currentIndex used to keep track of <hr/>
                let currentIndex = 0;

                for (let certificate of shortTabList.contents) {
                    // HTML-string with all data from the current certificate
                    let certificateHTML = `
                     <div class="media">
                         <div class="media-body">
                             <small class="text-muted mb-0">${certificate.date}</small>
                             <h5 class="mt-0">${certificate.certificateName}</h5>
                             <p class="text-muted font-italic">${certificate.Examinationer}</p>
                         </div>
                     </div>
                     `;

                    // If current index is less than the length of array and (-1)
                    if (currentIndex < (shortTabList.contents.length) - 1) {
                        // Add a horizontal divider 
                        certificateHTML += `<hr/>`;
                    }
                    // Append id with certificateHTML
                    $(`#${tabListKey}`).append(certificateHTML);

                    // Increase index
                    currentIndex++;
                }

            }

        }

    }

    // Some settings that's not standard
    let miscSettings = settings.misc;

    // Update tooltip for all misc items
    for (let miscSetting in miscSettings) {
        $(`#${miscSetting}`).attr('title', miscSettings[miscSetting]);
    }


    // Initialized tooltips
    $(function() {
        $('[data-toggle="tooltip"]').tooltip();
    });


}