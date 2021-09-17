let contenedorResultados = document.querySelector(".contenedor-resultados");
let contenedorSinResultados = document.querySelector(".sin-resultados");
let contenedorTrending = document.getElementById("contenedor-trending");
let BotonverMas = document.querySelector(".ver-mas");
let closeModal = document.querySelector(".close-modal");
let modal = document.getElementById("my-modal");
let modalContent = document.querySelector(".modal-content");
let userModal = document.querySelector(".user-modal");
let tituloModal = document.querySelector(".titulo-modal");
let tituloFavoritos = document.querySelector(".titulo-fav");
let apikey = "6x6TFFQi4OLI4Pcck6jI1rx6qMnZG7Rx";
let favoritos;
let suma = 12;
let index = 0;

//Crear favoritos
const dibujarFavoritos = (user, descripcion, gif, id) => {
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
            <p class="gift-titulo">${descripcion}</p>
        </div>
    </div>
       <img  class="imagen" id="${id}" src="${gif}" alt="${descripcion}">
    
   
</div>`;

    let div = document.createElement("div");
    div.classList.add("contenedor");
    div.innerHTML = html;
    contenedorResultados.appendChild(div);
};
//Pinta los gifs dentro del HTML
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
    
   
</div>`;
    let div = document.createElement("div");
    div.classList.add("contenedor-gifos");
    div.innerHTML = html;
    contenedorTrending.append(div);
};

const llamarFavoritos = () => {
    if (localStorage.getItem("favoritos")) {
        favoritos = JSON.parse(localStorage.getItem("favoritos"));
        if (favoritos.length > 0 && favoritos.length < 12) {
            for (let i = 0; i < favoritos.length; i++) {
                let user = favoritos[i].user;
                let descripcion = favoritos[i].descripcion;
                let gifo = favoritos[i].gif;
                let id = favoritos[i].id;
                dibujarFavoritos(user, descripcion, gifo, id);
            }
            eliminarFavorito();
        } else if (favoritos.length > 12) {
            for (let i = 0; i < 12; i++) {
                let user = favoritos[i].user;
                let descripcion = favoritos[i].descripcion;
                let gifo = favoritos[i].gif;
                let id = favoritos[i].id;
                dibujarFavoritos(user, descripcion, gifo, id);
            }

            eliminarFavorito();
            maxMinPicture();
            descargarGifos();
            aggFavorito();
        }
    }
    verMas();
};

const event = () => {
    //TRENDING
    const buttonL = document.querySelector(".sliderLeft");
    const buttonR = document.querySelector(".sliderRight");

    buttonL.addEventListener("click", function (event) {
        contenedorTrending.scrollLeft -= 350;
    });

    buttonR.addEventListener("click", function (event) {
        contenedorTrending.scrollLeft += 350;
    });
};
event();

// Agregar mas gifs con el boton Ver Mas
const verMas = () => {
    if (favoritos.length > 12) {
        BotonverMas.style.display = "block";
        BotonverMas.addEventListener("click", () => {
            suma += 12;
            index += 12;
            if (suma <= favoritos.length) {
                for (let i = index; i < suma; i++) {
                    let user = favoritos[i].user;
                    let descripcion = favoritos[i].descripcion;
                    let gifo = favoritos[i].gif;
                    let id = favoritos[i].id;
                    dibujarFavoritos(user, descripcion, gifo, id);
                }
                eliminarFavorito();
            } else if (suma >= favoritos.length) {
                for (let i = index; i < favoritos.length; i++) {
                    let user = favoritos[i].user;
                    let descripcion = favoritos[i].descripcion;
                    let gifo = favoritos[i].gif;
                    let id = favoritos[i].id;
                    dibujarFavoritos(user, descripcion, gifo, id);
                }
                BotonverMas.style.display = "none";
                suma = 12;
                index = 0;
                eliminarFavorito();
                maxMinPicture();
                descargarGifos();
                aggFavorito();
            }
        });
    } else {
        BotonverMas.style.display = "none";
    }
};

//Eliminar Gif de favoritos
const eliminarFavorito = () => {
    let iconEliminar = document.querySelectorAll(".icon-eliminar");
    iconEliminar.forEach((icon) => {
        icon.addEventListener("click", () => {
            const hijo =
                icon.parentElement.parentElement.parentElement.parentElement
                .parentElement;
            console.log(hijo);
            const padre = hijo.parentNode;
            let url =
                icon.parentElement.parentElement.parentElement.parentElement
                .lastElementChild.src;
            let nuevoFavoritos = favoritos.filter((i) => i.gif != url);
            favoritos = nuevoFavoritos;
            localStorage.setItem("favoritos", JSON.stringify(favoritos));
            padre.removeChild(hijo);

            if (contenedorResultados.children.length == 0 && favoritos.length > 0) {
                BotonverMas.style.display = "block";
                if (favoritos.length > 12) {
                    for (let i = 0; i < 12; i++) {
                        let user = favoritos[i].user;
                        let descripcion = favoritos[i].descripcion;
                        let gifo = favoritos[i].gif;
                        let id = favoritos[i].id;
                        dibujarFavoritos(user, descripcion, gifo, id);
                    }

                    eliminarFavorito();
                    maxMinPicture();
                    descargarGifos();
                    aggFavorito();
                } else {
                    for (let i = 0; i < favoritos.length; i++) {
                        let user = favoritos[i].user;
                        let descripcion = favoritos[i].descripcion;
                        let gifo = favoritos[i].gif;
                        let id = favoritos[i].id;
                        dibujarFavoritos(user, descripcion, gifo, id);
                    }
                    eliminarFavorito();
                    maxMinPicture();
                    descargarGifos();
                    aggFavorito();
                }
            } else if (contenedorResultados.children.length == 0) {
                BotonverMas.style.display = "none";
            }
        });
    });
};

const ocultarDivs = () => {
    if (contenedorResultados.children.length > 0) {
        contenedorSinResultados.style.display = "none";
    } else {
        contenedorSinResultados.style.display = "block";
        BotonverMas.style.display = "none";
    }
};

const trendingGifos = async (limite) => {
    try {
        let url = `https://api.giphy.com/v1/gifs/trending?api_key=${apikey}&limit=${limite}`;
        let resp = await fetch(url);
        let data = await resp.json();
        if (data.meta.status == 200) {
            return data;
        } else {
            throw new Error(`error en el estatus numero :${data.meta.status}`);
        }
    } catch (err) {
        console.log(err);
    }
};
trendingGifos().then((resp) => {
    let data = resp.data;
    data.forEach((gif) => {
        let imgUrl = gif.images.downsized.url;
        let usuario = gif.username;
        let titulo = gif.title;
        let id = gif.id;
        if (usuario == "") {
            usuario = "unknown user";
        } else if (gif.title == "") {
            titulo = "";
        }
        dibujarTrending(imgUrl, usuario, titulo, titulo, id);
    });
    maxMinPicture();
    descargarGifos();
    aggFavorito();
});

closeModal.addEventListener("click", () => {
    if (!iconModalFav.classList.contains("actived")) {
        let source = closeModal.nextElementSibling.firstElementChild.src;
        for (let i = 0; i < contenedorResultados.children.length; i++) {
            let src =
                contenedorResultados.children[i].firstElementChild.firstElementChild
                .nextElementSibling.src;
            if (src == source) {
                let hijo = contenedorResultados.children[i];
                let padre = hijo.parentNode;
                padre.removeChild(hijo);
            }
        }
    }
});

llamarFavoritos();
ocultarDivs();