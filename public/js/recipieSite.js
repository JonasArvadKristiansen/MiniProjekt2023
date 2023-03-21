// Laver alle options i select 
const selectOptions = document.getElementById('selectOptions')
for (let i = 1; i <= 100; i++) {
    let option = document.createElement('option')
    option.text = i

    selectOptions.append(option)
}


// Gemmer de orginale data i en sessionStorage
let amount = document.getElementsByClassName('amount') 
let totalAmount = []
for (let i = 0; i < amount.length; i++) {
   totalAmount.push(amount[i].innerHTML); 
}
sessionStorage.setItem ('recapiTotalamount', totalAmount );


//Ændre ingrediens værdierne numre
selectOptions.addEventListener("change", function() {
    let result = sessionStorage.getItem('recapiTotalamount').split(',');
    let deafultAmount = document.getElementById('deafultAmount')

    for (let i = 0; i < amount.length; i++) {
        let value = (parseInt(result[i]) / deafultAmount.value) * selectOptions.value
        value = value.toFixed(2)
        amount[i].innerHTML = value.toString();
    }
});