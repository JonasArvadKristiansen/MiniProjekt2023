// Når man ville oprette en ingrediens
// Værdier fra input

const ingredientName = document.getElementById('editIngredientName')
const ingrediensMeasurements = document.getElementById('editIngrediensMeasurements')
const ingredientUnit = document.getElementById('editIngredientUnit')

// Ingrediens list og opret button
let ingredientList = document.getElementById('editIngredientList')
const createIncredient = document.getElementById('editCreateIncredient')

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
        input.name = 'editIngrediensMeasurements'
        input.defaultValue  = ingrediensArray[0]
        input.readOnly = true
        div.appendChild(input)

        //Ingrediensens enhed
        input = document.createElement('input')
        input.className = 'form-control no-touch'
        input.type = 'text'
        input.name = 'editIngredientUnit'
        input.defaultValue = ingrediensArray[1]
        input.readOnly = true
        div.appendChild(input)

        //Ingrediensens navn
        input = document.createElement('input')
        input.className = 'form-control no-touch'
        input.type = 'text'
        input.name = 'editIngredientName'
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

