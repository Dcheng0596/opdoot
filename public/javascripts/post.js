let file = location.pathname.split('/')[2];
let upvote = document.getElementById("button-up");
let downvote = document.getElementById("button-down");
let opdoots = document.getElementById("opdoots");
let opdootContainer = document.getElementById("opdoot-container");

async function fetchOpdoot(vote) {
    try {
        let body = {
            file: file,
            vote: vote
        }
        const response =  await fetch("/post/opdoot", {
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

upvote.addEventListener("click", function() {
    if(opdootContainer.classList.contains("novote")){
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
    fetchOpdoot("upvote");
});

downvote.addEventListener("click", function() {
    if(opdootContainer.classList.contains("novote")){
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
    fetchOpdoot("downvote");
});


