//bloquea el boton derecho del ratón para que sea más difícil ver el código
document.oncontextmenu = () => false;
// Evento para comprobar el tamaño de la pantalla
window.addEventListener('resize', () => setTimeout(location.reload.bind(location), 200));

// Función para mostrar el mensaje correspondiente según el tamaño de la ventana
function displayMessage() {
    const titulo = document.getElementById('titulo');
    if (titulo.parentElement.clientWidth <= 800) {
        titulo.innerText += '\nMueve los coches';
    } else {
        titulo.innerText += '\nPulsar las teclas A,S y K,L';
    }
}

// Mostrar el mensaje al cargar la página
displayMessage();

//si pulsamos start, se inicia el juego
document.getElementById("start").addEventListener("click", function () {
    document.getElementById("fondo-inicio").style.display = 'none';//ocultamos el inicio
    document.getElementById("opacidad").style.display = 'none';//ocultamos la opacidad

    // Mover el coche con el dedo
    // Variables para almacenar los identificadores de dedo correspondientes a cada coche
    let fingerId1 = null;
    let fingerId2 = null;

    // Función para manejar el evento touchmove para coche1
    function moveCar(carId, event, fingerId) {
        event.preventDefault(); // Evitar el comportamiento predeterminado de scroll

        // Verificar si el coche puede moverse
        if ((carId === 'coche1' && !moverCoche1) || (carId === 'coche2' && !moverCoche2)) {
            return; // Si no puede moverse, salimos de la función
        }


        const coche = document.getElementById(carId);
        const contenedor = coche.parentElement;//Obtenemos una referencia al contenedor del coche, que es el elemento padre del coche.

        // Verificar si el dedo que se está moviendo coincide con el dedo que está asignado al coche1
        const touch = getTouchById(event, fingerId);
        if (!touch) return;

        //Realizamos cálculos para determinar la nueva posición del coche basada en la posición del dedo y del contenedor del coche.
        //Obtener el coche y su contenedor
        const cocheWidth = coche.offsetWidth;
        const contenedorWidth = contenedor.clientWidth;

        const contenedorRect = contenedor.getBoundingClientRect();
        let nuevaPosicionX = touch.clientX - cocheWidth / 2 - contenedorRect.left; // Ajuste para que el coche se quede en el centro
        newPosition = Math.max(0, Math.min(nuevaPosicionX, contenedorWidth - cocheWidth)); // Mantener dentro de los límites del contenedor
        coche.style.left = newPosition + 'px';
    }

    // Función para obtener el evento touch con un identificador específico
    //Esta función se utiliza para obtener el evento touch con un identificador específico. 
    //Iteramos sobre los eventos touch en event.changedTouches y devolvemos el evento que coincide con el identificador id.
    function getTouchById(event, id) {
        for (let i = 0; i < event.changedTouches.length; i++) {
            if (event.changedTouches[i].identifier === id) {
                return event.changedTouches[i];
            }
        }
        return null;
    }

    // Asignar los eventos touchmove al contenedor de cada coche
    document.getElementById('coche1').addEventListener('touchmove', function (event) {
        moveCar('coche1', event, fingerId1);
    });

    document.getElementById('coche2').addEventListener('touchmove', function (event) {
        moveCar('coche2', event, fingerId2);
    });

    // Función para manejar el evento touchstart para cada coche
    document.getElementById('coche1').addEventListener('touchstart', function (event) {
        fingerId1 = event.changedTouches[0].identifier;
    });

    document.getElementById('coche2').addEventListener('touchstart', function (event) {
        fingerId2 = event.changedTouches[0].identifier;
    });

    let ultimaActualizacion = null; // Último tiempo de actualización
    let idAnimacion;


    //timestamp representa el tiempo en milisegundos en el que se está ejecutando la función moverElementos.
    function moverElementos(timestamp) {
        if (!ultimaActualizacion) {
            ultimaActualizacion = timestamp;
        }
        const deltaTiempo = timestamp - ultimaActualizacion;

        // Mover los coches
        moverCoches(deltaTiempo);
        // Mover las barras
        moverBarras1(deltaTiempo);
        moverBarras2(deltaTiempo);
        ultimaActualizacion = timestamp;
        // Solicitar el siguiente fotograma de animación
        idAnimacion = requestAnimationFrame(moverElementos);
    }

    // Función para detener el movimiento
    function detenerAnimacion() {
        cancelAnimationFrame(idAnimacion);
    }

    // Función para reanudar el temporizador
    function reanudarAnimacion() {
        idAnimacion = requestAnimationFrame(moverElementos);
    }

     // Evento cuando la ventana pierde el foco
     window.addEventListener('blur', detenerAnimacion);

    // Evento cuando la ventana recupera el foco
    window.addEventListener('focus', reanudarAnimacion);

    // Iniciar la animación
    requestAnimationFrame(moverElementos);


    //creo las variables para mover los coche con las teclas
    //se coloca fuera porque si se coloca dentro de la funcion, cada vez que se
    //pulsa una tecla, se reinicia el valor a 0 y no funcionaria el movimiento
    let movimientoCoche1 = 0;
    let movimientoCoche2 = 0;

    //función para mover los coches
    // Objeto para almacenar las teclas presionadas y la dirección actual de movimiento
    var teclasPresionadas = {};
    var direccionMovimiento1 = 0; // 0: quieto, -1: izquierda, 1: derecha
    var direccionMovimiento2 = 0;

    // Función para manejar el evento de tecla presionada
    window.addEventListener("keydown", function (event) {
        // Agregar la tecla presionada al objeto
        teclasPresionadas[event.keyCode] = true;
        // Actualizar la dirección de movimiento para el coche 1
        if (event.keyCode === 65) { // Tecla A (izquierda)
            direccionMovimiento1 = -1;
        } else if (event.keyCode === 83) { // Tecla S (derecha)
            direccionMovimiento1 = 1;
        }

        // Actualizar la dirección de movimiento para el coche 2
        if (event.keyCode === 75) { // Tecla K (izquierda)
            direccionMovimiento2 = -1;
        } else if (event.keyCode === 76) { // Tecla L (derecha)
            direccionMovimiento2 = 1;
        }
    });

    // Función para manejar el evento de tecla liberada
    window.addEventListener("keyup", function (event) {
        // Eliminar la tecla liberada del objeto
        delete teclasPresionadas[event.keyCode];
        // Si la tecla liberada es la que indica la dirección actual, detener el movimiento
        if ((event.keyCode === 65 && direccionMovimiento1 === -1) || (event.keyCode === 83 && direccionMovimiento1 === 1)) {
            direccionMovimiento1 = 0;
        }

        if ((event.keyCode === 75 && direccionMovimiento2 === -1) || (event.keyCode === 76 && direccionMovimiento2 === 1)) {
            direccionMovimiento2 = 0;
        }
    });

    //estas variables las utilizo para que no se pueda mover el coche cuando pierde
    let moverCoche1 = true;
    let moverCoche2 = true;

    // Función para manejar el movimiento de los coches
    function moverCoches(deltaTiempo) {
        if (moverCoche1) {
            // Mover el coche 1 según la dirección de movimiento
            if (direccionMovimiento1 === -1 && movimientoCoche1 > -22) { // Izquierda
                movimientoCoche1 -= 0.2;
            } else if (direccionMovimiento1 === 1 && movimientoCoche1 < 22) { // Derecha
                movimientoCoche1 += 0.2;
            }
        }

        if (moverCoche2) {
            // Mover el coche 2 según la dirección de movimiento
            if (direccionMovimiento2 === -1 && movimientoCoche2 > -22) { // Izquierda
                movimientoCoche2 -= 0.2;
            } else if (direccionMovimiento2 === 1 && movimientoCoche2 < 22) { // Derecha
                movimientoCoche2 += 0.2;
            }
        }

        // Actualizar la posición de los coches
        document.getElementById("coche1").style.transform = 'translateX(' + movimientoCoche1 + 'vw)';
        document.getElementById("coche2").style.transform = 'translateX(' + movimientoCoche2 + 'vw)';

    }

    // Variables para almacenar los tiempos finales
    let tiempoFinal1 = 0;
    let tiempoFinal2 = 0;


    //Ponemos la velocidad de las barras
    var Velocidad_juego = 1;

    ////////////////
    //Primer coche//
    ////////////////

    // Declaramos la variable de tiempo
    let t1 = 0;
    let contarTiempo1;
    var VELOCIDAD_VERTICAL1 = Velocidad_juego;
    var puntuacion1 = 1;
    let intervaloAumentoVelocidad1 = 15; // Intervalo de aumento de velocidad en segundos
    var contador1Nivel = 1;

    function actualizarVelocidad1() {
        // Aumentar la velocidad cada vez que pase el intervalo
        if (t1 % intervaloAumentoVelocidad1 === 0) {
            VELOCIDAD_VERTICAL1++;
            //mostramos el mensaje del nivel
            var mensaje1 = document.getElementById("nivel1");
            mensaje1.textContent = "Nivel " + contador1Nivel;
            mensaje1.classList.remove("ocultar");
            // Esperar 2 segundos y luego ocultar el mensaje
            setTimeout(function() {
                mensaje1.classList.add("ocultar");
            }, 3000);
            contador1Nivel++;  
        }
        //sumamos los puntos cada 15seg
        if (t1 % 3 === 0) {
            puntuacion1=puntuacion1+VELOCIDAD_VERTICAL1;
        }
    }

    // Función para manejar la actualización del tiempo
    function actualizarTiempo1() {
        // Incrementamos el tiempo
        t1 = t1 + 1;
        // Programamos la próxima actualización del tiempo después de 1000 ms (1 segundo)
        contarTiempo1 = setTimeout(actualizarTiempo1, 1000);

        actualizarVelocidad1();
        // Actualizamos el tiempo en el elemento HTML
        document.getElementById("puntuacion1").innerText = 'Puntuación: ' + puntuacion1;
    }

    // Función para detener el temporizador
    function detenerTiempo1() {
        clearTimeout(contarTiempo1);
    }

    // Función para reanudar el temporizador
    function reanudarTiempo1() {
        contarTiempo1 = setTimeout(actualizarTiempo1, 1000);
    }

    // Evento cuando la ventana pierde el foco
    window.addEventListener('blur', detenerTiempo1);

    // Evento cuando la ventana recupera el foco
    window.addEventListener('focus', reanudarTiempo1);

    // Iniciamos la actualización del tiempo
    actualizarTiempo1();

    // CREAR CONTENEDOR PARA EL JUEGO
    var contenedor_juego1 = document.getElementById('container1');

    // Obtener la altura del contenedor, lo hago con client para que no cuente los bordes
    var alturaContainer1 = contenedor_juego1.clientHeight;
    // Define the number of bars
    // console.log(alturaContainer1);

    //si el 100% del container1 es alturacontainer1, el 80px que es lo que mide cada barra de alto por defecto, cuanto es %?
    // var ALTURA_DE_BARRAS1 = 80;
    var ALTURA_DE_BARRAS1_sinRedondeo = (80 * 100) / alturaContainer1;
    // console.log(ALTURA_DE_BARRAS1_sinRedondeo.toFixed(1));
    var ALTURA_DE_BARRAS1_Porcentaje = ALTURA_DE_BARRAS1_sinRedondeo.toFixed(1);//con redondeo y un decimal y esta en %

    //ahora a pasarlo a px. Multiplicamos la altura de barras en % por la altura del contenedor y la dividimos entre 100
    var ALTURA_DE_BARRAS1 = (ALTURA_DE_BARRAS1_Porcentaje * alturaContainer1) / 100;

    var NUMERO_DE_BARRAS_HORIZONTALES1 = Math.floor(2 + parseInt(contenedor_juego1.offsetHeight) / ALTURA_DE_BARRAS1);

    //alert('NUMERO_DE_BARRAS_HORIZONTALES1: ' + NUMERO_DE_BARRAS_HORIZONTALES1);

    var ALTURA_PISTA1 = (NUMERO_DE_BARRAS_HORIZONTALES1 - 1) * ALTURA_DE_BARRAS1;

    // Obtener la anchura del contenedor sin los bordes
    var anchuraContainer1 = contenedor_juego1.clientWidth;

    //si el 100% del container1 es anchuracontainer1, el 40% que es lo que mide cada barra de ancho, cuanto es px?
    var ANCHURA_BARRAS1 = (anchuraContainer1 * 41) / 100;

    //hacemos lo mismo con la anchura del hueco pero en este caso es el 20% ya que las barras son el 80%
    var ANCHURA_HUECO1 = Math.floor((anchuraContainer1 * 20) / 100);
    //  console.log(ANCHURA_HUECO1);

    // var ANCHURA_BARRAS1 = 280;
    // var ANCHURA_HUECO1 = 180;
    var ANCHO_DE_PANTALLA1 = ANCHURA_BARRAS1 * 2 + ANCHURA_HUECO1;

    //El hueco se va a desplazar un 3%
    //var VELOCIDAD_HORIZONTAL_HUECO1= 20;
    var VELOCIDAD_HORIZONTAL_HUECO1 = Math.round((anchuraContainer1 * 3) / 100);

    // CREACIÓN DE BARRAS
    for (var i = 0; i < NUMERO_DE_BARRAS_HORIZONTALES1; i++) {

        // LADO1 IZQUIERDO
        // Nuevo div
        var barra_izquierda1 = document.createElement('div');
        //Asigna "barra_izq1uierda1"
        //barra_izq1uierda1.className = 'barra_izq1uierda1';
        barra_izquierda1.classList.add('barra_horizontal', 'barra_izquierda1')
        //bar.style.top = document.style.className("bar");
        barra_izquierda1.style.top = "" + (ALTURA_DE_BARRAS1 * i - ALTURA_DE_BARRAS1) + "px";
        // Append the div to the container
        contenedor_juego1.appendChild(barra_izquierda1);

        // LADO1 DERECHO, TRAS ANCHURA_HUECO1
        // NUEVO div
        var barra_derecha1 = document.createElement('div');
        // Assign the 'bar' class to the div
        barra_derecha1.classList.add('barra_horizontal', 'barra_derecha1')

        //bar.style.top1 = document.style.className("bar");
        barra_derecha1.style.top = "" + (ALTURA_DE_BARRAS1 * i - ALTURA_DE_BARRAS1) + "px";
        barra_derecha1.style.left = "" + (ANCHURA_BARRAS1 + ANCHURA_HUECO1) + "px";
        // Append the div to the container
        contenedor_juego1.appendChild(barra_derecha1);

    }
    // Todas las barras serán del mismo color
    var element1 = document.querySelector('.barra_izquierda1');
    var COLOR_DE_BARRAS = window.getComputedStyle(element1).backgroundColor;

    // Array con dos element1os, lista de barras IZQUIERDAS y lista de barras DERECHAS
    var divs1 = [];
    divs1[0] = document.querySelectorAll('.barra_horizontal.barra_izquierda1');
    divs1[1] = document.querySelectorAll('.barra_horizontal.barra_derecha1');

    var izquierdaHueco1;
    var nuevaIzquierdaHueco1;
    var destino_hueco1 = Math.floor(Math.random() * (ANCHO_DE_PANTALLA1 - ANCHURA_HUECO1));
    destino_hueco1 -= (destino_hueco1 % VELOCIDAD_HORIZONTAL_HUECO1);
    var banderaNuevoDestino1 = false;

    function moverBarras1(deltaTiempo) {
        var top1;
         //var velocidad_Movimiento1 = Math.round((VELOCIDAD_VERTICAL1 * (deltaTiempo/10)));
         var velocidad_Movimiento1= VELOCIDAD_VERTICAL1;
        //console.log(velocidad_Movimiento1);

        // BUCLE para AVANZAR y poner de color rojo las barras que se salen por abajo
        for (var i = 0; i < divs1[0].length; i++) {
            // AVANZAR CADA BARRA HORIZONTAL
            // Se pone '0' como alternativa de evaluación perezosa, para inicializar
            top1 = (parseInt(divs1[0][i].style.top || '0') + velocidad_Movimiento1);
            for (var izquierdaYderecha1 = 0; izquierdaYderecha1 < 2; izquierdaYderecha1++) {
                divs1[izquierdaYderecha1][i].style.top = top1 + 'px';
            }
        }

        // Alguna barra desaparece por la parte de abajo?
        for (var i = 0; i < divs1[0].length; i++) {
            // Se pone '0' como alternativa de evaluación perezosa, para inicializar
            top1 = (parseInt(divs1[0][i].style.top || '0'));

            if (top1 > ALTURA_PISTA1) {
                // divs1[0][i].style.top = (-1 * ALTURA_DE_BARRAS1 + 1) + 'px';
                divs1[0][i].style.top = (-1 * ALTURA_DE_BARRAS1 + velocidad_Movimiento1) + 'px';
                divs1[1][i].style.top = (-1 * ALTURA_DE_BARRAS1 + velocidad_Movimiento1) + 'px';

                var barraSiguienteConEstilosComputados1 = window.getComputedStyle(divs1[0][(i + 1) % NUMERO_DE_BARRAS_HORIZONTALES1]);
                izquierdaHueco1 = parseInt(barraSiguienteConEstilosComputados1.width || '0');

                //compruebo que izquierdaHueco sea multiplo de 20, ya que se le suma 20px cada vez que se mueve el hueco
                var contador1 = 1;
                while (izquierdaHueco1 % VELOCIDAD_HORIZONTAL_HUECO1 != 0) {
                    if ((izquierdaHueco1 + contador1) % VELOCIDAD_HORIZONTAL_HUECO1 == 0) {
                        izquierdaHueco1 += contador1;
                        break;
                    } else if ((izquierdaHueco1 - contador1) % VELOCIDAD_HORIZONTAL_HUECO1 === 0) {
                        izquierdaHueco1 -= contador1;
                        break;
                    }
                    contador1++;
                }

                // Si se alcanza el destino del hueco
                if (izquierdaHueco1 == destino_hueco1) {
                    destino_hueco1 = Math.floor(Math.random() * (ANCHO_DE_PANTALLA1 - ANCHURA_HUECO1));
                    destino_hueco1 -= (destino_hueco1 - izquierdaHueco1) % VELOCIDAD_HORIZONTAL_HUECO1;
                }

                //si está mas a la izquierda
                if (izquierdaHueco1 < destino_hueco1) {
                    nuevaIzquierdaHueco1 = izquierdaHueco1 + VELOCIDAD_HORIZONTAL_HUECO1;
                } else { // Necesariamente: izquierdaHueco1>destino_hueco1
                    nuevaIzquierdaHueco1 = izquierdaHueco1 - VELOCIDAD_HORIZONTAL_HUECO1;
                }

                divs1[0][i].style.width = '' + (nuevaIzquierdaHueco1) + 'px';
                divs1[1][i].style.left = '' + (nuevaIzquierdaHueco1 + ANCHURA_HUECO1) + 'px';
                divs1[1][i].style.width = '' + (ANCHO_DE_PANTALLA1 - nuevaIzquierdaHueco1 - ANCHURA_HUECO1) + 'px';
            }
        }
    }

    // Variables para rastrear las colisiones y controlar el juego
    let colisionBarraDer1 = false;
    let colisionBarraIzq1 = false;
    let colisiones1 = 0;
    var idColisiones1;

    // Función para detectar colisiones y realizar actualizaciones
    function detectarColisionesCoche1() {
        colisionBarraDer1 = false;
        colisionBarraIzq1 = false;

        //coche1
        var coche1 = document.getElementById("coche1").getBoundingClientRect();

        //ponemos las condiciones para comprobar las colisiones1
        if (VELOCIDAD_VERTICAL1 > 0) {
            //comprobamos que ningun lado1 del coche1 choque con la barra o si no cuenta como choque
            // Iterar sobre todas las barras derechas
            for (var i = 0; i < divs1[1].length; i++) {
                var barra_der1 = divs1[1][i].getBoundingClientRect();

                // Verificar colisión con la barra derecha
                if (!colisionBarraDer1 && ((barra_der1.left < coche1.right && coche1.left < barra_der1.right)) && (barra_der1.top < coche1.bottom && coche1.top < barra_der1.bottom)) {
                    //si hay una colision la sumamos
                    colisionBarraDer1 = true;
                    colisiones1++;
                    // Colisión detectada con la barra derecha
                    document.getElementById("colisiones1").innerText = 'Colisiones: ' + colisiones1;/*lo escribimos*/
                }
            }

            // Iterar sobre todas las barras izquierdas
            for (var i = 0; i < divs1[0].length; i++) {
                var barra_izq1 = divs1[0][i].getBoundingClientRect();

                // Verificar colisión con la barra izquierda
                //hacemos lo mismo para la barra izq
                if (!colisionBarraIzq1 && (barra_izq1.left < coche1.right && coche1.left < barra_izq1.right) && (barra_izq1.top < coche1.bottom && coche1.top < barra_izq1.bottom)) {
                    colisionBarraIzq1 = true;
                    colisiones1++;
                    // Colisión detectada con la barra izquierda
                    document.getElementById("colisiones1").innerText = 'Colisiones: ' + colisiones1;/*lo escribimos*/
                }
            }
        }

        if (colisiones1 < 11) {
            document.getElementById("colisiones1").innerText = 'Colisiones: ' + colisiones1;/*lo escribimos*/
        }

        if (colisiones1 == 10) {
            document.getElementById("perder1").style.display = 'block';//mostramos el mensaje de game over
            moverCoche1 = false;//paramos el coche1
            VELOCIDAD_VERTICAL1 = 0;//paramos el movimiento
            clearInterval(contarTiempo1);//paramos el tiempo
            //obtenemos el tiempo final
            tiempoFinal1 = t1;
        }

        // Programamos la próxima actualización del tiempo después de 1000 ms (1 segundo)
        idColisiones1 = setTimeout(detectarColisionesCoche1, 900);
    }
    
    // Función para detener las colisiones
    function detenerColisiones1() {
        clearTimeout(idColisiones1);
    }

    // Función para reanudar las colisiones
    function reanudarColisiones1() {
        idColisiones1 = setTimeout(detectarColisionesCoche1, 900);
    }

    // Evento cuando la ventana pierde el foco
    window.addEventListener('blur', detenerColisiones1);

    // Evento cuando la ventana recupera el foco
    window.addEventListener('focus', reanudarColisiones1);


    // Iniciar la detección de colisiones y las actualizaciones
    requestAnimationFrame(detectarColisionesCoche1);


    /////////////////
    //Segundo coche//
    /////////////////

    // Declaramos la variable de tiempo
    let t2 = 0;
    let contarTiempo2;
    var VELOCIDAD_VERTICAL2 = Velocidad_juego;
    var puntuacion2 = 1;
    let intervaloAumentoVelocidad2 = 15; // Intervalo de aumento de velocidad en segundos
    var contador2Nivel = 1;

    function actualizarVelocidad2() {
        // Aumentar la velocidad cada vez que pase el intervalo
        if (t2 % intervaloAumentoVelocidad2 === 0) {
            VELOCIDAD_VERTICAL2++;
             //mostramos el mensaje del nivel
             var mensaje2 = document.getElementById("nivel2");
            mensaje2.textContent = "Nivel " + contador2Nivel;
            mensaje2.classList.remove("ocultar");
            // Esperar 2 segundos y luego ocultar el mensaje
            setTimeout(function() {
                mensaje2.classList.add("ocultar");
            }, 3000);
            contador2Nivel++;
        }

        //sumamos los puntos cada 15seg
        if (t2 % 3 === 0) {
            puntuacion2=puntuacion2+VELOCIDAD_VERTICAL2;
        }
    }

    // Función para manejar la actualización del tiempo
    function actualizarTiempo2() {
        // Incrementamos el tiempo
        t2 = t2 + 1;
        // Programamos la próxima actualización del tiempo después de 1000 ms (1 segundo)
        contarTiempo2 = setTimeout(actualizarTiempo2, 1000);

        actualizarVelocidad2();
        // Actualizamos la puntuacion en el elemento HTML
        document.getElementById("puntuacion2").innerText = 'Puntuación: ' + puntuacion2;
    }

    // Función para detener el temporizador
    function detenerTiempo2() {
        clearTimeout(contarTiempo2);
    }

    // Función para reanudar el temporizador
    function reanudarTiempo2() {
        contarTiempo2 = setTimeout(actualizarTiempo2, 1000);
    }

    // Evento cuando la ventana pierde el foco
    window.addEventListener('blur', detenerTiempo2);

    // Evento cuando la ventana recupera el foco
    window.addEventListener('focus', reanudarTiempo2);

    // Iniciamos la actualización del tiempo
    actualizarTiempo2();

    // CREAR CONTENEDOR PARA EL JUEGO
    var contenedor_juego2 = document.getElementById('container2');

    // Obtener la altura del contenedor, lo hago con client para que no cuente los bordes
    var alturaContainer2 = contenedor_juego2.clientHeight;

    //si el 100% del container2 es alturacontainer2, el 80px que es lo que mide cada barra de alto por defecto, cuanto es %?
    var ALTURA_DE_BARRAS2_sinRedondeo = (80 * 100) / alturaContainer2;
    // console.log(ALTURA_DE_BARRAS2_sinRedondeo.toFixed(1));
    var ALTURA_DE_BARRAS2_Porcentaje = ALTURA_DE_BARRAS2_sinRedondeo.toFixed(1);//con redondeo y un decimal y esta en %

    //ahora a pasarlo a px. Multiplicamos la altura de barras en % por la altura del contenedor y la dividimos entre 100
    var ALTURA_DE_BARRAS2 = (ALTURA_DE_BARRAS2_Porcentaje * alturaContainer2) / 100;

    // var ALTURA_DE_BARRAS2 = 80;
    var NUMERO_DE_BARRAS_HORIZONTALES2 = Math.floor(2 + parseInt(contenedor_juego2.offsetHeight) / ALTURA_DE_BARRAS2);

    //alert('NUMERO_DE_BARRAS_HORIZONTALES2: ' + NUMERO_DE_BARRAS_HORIZONTALES2);

    var ALTURA_PISTA2 = (NUMERO_DE_BARRAS_HORIZONTALES2 - 1) * ALTURA_DE_BARRAS2;

    // Obtener la anchura del contenedor
    var anchuraContainer2 = contenedor_juego2.clientWidth;

    // Imprimir la anchura del contenedor en la consola
    // console.log("Anchura del container2:", anchuraContainer2);

    //si el 100% del container2 es anchuracontainer1, el 40% que es lo que mide cada barra de ancho, cuanto es px?
    var ANCHURA_BARRAS2 = (anchuraContainer2 * 40) / 100;
    // console.log(ANCHURA_BARRAS2);

    //hacemos lo mismo con la anchura del hueco pero en este caso es el 20% ya que las barras son el 80%
    var ANCHURA_HUECO2 = (anchuraContainer2 * 20) / 100;
    // console.log(ANCHURA_HUECO2);

    // var ANCHURA_BARRAS2 = 280;
    // var ANCHURA_HUECO2 = 180;
    var ANCHO_DE_PANTALLA2 = ANCHURA_BARRAS2 * 2 + ANCHURA_HUECO2;

    //El hueco se va a desplazar un 3%
    //var VELOCIDAD_HORIZONTAL_HUECO1= 20;
    var VELOCIDAD_HORIZONTAL_HUECO2 = Math.round((anchuraContainer2 * 3) / 100);

    // CREACIÓN DE BARRAS
    for (var i = 0; i < NUMERO_DE_BARRAS_HORIZONTALES2; i++) {

        // LADO2 IZQUIERDO
        // Nuevo div
        var barra_izquierda2 = document.createElement('div');
        //Asigna "barra_izq1uierda2"
        //barra_izq1uierda2.className = 'barra_izq1uierda2';
        barra_izquierda2.classList.add('barra_horizontal', 'barra_izquierda2')
        //bar.style.top = document.style.className("bar");
        barra_izquierda2.style.top = "" + (ALTURA_DE_BARRAS2 * i - ALTURA_DE_BARRAS2) + "px";
        // Append the div to the container
        contenedor_juego2.appendChild(barra_izquierda2);

        // LADO2 DERECHO, TRAS ANCHURA_HUECO2
        // NUEVO div
        var barra_derecha2 = document.createElement('div');
        // Assign the 'bar' class to the div
        // BORRAR -> barra_derecha2.className = 'barra_derecha2';
        barra_derecha2.classList.add('barra_horizontal', 'barra_derecha2')

        //bar.style.top2 = document.style.className("bar");
        barra_derecha2.style.top = "" + (ALTURA_DE_BARRAS2 * i - ALTURA_DE_BARRAS2) + "px";
        barra_derecha2.style.left = "" + (ANCHURA_BARRAS2 + ANCHURA_HUECO2) + "px";
        // Append the div to the container
        contenedor_juego2.appendChild(barra_derecha2);

    }
    // Todas las barras serán del mismo color
    var element2 = document.querySelector('.barra_izquierda2');
    var COLOR_DE_BARRAS = window.getComputedStyle(element2).backgroundColor;

    // Array con dos element1os, lista de barras IZQUIERDAS y lista de barras DERECHAS
    var divs2 = [];
    divs2[0] = document.querySelectorAll('.barra_horizontal.barra_izquierda2');
    divs2[1] = document.querySelectorAll('.barra_horizontal.barra_derecha2');

    var izquierdaHueco2;
    var nuevaIzquierdaHueco2;
    var destino_hueco2 = Math.floor(Math.random() * (ANCHO_DE_PANTALLA2 - ANCHURA_HUECO2));
    destino_hueco2 -= (destino_hueco2 % VELOCIDAD_HORIZONTAL_HUECO2);
    var banderaNuevoDestino2 = false;

    function moverBarras2(deltaTiempo) {
        var top2;

        //var velocidad_Movimiento2 = Math.round((VELOCIDAD_VERTICAL2 * deltaTiempo) / 10);
        // console.log(Math.round((VELOCIDAD_VERTICAL2)));

        // BUCLE para AVANZAR y poner de color rojo las barras que se salen por abajo
        for (var i = 0; i < divs2[0].length; i++) {
            // AVANZAR CADA BARRA HORIZONTAL
            // Se pone '0' como alternativa de evaluación perezosa, para inicializar
            top2 = (parseInt(divs2[0][i].style.top || '0') + VELOCIDAD_VERTICAL2);
            for (var izquierdaYderecha2 = 0; izquierdaYderecha2 < 2; izquierdaYderecha2++) {
                divs2[izquierdaYderecha2][i].style.top = top2 + 'px';
            }
        }
        // Alguna barra desaparece por la parte de abajo?
        for (var i = 0; i < divs2[0].length; i++) {
            // Se pone '0' como alternativa de evaluación perezosa, para inicializar
            top2 = (parseInt(divs2[0][i].style.top || '0'));

            if (top2 > ALTURA_PISTA2) {
                divs2[0][i].style.top = (-1 * ALTURA_DE_BARRAS2 + VELOCIDAD_VERTICAL2) + 'px';
                divs2[1][i].style.top = (-1 * ALTURA_DE_BARRAS2 + VELOCIDAD_VERTICAL2) + 'px';

                var barraSiguienteConEstilosComputados2 = window.getComputedStyle(divs2[0][(i + 1) % NUMERO_DE_BARRAS_HORIZONTALES2]);
                izquierdaHueco2 = parseInt(barraSiguienteConEstilosComputados2.width || '0');

                //compruebo que izquierdaHueco sea multiplo de 20, ya que se le suma 20px cada vez que se mueve el hueco
                var contador2 = 1;
                while (izquierdaHueco2 % VELOCIDAD_HORIZONTAL_HUECO2 != 0) {
                    if ((izquierdaHueco2 + contador2) % VELOCIDAD_HORIZONTAL_HUECO2 == 0) {
                        izquierdaHueco2 += contador2;
                        break;
                    } else if ((izquierdaHueco2 - contador2) % VELOCIDAD_HORIZONTAL_HUECO2 === 0) {
                        izquierdaHueco2 -= contador2;
                        break;
                    }
                    contador2++;
                }

                //Si se alcanza el destino del hueco
                if (izquierdaHueco2 == destino_hueco2) {
                    destino_hueco2 = Math.floor(Math.random() * (ANCHO_DE_PANTALLA2 - ANCHURA_HUECO2));
                    destino_hueco2 -= (destino_hueco2 - izquierdaHueco2) % VELOCIDAD_HORIZONTAL_HUECO2;
                }

                if (izquierdaHueco2 < destino_hueco2) {
                    nuevaIzquierdaHueco2 = izquierdaHueco2 + VELOCIDAD_HORIZONTAL_HUECO2;
                } else { // Necesariamente: izquierdaHueco2>destino_hueco2
                    nuevaIzquierdaHueco2 = izquierdaHueco2 - VELOCIDAD_HORIZONTAL_HUECO2;
                }

                divs2[0][i].style.width = '' + (nuevaIzquierdaHueco2) + 'px';
                divs2[1][i].style.left = '' + (nuevaIzquierdaHueco2 + ANCHURA_HUECO2) + 'px';
                divs2[1][i].style.width = '' + (ANCHO_DE_PANTALLA2 - nuevaIzquierdaHueco2 - ANCHURA_HUECO2) + 'px';
            }
        }
    }

    // Variables para rastrear las colisiones y controlar el juego
    let colisionBarraDer2 = false;
    let colisionBarraIzq2 = false;
    let colisiones2 = 0;
    var idColisiones2;

    // Función para detectar colisiones y realizar actualizaciones
    function detectarColisionesCoche2() {
        colisionBarraDer2 = false;
        colisionBarraIzq2 = false;

        //coche2
        var coche2 = document.getElementById("coche2").getBoundingClientRect();

        //ponemos las condiciones para comprobar las colisiones2
        if (VELOCIDAD_VERTICAL2 > 0) {

            //comprobamos que ningun lado del coche2 choque con la barra o si no cuenta como choque
            // Iterar sobre todas las barras derechas
            for (var i = 0; i < divs2[1].length; i++) {
                var barra_der2 = divs2[1][i].getBoundingClientRect();

                // Verificar colisión con la barra derecha
                if (!colisionBarraDer2 && ((barra_der2.left < coche2.right && coche2.left < barra_der2.right)) && (barra_der2.top < coche2.bottom && coche2.top < barra_der2.bottom)) {
                    //si hay una colision la sumamos
                    colisionBarraDer2 = true;
                    colisiones2++;
                    // Colisión detectada con la barra derecha
                    document.getElementById("colisiones2").innerText = 'Colisiones: ' + colisiones2;/*lo escribimos*/
                }
            }

            // Iterar sobre todas las barras izquierdas
            for (var i = 0; i < divs2[0].length; i++) {
                var barra_izq2 = divs2[0][i].getBoundingClientRect();

                // Verificar colisión con la barra izquierda
                //hacemos lo mismo para la barra izq
                if (!colisionBarraIzq2 && (barra_izq2.left < coche2.right && coche2.left < barra_izq2.right) && (barra_izq2.top < coche2.bottom && coche2.top < barra_izq2.bottom)) {
                    colisionBarraIzq2 = true;
                    colisiones2++;
                    // Colisión detectada con la barra izquierda
                    document.getElementById("colisiones2").innerText = 'Colisiones: ' + colisiones2;/*lo escribimos*/
                }
            }
        }

        if (colisiones2 < 11) {
            document.getElementById("colisiones2").innerText = 'Colisiones: ' + colisiones2;/*lo escribimos*/
        }

        if (colisiones2 == 10) {
            document.getElementById("perder2").style.display = 'block';//mostramos el mensaje de game over
            moverCoche2 = false;//paramos el coche2
            VELOCIDAD_VERTICAL2 = 0;//paramos el movimiento
            clearTimeout(contarTiempo2);//paramos el tiempo
            //obtenemos el tiempo final
            tiempoFinal2 = t2;
        }

        // Programamos la próxima actualización del tiempo después de 1000 ms (1 segundo)
        idColisiones2 = setTimeout(detectarColisionesCoche2, 900);
    }

    // Función para detener las colisiones
    function detenerColisiones2() {
        clearTimeout(idColisiones2);
    }

    // Función para reanudar las colisiones
    function reanudarColisiones2() {
        idColisiones2 = setTimeout(detectarColisionesCoche2, 900);
    }

    // Evento cuando la ventana pierde el foco
    window.addEventListener('blur', detenerColisiones2);

    // Evento cuando la ventana recupera el foco
    window.addEventListener('focus', reanudarColisiones2);

    // Iniciar la detección de colisiones y las actualizaciones
    requestAnimationFrame(detectarColisionesCoche2);

    // Función para verificar al ganador
    function verificarGanador() {
        if (colisiones1 == 10 && colisiones2 == 10) {
            //convertimos el tiempo
            var tiempo1EnHoras = Math.floor(tiempoFinal1 / 3600);
            var tiempo1EnMinutos = Math.floor((tiempoFinal1 % 3600) / 60);
            var tiempo1EnSegundos = tiempoFinal1 % 60;

            var tiempo2EnHoras = Math.floor(tiempoFinal2 / 3600);
            var tiempo2EnMinutos = Math.floor((tiempoFinal2 % 3600) / 60);
            var tiempo2EnSegundos = tiempoFinal2 % 60;

            var mensajeGanador = "";

            //gana coche 1
            if (tiempoFinal1 > tiempoFinal2) {
                if (tiempo1EnHoras > 0) {
                    if (tiempo1EnHoras == 1) {
                        if (tiempo1EnMinutos == 1) {
                            if (tiempo1EnSegundos == 1) {
                                mensajeGanador += "Ganador: Coche 1!!\nTiempo en juego: " + tiempo1EnHoras + " hora, " + tiempo1EnMinutos + " minuto y " + tiempo1EnSegundos + " segundo\nPuntuación: "+puntuacion1;
                                mensajeGanador += "\n---------------------------------------------------------------";
                                mensajeGanador += "\nCoche 2\nTiempo en juego: " + tiempo2EnHoras + " hora, " + tiempo2EnMinutos + " minuto y " + tiempo2EnSegundos + " segundo\nPuntuación: "+puntuacion2;

                            } else {
                                mensajeGanador += "Ganador: Coche 1!!\nTiempo en juego: " + tiempo1EnHoras + " hora, " + tiempo1EnMinutos + " minuto y " + tiempo1EnSegundos + " segundos\nPuntuación: "+puntuacion1;
                                mensajeGanador += "\n---------------------------------------------------------------";
                                mensajeGanador += "\nCoche 2\nTiempo en juego: " + tiempo2EnHoras + " hora, " + tiempo2EnMinutos + " minuto y " + tiempo2EnSegundos + " segundos\nPuntuación: "+puntuacion2;
                            }
                        } else {
                            if (tiempo1EnSegundos == 1) {
                                mensajeGanador += "Ganador: Coche 1!!\nTiempo en juego: " + tiempo1EnHoras + " hora, " + tiempo1EnMinutos + " minutos y " + tiempo1EnSegundos + " segundo\nPuntuación: "+puntuacion1;
                                mensajeGanador += "\n---------------------------------------------------------------";
                                mensajeGanador += "\nCoche 2\nTiempo en juego: " + tiempo2EnHoras + " hora, " + tiempo2EnMinutos + " minutos y " + tiempo2EnSegundos + " segundo\nPuntuación: "+puntuacion2;
                            } else {
                                mensajeGanador += "Ganador: Coche 1!!\nTiempo en juego: " + tiempo1EnHoras + " hora, " + tiempo1EnMinutos + " minutos y " + tiempo1EnSegundos + " segundos\nPuntuación: "+puntuacion1;
                                mensajeGanador += "\n---------------------------------------------------------------";
                                mensajeGanador += "\nCoche 2\nTiempo en juego: " + tiempo2EnHoras + " hora, " + tiempo2EnMinutos + " minutos y " + tiempo2EnSegundos + " segundos\nPuntuación: "+puntuacion2;
                            }
                        }
                    } else {
                        if (tiempo1EnMinutos == 1) {
                            if (tiempo1EnSegundos == 1) {
                                mensajeGanador += "Ganador: Coche 1!!\nTiempo en juego: " + tiempo1EnHoras + " horas, " + tiempo1EnMinutos + " minuto y " + tiempo1EnSegundos + " segundo\nPuntuación: "+puntuacion1;
                                mensajeGanador += "\n---------------------------------------------------------------";
                                mensajeGanador += "\nCoche 2\nTiempo en juego: " + tiempo2EnHoras + " horas, " + tiempo2EnMinutos + " minuto y " + tiempo2EnSegundos + " segundo\nPuntuación: "+puntuacion2;
                            } else {
                                mensajeGanador += "Ganador: Coche 1!!\nTiempo en juego: " + tiempo1EnHoras + " horas, " + tiempo1EnMinutos + " minuto y " + tiempo1EnSegundos + " segundos\nPuntuación: "+puntuacion1;
                                mensajeGanador += "\n---------------------------------------------------------------";
                                mensajeGanador += "\nCoche 2\nTiempo en juego: " + tiempo2EnHoras + " horas, " + tiempo2EnMinutos + " minuto y " + tiempo2EnSegundos + " segundos\nPuntuación: "+puntuacion2;
                            }
                        } else {
                            if (tiempo1EnSegundos == 1) {
                                mensajeGanador += "Ganador: Coche 1!!\nTiempo en juego: " + tiempo1EnHoras + " horas, " + tiempo1EnMinutos + " minutos y " + tiempo1EnSegundos + " segundo\nPuntuación: "+puntuacion1;
                                mensajeGanador += "\n---------------------------------------------------------------";
                                mensajeGanador += "\nCoche 2\nTiempo en juego: " + tiempo2EnHoras + " horas, " + tiempo2EnMinutos + " minutos y " + tiempo2EnSegundos + " segundo\nPuntuación: "+puntuacion2;
                            } else {
                                mensajeGanador += "Ganador: Coche 1!!\nTiempo en juego: " + tiempo1EnHoras + " horas, " + tiempo1EnMinutos + " minutos y " + tiempo1EnSegundos + " segundos\nPuntuación: "+puntuacion1;
                                mensajeGanador += "\n---------------------------------------------------------------";
                                mensajeGanador += "\nCoche 2\nTiempo en juego: " + tiempo2EnHoras + " horas, " + tiempo2EnMinutos + " minutos y " + tiempo2EnSegundos + " segundos\nPuntuación: "+puntuacion2;
                            }
                        }
                    }
                } else if (tiempo1EnMinutos > 0) {
                    if (tiempo1EnMinutos == 1) {
                        mensajeGanador += "Ganador: Coche 1!!\nTiempo en juego: " + tiempo1EnMinutos + " minuto y " + tiempo1EnSegundos + " segundos\nPuntuación: "+puntuacion1;
                        mensajeGanador += "\n---------------------------------------------------------------";
                        mensajeGanador += "\nCoche 2\nTiempo en juego: " + tiempo2EnMinutos + " minuto y " + tiempo2EnSegundos + " segundos\nPuntuación: "+puntuacion2;
                    } else {
                        mensajeGanador += "Ganador: Coche 1!!\nTiempo en juego: " + tiempo1EnMinutos + " minutos y " + tiempo1EnSegundos + " segundos\nPuntuación: "+puntuacion1;
                        mensajeGanador += "\n---------------------------------------------------------------";
                        mensajeGanador += "\nCoche 2\nTiempo en juego: " + tiempo2EnMinutos + " minutos y " + tiempo2EnSegundos + " segundos\nPuntuación: "+puntuacion2;
                    }
                } else {
                    if (tiempo1EnSegundos == 1) {
                        mensajeGanador += "Ganador: Coche 1!!\nTiempo en juego: " + tiempo1EnSegundos + " segundo\nPuntuación: "+puntuacion1;
                        mensajeGanador += "\n---------------------------------------------------------------";
                        mensajeGanador += "\nCoche 2\nTiempo en juego: " + tiempo2EnSegundos + " segundo\nPuntuación: "+puntuacion2;
                    } else {
                        mensajeGanador += "Ganador: Coche 1!!\nTiempo en juego: " + tiempo1EnSegundos + " segundos\nPuntuación: "+puntuacion1;
                        mensajeGanador += "\n---------------------------------------------------------------";
                        mensajeGanador += "\nCoche 2\nTiempo en juego: " + tiempo2EnSegundos + " segundos\nPuntuación: "+puntuacion2;

                    }
                }
                //gana coche 2
            } else if (tiempoFinal2 > tiempoFinal1) {
                if (tiempo2EnHoras > 0) {
                    if (tiempo2EnHoras == 1) {
                        if (tiempo2EnMinutos == 1) {
                            if (tiempo2EnSegundos == 1) {
                                mensajeGanador += "Ganador: Coche 2!!\nTiempo en juego: " + tiempo2EnHoras + " hora, " + tiempo2EnMinutos + " minuto y " + tiempo2EnSegundos + " segundo\nPuntuación: "+puntuacion2;
                                mensajeGanador += "\n---------------------------------------------------------------";
                                mensajeGanador += "\nCoche 1\nTiempo en juego: " + tiempo1EnHoras + " hora, " + tiempo1EnMinutos + " minuto y " + tiempo1EnSegundos + " segundo\nPuntuación: "+puntuacion1;

                            } else {
                                mensajeGanador += "Ganador: Coche 2!!\nTiempo en juego: " + tiempo2EnHoras + " hora, " + tiempo2EnMinutos + " minuto y " + tiempo2EnSegundos + " segundos\nPuntuación: "+puntuacion2;
                                mensajeGanador += "\n---------------------------------------------------------------";
                                mensajeGanador += "\nCoche 1\nTiempo en juego: " + tiempo1EnHoras + " hora, " + tiempo1EnMinutos + " minuto y " + tiempo1EnSegundos + " segundos\nPuntuación: "+puntuacion1;
                            }
                        } else {
                            if (tiempo2EnSegundos == 1) {
                                mensajeGanador += "Ganador: Coche 2!!\nTiempo en juego: " + tiempo2EnHoras + " hora, " + tiempo2EnMinutos + " minutos y " + tiempo2EnSegundos + " segundo\nPuntuación: "+puntuacion2;
                                mensajeGanador += "\n---------------------------------------------------------------";
                                mensajeGanador += "\nCoche 1\nTiempo en juego: " + tiempo1EnHoras + " hora, " + tiempo1EnMinutos + " minutos y " + tiempo1EnSegundos + " segundo\nPuntuación: "+puntuacion1;
                            } else {
                                mensajeGanador += "Ganador: Coche 2!!\nTiempo en juego: " + tiempo2EnHoras + " hora, " + tiempo2EnMinutos + " minutos y " + tiempo2EnSegundos + " segundos\nPuntuación: "+puntuacion2;
                                mensajeGanador += "\n---------------------------------------------------------------";
                                mensajeGanador += "\nCoche 1\nTiempo en juego: " + tiempo1EnHoras + " hora, " + tiempo1EnMinutos + " minutos y " + tiempo1EnSegundos + " segundos\nPuntuación: "+puntuacion1;
                            }
                        }
                    } else {
                        if (tiempo2EnMinutos == 1) {
                            if (tiempo2EnSegundos == 1) {
                                mensajeGanador += "Ganador: Coche 2!!\nTiempo en juego: " + tiempo2EnHoras + " horas, " + tiempo2EnMinutos + " minuto y " + tiempo2EnSegundos + " segundo\nPuntuación: "+puntuacion2;
                                mensajeGanador += "\n---------------------------------------------------------------";
                                mensajeGanador += "\nCoche 1\nTiempo en juego: " + tiempo1EnHoras + " horas, " + tiempo1EnMinutos + " minuto y " + tiempo1EnSegundos + " segundo\nPuntuación: "+puntuacion1;
                            } else {
                                mensajeGanador += "Ganador: Coche 2!!\nTiempo en juego: " + tiempo2EnHoras + " horas, " + tiempo2EnMinutos + " minuto y " + tiempo2EnSegundos + " segundos\nPuntuación: "+puntuacion2;
                                mensajeGanador += "\n---------------------------------------------------------------";
                                mensajeGanador += "\nCoche 1\nTiempo en juego: " + tiempo1EnHoras + " horas, " + tiempo1EnMinutos + " minuto y " + tiempo1EnSegundos + " segundos\nPuntuación: "+puntuacion1;
                            }
                        } else {
                            if (tiempo2EnSegundos == 1) {
                                mensajeGanador += "Ganador: Coche 2!!\nTiempo en juego: " + tiempo2EnHoras + " horas, " + tiempo2EnMinutos + " minutos y " + tiempo2EnSegundos + " segundo\nPuntuación: "+puntuacion2;
                                mensajeGanador += "\n---------------------------------------------------------------";
                                mensajeGanador += "\nCoche 1\nTiempo en juego: " + tiempo1EnHoras + " horas, " + tiempo1EnMinutos + " minutos y " + tiempo1EnSegundos + " segundo\nPuntuación: "+puntuacion1;
                            } else {
                                mensajeGanador += "Ganador: Coche 2!!\nTiempo en juego: " + tiempo2EnHoras + " horas, " + tiempo2EnMinutos + " minutos y " + tiempo2EnSegundos + " segundos\nPuntuación: "+puntuacion2;
                                mensajeGanador += "\n---------------------------------------------------------------";
                                mensajeGanador += "\nCoche 1\nTiempo en juego: " + tiempo1EnHoras + " horas, " + tiempo1EnMinutos + " minutos y " + tiempo1EnSegundos + " segundos\nPuntuación: "+puntuacion1;
                            }
                        }
                    }
                } else if (tiempo2EnMinutos > 0) {
                    if (tiempo2EnMinutos == 1) {
                        mensajeGanador += "Ganador: Coche 2!!\nTiempo en juego: " + tiempo2EnMinutos + " minuto y " + tiempo2EnSegundos + " segundos\nPuntuación: "+puntuacion2;
                        mensajeGanador += "\n---------------------------------------------------------------";
                        mensajeGanador += "\nCoche 1\nTiempo en juego: " + tiempo1EnMinutos + " minuto y " + tiempo1EnSegundos + " segundos\nPuntuación: "+puntuacion1;
                    } else {
                        mensajeGanador += "Ganador: Coche 2!!\nTiempo en juego: " + tiempo2EnMinutos + " minutos y " + tiempo2EnSegundos + " segundos\nPuntuación: "+puntuacion2;
                        mensajeGanador += "\n---------------------------------------------------------------";
                        mensajeGanador += "\nCoche 1\nTiempo en juego: " + tiempo1EnMinutos + " minutos y " + tiempo1EnSegundos + " segundos\nPuntuación: "+puntuacion1;
                    }
                } else {
                    if (tiempo2EnSegundos == 1) {
                        mensajeGanador += "Ganador: Coche 2!!\nTiempo en juego: " + tiempo2EnSegundos + " segundo\nPuntuación: "+puntuacion2;
                        mensajeGanador += "\n---------------------------------------------------------------";
                        mensajeGanador += "\nCoche 1\nTiempo en juego: " + tiempo1EnSegundos + " segundo\nPuntuación: "+puntuacion1;

                    } else {
                        mensajeGanador += "Ganador: Coche 2!!\nTiempo en juego: " + tiempo2EnSegundos + " segundos\nPuntuación: "+puntuacion2;
                        mensajeGanador += "\n---------------------------------------------------------------";
                        mensajeGanador += "\nCoche 1\nTiempo en juego: " + tiempo1EnSegundos + " segundos\nPuntuación: "+puntuacion1;
                    }
                }
                //empate
            } else {
                if (tiempo1EnHoras > 0) {
                    if (tiempo1EnHoras == 1) {
                        if (tiempo1EnMinutos == 1) {
                            if (tiempo1EnSegundos == 1) {
                                mensajeGanador += "Empate!!\nTiempo en juego: " + tiempo1EnHoras + " hora, " + tiempo1EnMinutos + " minuto y " + tiempo1EnSegundos + " segundo\nPuntuación: "+puntuacion1;
                            } else {
                                mensajeGanador += "Empate!!\nTiempo en juego: " + tiempo1EnHoras + " hora, " + tiempo1EnMinutos + " minuto y " + tiempo1EnSegundos + " segundos\nPuntuación: "+puntuacion1;
                            }
                        } else {
                            if (tiempo1EnSegundos == 1) {
                                mensajeGanador += "Empate!!\nTiempo en juego: " + tiempo1EnHoras + " hora, " + tiempo1EnMinutos + " minutos y " + tiempo1EnSegundos + " segundo\nPuntuación: "+puntuacion1;
                            } else {
                                mensajeGanador += "Empate!!\nTiempo en juego: " + tiempo1EnHoras + " hora, " + tiempo1EnMinutos + " minutos y " + tiempo1EnSegundos + " segundos\nPuntuación: "+puntuacion1;
                            }
                        }
                    } else {
                        if (tiempo1EnMinutos == 1) {
                            if (tiempo1EnSegundos == 1) {
                                mensajeGanador += "Empate!!\nTiempo en juego: " + tiempo1EnHoras + " horas, " + tiempo1EnMinutos + " minuto y " + tiempo1EnSegundos + " segundo\nPuntuación: "+puntuacion1;
                            } else {
                                mensajeGanador += "Empate!!\nTiempo en juego: " + tiempo1EnHoras + " horas, " + tiempo1EnMinutos + " minuto y " + tiempo1EnSegundos + " segundos\nPuntuación: "+puntuacion1;
                            }
                        } else {
                            if (tiempo1EnSegundos == 1) {
                                mensajeGanador += "Empate!!\nTiempo en juego: " + tiempo1EnHoras + " horas, " + tiempo1EnMinutos + " minutos y " + tiempo1EnSegundos + " segundo\nPuntuación: "+puntuacion1;
                            } else {
                                mensajeGanador += "Empate!!\nTiempo en juego: " + tiempo1EnHoras + " horas, " + tiempo1EnMinutos + " minutos y " + tiempo1EnSegundos + " segundos\nPuntuación: "+puntuacion1;
                            }
                        }
                    }
                } else if (tiempo1EnMinutos > 0) {
                    if (tiempo1EnMinutos == 1) {
                        mensajeGanador += "Empate!!\nTiempo en juego: " + tiempo1EnMinutos + " minuto y " + tiempo1EnSegundos + " segundos\nPuntuación: "+puntuacion1;
                    } else {
                        mensajeGanador += "Empate!!\nTiempo en juego: " + tiempo1EnMinutos + " minutos y " + tiempo1EnSegundos + " segundos\nPuntuación: "+puntuacion1;
                    }
                } else {
                    if (tiempo1EnSegundos == 1) {
                        mensajeGanador += "Empate!!\nTiempo en juego: " + tiempo1EnSegundos + " segundo\nPuntuación: "+puntuacion1;
                    } else {
                        mensajeGanador += "Empate!!\nTiempo en juego: " + tiempo1EnSegundos + " segundos\nPuntuación: "+puntuacion1;
                    }
                }
            }
            alert(mensajeGanador);//mostramos el mensaje
            // setTimeout(recargar, 300);
            //Hacemos que tarde un poco en recargar la pagina
            setTimeout(location.reload.bind(location), 500);
        }
        setTimeout(verificarGanador, 600);//llamamos a verificar ganador cada cierto tiempo
    }
    requestAnimationFrame(verificarGanador);
});