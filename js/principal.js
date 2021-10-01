let inputBuscador = document.querySelector('.input-buscador');
let modal = document.getElementById('my-modal');
let modalContent = document.querySelector('.modal-content')
let closeModal = document.querySelector('.close-modal');
let buscador = document.getElementById('buscador');
let crear = document.getElementById('crear-gifo');
let menu = document.getElementById('menu');
let contenedorTrending = document.getElementById('contenedor-trending');
let left = document.getElementById('left');
let right = document.getElementById('right');
let informacionModal = document.querySelector('.informacion');
let contenedorResultados = document.querySelector('.contenedor-resultados');
let lupa = document.querySelector('.icon-serch-right');
let verMas = document.querySelector('.ver-mas');
let btnCancel = document.querySelector('.btn-cancel');
let iconSearchLeft = document.querySelector('.icon-serch-left');
let tituloBuqueda = document.querySelector('.titulo-busqueda');
let iconSinResultado = document.querySelector('.sin-resultado');
let txtSinResultado = document.getElementById('txt-sin-resultado');
let trendingTitle = document.querySelector('.trending-titulo');
let trendingTxt = document.querySelector('.contenedor-texto-trending');
let bordeResultados = document.querySelector('.borde');
let contenedorSugerencias = document.querySelector('.contenedor-sugerencias');
let userModal = document.querySelector('.user-modal');
let tituloModal = document.querySelector('.titulo-modal');
let trendContainer = document.querySelector('.trendContainer');
let contenedorGifos = document.getElementsByClassName('contenedor-gifos');
let apikey = '6x6TFFQi4OLI4Pcck6jI1rx6qMnZG7Rx';
let favoritos = [];
let suma = 12;
let index = 0;
let y;

//Pinta las sugerencias de busqueda
const dibujarSugerencias = (sugerencia) => {
    const html = `
    <div class="sugerencia-img">
     <div></div>
   </div>
  <div class="sugerencia-descripcion">
   <p class="descripcion">${sugerencia}</p> 
  </div>
 `
    let div = document.createElement('div');
    div.classList.add('sugerencia');
    div.innerHTML = html;
    contenedorSugerencias.append(div)
}


