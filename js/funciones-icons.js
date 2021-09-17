let iconModalFav = document.querySelector('.icon-favorito-modal');
//Funciones version mobile

const maximinizarMobile = (event) => {
    let user = event.target.previousElementSibling.lastElementChild.firstElementChild.textContent
    let descripcion = event.target.previousElementSibling.lastElementChild.firstElementChild.nextElementSibling.textContent
    let id = event.target.id
    modal.style.display = "block";
    modalContent.src = event.target.src;
    modalContent.alt = descripcion;
    modalContent.id = id
    userModal.textContent = user;
    tituloModal.textContent = descripcion;
    modal.classList.add('actived')

    if (favoritos.length > 0) {
        favoritos.forEach(favorito => {
            if (favorito.id == id) {
                iconModalFav.classList.add('actived')

            }
        })
    }

}

const maximizar = (event) => {
    let user = event.target.parentElement.parentElement.nextElementSibling.firstChild.nextSibling.textContent;
    let descripcion = event.target.parentElement.parentElement.nextElementSibling.firstChild.nextSibling.nextSibling.nextSibling.textContent;
    let pictureUrl = event.target.parentElement.parentElement.parentElement.parentElement.lastElementChild.src;
    let img = event.target.parentElement.parentElement.parentElement.parentElement.lastElementChild
    let id = img.id
    modal.style.display = "block";
    modalContent.src = pictureUrl;
    modalContent.id = id
    modalContent.alt = descripcion
    userModal.textContent = user;
    tituloModal.textContent = descripcion;
    modal.classList.add('actived')


    let imagen = iconModalFav.parentNode.parentNode.previousElementSibling.firstElementChild;
    let idIconModalFav = imagen.id;
    if (favoritos.length > 0) {
        favoritos.forEach(gifo => {
            let idFavorito = gifo.id;
            if (idFavorito == idIconModalFav) {

                iconModalFav.classList.add('actived')
            }
        })
    }




}

//Ver gif en pantalla completa
const maxMinPicture = () => {

    let img = document.querySelectorAll('.imagen');
    let icon = document.querySelectorAll('.icon-escalar')
    img.forEach((imagen) => {
        imagen.addEventListener('click', maximinizarMobile)
    })

    icon.forEach((icon) => {
        icon.addEventListener('click', maximizar)
    })

    closeModal.addEventListener('click', (event) => {
        modal.style.display = "none";
        modal.classList.remove('actived')
        modalContent.src = ''
        iconModalFav.classList.remove('actived')
        if (favoritos.length > 0) {

            let iconFavorito = document.querySelectorAll('.icon-favorito');

            (localStorage.getItem('favoritos')) ? favoritos = JSON.parse(localStorage.getItem('favoritos')): favoritos = []
            iconFavorito.forEach(icon => {
                let idFavorito = icon.parentElement.parentElement.parentElement.parentElement.lastElementChild.id
                for (let i = 0; i < favoritos.length; i++) {
                    if (idFavorito == favoritos[i].id) {
                        icon.classList.add('actived')
                        break
                    } else {
                        icon.classList.remove('actived')

                    }
                }
            })
        }

    })

}



const crearFavorito = (event) => {
    class GIF {

        constructor(user, descripcion, gif, id) {
            this.user = user
            this.descripcion = descripcion
            this.gif = gif;
            this.id = id
        }
    }

    event.target.classList.toggle('actived')

    let user = event.target.parentElement.parentElement.nextElementSibling.firstChild.nextSibling.textContent;
    let imagen = event.target.parentElement.parentElement.parentElement.parentElement.lastElementChild
    let descripcion = imagen.attributes[3].value;
    let pictureUrl = imagen.attributes[2].value;
    let id = imagen.id



    if (event.target.classList.contains('actived')) {
        let favorito = new GIF(user, descripcion, pictureUrl, id)
        favoritos.push(favorito)
        localStorage.setItem('favoritos', JSON.stringify(favoritos))



    } else if (!event.target.classList.contains('actived')) {
        let nuevoFavoritos = favoritos.filter((i) => i.id != id)
        favoritos = nuevoFavoritos
        localStorage.setItem('favoritos', JSON.stringify(favoritos))
    }


}
//Agrego a favoritos
const aggFavorito = () => {

    let iconFavorito = document.querySelectorAll('.icon-favorito');

    (localStorage.getItem('favoritos')) ? favoritos = JSON.parse(localStorage.getItem('favoritos')): favoritos = []
    iconFavorito.forEach((icon) => {
        let idFavorito = icon.parentElement.parentElement.parentElement.parentElement.lastElementChild.id
        if (favoritos.length > 0) {
            for (let i = 0; i < favoritos.length; i++) {
                if (idFavorito == favoritos[i].id) {
                    icon.classList.add('actived')
                    break
                } else {
                    continue
                }
            }
        }


        icon.addEventListener('click', crearFavorito)
    })

}

//Descargar gif
const descargarGifoSeleccionado = (event) => {
    let nombre;
    let urlIcon;
    if (!modal.classList.contains('actived')) {
        nombre = event.target.parentElement.parentElement.nextElementSibling.firstChild.nextSibling.nextSibling.nextSibling.textContent;
        urlIcon = event.target.parentElement.parentElement.parentElement.parentElement.lastElementChild.src;
    } else if (modal.classList.contains('actived')) {
        nombre = event.target.parentElement.parentElement.firstElementChild.lastElementChild.textContent;
        urlIcon = event.target.parentElement.parentElement.previousElementSibling.firstElementChild.src;
    }
    let xhr = new XMLHttpRequest();

    xhr.open("GET", urlIcon, true);
    xhr.responseType = "blob";

    xhr.onload = function () {

        let urlCreator = window.URL || window.webkitURL;
        let imageUrl = urlCreator.createObjectURL(this.response);
        let tag = document.createElement('a');
        tag.href = imageUrl;
        tag.download = nombre;
        document.body.appendChild(tag);
        tag.click();
        document.body.removeChild(tag);

    }

    xhr.send();
}

const aggFavoritoModalActived = () => {

    iconModalFav.addEventListener('click', (event) => {
        class GIF {

            constructor(user, descripcion, gif, id) {
                this.user = user
                this.descripcion = descripcion
                this.gif = gif;
                this.id = id
            }
        }
        event.target.classList.toggle('actived');

        let imagen = event.target.parentNode.parentNode.previousElementSibling.firstElementChild
        let pictureUrl = imagen.src;
        let id = imagen.id;
        let descripcion = imagen.alt;
        let user = event.target.parentNode.previousElementSibling.firstElementChild.textContent;

        if (event.target.classList.contains('actived')) {
            let favorito = new GIF(user, descripcion, pictureUrl, id)
            favoritos.push(favorito)
            localStorage.setItem('favoritos', JSON.stringify(favoritos))



        } else if (!event.target.classList.contains('actived')) {
            let nuevoFavoritos = favoritos.filter((i) => i.id != id)
            favoritos = nuevoFavoritos
            localStorage.setItem('favoritos', JSON.stringify(favoritos))
        }

    })
}

const descargarGifos = () => {
    let iconDescarga = document.querySelectorAll('.icon-descargar')
    iconDescarga.forEach((icon) => {
        icon.addEventListener('click', descargarGifoSeleccionado)
    })
}
aggFavoritoModalActived()