// number of inputs that need to be validated to submit the form
let num_success = 3;

let submit = document.querySelector("button[disabled]")

document.getElementById("email").addEventListener("input", function() {
    isValid('/signup_ajax/email', this.value).then(errors => {
        let error = document.getElementById("email-error");
        let input = document.getElementById("email");
        if("email" in errors) {
           error.innerHTML = errors.email;
           input.classList.add("error");
           submit.setAttribute("disabled", "disabled")
        } else {
            error.innerHTML = "";
            input.classList.replace("error", "success");
            if(document.getElementsByClassName("success").length == num_success) {
                submit.removeAttribute("disabled")
            }
        }
    });
});

document.getElementById("username").addEventListener("input", function() {
    isValid('/signup_ajax/username', this.value).then(errors =>{
        let error = document.getElementById("username-error");
        let input = document.getElementById("username");
        if("username" in errors) {
           error.innerHTML = errors.username;
           input.classList.add("error");
           submit.setAttribute("disabled", "disabled")
        } else {
            error.innerHTML = "";
            input.classList.replace("error", "success");
            if(document.getElementsByClassName("success").length == num_success) {
                submit.removeAttribute("disabled")
            }
        }
    });
});

document.getElementById("password").addEventListener("input", function() {
    isValid('/signup_ajax/password', this.value).then(errors => {
        let error = document.getElementById("password-error");
        let input = document.getElementById("password");
        if("password" in errors) {
           error.innerHTML = errors.password;
           input.classList.add("error");
           submit.setAttribute("disabled", "disabled")
        } else {
            error.innerHTML = "";
            input.classList.replace("error", "success");
            if(document.getElementsByClassName("success").length == num_success) {
                submit.removeAttribute("disabled")
            }
        }
    });
});

const isValid = async (route, input) => {
    try {
        const response =  await fetch(route, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                input: input
            })
        });
        const resJson = await response.json();
        return resJson;
    } catch (error) {
        console.log(error)
    }
}