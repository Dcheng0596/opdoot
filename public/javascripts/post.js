let file = location.pathname.split('/')[2];
let upvote = document.getElementById("button-up");
let downvote = document.getElementById("button-down");
let opdoots = document.getElementById("opdoots");
let opdootContainer = document.getElementById("comment-opdoot-container");
let commentUpvote = document.getElementById("comment-button-up");
let commentDownvote = document.getElementById("comment-button-down");
let commentOpdoots = document.getElementById("comment-opdoots");
let commentOpdootContainer = document.getElementById("comment-opdoot-container");
let postComment = document.getElementById("post-comment");
let commentArea = document.getElementById("comment-area");
let commentSection = document.getElementById("comment-section");

async function fetchOpdoot(vote, url, id) {
    try {
        let body = {
            id: id,
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

function opdoot(upvote, downvote, opdootContainer, opdoots) {
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
        fetchOpdoot("upvote", "/post/opdoot", file);
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
        fetchOpdoot("downvote", "/post/opdoot", file);
    
    });
}

opdoot(upvote, opdootContainer, opdoots);


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

commentArea.addEventListener("input", function() {
    commentAreaEvent(this);
});

window.onload =  function() {
    commentAreaEvent(commentArea);
};

postComment.addEventListener("click", async function(){
    let text = commentArea.value;
    if(text == '' && !text) {
        return;
    }
    let comment = document.getElementById("user-comment-hidden").cloneNode(true);
    comment.removeAttribute("id");
    comment.classList.add("user-comment");
    comment.querySelector(".comment-text").innerText = text;
    commentSection.append(comment);
    commentArea.value = '';
    try {
        let body = {
            comment: text
        }
        const response =  await fetch("/post/comment", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });     
    } catch (error) {
        console.log(error)
    }
});


