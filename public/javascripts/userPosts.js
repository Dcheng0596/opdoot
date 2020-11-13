let username = location.pathname.split('/')[2];

let url = 'https://opdoot.s3.amazonaws.com';

let avatarFile = document.getElementById("avatar-file");
let changeAvatar = document.querySelector(".change-avatar");
if(avatarFile) {
    avatarFile.setAttribute("title", " ");
    avatarFile.addEventListener("mouseover", function() {
        changeAvatar.style.visibility = "visible";
    })
    avatarFile.addEventListener("mouseleave", function() {
        changeAvatar.style.visibility = "hidden";
    })
    avatarFile.addEventListener("change", async function() {
        let file = this.files[0];
        let maxFileSize = 1048576;
        if(file == null) {
            return
        }
        let spinner = createSpinner();
        let form = new FormData();
        
        spinner.style.position = "absolute";
        spinner.style.width = "110px";
        spinner.style.height = "110px"
        spinner.style.lineHeight = "115px";
        spinner.style.color = "white";

        document.querySelector(".user").prepend(spinner);
        changeAvatar.display = "none";
        if((file.type == "image/jpeg" || file.type == "image/png") &&
            file.size <= maxFileSize) {
            form.set("file", file);
            try {
                const response =  await fetch("/user/" + username + "/profile_picture", {
                    method: 'PUT',
                    body: form
                });
                const resText = await response.text();
                if(resText == "success") {
                    console.log(document.getElementById(".user .profile-picture"));
                    let reader = new FileReader();
                    reader.onload = function(e)  {
                        document.querySelector(".user .profile-picture").src = e.target.result;    
                    }
                    reader.readAsDataURL(file);
                    spinner.remove();
                    changeAvatar.display = "block";
                }
            } catch (error) {
                console.log(error)
            }
        }    
    });
}

async function fetchOpdoot(vote, post) {
    try {
        let body = {
            vote: vote
        }
        const response =  await fetch("/post/" + post + "/opdoot"
        , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        
    } catch (error) {
        console.log(error)
    }
}

function opdoot(post, postId) {
    let upvote = post.querySelector(".thumb-up");
    let downvote = post.querySelector(".thumb-down");
    let opdootContainer = post.querySelector(".opdoot-container");
    let opdoots =  post.querySelector(".opdoots");

    upvote.addEventListener("click", function(e) {
        e.stopPropagation();
        if(opdootContainer.classList.contains("novote")){
            location.href = '/login'
            return;
        }
        if(opdootContainer.classList.contains("upvote")) {
            opdootContainer.classList.remove("upvote");
            opdoots.innerText = parseInt(opdoots.innerText) - 1;
        } else if(opdootContainer.classList.contains("downvote")) {
            opdootContainer.classList.remove("downvote");
            opdootContainer.classList.add("upvote");
            opdoots.innerText = parseInt(opdoots.innerText) + 2;
        } else {
            opdootContainer.classList.add("upvote");
            opdoots.innerText = parseInt(opdoots.innerText) + 1;
        }
        fetchOpdoot("upvote", postId);
    });
    
    downvote.addEventListener("click", function(e) {
        e.stopPropagation();
        if(opdootContainer.classList.contains("novote")){
            location.href = '/login'
            return;
        }
        if(opdootContainer.classList.contains("downvote")) {
            opdootContainer.classList.remove("downvote");
            opdoots.innerText = parseInt(opdoots.innerText) + 1;
        } else if(opdootContainer.classList.contains("upvote")) {
            opdootContainer.classList.remove("upvote");
            opdootContainer.classList.add("downvote");
            opdoots.innerText = parseInt(opdoots.innerText) - 2;
        } else {
            opdootContainer.classList.add("downvote");
            opdoots.innerText = parseInt(opdoots.innerText) - 1;
        }
        fetchOpdoot("downvote", postId);
    });
}


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

    post.addEventListener("click", function(e) {
        location.href = '/post/' + model.file;
    })
    post.style.cursor = "pointer";
    post.removeAttribute("id");
    post.classList.add("user-post");
    post.setAttribute("href", "/post/" + model.file);
    image.src = url + "/" + model.file;
    post.querySelector(".title").innerText = model.title;
    post.querySelector(".opdoots").innerText = model.opdoots;
    post.querySelector(".opdoot-container").classList.add(model.vote);
    post.querySelector(".comment-amount").innerText = model.comments;
    post.querySelector(".view-amount").innerText = model.views;
    opdoot(post, model.file);

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