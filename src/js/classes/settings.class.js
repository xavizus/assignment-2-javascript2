export class Settings {

    //Languagecode is a combination of ISO 639 (two lowercase letter culture language code) and ISO 3166 (two uppercase letter country code)
    constructor(defaultLanguage = "en-GB"){
        this.userLanguage = defaultLanguage;
        this.languageContent = null;

        // Set the user langauge
        this.setUserLanguage();
    }

    /**
     * Sets the perferd language.
     */
    setUserLanguage() {

        // try to get user langauge from localstorage.
        let selectedLanguage = localStorage.getItem("language");

        // if no localstorage 'language' found
        if(selectedLanguage === null || selectedLanguage === '') {
            //assign the default value
            localStorage.setItem('language', this.userLanguage);
        } 
        // if localstorage 'language' found
        else {
            // set the found language
            this.userLanguage = selectedLanguage
        }
    }

    changeUserLanguage(newLanguage) {
        this.userLanguage = newLanguage;
        localStorage.setItem('language', this.userLanguage);
    }

    /**
     * loads language file
     */
    async loadLanguageContent(){

        // Set path to language file.
        let fileToGet = `./lang/${this.userLanguage}.json`;

        // fetch the file
        await fetch(fileToGet)
            // When response is recived
            .then((response)=>{
                // If the response is not ok.
                if(!response.ok) {
                    // throw an error.
                    throw Error(response.statusText);
                }
                //return respons as json-object.
                return response.json();
            })
            // receives json-object 
            .then(results => {
                // store the json-object in class property.
                this.languageContent = results;
            })
            // if any error encounter 
            .catch((error)=> {
                // Error promt in console.
                console.error("Could not load the language file %s . %s",fileToGet, error);
            });

    }
}