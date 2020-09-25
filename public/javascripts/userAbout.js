let username = location.pathname.split('/')[2];

let url = 'https://opdootimages.s3.amazonaws.com';

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

function createSpinner() {
    let inner = document.createElement("div");
    inner.classList.add("spinner-border");
    let spinner = document.createElement("div");
    spinner.append(inner);
    spinner.classList.add("text-center");
    
    return spinner;
}

function editAbout() {
    let aboutMaxChar = 1000;
    let editAbout = document.querySelector(".edit-about");
    if(!editAbout) {
        return;
    }
    editAbout.addEventListener("click", function() {
        let bio = document.querySelector(".bio");
        if(!bio) {
            return;
        }
        let aboutMe = document.querySelector(".about-me");
        let editArea = document.createElement("textarea");
        let editCharCount = document.createElement("span");
 
        bio.remove();
        editArea.value = bio.innerText;
        editArea.classList.add("edit-about-me")
        editArea.addEventListener("input", function() {
            editCharCount.innerText = this.value.trim().length + "/" + aboutMaxChar;
            this.style.height = "";
            this.style.height = this.scrollHeight + 2 + "px";
        });
        editCharCount.classList.add("d-block", "small", "text-left", "mb-1");
        editCharCount.innerText = editArea.value.trim().length + "/1000";
        
        let container = document.createElement("div");
        let buttons = document.createElement("div");

        container.classList.add("d-flex", "justify-content-between");
        container.append(editCharCount);
        buttons.classList.add("d-flex");
        buttons.append(createCancelButton(aboutMe, editArea, container, bio));
        buttons.append(createSubmitButton(aboutMe, editArea, container, bio));
        container.append(buttons);

        aboutMe.append(editArea);
        aboutMe.append(container);
    })
}

function createSubmitButton(aboutMe, editArea, container, bio) {
    let submit = document.createElement("button");

    submit.innerText = "Submit";
    submit.classList.add("btn", "btn-primary");
    submit.addEventListener("click", async function() {
        this.disabled = true;
        let body = {
            about: editArea.value.trim()
        }
        try {
            const response =  await fetch("/user/" + username + "/about", {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            const resText = await response.text();
            if(resText == "success") {
                editArea.remove();
                container.remove();
                bio.innerText = editArea.value.trim();
                aboutMe.append(bio);
            }
        } catch (error) {
            console.log(error)
        }
    })

    let outer = document.createElement("div");

    outer.append(submit);
    outer.classList.add("text-right");

    return outer;
}

function createCancelButton(aboutMe, editArea, container, bio) {
    let cancel = document.createElement("button");

    cancel.innerText = "Cancel";
    cancel.classList.add("btn", "btn-secondary", "mr-2");
    cancel.addEventListener("click",  function() {
        editArea.remove();
        container.remove();
        aboutMe.append(bio);
    })
    return cancel;
}

window.onload = function() {
    editAbout();
}
