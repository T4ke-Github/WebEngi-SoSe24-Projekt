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
export function BlogOverview(blogData) {
    // Klonen des Blog-Übersichtstemplates
    let temp = document.getElementById('blogg_overview').cloneNode(true);
    temp.removeAttribute("id");
    let ul = temp.querySelector("ul");
    let liTemp = ul.firstElementChild;
    setNavButtons(liTemp);
    liTemp.remove();
    let li = liTemp.cloneNode(true);
    for (let p in blogData) {
        ul.appendChild(li);
        setDataInfo(ul, p);
    }
    setSelected(temp,blogData[0])
    return temp;
}
export function PostOverview(postData, commentsData){
    let temp = document.getElementById('post_detail').cloneNode(true);
    temp.removeAttribute('id');
   
   if (commentsData) {
        let CommentTemp = document.getElementById('blog_comments').cloneNode(true);
        CommentTemp.removeAttribute('id')
        let ul = CommentTemp.querySelector("ul");
        let liTemp = ul.firstElementChild;
        liTemp.remove();
        let li = liTemp.cloneNode(true);
        for(let x in commentsData){
            ul.appendChild(li);
            setDataInfo(li, x);
        }
        temp.appendChild(CommentTemp);
   } else {
    console.log("No Comment Found!")
   }
   setDataInfo(temp, postData)
   return temp;
}