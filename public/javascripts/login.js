
let inputs = document.getElementsByTagName("input");
let submit = document.querySelector("button[disabled]")

for(let input of inputs) {
    input.addEventListener("input", function() {
        let isAtLeastOneInputEmpty = false;
        for(let input of inputs) {
            if(input.value == '') {
                isAtLeastOneInputEmpty = true;
            }
        }
        if(isAtLeastOneInputEmpty) {
            submit.setAttribute("disabled", "disabled")
        } else {
            submit.removeAttribute("disabled")
        }
    })
}

