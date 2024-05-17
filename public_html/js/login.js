import { setLoggedIn, isLoggedIn } from './model.js';
import { navigateToPage } from './router.js';

// Private Variablen und Funktionen

const SCOPE = 'https://www.googleapis.com/auth/blogger';

let tokenClient;
let token;
let button = document.getElementById('sign-in-or-out-button');
let div = document.getElementById('auth-status');


function handleAuthClick() {
    if (isLoggedIn()) {
        // User is authorized and has clicked 'Sign out' button.
        logout();
        if (button)
            button.innerHTML = 'Anmelden';
        if (div)
            div.innerHTML = 'Abgemeldet bei Google';
    } else {
        // User is not signed in. Start Google auth flow.
        login();
        if (button)
            button.innerHTML = 'Abmelden';
        if (div)
            div.innerHTML = 'Angemeldet bei Google';


    }
}

function login() {
    // Conditionally ask users to select the Google Account they'd like to use,
    // and explicitly obtain their consent to fetch their Blogs.
    // NOTE: To request an access token a user gesture is necessary.
    
    if (token) {
        // Skip display of consent dialog for an existing session.
        tokenClient.requestAccessToken();
    } else {
        // Prompt the user to select an Google Account and asked for consent to share their data
        // when establishing a new session.
        // Auskommentiert für leichteres Testen: so wird der Consent abgefragt.
        //tokenClient.requestAccessToken({prompt: 'consent'});
        // So wird der Consent nicht Abgefragt
        tokenClient.requestAccessToken();
    }
}


function logout() {
    console.log("---------setSigninStatus: Abgemeldet---------");
    setLoggedIn(false);
    // Auskommentieren für leichteres Testen.
    //token = null;
    navigateToPage('/');
}

// Methode die aufgerufen wird, um das RequestAccessToken vom TokenClient 
// entgegen zu nehmen.
let loginCallback = (resp) => {
        if (resp.error !== undefined) {
            throw(resp);
        }
        // GIS has automatically updated gapi.client with the newly issued access token.
        console.log("---------setSigninStatus: Angemeldet---------");
        token = resp;
        // Dem Model das Token für die Anfragen übergeben
        setLoggedIn(true, resp);
        //Navigation auf Startseite
        navigateToPage(window.location.pathname);
    };

function handleClientLoad() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: '26901513547-8ae4n8ut9sh5l7839qjsknf4nminls6k.apps.googleusercontent.com',
        scope: SCOPE,
        callback: loginCallback 
    });
    button.addEventListener('click', handleAuthClick);
}

// After Loading, handleClientLoad is called
window.addEventListener("load", handleClientLoad);
