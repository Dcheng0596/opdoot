let username = location.pathname.split('/')[2];

let url = 'https://opdootimages.s3.amazonaws.com';

function createSpinner() {
    let inner = document.createElement("div");
    inner.classList.add("spinner-border");
    let spinner = document.createElement("div");
    spinner.append(inner);
    spinner.classList.add("text-center");
    
    return spinner;
}

async function fetchPosts(offset, limit, dir) {
    try {
        const response =  await fetch("/user/" + username + "/post/get?offset=" + offset + "&limit=" + limit, {
            method: 'GET',
        });
        let posts = await response.json();
        if(posts.status) {
            return null;
        }
        return posts.posts;
    } catch (error) {
        console.log(error)
        return null;
    }
}

function createPost(model) {
    let post = document.querySelector("#user-post-hidden").cloneNode(true);
    let image = post.querySelector(".post-image");
    post.removeAttribute("id");
    post.classList.add("user-post");
    post.setAttribute("href", "/post/" + model.file);
    image.src = url + "/" + model.file;
    post.querySelector(".title").innerText = model.title;
    post.querySelector(".opdoots").innerText = model.opdoots;
    post.querySelector(".comment-amount").innerText = model.comments;
    post.querySelector(".view-amount").innerText = model.views;

    return post;
}

let loadedAllPosts = true;
let limit = 16;

async function loadPosts(limit) {
    let spinner = createSpinner();
    let postArea = document.querySelector(".post");
    let offset = postArea.querySelectorAll(".user-post").length;

    postArea.append(spinner);

    let postContainer = postArea.querySelector(".post-container");
    let posts = await fetchPosts(offset, limit);
    for(post of posts) {
        postContainer.appendChild(createPost(post));
    }
    spinner.remove();
    console.log(posts);
    if(posts.length < limit) {
        return;
    }
    loadedAllPosts = false;

}

window.onload = function() {
    loadPosts(limit);
}

window.onscroll = function() {
    console.log("w");
    if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
        if(!loadedAllPosts) {
            loadedAllPosts = true;
            loadPosts(limit);
        }
    }
};