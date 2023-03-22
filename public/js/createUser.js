let form = document.querySelector("main form") 
let match = form.querySelectorAll("input")

match.forEach(el => {
    console.log(sessionStorage.getItem(el.id))
    if (sessionStorage.getItem(el.id).length > 0){
        el.value = sessionStorage.getItem(el.id) 
    }
});

function createUser() {
    form = document.querySelector("main form")
    match = form.querySelectorAll("input")

    match.forEach(el => {
        sessionStorage.setItem(el.id, el.value)  
    });
}