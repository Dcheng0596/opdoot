let file = location.pathname.split('/')[2];
let upvote = document.getElementById("button-up");
let downvote = document.getElementById("button-down");
let opdoots = document.getElementById("opdoots");
let opdootContainer = document.getElementById("opdoot-container");

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

let commentMaxChar = 150;

function commentAreaEvent(commentArea, submitButton, commentChar) {
    commentArea.value.trim() == '' ? submitButton.disabled = true : submitButton.disabled = false;
    commentChar.innerText = commentArea.value.length + "/" + commentMaxChar;
}

function toggleReplies(toggler, comment, id=null) {
    toggler.addEventListener("click", function() {
        let replies = comment.querySelector(".replies")
        let loadMore = comment.querySelector(".load-replies");
        let numReplies = replies.children.length;
        numReplies == 0 ? toggler.innerText = "Hide reply" : toggler.innerText =  "Hide " + (numReplies + 1) + " replies";
        if(replies.hidden == false) {
            replies.hidden = true;
            toggler.innerText = toggler.innerText.replace("Hide", "View");
            return;
        }
        replies.hidden = false;
        toggler.innerText = toggler.innerText.replace("View", "Hide");
        if(replies.children.length == 0 && id) {
            loadComments(replies, loadMore, 10, id);
        }
    });
}

function writeCommentSetup(writeCommentArea, destination, parentId=null) {
    let submitButton = writeCommentArea.querySelector(".post-comment");
    let commentArea = writeCommentArea.querySelector(".comment-area");
    let commentChar = writeCommentArea.querySelector(".comment-char");

    commentArea.addEventListener("input", function() {
        commentAreaEvent(this, submitButton, commentChar);
        commentArea.style.height = commentArea.scrollHeight + 2 + "px";

    });
    commentAreaEvent(commentArea, submitButton, commentChar);

    submitButton.addEventListener("click", async function(){
        let text = commentArea.value.trim();
        if(text == '' && !text) {
            return;
        }
        try {
            let body = {
                comment: text
            }
            if(parentId) {
                body.parentId = parentId
            }
            const response =  await fetch("/post/" + file + "/comment", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            let commentId = await response.text();
            if (!typeof parseInt(commentId) == 'number') {
                return;
            }
            let comment = document.getElementById("user-comment-hidden").cloneNode(true);
            comment.removeAttribute("id");
            comment.classList.add("user-comment");
            comment.querySelector(".comment-text").innerText = text;
            comment.setAttribute("data-comment-id", commentId)
            opdoot(
                comment.querySelector(".comment-button-up"),
                comment.querySelector(".comment-button-down"),
                comment.querySelector(".comment-opdoot-container"),
                comment.querySelector(".comment-opdoots"),
                "/comment/" + commentId + "/opdoot"
            )
            if(parentId) {
                writeCommentArea.hidden = true;
                comment.querySelector(".reply-comment").remove();
                destination.hidden = false;
                let parent = document.querySelector("[data-comment-id='" + parentId + "']");
                let toggle = parent.querySelector(".toggle-replies");
                toggle.hidden = false;
                toggleReplies(toggle, parent);
                loadComments(destination, comment.querySelector(".load-replies"), 10, parentId);
            } else {
                destination.prepend(comment);
            }
            commentArea.value = ''; 
            commentChar.innerText = 0 + "/" + commentMaxChar;
        } catch (error) {
            console.log(error)
        }
    });
}

let userComments = [];
let deleteCommentId;

function createComment(model, destination) {
    let comment = document.getElementById("user-comment-hidden").cloneNode(true);
    let commentOpdoots = comment.querySelector(".comment-opdoots");
    let commentOpdootContainer = comment.querySelector(".comment-opdoot-container")
    let toggle = comment.querySelector(".toggle-replies");

    comment.removeAttribute("id");
    comment.classList.add("user-comment");
    comment.querySelector(".comment-text").innerText = model.comment;
    comment.querySelector(".profile-picture").setAttribute("src", model.profilePicture);
    comment.querySelector(".comment-username").innerText = model.username;
    comment.querySelector(".timeago").innerText = model.timeago;
    commentOpdoots.innerText = model.opdoots;
    comment.setAttribute("data-comment-id", model.id);
    if(model.isUsers) {
        comment.querySelector(".options").hidden = false;
        userComments.push(model.id);
        comment.querySelector(".show-delete-modal").addEventListener("click", function() {
            deleteCommentId = model.id;
            console.log(deleteCommentId);
        });
    } else {
        comment.querySelector(".options").hidden = true;
    }
    if(model.replies == 0) {
        toggle.hidden = true;
    } else {
        if(model.replies == 1) {
            toggle.innerText = "View reply";
        } else if(model.replies > 1) {
            toggle.innerText = "View " + model.replies + " replies";
        }
        toggleReplies(toggle, comment, model.id);
    }
    if(model.vote) {
        commentOpdootContainer.classList.add(model.vote);
    } 
    let replyComment = comment.querySelector(".reply-comment");
    let createComment = comment.querySelector(".create-comment");
    if(commentOpdoots.classList.contains("novote")) {
        replyComment.addEventListener("click", function() {
            location.href = '/login';
        });
    } else {
        comment.querySelector(".cancel-comment").addEventListener("click", function() {
            createComment.hidden = true;
        });
        model.CommentId != null ? replyComment.remove() :
        replyComment.addEventListener("click", function() {
            createComment.hidden = false;
        });
        writeCommentSetup(createComment, comment.querySelector(".replies"), model.id);
    }
    
    opdoot(
        comment.querySelector(".comment-button-up"),
        comment.querySelector(".comment-button-down"),
        commentOpdootContainer,
        commentOpdoots,
        "/comment/" + model.id + "/opdoot"
    )
    
    destination.append(comment);
}

async function loadComments(destination, loadMore, limit, parentId) {
    let offset = destination.querySelectorAll(".user-comment").length;
    let url = "/post/" + file + "/comment?offset=" + offset + "&limit=" + limit;
    if(parentId) {
        url = url + "&parentId=" + parentId;
    } 
    let inner = document.createElement("div");
    inner.classList.add("spinner-border");
    let spinner = document.createElement("div");
    spinner.append(inner);
    spinner.classList.add("text-center");
    destination.append(spinner);
    try {
        const response =  await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });    
        let comments = await response.json();
        if(comments.status) {
            return;
        }
        spinner.remove();
        for(comment of comments.comments) {
            createComment(comment, destination);
        }
        if(comments.comments.length < limit) {
            loadMore.hidden = true;
        }
    } catch (error) {
        console.log(error);
    }
}

async function deleteComment() {
    if(userComments.includes(deleteCommentId)) {
        try {
            const response =  await fetch("/comment/" + deleteCommentId, {
                method: 'DELETE',
            });
            const status = await response.text();
            if(status == "success") {
                document.querySelector("[data-comment-id='" + deleteCommentId + "']").remove();
                $('#delete-comment-modal').modal('hide');
            }
        } catch (error) {
            console.log(error)
        }
    }
}

window.onload =  function() {
    let writeComment = document.getElementById("create-comment");
    let destination = document.getElementById("comments");
    let loadMore = document.getElementById("load-comments");
    
    const commentLoadLimit = 20;

    if(writeComment) {
        writeCommentSetup(writeComment, destination);
    };

    loadComments(destination, loadMore, commentLoadLimit);

    loadMore.addEventListener("click", function() {
        loadComments(destination, loadMore, commentLoadLimit);
    });

    document.getElementById("delete-comment").addEventListener("click", function() {
        deleteComment();
    })
};


