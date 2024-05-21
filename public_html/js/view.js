import * as presenter from './presenter.js';

// Ersetzt alle %bezeichner Texte in element durch die 
// gleichnamigen Attributwerte des Objekts
function setDataInfo(element, object) {
    let cont = element.innerHTML;
    for (let key in object) {
        let rexp = new RegExp("%" + key + "%", "g");
        cont = cont.replace(rexp, object[key]);
    }
    element.innerHTML = cont;
}

// Setzt die Navigations-Buttons in das Nav-Element des Templates in temp
function setNavButtons(templ) {
    // Klonen des Button-Komponententemplate
        let buttons = document.getElementById("buttons").cloneNode(true);
        buttons.removeAttribute("id");
        // Buttons in Navigation einsetzen
        let nav = templ.querySelector("nav");
        nav.append(buttons);
}

function setSelected(ul, abtId) {
    let li = null;
    let lis = ul.querySelectorAll('li');
    // Alle zurücksetzten, selektierten suchen
    for (let l of lis) {
        l.classList.remove('selected');
        if (l.dataset.id === abtId)
            li = l;
    }
    if (li)
        li.classList.add('selected');
}