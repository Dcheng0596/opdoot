//Email input event
document.getElementById("email").addEventListener("input", function() {
    isValid('/signup_ajax/email', this.value)
});

document.getElementById("username").addEventListener("input", function() {
    isValid('/signup_ajax/username', this.value)
});

document.getElementById("password").addEventListener("input", function() {
    isValid('/signup_ajax/password', this.value)
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
        console.log(resJson);
    } catch (error) {
        console.log(error)
    }
}