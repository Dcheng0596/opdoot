let search = document.querySelector("input[type='search']");
let results = document.getElementById("results");
let result = document.querySelector(".result");

search.addEventListener("input", async function() {
    try {
        let query = this.value.trim();
        results.innerHTML = "";

        if(query == "") {
            results.classList.add("d-none");
            return
        }
        const response =  await fetch("/search?query=" + query, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const resJson = await response.json();
        if(resJson.results.length == 0) {
            let noResult = document.createElement("span");
            noResult.innerText = "No Results";
            let outer = document.createElement("div");
            outer.classList.add("text-center", "pt-2");
            outer.append(noResult);
            results.append(outer);
        }
        results.classList.remove("d-none");
        resJson.results.forEach(function(user) {
            let newResult = result.cloneNode(true);
            let profilePicture = newResult.querySelector(".profile-picture");
            let username = newResult.querySelector(".username");

            newResult.href = '/user/' + user.username;
            profilePicture.src = user.profilePicture;
            username.innerText = user.username;
            newResult.classList.remove("d-none");
            results.append(newResult)
            
        })
    } catch (error) {
        console.log(error)
    }
});

results.style.width = search.parentElement.offsetWidth + "px";
console.log(results.style.width);