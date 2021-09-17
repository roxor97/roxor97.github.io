let contenedorResultados = document.querySelector('.contenedor-resultados');
let contenedorSinResultados = document.querySelector('.sin-resultados');
let BotonverMas = document.querySelector('.ver-mas');
let contenedorTrending = document.getElementById('contenedor-trending');
let closeModal = document.querySelector('.close-modal');
let modal = document.getElementById('my-modal')
let modalContent = document.querySelector('.modal-content');
let userModal = document.querySelector('.user-modal');
let tituloModal = document.querySelector('.titulo-modal');
let apikey = '6x6TFFQi4OLI4Pcck6jI1rx6qMnZG7Rx1';
let ids = '';
let index = 0;
let suma = 12;
let misGifos;


const getGifsById = async (id) => {
    try {
        let url = `https://api.giphy.com/v1/gifs?api_key=23DdXlqxN1Jjk8o8wO7TLcPhm4Uxv2e1&ids=${id}`;
        let resp = await fetch(url);
        let data = await resp.json()
        if (data.meta.status == 200) {
            return data
        } else {
            throw new Error(`error en el estatus numero :${data.meta.status}`)
        }
    } catch (err) {
        console.log(err)
    }

}

//Agregar gifs al HTML 
const dibujarMisGifos = (user, gif, id) => {
    const html = `
     <div class="gift"> 
    <div class="contenedor-info-tools">
        <div class="tools">
           <div class="icon-tools">
               <div class="icon-eliminar"></div>
                <div class="icon-descargar"></div>
                <div class="icon-escalar"></div>
            </div>
        </div>
        <div class="informacion">
            <h2 class="user">${user}</h2>
            <p class="gift-titulo">mi gif!</p>
        </div>
    </div>
       <img  class="imagen" id="${id}" src="${gif}" alt="gif animado">
    
   
</div>`

    let div = document.createElement('div');
    div.classList.add('contenedor');
    div.innerHTML = html;
    contenedorResultados.appendChild(div)
}


const dibujarTrending = (url, usuario, decripcion, alt, id) => {
    const html = ` 
     <div class="gift"> 
    <div class="contenedor-info-tools">
        <div class="tools">
           <div class="icon-tools">
            <div class="icon-favorito"></div>
            <div class="icon-descargar"></div>
            <div class="icon-escalar "></div>
            </div>
        </div>
        <div class="informacion">
            <h2 class="user">${usuario}</h2>
            <p class="gift-titulo">${decripcion}</p>
        </div>
    </div>
       <img  class="imagen "  id="${id}" src="${url}" alt="${alt}" >
    
   
</div>`
    let div = document.createElement('div')
    div.classList.add('contenedor-gifos');
    div.innerHTML = html
    contenedorTrending.append(div)

}



const getLocalStoragesIds = () => {
    if (localStorage.getItem('mis gifos')) {
        misGifos = JSON.parse(localStorage.getItem('mis gifos'));
        for (let i = 0; i < misGifos.length; i++) {
            if (i < misGifos.length - 1) {
                ids += `${misGifos[i]},`
            } else {
                ids += `${misGifos[i]}`

            }
        }

    } else {
        misGifos = [];
    }
}

//Agregar mas gifs
const verMas = (data) => {
    if (data.length > 12) {
        BotonverMas.style.display = 'block'
        BotonverMas.addEventListener('click', () => {
            suma += 12
            index += 12;
            console.log(suma)
            console.log(index)
            if (suma <= data.length) {

                for (let i = index; i < suma; i++) {
                    let user = data[i].username;
                    let gifo = data[i].images.downsized.url;
                    let id = data[i].id;
                    dibujarMisGifos(user, gifo, id)
                }
                eliminarFavorito()
                maxMinPicture()
                descargarGifos()
                aggFavorito()

            } else if (suma >= data.length) {
                for (let i = index; i < data.length; i++) {
                    let user = data[i].username;
                    let gifo = data[i].images.downsized.url;
                    let id = data[i].id;
                    dibujarMisGifos(user, gifo, id)
                }
                BotonverMas.style.display = 'none'
                suma = 12;
                index = 0;
                eliminarFavorito()
                maxMinPicture()
                descargarGifos()
                aggFavorito()



            }
        })
    } else {
        BotonverMas.style.display = 'none'

    }

}

