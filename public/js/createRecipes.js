// Når man ville oprette en ingrediens
// Værdier fra input

const ingredientName = document.getElementById('ingredientName')
const ingrediensMeasurements = document.getElementById('ingrediensMeasurements')
const ingredientUnit = document.getElementById('ingredientUnit')

// Ingrediens list og opret button
let ingredientList = document.getElementById('ingredientList')
const createIncredient = document.getElementById('createIncredient')

//Opret en ingrediens til ingredienslisten
createIncredient.addEventListener('click', function() {

    //cheker om nogen af dem er tomme
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
        //Ingrediensens mulling
        const div = document.createElement('div')
        div.className = 'mb-3 ingredientItem'
        ingredientList.appendChild(div)
        let input = document.createElement('input')
        input.className = 'form-control no-touch'
        input.type = 'text'
        input.name = 'ingrediensMeasurement'
        input.defaultValue  = ingrediensArray[0]
        input.readOnly = true
        div.appendChild(input)

        //Ingrediensens enhed
        input = document.createElement('input')
        input.className = 'form-control no-touch'
        input.type = 'text'
        input.name = 'ingrediensUnit'
        input.defaultValue = ingrediensArray[1]
        input.readOnly = true
        div.appendChild(input)

        //Ingrediensens navn
        input = document.createElement('input')
        input.className = 'form-control no-touch'
        input.type = 'text'
        input.name = 'ingrediensName'
        input.defaultValue = ingrediensArray[2]
        input.readOnly = true
        div.appendChild(input)

        //Slet knappen
        const deleteButton = document.createElement('button')
        deleteButton.className = 'btn btn-danger'
        deleteButton.type = 'button'
        deleteButton.innerHTML = 'Slet'
        deleteButton.setAttribute('onclick', 'DeleteParent(this)')
        div.appendChild(deleteButton)

        //nulstil input felterene
        ingredientName.value = null
        ingrediensMeasurements.value = null
    }
    
})

// function sat on the button to delete the parrent holding the ingrediens
function DeleteParent(button) {
    button.parentElement.remove()
}

let form = document.querySelector("main form") 
let inputs = form.querySelectorAll("input, textarea, select ")


// finder ingredienserne der gemt i session
const divContent = sessionStorage.getItem("myDivContent");
ingredientList.innerHTML = divContent;
ingredientList.appendChild(ingredientList)


// Henter informaiton i session og giver input felterne value
inputs.forEach(el => {
    if (sessionStorage.getItem(el.id).length > 0){
        el.value = sessionStorage.getItem(el.id) 
    }
});


// Gemmer informaiton i en session
function SaveData(){
    form = document.querySelector("main form") 
    inputs = form.querySelectorAll("input, textarea, select ")
    ingredientList = document.getElementById('ingredientList')

    const divContent = ingredientList.innerHTML
    sessionStorage.setItem("myDivContent", divContent);

    inputs.forEach(el => {
        sessionStorage.setItem(el.id, el.value)  
    });
}