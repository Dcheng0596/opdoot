async function isValid(route, input) {
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

function changeUsername() {
    let modal = document.getElementById("change-username-modal");
    let submit = modal.querySelector("button[type='submit']");
    let username = modal.querySelector("input[name='username']");
    let password = modal.querySelector("input[name='password']");

    submit.setAttribute("disabled", "disabled");
    username.addEventListener("input", function() {
        isValid('/signup_ajax/username', this.value).then(errors =>{
            let error = document.getElementById("username-error");
            if("username" in errors) {
               error.innerHTML = errors.username;
               this.classList.add("error");
               submit.setAttribute("disabled", "disabled")
            } else {
                error.innerHTML = "";
                this.classList.add("success");
                this.classList.remove("error");
                submit.removeAttribute("disabled");
            }
        });
    });

    submit.addEventListener("click", async function() {
        try {
            let body = {
                username: username.value,
                password: password.value
            }
            const response =  await fetch('/change_username', {
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
}

function changeEmail() {
    let modal = document.getElementById("change-email-modal");
    let submit = modal.querySelector("button[type='submit']");
    let email = modal.querySelector("input[name='email']");
    let password = modal.querySelector("input[name='password']");

    submit.setAttribute("disabled", "disabled");
    email.addEventListener("input", function() {
        isValid('/signup_ajax/email', this.value).then(errors =>{
            let error = document.getElementById("email-error");
            if("email" in errors) {
               error.innerHTML = errors.email;
               this.classList.add("error");
               submit.setAttribute("disabled", "disabled")
            } else {
                error.innerHTML = "";
                this.classList.add("success");
                this.classList.remove("error");
                submit.removeAttribute("disabled");
            }
        });
    });

    submit.addEventListener("click", async function() {
        try {
            let body = {
                email: email.value,
                password: password.value
            }
            const response =  await fetch('/change_email', {
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
}

function changePassword() {
    let modal = document.getElementById("change-password-modal");
    let submit = modal.querySelector("button[type='submit']");
    let newPassword = modal.querySelector("input[name='newPassword']");
    let password = modal.querySelector("input[name='password']");

    submit.setAttribute("disabled", "disabled");
    newPassword.addEventListener("input", function() {
        isValid('/signup_ajax/password', this.value).then(errors =>{
            let error = document.getElementById("newPassword-error");
            if("password" in errors) {
               error.innerHTML = errors.password;
               this.classList.add("error");
               submit.setAttribute("disabled", "disabled")
            } else {
                error.innerHTML = "";
                this.classList.add("success");
                this.classList.remove("error");
                submit.removeAttribute("disabled");
            }
        });
    });

    submit.addEventListener("click", async function() {
        try {
            let body = {
                newPassword: newPassword.value,
                password: password.value
            }
            const response =  await fetch('/change_password', {
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
}

function setPassword() {
    let modal = document.getElementById("set-password-modal");
    let submit = modal.querySelector("button[type='submit']");
    let password = modal.querySelector("input[name='password']");

    submit.setAttribute("disabled", "disabled");
    password.addEventListener("input", function() {
        isValid('/signup_ajax/password', this.value).then(errors =>{
            let error = document.getElementById("setPassword-error");
            if("password" in errors) {
               error.innerHTML = errors.password;
               this.classList.add("error");
               submit.setAttribute("disabled", "disabled")
            } else {
                error.innerHTML = "";
                this.classList.add("success");
                this.classList.remove("error");
                submit.removeAttribute("disabled");
            }
        });
    });

    submit.addEventListener("click", async function() {
        try {
            let body = {
                password: password.value
            }
            const response =  await fetch('/set_password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            let status = await response.text();

            if(status == "success") {
                let usernameModal = document.getElementById("show-username-modal");
                let emailModal = document.getElementById("show-email-modal");
                let passwordModal = document.getElementById("show-password-modal");

                usernameModal.setAttribute("data-target", "change-username-modal");
                emailModal.setAttribute("data-target", "change-email-modal");
                passwordModal.setAttribute("data-target", "change-password-modal");
            }
            
        } catch (error) {
            console.log(error)
        }
    });
}


changeUsername();
changeEmail();
changePassword();
setPassword();
