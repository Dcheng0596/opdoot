let file = location.pathname.split('/')[2];
let upvote = document.getElementById("button-up");
let downvote = document.getElementById("button-down");
let opdoots = document.getElementById("opdoots");
let opdootContainer = document.getElementById("opdoot-container");
let postComment = document.getElementById("post-comment");
let commentArea = document.getElementById("comment-area");
let commentSection = document.getElementById("comment-section");
let postComments = document.getElementById("comments");

function mediaEvent(mediaQuery) {
    let commentSection = document.getElementById("comment-section");
    let mobileView = document.getElementById("mobile-view");
    let mainColumn = document.getElementById("main-column");
    if(mediaQuery.matches) {
        mobileView.appendChild(commentSection);
    } else {
        mainColumn.appendChild(commentSection);
    }
    
}
  
  var mediaQuery = window.matchMedia("(max-width: 992px)")
  mediaEvent(mediaQuery)
  mediaQuery.addListener(mediaEvent) 
  

async function fetchOpdoot(vote, url) {
    try {
        let body = {
            vote: vote
        }
        const response =  await fetch(url, {
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

function opdoot(upvote, downvote, opdootContainer, opdoots, url) {
    upvote.addEventListener("click", function() {
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
        fetchOpdoot("upvote", url);
    });
    
    downvote.addEventListener("click", function() {
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
        fetchOpdoot("downvote", url);
    
    });
}

opdoot(upvote, downvote, opdootContainer, opdoots, ("/post/" + file + "/opdoot"));

let commentChar = document.getElementById("comment-char");
let commentMaxChar = 150;
let canPost = false;

function commentAreaEvent(commentArea) {
    if(commentArea.value == '') {
        postComment.disabled = true;
    } else {
        postComment.disabled = false;
    }
    commentChar.innerText = commentArea.value.length + "/" + commentMaxChar;
    commentArea.style.height = "";
    commentArea.style.height = commentArea.scrollHeight + 2 + "px";
}

if(commentArea) {
    commentArea.addEventListener("input", function() {
        commentAreaEvent(this);
    });
 
    postComment.addEventListener("click", async function(){
        let text = commentArea.value;
        if(text == '' && !text) {
            return;
        }
        try {
            let body = {
                comment: text
            }
            const response =  await fetch("/post/" + file + "/comment", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });    
            let commentId = await response.text();
            let comment = document.getElementById("user-comment-hidden").cloneNode(true);
            comment.removeAttribute("id");
            comment.classList.add("user-comment");
            comment.querySelector(".comment-text").innerText = text;
            comment.setAttribute("data-comment-id", commentId)
            postComments.prepend(comment);
            commentArea.value = ''; 
            commentChar.innerText = 0 + "/" + commentMaxChar;
        } catch (error) {
            console.log(error)
        }
    });
}

let commentOffset = 0;
let commentLimit = 20;

function createComment(model) {
    let comment = document.getElementById("user-comment-hidden").cloneNode(true);
    comment.removeAttribute("id");
    comment.classList.add("user-comment");
    comment.querySelector(".comment-text").innerText = model.comment;
    comment.querySelector(".profile-picture").setAttribute("src", model.profilePicture);
    comment.querySelector(".comment-username").innerText = model.username;
    comment.querySelector(".timeago").innerText = model.timeago;
    comment.querySelector(".comment-opdoots").innerText = model.opdoots;
    comment.setAttribute("data-comment-id", model.id)
    opdoot(
        comment.querySelector(".comment-button-up"),
        comment.querySelector(".comment-button-down"),
        comment.querySelector(".comment-opdoot-container"),
        comment.querySelector(".comment-opdoots"),
        "/comment/" + model.id + "/opdoot"
    )

    postComments.append(comment);
}

window.onload =  async function() {
    if(commentArea) {
        commentAreaEvent(commentArea);
    }
    let spinner = document.createElement("div");
    spinner.classList.add("spinner-border");
    spinner.classList.add("mx-auto");
    postComments.append(spinner);
    try {

        const response =  await fetch("/post/" + file + "/comment?offset=" + commentOffset + "&limit=" + commentLimit, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });    
        let comments = await response.json();
        postComments.removeChild(spinner);
        for(comment of comments.comments) {
            createComment(comment);
        }
    } catch (error) {
        console.log(error)
    }
};
