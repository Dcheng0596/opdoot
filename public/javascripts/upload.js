
const supportedTypes = ["image/jpeg", ]

let dropArea = document.getElementById("drop-area");
let submit = document.getElementById("submit");
let form = new FormData();

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

dropArea.addEventListener("drop", function(e) {
    e.preventDefault();
    let file = e.dataTransfer.items[0];
    if(file) {
        previewImage(file.getAsFile());
        enableSubmit();
    } else {
        submit.setAttribute("disabled", "disabled")
    }
    
});

dropArea.addEventListener("dragover", function(e) {
    e.preventDefault();
});

dropArea.addEventListener("dragenter", function(e) {
    e.preventDefault();
    this.classList.remove("drag-leave");
    void this.offsetWidth;
    this.classList.add("drag-enter");
});

dropArea.addEventListener("dragleave", function(e) {
    e.preventDefault();
    this.classList.remove("drag-enter");
    void this.offsetWidth;
    this.classList.add("drag-leave");

});

let input =  document.getElementById("input-file");

input.accept = "image/jpeg,image/png";

input.addEventListener("change", function() {
    let file = this.files[0];
    if(file) {
        previewImage(file);
        enableSubmit();
    } else {
        submit.setAttribute("disabled", "disabled")
    }
});

document.getElementById("title").addEventListener("input", function() {
    form.set('title', this.value)
});
   
document.getElementById("tags").addEventListener("input", function() {
    form.set('tags', this.value);
});
