const contenedorPreview = document.querySelector(".contenedor-preview");
const video = document.querySelector("video");
const btnComenzar = document.querySelector(".comenzar");
const steps = document.querySelectorAll(".step");
const contenidoUno = document.querySelector(".contenido");
const contenidoDos = document.querySelector(".contenido2");
const divGrabar = document.querySelector(".boton-grabar");
const btnGrabar = document.querySelector(".grabar");
const divFinalizar = document.querySelector(".boton-finalizar");
const btnFinalizar = document.querySelector(".finalizar");
const divUpload = document.querySelector(".boton-upload");
const btnUpload = document.querySelector(".upload");
const preview = document.querySelector(".preview");
const repeat = document.querySelector(".repeat");
const divTempo = document.querySelector(".tiempo");
const segundos = document.querySelector(".segundos");
const minutos = document.querySelector(".minutos");
const horas = document.querySelector(".horas");
const fondo = document.querySelector(".background");
const descargar = document.querySelector(".download");
const iconLink = document.querySelector(".link");
const iconLoading = document.querySelector(".loading");
const texto = document.querySelector(".text");
const APIKEY = "6x6TFFQi4OLI4Pcck6jI1rx6qMnZG7Rx";
let arregloIds = [];
let tiempo = new Date().getSeconds();
let segundo = 0;
let blob;
let timing;
let minuto = 0;
let hora = 0;
let recorder;
let stream;

// Funcion que sube el gif a giphy
const uploadGif = async (gif) => {
    try {
        let url = `https://upload.giphy.com/v1/gifs?api_key=${APIKEY}`;
        let resp = await fetch(url, {
            method: "POST",
            body: gif,
        });
        let data = await resp.json();
        if (data.meta.status == 200) {
            return data;
        } else {
            throw new Error(`${data.meta.status}`);
        }
    } catch (err) {
        console.log(err);
    }
};

const getUrl = async (id) => {
    try {
        let url = `https://api.giphy.com/v1/gifs/${id}?api_key=${APIKEY}`;
        let resp = await fetch(url);
        let data = await resp.json();
        if (data.meta.status == 200) {
            return data;
        } else {
            throw new Error(`${data.meta.status}`);
        }
    } catch (err) {
        console.log(err);
    }
};

//Obtengo el id del gif y lo guardo en LocalStorage
const guardarGifo = (id) => {
    if (localStorage.getItem("mis gifos")) {
        arregloIds = JSON.parse(localStorage.getItem("mis gifos"));
    } else {
        arregloIds = [];
    }
    arregloIds.push(id);
    localStorage.setItem("mis gifos", JSON.stringify(arregloIds));
};

//Muestra el tiempo de duracion del gif
const recordingTime = () => {
    segundo++;
    if (segundo < 60) {
        if (segundo < 10) {
            segundos.textContent = `0${segundo}`;
        } else {
            segundos.textContent = segundo;
        }
    } else {
        segundos.textContent = `00`;
        segundo = 0;
        minuto++;
        if (minuto < 60) {
            if (minuto < 10) {
                minutos.textContent = `0${minuto}:`;
            } else {
                minutos.textContent = `${minuto}:`;
            }
        } else {
            minutos.textContent = `00:`;
            minuto = 0;
            hora++;
            if (hora < 10) {
                horas.textContent = `0${hora}:`;
            } else {
                horas.textContent = `${hora}:`;
            }
        }
    }
};

//Permiso para utilizar la camara
const permisoCamara = () => {
    contenidoUno.style.display = "none";
    contenidoDos.style.display = "block";
    steps[0].classList.remove("step");
    steps[0].classList.add("step-actived");
    getMediaRecord();
};

const getMediaRecord = () => {
    let constraints = {
        video: {
            height: 370
        }
    };
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then((mediaStream) => {
            stream = mediaStream;
            video.srcObject = mediaStream;
            video.play();
            recorder = RecordRTC(mediaStream, {
                type: "gif",
                frameRate: 1,
                quality: 10,
                width: 360,
                hidden: 240,
                onGifRecordingStarted: () => {
                    console.log("started");
                    divTempo.style.display = "flex";
                    divFinalizar.style.display = "flex";
                    timing = setInterval(() => {
                        recordingTime();
                    }, 1000);
                },
            });

            video.style.display = "block";
            btnComenzar.style.display = "none";
            contenidoDos.style.display = "none";
            divGrabar.style.display = "flex";
            steps[0].classList.remove("step-actived");
            steps[0].classList.add("step");
            steps[1].classList.remove("step");
            steps[1].classList.add("step-actived");
        })
        .catch((err) => {
            console.log(err);
            steps[0].classList.remove("step-actived");
            steps[0].classList.add("step");
            contenidoDos.style.display = "none";
            contenidoUno.style.display = "block";
        });
};

const finalizarGrabacion = () => {
    recorder.stopRecording(() => {
        blob = recorder.getBlob();
        let track = stream.getTracks()[0].stop();
        let blobUrl = URL.createObjectURL(blob);
        preview.src = blobUrl;
        video.style.display = "none";
        contenedorPreview.style.display = "flex";
        clearInterval(timing);
    });
    divFinalizar.style.display = "none";
    divTempo.style.display = "none";
    divUpload.style.display = "flex";
    repeat.style.display = "block";
};

//Evento que inicia la grabacion
btnComenzar.addEventListener("click", permisoCamara);

btnGrabar.addEventListener("click", () => {
    recorder.startRecording();
    btnGrabar.style.display = "none";
});

// Evento que finaliza la grabacion
btnFinalizar.addEventListener("click", finalizarGrabacion);

btnUpload.addEventListener("click", () => {
    divUpload.style.display = "none";
    steps[2].classList.remove("step");
    steps[2].classList.add("step-actived");
    steps[1].classList.remove("step-actived");
    steps[1].classList.add("step");
    repeat.style.display = "none";
    fondo.style.display = "flex";
    let form = new FormData();
    form.append("file", recorder.getBlob(), "creado.gif");
    uploadGif(form).then((resp) => {
        let gifoId = resp.data.id;
        iconLoading.classList.add("ok");
        texto.classList.add("ok");
        texto.textContent = "GIFO subido con éxito";
        descargar.style.display = "block";
        iconLink.style.display = "block";
        setTimeout(() => {
            descargar.classList.add("ok");
            iconLink.classList.add("ok");
        }, 500);
        repeat.style.display = "block";
        repeat.textContent = "NUEVA GRABACION";
        guardarGifo(gifoId);
        getUrl(gifoId).then((respuesta) => {
            let urlGif = respuesta.data.url;
            iconLink.id = urlGif;
        });
    });
});

//Evento para repetir grabacion
repeat.addEventListener("click", () => {
    repeat.textContent = "REPETIR CAPTURA";
    window.location.reload();
});

iconLink.addEventListener("click", (event) => {
    let aux = document.createElement("input");
    aux.value = iconLink.id;
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
    alert("Link del Gif Copiado al Portapapeles");
    console.log;
});

/// Evento para descargar el gif
descargar.addEventListener("click", () => {
    invokeSaveAsDialog(blob);
});