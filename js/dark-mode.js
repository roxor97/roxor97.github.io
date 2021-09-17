let getDark = document.getElementById('btn-dark');
let btnLight = document.getElementById('btn-light');
let body = document.body;





//Agrega modo dark al body
const modoNocturno = () => {
    body.classList.toggle('dark');

}
const setBodyDark = () => {
    if (localStorage.getItem('dark-mode') == 'true') {
        body.classList.add('dark')
        getDark.style.display = 'none'
        btnLight.style.display = 'flex'
    } else {
        body.classList.remove('dark')

    }
}

getDark.addEventListener('click', () => {
    modoNocturno()

    getDark.style.display = 'none'
    btnLight.style.display = 'flex'

    if (body.classList.contains('dark')) {
        localStorage.setItem('dark-mode', true)

    } else {
        localStorage.setItem('dark-mode', false)

    }

})
//Cambiar a modo diurno
btnLight.addEventListener('click', () => {
    modoNocturno()
    btnLight.style.display = 'none'
    getDark.style.display = 'flex'
    if (body.classList.contains('dark')) {
        localStorage.setItem('dark-mode', 'true')


    } else {
        localStorage.setItem('dark-mode', 'false')
    }



})

setBodyDark()