// Når man ville oprette en ingrediens
// Værdier fra input
const ingredientName = document.getElementById('ingredientName')
const ingrediensMeasurements = document.getElementById('ingrediensMeasurements')
const ingredientUnit = document.getElementById('ingredientUnit')

// List og button
const ingredientList = document.getElementById('ingredientList')
const createIncredient = document.getElementById('createIncredient')


// Opretter ingredienser til en liste 
createIncredient.addEventListener('click', function () {
    let create = true
    const ingrediensArray = [ingrediensMeasurements.value, ingredientUnit.value, ingredientName.value ]
    for (let i = 0; i < ingrediensArray.length; i++) {
        if (ingrediensArray[i].length === 0) {
            create = false
            break;
        }
    }

    // laver de forskellige inputs hvis alle inputs for at oprette ingredienser er opfyldt
    if (create) {
        const div = document.createElement('div')
        div.className = 'mb-3 ingredientItem'
        ingredientList.appendChild(div)

        let input = document.createElement('input')
        input.className = 'form-control no-touch'
        input.type = 'text'
        input.name = 'ingrediensMeasurement'
        input.value = ingrediensArray[0]
        input.readOnly = true
        div.appendChild(input)

        input = document.createElement('input')
        input.className = 'form-control no-touch'
        input.type = 'text'
        input.name = 'ingrediensUnit'
        input.value = ingrediensArray[1]
        input.readOnly = true
        div.appendChild(input)


        input = document.createElement('input')
        input.className = 'form-control no-touch'
        input.type = 'text'
        input.name = 'ingrediensName'
        input.value = ingrediensArray[2]
        input.readOnly = true
        div.appendChild(input)

        const deleteButton = document.createElement('button')
        deleteButton.className = 'btn btn-danger'
        deleteButton.type = 'button'
        deleteButton.innerHTML = 'Slet'
        div.appendChild(deleteButton)

        deleteButton.addEventListener('click', function() {
            div.remove()
        })
    
        ingredientName.value = null
        ingrediensMeasurements.value = null
    }
})


let form = document.querySelector("main form") 
let inputs = form.querySelectorAll("input, textarea, select ")
console.log(inputs)
//let ingredientItem = document.getElementById("ingredientItem")




// Henter informaiton i session og giver input felterne value
inputs.forEach(el => {
    console.log(sessionStorage.getItem(el.id))
    if (sessionStorage.getItem(el.id).length > 0){
        el.value = sessionStorage.getItem(el.id) 
    }
});

// Gemmer informaiton i en session
function SaveData(){
    form = document.querySelector("main form") 
    inputs = form.querySelectorAll("input, textarea, select ")

    inputs.forEach(el => {
        sessionStorage.setItem(el.id, el.value)  
    });
}