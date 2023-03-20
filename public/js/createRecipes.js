// Når man ville oprette en ingrediens

// Værdier fra input
const ingredientName = document.getElementById('ingredientName')
const ingrediensMeasurements = document.getElementById('ingrediensMeasurements')
const ingredientUnit = document.getElementById('ingredientUnit')

// List og button
const ingredientList = document.getElementById('ingredientList')
const createIngredient = document.getElementById('createIncredient')


createIncredient.addEventListener('click', function () {
    let create = true
    const ingrediensArray = [ingrediensMeasurements.value, ingredientUnit.value, ingredientName.value ]
    for (let i = 0; i < ingrediensArray.length; i++) {
        if (ingrediensArray[i].length === 0) {
            create = false
            break;
        }
    }
    
    // laver de forskellige elementer og indsætter dem hvis alt er udfyldt
    if (create) {
        const div = document.createElement('div')
        div.className = 'input-group mb-3'
        ingredientList.appendChild(div)

        const input = document.createElement('input')
        input.className = 'form-control no-touch'
        input.type = 'text'
        input.name = 'ingredientList'
        input.value = `${ingrediensArray[0]} ${ingrediensArray[1]} ${ingrediensArray[2]}`
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