
let dropArea = document.getElementById("drop-area");
let submit = document.getElementById("submit");
let form = new FormData();
let maxFileSize = 20971520;

function previewImage(file) {
    let reader = new FileReader();
    let image = new Image();
    reader.onload = function(e)  {
        image.src = e.target.result;
        image.hidden = true;
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
        form.set('width', this.naturalWidth);
        form.set('height', this.naturalHeight);
        enableSubmit();
        image.hidden = false;
    }
    dropArea.classList.add("dropped");
    console.log(image.naturalWidth);
    
    form.set('file', file);
};

function showSpinner() {
    let spinner = document.createElement("div");
    spinner.classList.add("spinner-border");
    spinner.classList.add("text-light");
    while (dropArea.hasChildNodes()) {
        dropArea.removeChild(dropArea.childNodes[0]);
    }
    dropArea.appendChild(spinner);
}

function enableSubmit() {
    if(form.has('file') && form.has('width') && form.has('height')) {
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
        submit.setAttribute("disabled", "disabled");
        return;
    }
    console.log(file.getAsFile().size + " " + maxFileSize);
    if((file.getAsFile().type == "image/jpeg" || file.getAsFile().type == "image/png") &&
       file.getAsFile().size <= maxFileSize) {
        showSpinner();
        handleImageUpload(file.getAsFile());
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
    if(file.type == "image/jpeg" || file.type == "image/png" ||
       file.size <= maxFileSize) {
        showSpinner();
        handleImageUpload(file);
        return;
    }
    leaveAnimation();

});

let titleMaxChar = 100
let descriptionMaxChar = 200
let tagsMaxChar = 200

let titleChar = document.getElementById("title-char");
document.getElementById("title").addEventListener("input", function() {
    form.set('title', this.value);
    titleChar.innerText = this.value.length + "/" + titleMaxChar;
});

let descriptionChar = document.getElementById("description-char");
document.getElementById("description").addEventListener("input", function() {
    form.set('description', this.value);
    descriptionChar.innerText = this.value.length + "/" + descriptionMaxChar;
});

let tagsChar = document.getElementById("tags-char");
document.getElementById("tags").addEventListener("input", function() {
    form.set('tags', this.value);
    tagsChar.innerText = this.value.length + "/" + tagsMaxChar;
});

submit.addEventListener("click", async function() {
    submit.setAttribute("disabled", "disabled");

    for(var pair of form.entries()) {
        console.log(pair[0]+ ', '+ pair[1]); 
     }
    try {
        const response =  await fetch("/upload", {
            method: 'POST',
            body: form
        });
        const resJSON = await response.json();
        if(resJSON.error) {
            document.getElementById("error").innerText = resJSON.error;
        } else {
            location.href = resJSON.url;
        }
    } catch (error) {
        console.log(error)
    }
});

async function handleImageUpload(file) {
    submit.setAttribute("disabled", "disabled");

    const imageFile = file;
    console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
    console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);
   
    const options = {
      maxSizeMB: 10,
      useWebWorker: true
    }
    try {
      const compressedFile = await imageCompression(imageFile, options);
      previewImage(compressedFile);
    } catch (error) {
      console.log(error);
    }
   
  }