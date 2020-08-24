
let dropArea = document.getElementById("drop-area");
let submit = document.getElementById("submit");
let form = new FormData();
let maxFileSize = 20971520;

function previewImage(file) {
    let reader = new FileReader();
    let image = new Image();
    reader.onload = function(e)  {
        image.src = e.target.result;
        while (dropArea.hasChildNodes()) {
            dropArea.removeChild(dropArea.childNodes[0]);
        }
        dropArea.appendChild(image);
    }
    reader.readAsDataURL(file);
    image.onload = function() {
        if(this.naturalWidth > this.naturalHeight) {
            this.style.width = "100%";
        } else {
            this.style.height = "100%";
        }
    }
    dropArea.classList.add("dropped")
    form.set('file', file);
};

function enableSubmit() {
    if(form.has('file')) {
        submit.removeAttribute("disabled");
    }
}

function enterAnimation() {
    dropArea.classList.remove("drag-leave");
    void dropArea.offsetWidth;
    dropArea.classList.add("drag-enter");
}

function leaveAnimation() {
    dropArea.classList.remove("drag-enter");
    void dropArea.offsetWidth;
    dropArea.classList.add("drag-leave");
}



dropArea.addEventListener("drop", function(e) {
    e.preventDefault();
    let file = e.dataTransfer.items[0];
    if(file == null) {
        submit.setAttribute("disabled", "disabled")
        return;
    }
    console.log(file.getAsFile().size + " " + maxFileSize);
    if((file.getAsFile().type == "image/jpeg" || file.getAsFile().type == "image/jpeg") &&
       file.getAsFile().size <= maxFileSize) {
        previewImage(file.getAsFile());
        enableSubmit();
        return;
    }
    leaveAnimation();

});

dropArea.addEventListener("dragover", function(e) {
    e.preventDefault();
});

dropArea.addEventListener("dragenter", function(e) {
    e.preventDefault();
    enterAnimation();
});

dropArea.addEventListener("dragleave", function(e) {
    e.preventDefault();
    leaveAnimation();
});

let input =  document.getElementById("input-file");

input.accept = "image/jpeg,image/png";

input.addEventListener("change", function() {
    let file = this.files[0];
    if(file == null) {
        submit.setAttribute("disabled", "disabled");
        return
    }
    if(file.type == "image/jpeg" || file.type == "image/jpeg" ||
       file.getAsFile().size <= maxFileSize) {
        previewImage(file);
        enableSubmit();
        return;
    }
    leaveAnimation();

});

let titleMaxChar = 100
let tagsMaxChar = 200

let titleChar = document.getElementById("title-char");
document.getElementById("title").addEventListener("input", function() {
    form.set('title', this.value);
    titleChar.innerHTML = this.value.length + "/" + titleMaxChar;
});

let tagsChar = document.getElementById("tags-char");
document.getElementById("tags").addEventListener("input", function() {
    form.set('tags', this.value);
    tagsChar.innerHTML = this.value.length + "/" + tagsMaxChar;
});

submit.addEventListener("click", async function() {
    for(var pair of form.entries()) {
        console.log(pair[0]+ ', '+ pair[1]); 
     }
    try {
        const response =  await fetch("/upload", {
            method: 'POST',
            body: form
        });
        const resJson = await response.json();
        console.log(resJson);
        location.href = resJson.redirect;
        document.getElementById("error").innerHTML = resJson.error;
    } catch (error) {
        console.log(error)
    }
});
