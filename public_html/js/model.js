

// private Variablen und Funktionen

const pathSelf = 'https://www.googleapis.com/blogger/v3/users/self';
const pathGetBlogs = pathSelf + '/blogs';
const pathBlogs = 'https://www.googleapis.com/blogger/v3/blogs';
let loggedIn = false;
let reqInstance = null;

function getPath(bid, pid, cid) {
    let path = pathBlogs;
    if (bid)
        path += '/' + bid;
    if (pid)
        path += '/posts/' + pid;
    if (cid)
        path += "/comments/" + cid;
    return path;
}

// Formatiert den Datum-String in date in zwei mögliche Datum-Strings: 
// long = false: 24.10.2018
// long = true: Mittwoch, 24. Oktober 2018, 12:21
function formatDate(date, long) {
    // Hier kommt Ihr Code hin
}

// Öffentliche Schnittstelle von Model

// Wird nach Login (which = true)/Logout (which = false) aufgerufen.
// token enthält das Token für den Zugriff auf Blogger-Daten.
function setLoggedIn(which, token) {
    loggedIn = which;
    if (token) {
        // Hier wird ein Request-Objekt mit Default-Header erzeugt
        // Im Header wird das Token für die Anfrage bei Blogger-API gesetzt
        reqInstance = axios.create({
            headers: {
                Authorization: `${token.token_type} ${token.access_token}`
            }
        });
    }
    if (!token)
        reqInstance = null;
}
// Getter für loggedIn
function isLoggedIn() {
    return loggedIn;
}
// Liefert den angemeldeten Nutzer mit allen Infos
async function getSelf() {
    // Execute the Axios request.
    let result = await reqInstance.get(pathSelf);
    return result.data;
}
// Liefert alle Blogs des angemeldeten Nutzers
async function getAllBlogs() {
    let result = await reqInstance.get(pathGetBlogs);
    let blogs = [];
    if (result.data.items)
        blogs = result.data.items;
    return blogs;
}
// Liefert den Blog mit der Blog-Id bid
async function getBlog(bid) {
    let path = getPath(bid);
    // Execute the API request.
    let result = await reqInstance.get(path);
    return result.data;
}
// Liefert alle Posts des Blogs mit der Blog-Id bid.
async function getAllPostsOfBlog(bid) {
    let path = getPath(bid) + '/posts';
    let result = await reqInstance.get(path);
    let posts = [];
    if (result.data.items)
        posts = result.data.items;
    return posts;
}
// Liefert den Post mit der Post-Id pid im Blog mit der Blog-Id bid
async function getPost(bid, pid) {
    let path = getPath(bid, pid);
    let result = await reqInstance.get(path);
    return result.data;
}
// Liefert alle Kommentare zu dem Post mit der Post-Id pid 
// im Blog mit der Blog-Id bid
async function getAllCommentsOfPost(bid, pid) {
    let path = getPath(bid, pid) + "/comments";
    let result = await reqInstance.get(path);
    let comments = [];
    if (result.data.items)
        comments = result.data.items;
    return comments;
}

// Löscht den Kommentar mit der Id cid zu Post mit der Post-Id pid 
// im Blog mit der Blog-Id bid 
async function deleteComment(bid, pid, cid) {
    var path = getPath(bid, pid, cid);
    let result = await reqInstance.delete(path);
    return result.data;
}
// Fügt dem Blog mit der Blog-Id bid einen neuen Post 
// mit title und content hinzu.
async function addNewPost(bid, title, content) {
    var body = {
        kind: "blogger#post",
        title: title,
        blog: {
            id: bid
        },
        content: content
    };
    let path = getPath(bid) + '/posts';
    let result = await reqInstance.post(path, body);
    return result.data;
}
// Aktualisiert title und content im geänderten Post 
// mit der Post-Id pid im Blog mit der Blog-Id bid.
async function updatePost(bid, pid, title, content) {
    var body = {
        kind: "blogger#post",
        title: title,
        id: pid,
        blog: {
            id: bid
        },
        content: content
    };
    let path = getPath(bid, pid);
    let result = await reqInstance.put(path, body);
    return result.data;
}
// Löscht den Post mit der Post-Id pid im Blog 
// mit der Blog-Id bid.
async function deletePost(bid, pid) {
    var path = getPath(bid, pid);
    let result = await reqInstance.delete(path);
    let data = result.data;
    if (result.status === 204)
        return true;
    else
        return false;
}

export { setLoggedIn, isLoggedIn, getSelf, getAllBlogs, getBlog,
        getAllPostsOfBlog, getPost, getAllCommentsOfPost, deleteComment,
        addNewPost, updatePost, deletePost };



