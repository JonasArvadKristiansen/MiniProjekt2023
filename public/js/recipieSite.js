const selectOptions = document.getElementById('selectOptions')

for (let i = 1; i <= 100; i++) {
    let option = document.createElement('option')
    option.text = i

    selectOptions.append(option)
}