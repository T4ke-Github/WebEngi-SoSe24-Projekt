
import * as router from './router.js';
import * as model from './model.js';

// Private Variablen und Funktionen
let state = {};
resetState();

function resetState() {
    state = {
        init: true,
        blogId: -1,
        postId: -1,
        owner: null,
        detail: false
    };
}


// Aktualisiert die allgemeinen Elemente der Seite
async function updatePage() {
    console.log("Presenter: Aufruf von updatePage()");
    // Nutzer abfragen und Anzeigenamen als owner setzen
    let self = await model.getSelf();
    state.owner = self.displayName;
    console.log(`Presenter: Nutzer*in ${state.owner} hat sich angemeldet.`);
}


let loginPage = function () {
    console.log("Presenter: Aufruf von loginPage()");
    if (state.owner !== null)
        console.log(`Presenter: Nutzer*in ${state.owner} hat sich abgemeldet.`);
    else
        console.log("Nutzer ist abgemeldet!");
    resetState();
};


// Öffentliche Schnittstelle von Presenter
// 
// Zeigt die Startseite an.
async function showStartPage() {
    console.log("Aufruf von presenter.showStartPage()");
    // Wenn vorher noch nichts angezeigt wurde, d.h. beim Einloggen
    if (model.isLoggedIn()) { // Wenn der Nutzer eingeloggt ist
        // Alle Blogs des angemeldeten Nutzers abfragen
        let blogs = await model.getAllBlogs();
        // Beim Betreten der App wird die Id des ersten Blogs im State
        // gesetzt
        state.blogId = blogs[0].id;
        // Setzen der noch fehlenden Elemente der Seite
        await updatePage();
        console.log("--------------- Alle Blogs --------------- ");
        console.log(blogs);
        // Weiter zur Übersicht für den ausgewählten Blog
        showBlogOverview(state.blogId);
    }
    if (!model.isLoggedIn()) { // Wenn der Nuzter eingelogged war und sich abgemeldet hat
        //Hier wird die Seite ohne Inhalt angezeigt
        loginPage();
    }
}

async function showBlogOverview(bid) {
    console.log(`Aufruf von presenter.showBlogOverview(${bid})`);
    if (state.blogId !== bid)
        state.blogId = bid;
    state.detail = false;
    let posts = await model.getAllPostsOfBlog(state.blogId);
    console.log(`--------------- Alle Posts des Blogs ${bid} --------------- `);
    console.log(posts);
    showPostDetail(bid, posts[1].id);
}

async function showPostDetail(bid, pid) {
    console.log(`Aufruf von presenter.showPostDetail(${bid}, ${pid})`);
    state.blogId = bid;
    state.postId = pid;
    state.detail = true;
    console.log(`--------------- Post mit der id ${pid} --------------- `);
    let post = await model.getPost(bid, pid);
    console.log(post);
    console.log(`--------------- Alle Comments des Posts ${state.postId}) --------------- `);
    let comments = await model.getAllCommentsOfPost(state.blogId, state.postId);
    console.log(comments);
}



export { showStartPage, showBlogOverview, showPostDetail };