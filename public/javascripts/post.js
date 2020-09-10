let file = location.pathname.split('/')[2];
let upvote = document.getElementById("button-up");
let downvote = document.getElementById("button-down");
let opdoots = document.getElementById("opdoots");
let opdootContainer = document.getElementById("comment-opdoot-container");
let postComment = document.getElementById("post-comment");
let commentArea = document.getElementById("comment-area");
let commentSection = document.getElementById("comment-section");

let commentUpvote = document.getElementById("comment-button-up");
let commentDownvote = document.getElementById("comment-button-down");
let commentOpdoots = document.getElementById("comment-opdoots");
let commentOpdootContainer = document.getElementById("comment-opdoot-container");

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
        fetchOpdoot("upvote", "/post/" + file + "/opdoot");
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
        fetchOpdoot("downvote", "/post/" + file + "/opdoot");
    
    });
}

opdoot(upvote, downvote, opdootContainer, opdoots);
//opdoot(commentUpvote, commentDownvote, commentOpdootContainer, commentOpdoots);


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
    
    window.onload =  function() {
        commentAreaEvent(commentArea);
    };
    
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
            commentSection.prepend(comment);
            commentArea.value = ''; 
            commentChar.innerText = 0 + "/" + commentMaxChar;
        } catch (error) {
            console.log(error)
        }
    });
}


