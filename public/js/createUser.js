let form = document.querySelector("main form") 
let inputs = form.querySelectorAll("input")

// Henter informaiton i session og giver input felterne value
inputs.forEach(el => {
    console.log(sessionStorage.getItem(el.id))
    if (sessionStorage.getItem(el.id).length > 0){
        el.value = sessionStorage.getItem(el.id) 
    }
});


// Gemmer informaiton i en session
function SaveData() {
    console.log('insider')
    form = document.querySelector("main form")
    inputs = form.querySelectorAll("input")

    inputs.forEach(el => {
        sessionStorage.setItem(el.id, el.value) 
    })
}