const trendingTerm = async () => {
    try {
        let url = `https://api.giphy.com/v1/trending/searches?api_key=${apikey}`;
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

//Agrego al HTML los terminos de sugerencia
const dibujarTrendingTerms = (termino) => {
    const html = `<p class = "texto-trending trendingItem">${termino}</p>`;
    let div = document.createElement('div')
    div.classList.add('trendContainer')
    div.innerHTML = html;
    trendingTxt.append(div)

}

const llamarTrendingTerm = () => {
    trendingTerm().then(resp => {
        let data = resp.data;
        for (let i = 0; i < 5; i++) {
            dibujarTrendingTerms(`  ${data[i]}`)

        }

        let trendingTerm = document.querySelectorAll('.trendingItem')
        trendingTerm.forEach((term) => {
            term.addEventListener('click', () => {
                llamarBusqueda(term.textContent)
                inputBuscador.value = term.textContent;
            })
        })
    })
}

//Autocompletar la busqueda 
const autoCompletar = async (word) => {
    try {
        let url = `https://api.giphy.com/v1/gifs/search/tags?api_key=${apikey}&q=${word}`;
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


const llamarAutoCompletar = (palabra) => {
    if (inputBuscador.value == '') {
        eliminarSugerencias();
        contenedorSugerencias.style.display = 'none'

    }
    if (inputBuscador.value.length > 0) {
        autoCompletar(palabra).then((resp) => {
            let data = resp.data;
            eliminarSugerencias()
            contenedorSugerencias.style.display = 'none'
             if (body.className==='dark'){
                lupa.style.background="url('/assets/close-modo-noct.svg') no-repeat"
            }
            else{
                lupa.style.background= "url('/assets/close.svg') no-repeat" 
            }
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    dibujarSugerencias(data[i].name)
                }
                contenedorSugerencias.style.display = 'block';
                let sugerencia = document.querySelectorAll('.sugerencia-descripcion');
                sugerencia.forEach((sug) => {
                    sug.addEventListener('click', () => {

                        eliminarSugerencias()
                        inputBuscador.value = sug.firstElementChild.textContent
                        contenedorSugerencias.style.display = 'none';
                        resolveSerachPeticion(sug.firstElementChild.textContent)
                        verMas.disabled = false;

                    })
                })
            }
        }).catch(err => {
            console.log(err)
        })
    }
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


//Pinta cada gif en el HTML
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
    </div>
`
    let div = document.createElement('div')
    div.classList.add('contenedor-gifos');
    div.innerHTML = html
    contenedorTrending.append(div)
    contenedorTrending.insertBefore(div, right)
}


//Agregar buscador en la parte superior izquierda
const menuSticky = () => {
    window.onscroll = function () {
        y = window.scrollY;
        console.log(y)
        let ejeY = Math.round(y)
        let pantalla = window.screen.width;
        if (ejeY > 450 && pantalla > 968 && pantalla < 1200) {
            buscador.style.position = 'fixed';
            buscador.style.top = '0';
            buscador.style.left = '0';
            buscador.style.maxWidth = '200px'
            buscador.style.transform = 'translate(150px,25px)';
            buscador.style.transition = '0.5s ease all';
            contenedorSugerencias.style.display = 'none'




        } else if (ejeY > 400 && pantalla >= 1200) {
            buscador.style.maxWidth = '350px'
            buscador.style.transform = 'translate(250px,25px)'
            buscador.style.position = 'fixed';
            buscador.style.top = '0';
            buscador.style.left = '0';
            buscador.style.transition = '0.5s ease all';
            contenedorSugerencias.style.display = 'none'


        } else if (ejeY < 400) {
            buscador.style.position = 'static'
            buscador.style.maxWidth = '600px'
            buscador.style.transform = 'translate(0)';
            buscador.style.transition = '0.5s ease all';


        }

    }
}


const eventos = () => {

    //Buscar con la lupa
    lupa.addEventListener('click', () => {
        eliminarSugerencias()
        contenedorSugerencias.style.display = 'none'
        resolveSerachPeticion(inputBuscador.value)
    })
    //Buscar con enter
    inputBuscador.addEventListener('keyup', (event) => {
        llamarAutoCompletar(inputBuscador.value)
        if (event.keyCode === 13) {
            resolveSerachPeticion(inputBuscador.value)
        }
        if (inputBuscador.value == '') {
            tituloBuqueda.textContent = inputBuscador.value;
            iconSinResultado.style.display = 'none';
            txtSinResultado.style.display = 'none';
            bordeResultados.style.display = 'none';

        }
    })

    btnCancel.addEventListener('click', () => {
        cancelarBuqueda()
    })
    verMas.addEventListener('click', () => {
        aggMasGifs()
    })

    //TRENDING
    const buttonL = document.querySelector('.sliderLeft');
    const buttonR = document.querySelector('.sliderRight');

    buttonL.addEventListener('click', function (event) {
        contenedorTrending.scrollLeft -= 350;
    });

    buttonR.addEventListener('click', function (event) {
        contenedorTrending.scrollLeft += 350;
    });


}



//Sugerencias de busqueda
const sugerencias = async (sugerencia) => {
    try {
        let url = `https://api.giphy.com/v1/tags/related/{${sugerencia}}?api_key=${apikey}`;
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

const llamarSugerencias = (palabra) => {
    eliminarSugerencias()
    sugerencias(palabra).then((resp) => {
        let data = resp.data;
        if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                let sug = data[i].name
                dibujarSugerencias(sug)
            }
            contenedorSugerencias.style.display = 'block'

            let sugerencia = document.querySelectorAll('.sugerencia-descripcion');
            sugerencia.forEach((sug) => {
                sug.addEventListener('click', () => {
                    eliminarSugerencias()
                    eliminarDivs()
                    inputBuscador.value = sug.firstElementChild.textContent
                    contenedorSugerencias.style.display = 'none';

                    resolveSerachPeticion(sug.firstElementChild.textContent)
                    verMas.disabled = false;
                })
            })
        }
    }).catch(err => {
        console.log(err)
    })

}

//Buscar gift por palabra clave
const BuscarGifs = async (word) => {

    try {
        let url = `https://api.giphy.com/v1/gifs/search?api_key=${apikey}&q=${word}`;
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

const llamarBusqueda = (palabra) => {
    BuscarGifs(palabra).then((resp) => {
        let data = resp.data;
        if (data.length > 0 && data.length > 12) {
            btnCancel.style.display = 'block';
            lupa.style.display = 'none'
            verMas.style.display = 'block';
            iconSearchLeft.style.display = 'block'
            tituloBuqueda.style.display = 'block'
            tituloBuqueda.textContent = inputBuscador.value;
            iconSinResultado.style.display = 'none';
            txtSinResultado.style.display = 'none';
            bordeResultados.style.display = 'block';
            trendingTxt.style.display = 'none';
            trendingTitle.style.display = 'none'
            inputBuscador.disabled = true;
            contenedorSugerencias.style.display = 'none';
            for (let i = 0; i < 12; i++) {
                let imgUrl = data[i].images.downsized.url;
                let imagenes = data[i].images


                let usuario = data[i].username;
                let titulo = data[i].title;
                let id = data[i].id;
                if (usuario == '') {
                    usuario = 'unknown user'
                } else if (data[i].title == '') {
                    titulo = ''
                }
                dibujarBusqueda(imgUrl, usuario, titulo, id)
            }
            maxMinPicture()
            descargarGifos()
            eliminarSugerencias()
            llamarSugerencias(palabra)
            aggFavorito()

        } else if (data.length < 12 && data.length > 0) {
            btnCancel.style.display = 'block';
            lupa.style.display = 'none'
            verMas.style.display = 'block';
            iconSearchLeft.style.display = 'block'
            tituloBuqueda.style.display = 'block'
            tituloBuqueda.textContent = inputBuscador.value;
            iconSinResultado.style.display = 'none';
            txtSinResultado.style.display = 'none';
            bordeResultados.style.display = 'block';
            trendingTxt.style.display = 'none';
            trendingTitle.style.display = 'none'
            inputBuscador.disabled = true;
            contenedorSugerencias.style.display = 'none';


            for (let i = 0; i < data.length; i++) {
                let imgUrl = data[i].images.downsized.url;
                let usuario = data[i].username;
                let titulo = data[i].title;
                if (usuario == '') {
                    usuario = 'unknown user'
                } else if (data[i].title == '') {
                    titulo = ''
                }
                dibujarBusqueda(imgUrl, usuario, titulo)
            }

            maxMinPicture()
            descargarGifos()
            eliminarSugerencias()
            sugerencias(palabra)
            aggFavorito()

        } else {
            tituloBuqueda.style.display = 'block';
            tituloBuqueda.textContent = inputBuscador.value;
            iconSinResultado.style.display = 'block';
            txtSinResultado.style.display = 'block';
            bordeResultados.style.display = 'block';
        }

    }).catch(err => {
        console.log(err)
    })
}

const resolveSerachPeticion = (palabra) => {
    if (inputBuscador.value != '') {
        llamarBusqueda(palabra)
    }
}


const dibujarBusqueda = (gif, usuario, titulo, id) => {
    const html = `  
    <div class="gift"> 
        <div class="contenedor-info-tools">
            <div class="tools">
               <div class="icon-tools">
                    <div class="icon-favorito "></div>
                    <div class="icon-descargar"></div>
                    <div class="icon-escalar"></div>
                </div>
            </div>
            <div class="informacion">
                <h2 class="user">${usuario}</h2>
                <p class="gift-titulo">${titulo}</p>
            </div>
        </div>
           <img  class="imagen" id="${id}" src="${gif}" alt="${titulo}">
        
       
    </div>
    `
    let div = document.createElement('div')
    div.classList.add('contenedor');
    div.innerHTML = html
    contenedorResultados.append(div)
}





//Cancelar busqueda
const cancelarBuqueda = () => {
    inputBuscador.value = ''
    trendingTxt.textContent = ''
    eliminarDivs()
    eliminarSugerencias()
    llamarTrendingTerm()

    lupa.style.display = 'block'
    btnCancel.style.display = 'none';
    inputBuscador.disabled = false;
    verMas.disabled = false;
    verMas.style.display = 'none'
    iconSearchLeft.style.display = 'none';
    tituloBuqueda.style.display = 'none';
    bordeResultados.style.display = 'none';
    trendingTxt.style.display = 'flex';
    trendingTitle.style.display = 'block';
    contenedorSugerencias.style.display = 'none';
}


const eliminarDivs = () => {
    for (let i = contenedorResultados.children.length - 1; i >= 0; i--) {
        let hijo = contenedorResultados.children[i];
        contenedorResultados.removeChild(hijo);
    }
}



const eliminarSugerencias = () => {
    for (let i = contenedorSugerencias.children.length - 1; i >= 0; i--) {
        let hijo = contenedorSugerencias.children[i];
        contenedorSugerencias.removeChild(hijo);
    }
}



const aggMasGifs = () => {
    if (inputBuscador.value != '') {
        BuscarGifs(inputBuscador.value).then((resp) => {
            let data = resp.data;
            suma += 12
            index += 12
            if (suma < data.length || data.length > 50) {
                for (let i = index; i < suma; i++) {
                    let imgUrl = data[i].images.downsized.url;
                    let usuario = data[i].username;
                    let titulo = data[i].title;
                    let id = data[i].id
                    if (usuario == '') {
                        usuario = 'unknown user'
                    } else if (data[i].title == '') {
                        titulo = ''
                    }
                    dibujarBusqueda(imgUrl, usuario, titulo, id)

                }
                aggFavorito()
                maxMinPicture()
                descargarGifos()


            } else if (suma > data.length) {
                verMas.disabled = true
                suma = data.length
                for (let i = index; i < suma; i++) {
                    let imgUrl = data[i].images.downsized.url;
                    let usuario = data[i].username;
                    let titulo = data[i].title;
                    let id = data[i].id
                    if (usuario == '') {
                        usuario = 'unknown user'
                    } else if (data[i].title == '') {
                        titulo = ''
                    }
                    dibujarBusqueda(imgUrl, usuario, titulo, id)

                }
                aggFavorito()
                maxMinPicture()
                descargarGifos()
                verMas.style.display = 'none'
                suma = 12;
                index = 0



            }



        })




    }

}

const init = () => {
    eventos()
    llamarTrendingTerm()
    menuSticky()
    inputBuscador.value = ''

}
init()