// Eliminar gifs
const eliminarFavorito = () => {
    let iconEliminar = document.querySelectorAll('.icon-eliminar');
    iconEliminar.forEach((icon) => {
        icon.addEventListener('click', () => {
            const hijo = icon.parentElement.parentElement.parentElement.parentElement.parentElement;
            const padre = hijo.parentNode
            let miId = icon.parentElement.parentElement.parentElement.parentElement.lastElementChild.id;
            console.log(miId)
            let nuevoMisGifos = misGifos.filter((i) => i != miId)
            misGifos = nuevoMisGifos;
            localStorage.setItem('mis gifos', JSON.stringify(misGifos));
            padre.removeChild(hijo)

            if (contenedorResultados.children.length == 0 && misGifos.length > 0) {
                BotonverMas.style.display = 'block';
                getLocalStoragesIds()
                getGifsById(ids).then(resp => {
                    let data = resp.data;
                    if (misGifos.length > 12) {
                        for (let i = 0; i < 12; i++) {
                            let user = data[i].username;
                            let gifo = data[i].images.downsized.url;
                            let id = data[i].id;
                            dibujarMisGifos(user, gifo, id)

                        }

                        eliminarFavorito()
                    } else {
                        for (let i = 0; i < misGifos.length; i++) {
                            let user = data[i].username;
                            let gifo = data[i].images.downsized.url;
                            let id = data[i].id;
                            dibujarMisGifos(user, gifo, id)

                        }
                        eliminarFavorito()
                    }
                })



            } else if (contenedorResultados.children.length == 0) {
                BotonverMas.style.display = 'none'

            }
        })
    })
}


const trendingGifos = async (limite) => {
    try {
        let url = `https://api.giphy.com/v1/gifs/trending?api_key=${apikey}&limit=${limite}`
        let resp = await fetch(url);
        let data = await resp.json()
        if (data.meta.status == 200) {
            return data
        } else {
            throw new Error(`error en el estatus numero :${data.meta.status}`)
        }
    } catch (err) {
        console.log(err)
    }

}
trendingGifos().then((resp) => {
    let data = resp.data;
    data.forEach((gif) => {
        let imgUrl = gif.images.downsized.url;
        let usuario = gif.username;
        let titulo = gif.title;
        let id = gif.id;
        if (usuario == '') {
            usuario = 'unknown user'
        } else if (gif.title == '') {
            titulo = ''
        }
        dibujarTrending(imgUrl, usuario, titulo, titulo, id)
    })
    maxMinPicture()
    descargarGifos()
    aggFavorito()


})



getLocalStoragesIds();


getGifsById(ids).then(resp => {
    let data = resp.data;
    if (data.length > 0 && data.length < 12) {
        for (let i = 0; i < data.length; i++) {
            let user = data[i].username;
            let gifo = data[i].images.downsized.url;
            let id = data[i].id;

            dibujarMisGifos(user, gifo, id)

        }
        eliminarFavorito()
    } else if (data.length >= 12) {
        for (let i = 0; i < 12; i++) {
            let user = data[i].username;
            let gifo = data[i].images.downsized.url;
            let id = data[i].id;
            dibujarMisGifos(user, gifo, id)

        }
        eliminarFavorito()
    }
    if (contenedorResultados.children.length > 0) {
        contenedorSinResultados.style.display = 'none';
    } else {
        contenedorSinResultados.style.display = 'block';

    }
    verMas(data)
    aggFavorito()
    maxMinPicture()
    descargarGifos()
})


if (contenedorResultados.children.length == 0) {
    BotonverMas.style.display = 'none'
} else {
    BotonverMas.style.display = 'flex'

}
const evento = () => {

    //TRENDING
    const buttonL1 = document.querySelector('.sliderLeft');
    const buttonR1 = document.querySelector('.sliderRight');

    buttonL1.addEventListener('click', function (event) {
        contenedorTrending.scrollLeft -= 350;
    });

    buttonR1.addEventListener('click', function (event) {
        contenedorTrending.scrollLeft += 350;

    });


}
evento();