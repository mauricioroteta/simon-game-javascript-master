const juego = () => {
    const sleep = m => new Promise(r => setTimeout(r, m));
    const cargarSonido = function (fuente) {
        const sonido = document.createElement("audio");
        sonido.src = fuente;
        sonido.setAttribute("preload", "auto");
        sonido.setAttribute("controls", "none");
        sonido.style.display = "none";
        document.body.appendChild(sonido);
        return sonido;
    }
    
    // Cantodad de intentos 
    const intentos = 10;

    const partidoEn16 = (Math.PI * 2) / 16;
    const centroX = 200, centroY = 200;
    const radioCirculo = 160;
    const radioCuarto = 170;
    const radioCirculoCentral = 80;
    const distancia = 10;
    const gamma = 2;
    const milisegundosCpu = 200,
        milisegundosUsuario = 100;
    const sonidoSuperiorIzquierda = cargarSonido("1.mp3"),
        sonidoSuperiorDerecha = cargarSonido("2.mp3"),
        sonidoInferiorIzquierda = cargarSonido("3.mp3"),
        sonidoInferiorDerecha = cargarSonido("4.mp3");

    let puedeJugar = false;
    let contador = 0;
    let puntaje = 0;
    let secuencia = [];

    const verde = d3.color("#1B5E20"),
        rojo = d3.color("#B71C1C"),
        amarillo = d3.color("#F9A825"),
        azul = d3.color("#0D47A1"),
        negro = d3.color("#212121");


    const circuloFondo = d3.arc()
        .innerRadius(0)
        .outerRadius(radioCirculo)
        .startAngle(0)
        .endAngle(Math.PI * 2);

    const circuloCentral = d3.arc()
        .innerRadius(0)
        .outerRadius(radioCirculoCentral)
        .startAngle(0)
        .endAngle(Math.PI * 2);

    const $svg = d3.select("#contenedorJuego")
        .append("svg")
        .attr('width', 400)
        .attr('height', 400);

    $svg.append("g")
        .attr("transform", `translate(${centroX},${centroY})`)
        .append("path")
        .attr("d", circuloFondo)
        .attr("fill", negro);


    const superiorIzquierda = $svg.append("g")
        .attr("transform", `translate(${centroX - distancia},${centroY - distancia})`)
        .attr("class", "boton")
        .append("path")
        .attr("d",
            d3.arc()
                .innerRadius(0)
                .outerRadius(radioCuarto)
                .startAngle(partidoEn16 * 12)
                .endAngle(partidoEn16 * 16)
        )
        .attr("fill", verde);


    const superiorDerecha = $svg.append("g")
        .attr("transform", `translate(${centroX + distancia},${centroY - distancia})`)
        .attr("class", "boton")
        .append("path")
        .attr("d",
            d3.arc()
                .innerRadius(0)
                .outerRadius(radioCuarto)
                .startAngle(0)
                .endAngle(partidoEn16 * 4)
        )
        .attr("fill", rojo);
        
    const inferiorIzquierda = $svg.append("g")
        .attr("transform", `translate(${centroX - distancia},${centroY + distancia})`)
        .attr("class", "boton")
        .append("path")
        .attr("d",
            d3.arc()
                .innerRadius(0)
                .outerRadius(radioCuarto)
                .startAngle(partidoEn16 * 8)
                .endAngle(partidoEn16 * 12)
        )
        .attr("fill", amarillo);

    const inferiorDerecha = $svg.append("g")
        .attr("transform", `translate(${centroX + distancia},${centroY + distancia})`)
        .attr("class", "boton")
        .append("path")
        .attr("d",
            d3.arc()
                .innerRadius(0)
                .outerRadius(radioCuarto)
                .startAngle(partidoEn16 * 4)
                .endAngle(partidoEn16 * 8)
        )
        .attr("fill", azul);

    // Encima de los otros círculos, el círculo central
    $svg.append("g")
        .attr("transform", `translate(${centroX},${centroY})`)
        .append("path")
        .attr("d", circuloCentral)
        .attr("fill", negro);

    const textoPuntaje = $svg.append("text")
        .attr("transform", `translate(${centroX},${centroY})`)
        .attr("fill", "#ffffff")
        .attr("font-size", 30)
        .attr("font-weight", "bold")
        .attr("font-family", "Courier")
        .style("text-anchor", "middle")
        .style("dominant-baseline", "central")
        .text("0")
    const encenderYApagarBoton = async (boton, duracion) => {
        puedeJugar = false;
        const colorActual = boton.attr("fill");
        let sonidoQueSeReproduce;
        if (compararBotones(boton, superiorIzquierda)) {
            sonidoQueSeReproduce = sonidoSuperiorIzquierda;
        } else if (compararBotones(boton, superiorDerecha)) {
            sonidoQueSeReproduce = sonidoSuperiorDerecha;
        } else if (compararBotones(boton, inferiorIzquierda)) {
            sonidoQueSeReproduce = sonidoInferiorIzquierda
        } else {
            sonidoQueSeReproduce = sonidoInferiorDerecha;
        }
        sonidoQueSeReproduce.currentTime = 0;
        await sonidoQueSeReproduce.play();
        boton.attr("fill", d3.color(colorActual).brighter(gamma))
        await sleep(duracion);
        boton.attr("fill", d3.color(colorActual));
        await sleep(duracion);
        await sonidoQueSeReproduce.pause();
        puedeJugar = true;
    };
    const reproducirSecuencia = async secuencia => {
        for (const boton of secuencia) {
            await encenderYApagarBoton(boton, milisegundosCpu);
        }
    };
    const botones = [superiorIzquierda, superiorDerecha, inferiorIzquierda, inferiorDerecha];
    const aleatorioDeArreglo = arreglo => arreglo[Math.floor(Math.random() * arreglo.length)];
    const agregarBotonAleatorioASecuencia = secuencia => secuencia.push(aleatorioDeArreglo(botones));
    const compararBotones = (boton, otroBoton) => {
        return boton.attr("fill") === otroBoton.attr("fill");
    };
    const compararSecuenciaDeUsuarioConOriginal = (secuenciaOriginal, botonDeUsuario, indice) => {
        return compararBotones(secuenciaOriginal[indice], botonDeUsuario);
    };
    const refrescarPuntaje = puntaje => textoPuntaje.text(puntaje.toString());
    const reiniciar = () => {
        secuencia = [];
        puedeJugar = false;
        contador = puntaje = 0;
        refrescarPuntaje(puntaje);
    }
    

    botones.forEach(boton => {
        boton.on("click", async () => {
            if (!puedeJugar) {
                console.log("No puedes jugar ._.");
                return;
            }
            puedeJugar = false;
            const ok = compararSecuenciaDeUsuarioConOriginal(secuencia, boton, contador);
            if (ok) {
                await encenderYApagarBoton(boton, milisegundosUsuario);
                if (contador >= secuencia.length - 1) {
                    puntaje++;
                    refrescarPuntaje(puntaje);
                    await sleep(500);
                    await turnoDelCpu();
                } else {
                }
                puedeJugar = true;
            } else {

                $btnComenzar.disabled = false;
                Swal.fire("Perdiste", `Has perdido. Tu puntuación fue de ${puntaje}. Gracias por Jugar con La Perseverancia Seguros!`);
            }
        });
    });

    const turnoDelCpu = async () => {
        if (puntaje == intentos){
            //Swal.fire("GANASTE!", `Has Ganado. Llegaste a ${puntaje}. Puedes jugar de nuevo cuando quieras`);
            Swal.fire({
                title: "¡Ganaste!",
                html: `
            <img class="img-fluid" src="./img/ganaste.png" alt="Ganaste">
            <p class="h4">Muy bien hecho</p>
            <p class="h4">Gracias por jugar con Nosotros!</p>`,
                confirmButtonAriaLabel: "Jugar de nuevo",
                allowOutsideClick: false,
                allowEscapeKey: false,
            })
            reiniciar();
            $btnComenzar.disabled = false;
        } else
        {
            puedeJugar = false;
            agregarBotonAleatorioASecuencia(secuencia);
            await reproducirSecuencia(secuencia);
            contador = 0;
            puedeJugar = true;
        }
    }

    const $btnComenzar = document.querySelector("#comenzar");
    $btnComenzar.addEventListener("click", () => {
        $btnComenzar.disabled = true;
        reiniciar();
        turnoDelCpu();
    });


    const guardarPuntaje = (nombre, puntaje) => {
        let puntajes = JSON.parse(localStorage.getItem('puntajes')) || [];
        puntajes.push({ nombre, puntaje });
        puntajes.sort((a, b) => b.puntaje - a.puntaje);
        if (puntajes.length > 10) {
            puntajes = puntajes.slice(0, 10);
        }
        localStorage.setItem('puntajes', JSON.stringify(puntajes));
        actualizarTablaPuntajes();
    };

    // Actualizar la tabla de puntajes
    const actualizarTablaPuntajes = () => {
        const puntajes = JSON.parse(localStorage.getItem('puntajes')) || [];
        const tabla = document.getElementById('tablaPuntajes').getElementsByTagName('tbody')[0];
        tabla.innerHTML = ''; // Limpiar tabla
        puntajes.forEach((item, index) => {
            const fila = tabla.insertRow();
            const celdaPosicion = fila.insertCell(0);
            const celdaNombre = fila.insertCell(1);
            const celdaPuntaje = fila.insertCell(2);
            celdaPosicion.textContent = index + 1;
            celdaNombre.textContent = item.nombre;
            celdaPuntaje.textContent = item.puntaje;
        });
    };

    // Función que se ejecuta cuando el jugador pierde
    const perder = () => {
        Swal.fire("Perdiste", `Has perdido. Tu puntuación fue de ${puntaje}. Gracias por Jugar con La Perseverancia Seguros!`);

        $btnComenzar.disabled = false;
    };

    // Reemplazar el mensaje de pérdida en el código existente
    botones.forEach(boton => {
        boton.on("click", async () => {
            if (!puedeJugar) return;
            puedeJugar = false;
            const ok = compararSecuenciaDeUsuarioConOriginal(secuencia, boton, contador);
            if (ok) {
                await encenderYApagarBoton(boton, milisegundosUsuario);
                if (contador >= secuencia.length - 1) {
                    puntaje++;
                    refrescarPuntaje(puntaje);
                    await sleep(500);
                    await turnoDelCpu();
                } else {
                    contador++;
                }
                puedeJugar = true;
            } else {
                perder();
            }
        });
    });

    // Inicializar puntajes y tabla
    actualizarTablaPuntajes();

}
Swal.fire("Bienvenido", `Comienza a jugar con La Perseverancia Seguros!`)
    .then(juego)