export class Settings {

    //Languagecode is a combination of ISO 639 (two lowercase letter culture language code) and ISO 3166 (two uppercase letter country code)
    constructor(defaultLanguage = "en-GB"){
        this.userLanguage = defaultLanguage;
        this.languageContent = null;

        this.setUserLanguage();
    }

    setUserLanguage() {
        let selectedLanguage = localStorage.getItem("language");

        if(selectedLanguage !== null) {
            this.userLanguage = selectedLanguage
        }
    }

    changeUserLanguage(newLanguage) {
        this.userLanguage = newLanguage;
    }

    async loadLanguageContent(){
        await fetch(`./lang/${this.userLanguage}.json`)
            .then((response)=>{
                return response.json();
            })
            .then(results => {
                this.languageContent = results;
            });

    }
}