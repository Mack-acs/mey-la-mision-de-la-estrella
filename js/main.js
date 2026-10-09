/* =====================================================
   MEY — LA MISIÓN DE LA ESTRELLA
   main.js

   Escenas: Inicio > Prólogo > Jardín > Cámara de las sombras
            > Bosque de las melodías > Biblioteca > Luna y estrella
            > Carta > Final

   TODO LO QUE PUEDES PERSONALIZAR (textos, pistas, carta,
   melodía, música) está en la sección 1: CONFIG.
===================================================== */

"use strict";

const $ = (id) => document.getElementById(id);
const game = $("game");
const isTouch = window.matchMedia("(pointer: coarse)").matches;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rand = (a, b) => a + Math.random() * (b - a);


/* =====================================================
   1. CONFIG — EDITA AQUÍ TUS TEXTOS, PISTAS, CARTA Y MÚSICA
   (Los saltos de línea se escriben con \n)
===================================================== */

const CONFIG = {

    /* Música de fondo por escena. Si dejas "" suena una melodía suave
       generada por el navegador. Para usar tus canciones, pon la ruta:
       garden: "assets/audio/jardin.mp3" */
    music: {
        start: "",
        garden: "",
        dungeon: "",
        forest: "",
        library: "",
        moon: "",
        final: ""
    },

    /* ---------------------------------------------------
       JARDÍN DE OCTUBRE
       Las flores están en tres arbustos. Cada pista habla de algo
       que de verdad se ve en el jardín:
         peonía   -> el único árbol que sigue verde (arriba a la izquierda)
         tulipán  -> el árbol más grande y antiguo (arriba a la derecha)
         nenúfar  -> el charco que dejó la lluvia (abajo a la izquierda)
       Si mueves esos elementos en la escena (sección 9), mueve la pista.
    --------------------------------------------------- */
    garden: {
        intro: ["El jardín de octubre",
            "Tres flores se esconden entre los arbustos. Lee sus pistas, observa el jardín y revisa con E donde creas que está cada una. Q abre y cierra tus pistas.", 8500],

        flowers: [
            {
                symbol: "peony",
                clue: "1. Todo el jardín se vistió de octubre,\nmenos un árbol que se quedó en verano.\nBusca el arbusto que se acurruca a sus pies.",
                title: "Una peonía",
                text: "Delicada y hermosa. Como la belleza que florece incluso cuando nadie la está mirando. Quizá por eso esta flor tenía algo de ti."
            },
            {
                symbol: "tulip",
                clue: "2. Es el más antiguo y el más alto de todos;\nsu copa casi roza el borde del cielo.\nAl lado, un arbusto escucha sus historias desde hace años.",
                title: "Un tulipán",
                text: "Entre sus pétalos duerme un destello dorado. Parece recordar la luz que siempre llevas contigo."
            },
            {
                symbol: "waterlily",
                clue: "3. Cuando la lluvia se va, deja un espejo en el suelo.\nBusca el arbusto que lo vigila de cerca,\nel que prefiere un reflejo del cielo antes que la sombra de los árboles.",
                title: "Un nenúfar",
                text: "Flota tranquila sobre el agua. Incluso bajo la lluvia, algunas flores nunca olvidan cómo brillar."
            }
        ],

        third: {
            title: "La estrella te está llamando",
            text: "Algo despertó en el jardín: una luz diminuta tiembla detrás de la antigua puerta. Alguien, muy lejos, lleva tiempo intentando llegar hasta ti."
        },

        doorOpen: {
            title: "La puerta se abrió",
            text: "La antigua puerta se abrió sola y dejó escapar una luz tibia. Camina hasta ella y presiona E para entrar."
        },

        empty: [
            "Solo hojas secas.",
            "Un escarabajo asustado sale corriendo.",
            "Nada por aquí... pero huele a otoño.",
            "Aquí no hay ninguna flor.",
            "Una mariposa tardía se va volando. Nada más.",
            "Solo ramitas y un poco de rocío.",
            "Este arbusto no guarda ningún secreto.",
            "Se oye la lluvia lejana. Aquí no hay nada."
        ],

        hintAfter: 6,
        hint: "Quizá convenga volver a leer las pistas. Los arbustos no cambian de lugar, pero las pistas hablan de lo que los rodea. Q las abre."
    },

    /* ---------------------------------------------------
       CÁMARA DE LAS SOMBRAS
       Las salas se abren UNA POR UNA, siguiendo las notas:
         1) sala de arriba a la izquierda (abierta desde el inicio) -> nota 1
         2) sala de arriba a la derecha (la del brasero)            -> nota 2
         3) sala de piedra, abajo a la izquierda (pila seca)        -> nota 3 (adivinanza de la llave)
         4) zona oscura, abajo a la derecha                         -> la llave
       La llave está al lado de la pila CON agua (zona oscura). La pila
       SECA y el brasero son las pistas falsas de la adivinanza.
    --------------------------------------------------- */
    dungeon: {
        intro: ["La cámara de las sombras",
            "Algo se mueve en la oscuridad. Explora con cuidado: E levanta objetos y, si no hay nada cerca, lanza una explosión de luz (también con ESPACIO). Q abre tu nota.", 8000],

        tablet: {
            title: "Una tablilla grabada",
            text: "Quien camina recto solo encuentra una puerta que no cede.\nLo que se busca se guarda a los lados del camino,\ndonde nadie quiere entrar.\nSolo un camino despierta a la vez: sigue la luz."
        },

        /* Un sello de luz cierra cada sala hasta que encuentres la pista que la abre */
        gate: ["Un sello de luz", "Una barrera de luz violeta cierra el paso. Quizá una pista de otra sala la deshaga."],

        /* Las dos primeras notas: cada una te manda a la siguiente sala (la tercera es keyRiddle) */
        clueNotes: [
            "Quien busca a ciegas se pierde dos veces.\nSigue el calor de la ceniza: en la sala donde el fuego aún respira, otra nota te espera.",
            "El fuego ya dijo lo suyo.\nAhora ve donde la piedra está fría y una pila vacía recuerda el agua. Allí te espera la siguiente nota."
        ],

        /* Mensaje al abrirse cada sala (ne = brasero | sw = piedra | se = zona oscura) */
        unlock: {
            ne: ["Un camino se iluminó", "El sello del otro lado del pasillo se deshizo y dejó una luz cálida. Ve hacia allí."],
            sw: ["Un camino se iluminó", "Se abrieron los sellos de la sala de piedra. Un resplandor te indica por dónde ir."],
            se: ["El último camino", "La zona oscura se abrió. La llave tiene que estar ahí, aunque la luz apenas llegue."]
        },

        lockedDoor: ["Una puerta sellada", "Tiene una cerradura con forma de estrella. Todavía falta la llave."],

        keyRiddle: "Una pila olvidó cómo beberse el cielo;\notra todavía lo guarda, quieto como un espejo.\nVisita a la que aún guarda agua, allí donde la luz apenas alcanza el suelo.\nAlgo duerme a su lado.",

        noteTitle: "Una nota arrugada",

        wakeUp: ["Las sombras despiertan",
            "Algo se agitó en las salas vecinas. Esquiva, huye o lánzales una explosión de luz con E.", 5600],

        sealed: ["Atascada",
            "La tapa no cede. Quizá necesites saber qué buscas antes de insistir."],

        ambush: ["Una sombra", "Algo salió de la vasija."],

        heal: ["Una luz de vida", "Una luz tibia te devuelve algo de fuerza."],

        /* Lo que hay en las vasijas que podrían esconder la llave pero no la tienen */
        decoys: {
            dry: "Solo arena seca. La pila olvidó el agua hace mucho tiempo, y ya no guarda nada.",
            brazier: "Ceniza tibia. Aquí la luz sí llega, y precisamente por eso nada se esconde."
        },

        empty: [
            "Solo polvo.",
            "Telarañas y silencio.",
            "Está vacío.",
            "Nada, salvo una pequeña grieta.",
            "Una moneda oxidada. Sin valor."
        ],

        keyFound: ["La llave de la estrella",
            "El agua tembló y la llave brilló en tus manos. Las sombras retroceden: la puerta del fondo del pasillo te espera.", 5600],

        doorOpen: ["La puerta cedió",
            "La cerradura con forma de estrella encajó. Camina hasta la puerta y presiona E.", 4600],

        defeat: {
            title: "Las sombras te alcanzaron",
            lines: [
                "Respira. Tu luz sigue ahí.",
                "La estrella no se rinde, y tú tampoco.",
                "Las sombras aprenden tus pasos... y tú aprendes los suyos."
            ],
            tips: [
                "Las sombras dormidas despiertan si te acercas demasiado. Rodéalas o espera a que se alejen.",
                "Cuando una sombra brilla en rosa, va a atacar: muévete antes de que termine.",
                "La explosión de luz (E) también borra los proyectiles."
            ]
        }
    },

    /* ---------------------------------------------------
       BOSQUE DE LAS MELODÍAS
       Las campanas se numeran de izquierda a derecha (1 a 4):
       1 = rosa, 2 = dorada, 3 = lila, 4 = crema.
       sequence = el orden correcto. notes = la nota (Hz) de cada campana.
       Ejemplo de notas: 523.25 Do, 587.33 Re, 659.25 Mi, 698.46 Fa,
       783.99 Sol, 880 La, 987.77 Si, 1046.5 Do agudo

       La nota baja flotando desde lo alto hasta un claro en el centro del bosque
       (se ve caer) y su adivinanza apunta al círculo de flores del suelo. Las pistas falsas son el
       tronco hueco, el árbol del farol y el tronco caído.
    --------------------------------------------------- */
    forest: {
        sequence: [2, 4, 1, 3, 2],
        notes: [523.25, 659.25, 783.99, 1046.5],

        intro: ["El bosque de las melodías",
            "Las campanas van a cantar una melodía. Escúchala con atención y fíjate en cuáles se iluminan: después será tu turno.", 6200],

        yourTurn: ["Ahora es tu turno", "Toca las campanas en el mismo orden. La piedra del centro la repite.", 4200],

        wrong: ["La melodía se perdió...", "Las notas se desvanecieron. Escucha otra vez.", 3200],

        busy: ["Escucha primero", "Las campanas todavía están cantando."],

        success: ["La melodía está completa",
            "Las campanas brillaron todas juntas... y una nota empezó a caer flotando entre los árboles. Mira cómo baja.", 5600],

        noteTitle: "Una nota entre las hojas",
        noteRiddle: "Algunos secretos viven en el pecho de los árboles, otros cuelgan de su luz.\nEste prefiere el suelo, donde nadie plantó flores y aun así forman un círculo, como si esperaran una canción.",

        spots: {
            hollow: ["El tronco hueco", "Dentro solo hay una pluma y el eco de un pájaro. No es lo que buscas."],
            lantern: ["El árbol del farol", "El farol sigue encendido, pero al pie del árbol solo hay raíces y musgo."],
            log: ["El tronco caído", "Un caracol dormido y mucha corteza. Nada que abra una puerta."]
        },

        keyFound: ["La llave de cristal",
            "Entre los pétalos del círculo brilló una llave diminuta, como hecha de campanas. La puerta del bosque la reconoce.", 5600],

        doorOpen: ["El camino se ilumina", "La puerta del bosque se abrió. La estrella estuvo aquí hace poco."]
    },

    /* ---------------------------------------------------
       BIBLIOTECA
       Cadena: nota de la ventana -> libro VERDE (mesa izquierda) -> libro
       AZUL (mesa de abajo) -> libro LILA sin adorno (estante junto a la puerta).
       Las notas son adivinanzas: no dicen "libro", ni el color tal cual.
       Si cambias los colores de los libros en la sección 12, cambia las notas.
    --------------------------------------------------- */
    library: {
        intro: "Hay una nota pegada en la ventana del fondo. Acércate y léela con E. Q abre tus notas.",

        notes: [
            "Aquí casi todo se vistió de octubre, menos una cosa que se quedó en verano.",
            "Los jardines también aprenden a despedirse.\nBusca lo que queda cuando la lluvia se cansa: un cielo recién lavado",
            "Lo más importante casi nunca quiere llamar la atención.\nViste el séptimo color del arcoíris y se esconde entre los suyos."
        ],

        /* Lo que se encuentra al abrir cada libro. id = el libro en la escena. */
        books: {
            tea:    { title: "Té para días de lluvia", text: "Recetas de té con canela y miel. En una página alguien escribió: «Lo mejor se toma despacio». Es un libro bonito, pero no es el que buscas." },
            garden: { title: "El jardín antes del otoño", text: "Habla de un jardín que se negaba a envejecer. Entre sus páginas hay una nota doblada.", early: "Un libro verde que habla de un jardín que se resiste al otoño. Algo te dice que todavía no es su turno." },
            map:    { title: "Atlas de constelaciones", text: "Un mapa de estrellas con varias páginas arrancadas. Una constelación está rodeada a lápiz, pero nadie la nombró." },
            moon:   { title: "Cuaderno de la luna", text: "Lleva una luna en la portada. Se siente cercano, como si le faltara alguien a su lado... pero no es el que buscas." },
            poems:  { title: "Poemas de octubre", text: "Poemas sobre hojas, hogueras y días cortos. Uno dice que las despedidas son solo caminos que aún no se cruzaron. Muy bonito, pero no es el que buscas." },
            sky:    { title: "El cielo después de la lluvia", text: "Habla de cómo el aire se vuelve claro cuando deja de llover. Entre las páginas asoma una nota.", early: "Un libro azul sobre cielos que se despejan. Parece importante, pero todavía no sabes por qué." },
            flowers:{ title: "Diccionario de flores", text: "Cada flor tiene un significado. La peonía significa «vergüenza sin motivo», el tulipán «declaración». Útil, aunque hoy no te sirve." },
            letters:{ title: "Cartas que nunca se enviaron", text: "Cartas dobladas con cuidado, todas sin sobre. La última termina con «ojalá lo sepas». No es el libro que buscas, pero dan ganas de enviarla." },
            sea:    { title: "Faros y mareas", text: "Una novela larguísima sobre un faro que guía barcos que nunca llegan. Muy bonita, pero no es." },
            melody: { title: "La melodía de Mey" },
            coat:   { title: "Historia de un abrigo", text: "El libro trata de un abrigo que pasa de mano en mano y abriga a cada dueño distinto. Cálido, pero no es el que buscas." },
            songs:  { title: "Canciones para cuando nadie escucha", text: "Letras de canciones copiadas a mano, con corazones en los márgenes y una nota: «este estribillo me recuerda a alguien». No es lo que buscas." }
        },

        starLocked: ["Un libro callado",
            "Algo te dice que todavía no es el momento. Sigue las pistas de las notas."],

        already: ["Ya revisaste este libro", "La nota que había ya está en tu panel de notas."],

        bookTitle: "La melodía de Mey",
        bookSubtitle: "Un libro escrito para ti",

        /* El libro final: aparece despacio, línea por línea */
        finalBook: {
            lines: [
                "Este libro llegó a su última página.",
                "Pero eso no significa que haya terminado.",
                "Puedes abrirlo otra vez cuando el día pese demasiado: con la lluvia afuera, con una canción en los audífonos, con la certeza de que adentro siempre vas a encontrar lo mismo.",
                "A una chica que ilumina sin darse cuenta, que se ríe de sus propias ocurrencias y que convierte octubre en su lugar favorito.",
                "Habrá días en que el mundo intente bajar la luz de las personas bonitas.",
                "No se lo permitas.",
                "No dejes que nada ni nadie apague tu brillo."
            ],
            button: "CERRAR EL LIBRO"
        },

        doorOpen: ["Una puerta se abre", "Entre las estanterías, una puerta dorada se iluminó. Camina hasta ella y presiona E."]
    },

    /* ---------------------------------------------------
       LUNA Y ESTRELLA: los recuerdos que se recogen antes del final
    --------------------------------------------------- */
    moon: {
        intro: ["La colina de la noche",
            "Cuatro luces flotan sobre la colina. Acércate a cada una y presiona E para recordar.", 5600],

        memories: [
            { title: "Tú y yo", text: "Una estrella y una luna, a muchos kilómetros de distancia. Dos piezas distintas que nunca se confunden y que aun así se reconocen siempre." },
            { title: "Las pequeñas cosas", text: "Los mensajes a cualquier hora, las canciones que que nos recuerdan a la otra. Lo pequeño, cuando es de dos, se vuelve enorme." },
            { title: "La distancia", text: "Hay kilómetros entre las dos, pero la distancia no mide cuánto nos queremos: mide cuánto nos esforzamos por seguir cerca. Y lo vamos haciendo muy bien." },
            { title: "Tu brillo", text: "Cuando ríes, cuando hablas de tus juegos, tus animes o tu música, algo en ti se enciende. Esa luz no es de nadie más. Es justo lo que la estrella vino a buscar." }
        ],

        cardButton: "GUARDAR RECUERDO",
        altarReady: "Las cuatro luces se unieron. En lo alto de la colina apareció una piedra con un brillo dorado.",
        altarUse: "Al tocar la piedra, la estrella volvió al cielo. Había estado ahí siempre, junto a la luna."
    },

    /* ---------------------------------------------------
       LA CARTA — cada texto entre comillas es un párrafo.
       Puedes cambiar lo que quieras: agrega recuerdos reales
       (una fecha, una broma, una canción) para hacerla más tuya.
    --------------------------------------------------- */
    letter: {
        title: "Para Mey",
        paragraphs: [
            "Feliz cumpleaños, Mey. Si estás leyendo esto es porque lograste lo que la estrella no pudo sola: llegar hasta ti.",
            "Quise hacerte este juego porque un mensaje no me alcanzaba. Quería que tuvieras algo que se pudiera recorrer, como si cada flor, cada campana y cada libro fueran una forma de decirte: pienso en ti, y me importas más de lo que a veces sé explicar.",
            "Sabes bien que estamos lejos. Hay kilómetros enteros de por medio y no podemos vernos como quisiéramos. Pero la distancia nunca ha podido cambiar lo que somos. Las pláticas, las anécdotas y lo que compartimos aun desde lejos... todo eso nos mantiene cerca, mucho más de lo que cualquier mapa podría decir.",
            "Por eso hice la refrencia a la pulsera de la luna y la estrella que una vez llegamos a compartir. Dos piezas distintas que no necesitan estar en el mismo lugar para pertenecerse. Si algún día una se pierde en la noche, la otra sabe exactamente dónde esperarla.",
            "Quiero que recuerdes algo: eres hermosa por fuera y por dentro, divertida, soñadora, y la clase de persona que hace más bonito octubre. No permitas que nada apague tu brillo. Y cuando se te olvide cómo brillas, vuelve a esta carta: aquí está la prueba de que alguien lo ve todo el tiempo."
        ],
        sign: "Te amo, mi niña preciosa."
    },

    /* Pantalla final */
    final: {
        line0: "Después de todo este viaje, finalmente llegaste.",
        line1: "Feliz cumpleaños, Mey.",
        line2: "Aunque estemos lejos, seguimos conectadas.",
        line3: "Nunca dejes de ser tú."
    }
};


/* =====================================================
   2. ESCALA Y CONSTANTES
   (en pantallas pequeñas todo se hace un poco más chico)
===================================================== */

let S = 1;

function resize() {
    // S = escala del "mundo" (arbustos, Mey, enemigos...)
    S = clamp(Math.min(innerWidth / 1000, innerHeight / 620), 0.4, 1);
    // U = escala de la interfaz (textos, cuadros, márgenes)
    const U = clamp(Math.min(innerWidth / 900, innerHeight / 480), 0.5, 1);
    // T = escala de los botones táctiles (nunca tan chicos que cueste tocarlos)
    const T = Math.max(U, 0.8);
    const st = document.documentElement.style;
    st.setProperty("--s", S);
    st.setProperty("--u", U);
    st.setProperty("--t", T);
    fitAll();
}

/* ---------- AJUSTE AUTOMÁTICO DE BLOQUES DE CONTENIDO ----------
   Inicio, prólogo, final y tarjetas (carta, libros, notas) se achican
   lo necesario para caber completos en cualquier pantalla. */
function fitBlock(el, maxW, maxH, origin, min) {
    if (!el || !el.offsetParent && getComputedStyle(el).position !== "fixed") return 1;
    el.style.scale = "1";
    el.style.transformOrigin = origin;
    const w = el.scrollWidth || 1, h = el.scrollHeight || 1;
    const k = Math.max(min, Math.min(1, maxW / w, maxH / h));
    el.style.scale = String(k);
    return k;
}

function fitAll() {
    const W = innerWidth, H = innerHeight;
    fitBlock(document.querySelector(".title-container"),     W - 24, H - 16, "50% 50%", 0.3);
    fitBlock(document.querySelector(".prologue-container"),  W - 24, H - 16, "50% 50%", 0.3);
    // En el final, el texto se acomoda debajo de la luna y la estrella cuando la pantalla es baja
    let skyBottom = 0;
    const moon = document.querySelector(".final-moon");
    if (H <= 520 && moon && moon.offsetParent) skyBottom = moon.offsetTop + moon.offsetHeight + 4;
    fitBlock(document.querySelector(".final-text"), W - 8, Math.min(H * 0.86, H * 0.88 - skyBottom), "50% 100%", 0.3);
    fitCard();
}

function fitCard() {
    const card = document.getElementById("card");
    const ov = document.getElementById("overlay");
    if (!card || !ov || ov.classList.contains("hidden")) return;
    const W = innerWidth, H = innerHeight;
    card.style.maxHeight = "none";
    const k = fitBlock(card, W - 24, H - 20, "50% 50%", 0.8);
    // si ni así cabe (texto largo), el texto se desliza dentro de la tarjeta
    // y el botón se queda fijo abajo, siempre visible
    if (card.scrollHeight * k > H - 20) card.style.maxHeight = ((H - 20) / k) + "px";
}

window.addEventListener("resize", resize);
window.addEventListener("orientationchange", () => setTimeout(resize, 250));
resize();

const SPEED = 230;            // velocidad de Mey (px/seg)
const REACH = 90;             // distancia para interactuar
const PLAYER_R = 14;          // "grosor" de Mey para colisiones

const PLAYER_MAX_HP = 100;
const ATTACK_DAMAGE = 25;
const ATTACK_RANGE = 115;     // radio de la explosión de luz
const ATTACK_COOLDOWN = 0.6;  // segundos

/* Las sombras (cada tipo tiene su propia forma de pelear) */
const SHADOW = {
    melee: {
        hp: 75, patrol: 52, chase: 112,
        detect: 175, sleepDetect: 125,   // a qué distancia ven a Mey (px)
        reach: 70,                        // a qué distancia empiezan a atacar
        tele: 78,                         // radio del golpe (px): sal de ahí mientras brilla
        dmg: 12, wind: 0.6, rec: 0.75
    },
    caster: {
        hp: 55, patrol: 46, chase: 84,
        detect: 215, sleepDetect: 140,
        keep: 215,                        // distancia a la que prefiere quedarse
        dmg: 10, wind: 0.78, rec: 0.95
    }
};


/* =====================================================
   3. AUDIO
===================================================== */

let audioCtx = null;

function initAudio() {
    if (audioCtx) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (Ctx) audioCtx = new Ctx();
}

function playNote(freq, delay = 0, dur = 0.55, vol = 0.05, type = "sine") {
    if (!audioCtx) return;
    const t = audioCtx.currentTime + delay;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(vol, t + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(t);
    osc.stop(t + dur + 0.05);
}

const sounds = {
    pick: () => [1046.5, 1318.5, 1568].forEach((f, i) => playNote(f, i * 0.09)),
    flower: () => [784, 988, 1175, 1568].forEach((f, i) => playNote(f, i * 0.11, 0.9, 0.05)),
    defeat: () => [880, 659.3, 440].forEach((f, i) => playNote(f, i * 0.1, 0.6, 0.04)),
    attack: () => { playNote(196, 0, 0.18, 0.03, "triangle"); playNote(392, 0.02, 0.26, 0.02); },
    hit: () => playNote(150, 0, 0.14, 0.04),
    hurt: () => { playNote(110, 0, 0.3, 0.06, "sawtooth"); playNote(82, 0.05, 0.3, 0.04, "triangle"); },
    wrong: () => [330, 262].forEach((f, i) => playNote(f, i * 0.12, 0.3, 0.04)),
    alert: () => [700, 930].forEach((f, i) => playNote(f, i * 0.07, 0.18, 0.025, "square")),
    slash: () => { playNote(130, 0, 0.22, 0.05, "sawtooth"); playNote(95, 0.03, 0.22, 0.035, "triangle"); },
    bolt: () => playNote(520, 0, 0.16, 0.02, "triangle"),
    reveal: () => playNote(240, 0, 0.5, 0.015, "triangle"),
    ring: (f) => { playNote(f, 0, 1.4, 0.07); playNote(f * 2.76, 0, 0.5, 0.018); playNote(f * 5.4, 0, 0.25, 0.008); },
    page: () => { playNote(300, 0, 0.12, 0.012, "triangle"); playNote(420, 0.06, 0.1, 0.01, "triangle"); },
    door: () => { playNote(98, 0, 1.2, 0.05, "triangle"); [523, 659, 784, 1047].forEach((f, i) => playNote(f, 0.25 + i * 0.16, 1.4, 0.04)); },
    win: () => CONFIG.forest.sequence.forEach((n, i) => playNote(CONFIG.forest.notes[n - 1], i * 0.28, 1.2, 0.07)),
    rise: () => [523, 659, 784, 1047, 1318].forEach((f, i) => playNote(f, i * 0.25, 1.6, 0.05))
};

/* Música ambiental suave (o tus archivos de CONFIG.music) */
const MOODS = {
    start: { notes: [523, 659, 784, 880, 1047], every: 2600, vol: 0.02 },
    garden: { notes: [392, 494, 587, 659, 784], every: 1900, vol: 0.02 },
    dungeon: { notes: [196, 233, 262, 311, 349], every: 1700, vol: 0.028 },
    forest: { notes: [523, 587, 659, 784, 880], every: 1400, vol: 0.018 },
    library: { notes: [330, 392, 440, 494, 587], every: 2300, vol: 0.02 },
    moon: { notes: [440, 523, 659, 784, 988], every: 2100, vol: 0.02 },
    final: { notes: [523, 659, 784, 1047], every: 2400, vol: 0.022 }
};

let musicTimer = null;
let musicFile = null;
let rainNode = null;

function setMusic(name) {
    clearInterval(musicTimer);
    if (musicFile) { musicFile.pause(); musicFile = null; }
    if (!name) return;

    const file = CONFIG.music[name];
    if (file) {
        musicFile = new Audio(file);
        musicFile.loop = true;
        musicFile.volume = 0.45;
        musicFile.play().catch(() => { });
        return;
    }

    const m = MOODS[name];
    if (!audioCtx || !m) return;
    const tick = () => playNote(m.notes[Math.floor(Math.random() * m.notes.length)], 0, 2.4, m.vol);
    tick();
    musicTimer = setInterval(tick, m.every);
}

function setRain(on) {
    if (!audioCtx) return;
    if (!on && rainNode) { rainNode.stop(); rainNode = null; return; }
    if (on && !rainNode) {
        const len = audioCtx.sampleRate * 2;
        const buf = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
        const src = audioCtx.createBufferSource();
        src.buffer = buf;
        src.loop = true;
        const filter = audioCtx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 1100;
        const gain = audioCtx.createGain();
        gain.gain.value = 0.045;
        src.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);
        src.start();
        rainNode = src;
    }
}


/* =====================================================
   3b. ILUSTRACIONES EXTRA (se agregan a la biblioteca de SVG)
   Aquí solo se suman dibujos nuevos; los de index.html no se tocan.
===================================================== */

(function addSymbols() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "0");
    svg.setAttribute("height", "0");
    svg.setAttribute("aria-hidden", "true");
    svg.style.position = "absolute";
    svg.innerHTML = `
        <!-- SOMBRA LANZADORA: la misma sombra, con una corona y una luz que flota -->
        <symbol id="caster" viewBox="0 0 100 100">
            <use href="#shadow"></use>
            <path d="M30,16 L36,2 L44,13 L50,0 L56,13 L64,2 L70,16 Z" fill="#4a3a5a" stroke="#b79ad0" stroke-width="2" stroke-linejoin="round"></path>
            <circle cx="50" cy="8" r="4.5" fill="#ffb8d6" stroke="#fff" stroke-width="1"></circle>
        </symbol>`;
    document.body.prepend(svg);
})();


/* =====================================================
   4. DIÁLOGOS Y MENSAJE DE INTERACCIÓN
===================================================== */

const dialogueBox = $("dialogue");
const promptEl = $("prompt");

let dialogueQueue = [];
let dialogueTimer = null;

/* En celular, los textos que hablan de teclas se cambian por los botones táctiles */
const TOUCH_TEXT = [
    [/ \(también con ESPACIO\)/g, ""],
    [/E levanta objetos y, si no hay nada cerca, lanza una explosión de luz/g, "INTERACTUAR levanta objetos y ATACAR lanza una explosión de luz"],
    [/E levanta objetos · E libre ataca/g, "INTERACTUAR levanta objetos · ATACAR lanza luz"],
    [/ Q abre y cierra tus pistas\./g, " Toca el recuadro de pistas para abrirlo o cerrarlo."],
    [/ Q las abre\./g, " Toca el recuadro de pistas para abrirlas."],
    [/ Q abre (tu nota|tus notas)\./g, " Toca el recuadro de notas para abrirlo."],
    [/presiona E/g, "toca INTERACTUAR"],
    [/explosión de luz con E\b/g, "explosión de luz con ATACAR"],
    [/\(E\)/g, "(ATACAR)"],
    [/con E\b/g, "con INTERACTUAR"]
];

function touchText(t) {
    if (!isTouch || typeof t !== "string") return t;
    return TOUCH_TEXT.reduce((out, [re, to]) => out.replace(re, to), t);
}

function say(title, text, ms = 3600) {
    dialogueQueue.push({ title, text: touchText(text), ms });
    if (!dialogueTimer) showNextDialogue();
}

function showNextDialogue() {
    const next = dialogueQueue.shift();
    if (!next) {
        dialogueTimer = null;
        dialogueBox.classList.add("hidden");
        return;
    }
    $("dialogue-title").textContent = next.title;
    $("dialogue-text").textContent = next.text;
    dialogueBox.classList.remove("hidden");
    dialogueTimer = setTimeout(showNextDialogue, next.ms);
}

function clearDialogue() {
    dialogueQueue = [];
    clearTimeout(dialogueTimer);
    dialogueTimer = null;
    dialogueBox.classList.add("hidden");
}

function showPrompt(text) {
    promptEl.textContent = text;
    promptEl.classList.remove("hidden");
}

function hidePrompt() {
    promptEl.classList.add("hidden");
}


/* =====================================================
   5. TARJETAS (libro, notas, recuerdos y carta)
===================================================== */

let paused = false;

function showCard({ html, button = "CONTINUAR", cls = "", onClose }) {
    const card = $("card");
    card.className = cls;
    card.innerHTML = `<div id="card-body">${html}</div><button id="card-btn" class="btn">${button}</button>`;
    $("overlay").classList.remove("hidden");
    fitCard();
    paused = true;
    keys.clear();
    hidePrompt();

    $("card-btn").onclick = () => {
        $("overlay").classList.add("hidden");
        paused = false;
        if (onClose) onClose();
    };
}


/* =====================================================
   6. CONTROLES
===================================================== */

const keys = new Set();

const KEY_MAP = {
    w: "up", arrowup: "up",
    s: "down", arrowdown: "down",
    a: "left", arrowleft: "left",
    d: "right", arrowright: "right"
};

document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();

    if (KEY_MAP[key]) {
        keys.add(KEY_MAP[key]);
        e.preventDefault();
        return;
    }

    if (key === "e" && !e.repeat) {
        interact();
        e.preventDefault();
    }

    if (key === " ") {
        action();
        e.preventDefault();
    }

    /* Q abre y cierra el panel de pistas */
    if (key === "q" && !e.repeat) {
        if (currentScene && currentScene.toggleClues) currentScene.toggleClues();
        e.preventDefault();
    }
});

document.addEventListener("keyup", (e) => {
    const key = e.key.toLowerCase();
    if (KEY_MAP[key]) keys.delete(KEY_MAP[key]);
});

window.addEventListener("blur", () => keys.clear());

/* Cruceta táctil */
document.querySelectorAll("[data-dir]").forEach((btn) => {
    const dir = btn.dataset.dir;

    btn.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        keys.add(dir);
        btn.classList.add("active");
    });

    ["pointerup", "pointerleave", "pointercancel"].forEach((name) => {
        btn.addEventListener(name, () => {
            keys.delete(dir);
            btn.classList.remove("active");
        });
    });
});

$("touch-interact").addEventListener("pointerdown", (e) => {
    e.preventDefault();
    interact();
});

$("touch-attack").addEventListener("pointerdown", (e) => {
    e.preventDefault();
    action();
});

document.addEventListener("contextmenu", (e) => e.preventDefault());

/* Acción principal (ESPACIO / botón ATACAR): atacar en el calabozo */
function action() {
    if (changing) return;
    if (paused) {
        const btn = $("card-btn");
        if (btn) btn.click();
        return;
    }
    if (currentScene && currentScene.onAction) currentScene.onAction();
    else interact();
}

/* E: interactuar con lo que tengas cerca. Si no hay nada, en el calabozo ataca. */
function interact() {
    if (changing) return;
    if (paused) {
        const btn = $("card-btn");
        if (btn) btn.click();
        return;
    }
    if (currentScene && currentScene.interact) currentScene.interact();
}


/* =====================================================
   7. PARTÍCULAS
===================================================== */

const LEAF_COLORS = ["#d9894a", "#c96f4a", "#e0a85a", "#d98f9f", "#b8754a"];
const PETAL_COLORS = ["#f2b5c6", "#e9a2b8", "#f6d0a8", "#e8c470"];

function spawn(container, kind, count) {
    for (let i = 0; i < count; i++) {
        const p = document.createElement("span");
        p.className = `particle ${kind}`;
        p.style.left = `${Math.random() * 100}%`;
        p.style.setProperty("--size", `${(kind === "leaf" || kind === "petal" ? 14 : 8) + Math.random() * 14}px`);
        p.style.setProperty("--dur", `${(kind === "rain" ? 0.7 : 9) + Math.random() * (kind === "rain" ? 0.5 : 7)}s`);
        p.style.setProperty("--delay", `${-Math.random() * 14}s`);

        if (kind === "leaf" || kind === "petal") {
            const colors = kind === "leaf" ? LEAF_COLORS : PETAL_COLORS;
            p.style.color = colors[i % colors.length];
            p.innerHTML = '<svg viewBox="0 0 30 30"><use href="#leaf"></use></svg>';
        }

        if (kind === "twinkle") {
            p.style.top = `${Math.random() * 100}%`;
            p.innerHTML = '<svg viewBox="0 0 100 100"><use href="#star"></use></svg>';
        }

        if (kind === "firefly") {
            p.style.top = `${20 + Math.random() * 70}%`;
        }

        container.appendChild(p);
    }
}


/* =====================================================
   8. ZONA JUGABLE (base de todas las escenas con movimiento)

   Cada escena define build() con sus objetos y reglas.
   Aquí vive lo común: mover a Mey, colisiones (círculos y muros),
   interacción, puertas que se abren, chispas y panel de pistas.
===================================================== */

class Zone {

    constructor(opts) {

        Object.assign(this, {
            playable: true,
            dark: false,
            music: "",
            rain: false,
            cls: "",
            fx: [],
            start: { x: 50, y: 80 },
            bounds: { x0: 4, x1: 96, y0: 22, y1: 92 },
            touchLabel: "INTERACTUAR",
            cluesOpenMs: 22000        // el panel de pistas empieza abierto y se cierra solo
        }, opts);

        this.obstacles = [];
        this.things = [];
        this.near = null;
        this.finished = false;

        /* Se crea la pantalla una sola vez */
        const s = document.createElement("section");
        s.id = `${this.id}-screen`;
        s.className = `screen zone hidden ${this.cls}`;
        s.innerHTML = `
            <div class="hud">
                <div class="hud-title">${this.title}</div>
                <div class="hud-goal"></div>
            </div>
            <div class="world"></div>
            <div class="fx"></div>`;
        game.insertBefore(s, promptEl);

        this.screen = s;
        this.world = s.querySelector(".world");
        this.fxEl = s.querySelector(".fx");
        this.goalEl = s.querySelector(".hud-goal");
    }


    /* ---------- entrada ---------- */

    enter() {
        clearTimeout(this.cluesTimer);
        this.world.innerHTML = "";
        this.fxEl.innerHTML = "";
        this.screen.classList.remove("lit", "starlit");
        this.setClues();
        this.obstacles = [];
        this.things = [];
        this.near = null;
        this.finished = false;
        this.locked = false;
        this.facing = null;
        this.doorThing = null;
        this.doorOpen = false;
        this.x = this.start.x;
        this.y = this.start.y;

        this.fx.forEach(([kind, n]) => spawn(this.fxEl, kind, n));

        this.build();

        this.player = this.obj("player", this.x, this.y, {
            ay: 90,
            html: '<svg class="sprite"><use href="#mey"></use></svg>'
        });
        this.face("down");

        $("touch-interact").textContent = this.touchLabel;

        if (this.intro && !this.skipIntro) say(...this.intro);
        this.skipIntro = false;
    }

    leave() {
        hidePrompt();
        keys.clear();
        clearTimeout(this.cluesTimer);
        if (this.player) this.player.classList.remove("walking");
    }


    /* ---------- crear objetos ---------- */

    place(el, x, y) {
        el.style.left = `${x}%`;
        el.style.top = `${y}%`;
        el.style.zIndex = Math.floor(y);
    }

    /* Objeto en el mundo. ay = punto de anclaje vertical (% de su alto) */
    obj(cls, x, y, { ay = 100, html = "", k = 1 } = {}) {
        const el = document.createElement("div");
        el.className = `obj ${cls}`;
        el.style.setProperty("--ay", ay);
        el.style.setProperty("--k", k);
        el.innerHTML = html;
        this.place(el, x, y);
        this.world.appendChild(el);
        return el;
    }

    /* Obstáculo circular (r en píxeles) */
    block(x, y, r) {
        const o = { x, y, r };
        this.obstacles.push(o);
        return o;
    }

    /* Muro rectangular (coordenadas en %). Se dibuja y bloquea el paso. */
    wall(x0, y0, x1, y1, cls = "") {
        this.obstacles.push({ rect: true, wall: true, x0, y0, x1, y1 });

        /* Los muros altos se dibujan en trozos para que Mey pase por detrás y por delante */
        const tall = (y1 - y0) > (x1 - x0) * 1.6;
        const step = tall ? 8 : (y1 - y0);

        for (let y = y0; y < y1 - 0.01; y += step) {
            const yEnd = Math.min(y + step, y1);
            const el = document.createElement("div");
            el.className = `dwall ${tall ? "v" : "h"} ${cls}`;
            el.style.left = `${x0}%`;
            el.style.top = `${y}%`;
            el.style.width = `${x1 - x0}%`;
            el.style.height = `${yEnd - y}%`;
            el.style.zIndex = Math.floor(yEnd) + (tall ? 0 : 1);
            this.world.appendChild(el);
        }
    }

    /* Objeto con el que se puede interactuar */
    thing(o) {
        const t = { done: false, enabled: true, ...o };
        t.el = this.obj(o.cls, o.x, o.y, o);
        this.things.push(t);
        return t;
    }

    /* Puerta de salida: se ve cerrada y, al cumplir el objetivo, se abre de verdad */
    door(x, y, onUse, locked) {
        this.doorOpen = false;
        this.doorThing = this.thing({
            cls: "adventure-door locked",
            x, y, ay: 90,
            verb: "EXAMINAR LA PUERTA",
            use: () => {
                if (!this.doorOpen) {
                    if (locked) say(locked[0], locked[1], 3400);
                    return;
                }
                onUse();
            },
            html: `<div class="door-frame">
                       <div class="door-light"></div>
                       <div class="door-wood"><div class="door-handle"></div></div>
                   </div>
                   <div class="door-label"><span>CAMINO CERRADO</span></div>`
        });
    }

    unlockDoor(title, text, ms = 5200) {
        const t = this.doorThing;
        if (!t || this.doorOpen) return;
        this.doorOpen = true;
        t.verb = "ENTRAR";
        this.near = null;                       // para que se actualice el mensaje

        t.el.classList.replace("locked", "unlocked");
        t.el.classList.add("opening");
        setTimeout(() => t.el.classList.add("open"), 60);
        t.el.querySelector(".door-label span").textContent = "ENTRAR";

        sounds.door();
        this.sparkles(t.x, t.y - 10, 30, "#ffe39a", 100);
        setTimeout(() => this.sparkles(t.x, t.y - 10, 18, "#ffd0e0", 70), 500);

        if (title) say(title, text, ms);
    }

    /* Chispas de luz que salen de un punto (magia, recompensas, golpes) */
    sparkles(x, y, n = 14, color = "#ffe39a", spread = 70) {
        const root = this.obj("spark-root", x, y, { ay: 50 });
        root.style.zIndex = 96;

        for (let i = 0; i < n; i++) {
            const sp = document.createElement("i");
            const a = Math.random() * Math.PI * 2;
            const d = spread * (0.35 + Math.random() * 0.75);
            sp.className = "spark";
            sp.style.setProperty("--dx", `${Math.cos(a) * d}px`);
            sp.style.setProperty("--dy", `${Math.sin(a) * d - 10}px`);
            sp.style.setProperty("--sz", `${4 + Math.random() * 6}px`);
            sp.style.setProperty("--c", color);
            sp.style.setProperty("--t", `${0.7 + Math.random() * 0.7}s`);
            root.appendChild(sp);
        }

        setTimeout(() => root.remove(), 1600);
    }

    setGoal(html) {
        this.goalEl.innerHTML = touchText(html);
    }


    /* ---------- panel de pistas (abajo a la izquierda) ----------
       items = [{ text, done }]. Empieza abierto y se cierra solo;
       Q (o tocar el título) lo abre y lo cierra cuando quieras. */

    setClues(title, items, open) {
        let el = this.screen.querySelector(".clues");

        if (!items || !items.length) {
            if (el) el.remove();
            return;
        }

        if (!el) {
            el = document.createElement("div");
            el.className = "clues" + (isTouch || !this.cluesOpenMs ? " collapsed" : "");
            el.innerHTML = '<button class="clues-head"></button><ul></ul>';
            el.onclick = () => this.toggleClues();
            this.screen.appendChild(el);
            if (!isTouch && this.cluesOpenMs) this.openClues(this.cluesOpenMs);
        }

        el.querySelector("button").textContent = isTouch ? title : `${title}  (Q)`;
        el.querySelector("ul").innerHTML = items
            .map((i) => `<li class="${i.done ? "done" : ""}">${i.text}</li>`)
            .join("");

        if (open) this.openClues(typeof open === "number" ? open : 14000);
    }

    openClues(ms) {
        const el = this.screen.querySelector(".clues");
        if (!el) return;
        el.classList.remove("collapsed");
        clearTimeout(this.cluesTimer);
        if (ms) this.cluesTimer = setTimeout(() => el.classList.add("collapsed"), ms);
    }

    closeClues() {
        const el = this.screen.querySelector(".clues");
        if (!el) return;
        clearTimeout(this.cluesTimer);
        el.classList.add("collapsed");
    }

    toggleClues() {
        const el = this.screen.querySelector(".clues");
        if (!el) return;
        clearTimeout(this.cluesTimer);
        el.classList.toggle("collapsed");
    }


    /* ---------- dirección del personaje ---------- */

    face(dir) {
        if (dir === this.facing) return;
        this.facing = dir;
        this.player.querySelector("use").setAttribute("href", dir === "up" ? "#mey-back" : "#mey");
        this.player.classList.toggle("flip", dir === "left");
    }


    /* ---------- bucle ---------- */

    update(dt) {
        if (paused) return;
        this.move(dt);
        if (this.tick) this.tick(dt);
        this.checkNear();
    }

    move(dt) {
        if (this.locked) {
            this.player.classList.remove("walking");
            return;
        }

        const W = this.screen.clientWidth;
        const H = this.screen.clientHeight;

        let dx = (keys.has("right") ? 1 : 0) - (keys.has("left") ? 1 : 0);
        let dy = (keys.has("down") ? 1 : 0) - (keys.has("up") ? 1 : 0);
       const moving = dx !== 0 || dy !== 0;

        // En celular, al empezar a caminar desaparecen los mensajes de arriba
        if (isTouch && moving && !this.wasMoving) clearDialogue();
        this.wasMoving = moving;
        if (moving) {
            if (isTouch) this.closeClues();   // en celular, al caminar se cierran las pistas
            const len = Math.hypot(dx, dy);
            dx /= len;
            dy /= len;

            this.face(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up"));

            const step = SPEED * S * dt;
            const nx = this.x + (dx * step / W) * 100;
            const ny = this.y + (dy * step / H) * 100;

            if (!this.hits(nx, this.y, W, H)) this.x = nx;
            if (!this.hits(this.x, ny, W, H)) this.y = ny;

            const b = this.bounds;
            this.x = clamp(this.x, b.x0, b.x1);
            this.y = clamp(this.y, b.y0, b.y1);
        }

        this.place(this.player, this.x, this.y);
        this.player.classList.toggle("walking", moving);
    }

    /* ¿Un círculo de radio pr (px) en (x, y) choca con algo? */
    hits(x, y, W, H, pr = PLAYER_R) {
        const rr = pr * S;
        return this.obstacles.some((o) => {
            if (o.rect) {
                const cx = clamp(x, o.x0, o.x1);
                const cy = clamp(y, o.y0, o.y1);
                return Math.hypot(((x - cx) / 100) * W, ((y - cy) / 100) * H) < rr * 0.85;
            }
            return Math.hypot(((x - o.x) / 100) * W, ((y - o.y) / 100) * H) < (o.r + pr) * S;
        });
    }

    pixelDistance(ax, ay, bx, by) {
        return Math.hypot(
            ((ax - bx) / 100) * this.screen.clientWidth,
            ((ay - by) / 100) * this.screen.clientHeight
        );
    }


    /* ---------- interacción ---------- */

    checkNear() {
        let best = null;
        let bestDist = REACH * S;

        for (const t of this.things) {
            if (t.done || !t.enabled) continue;
            const d = this.pixelDistance(this.x, this.y, t.x, t.y);
            if (d < bestDist && (!this.canReach || this.canReach(t))) { best = t; bestDist = d; }
        }

        if (best !== this.near) {
            this.near = best;
            if (best) showPrompt(isTouch ? "TOCA INTERACTUAR" : `PRESIONA E PARA ${best.verb}`);
            else hidePrompt();
        }
    }

    interact() {
        if (this.locked) return;
        if (this.near) this.near.use(this.near);
        else if (this.onIdle) this.onIdle();
    }
}


/* =====================================================
   9. JARDÍN DE OCTUBRE
   Las flores están escondidas DENTRO de los arbustos.
   Cada pista habla de algo que sí se ve en el jardín:
   el árbol que sigue verde, el árbol más grande y el charco.
===================================================== */

/* Arbusto donde se esconde cada flor (mismo orden que CONFIG.garden.flowers) */
const FLOWER_BUSHES = ["14,40", "80,40", "15,80"];

const gardenScene = new Zone({

    id: "garden",
    title: "El jardín de octubre",
    music: "garden",
    cls: "garden",
    fx: [["leaf", 18]],
    start: { x: 50, y: 62 },
    bounds: { x0: 4, x1: 96, y0: 26, y1: 92 },

    intro: CONFIG.garden.intro,

    build() {

        const G = CONFIG.garden;
        this.found = 0;
        this.emptyIndex = 0;
        this.wrongSearches = 0;
        this.hinted = false;

        this.flowers = G.flowers.map((f, i) => ({ ...f, bush: FLOWER_BUSHES[i] }));

        this.updateGoal();

        /* Detalles del suelo (no bloquean el paso) */
        this.obj("garden-puddle", 6, 89, { ay: 50 });                       // el espejo que dejó la lluvia
        [[48, 47, 1], [19, 53, 0.9], [66, 71, 1.1], [86, 49, 0.9]]          // montones de hojas
            .forEach(([x, y, k]) => this.obj("garden-leaves", x, y, { ay: 50, k }));

        /* Árboles [x, y, tamaño, rasgo]
           summer  = el único árbol que sigue verde
           ancient = el árbol más grande y más antiguo */
        [[7, 30, 1.25, "summer"], [20, 25, 1.05], [38, 29, 1.2], [57, 25, 1.1],
        [77, 32, 1.5, "ancient"], [93, 25, 1.1],
        [10, 68, 1.2], [33, 82, 1.15], [68, 78, 1.2], [91, 58, 1.15]]
            .forEach(([x, y, k, trait]) => {
                this.obj("garden-tree" + (trait ? ` ${trait}` : ""), x, y, { k });
                this.block(x, y, 18 * k);
            });

        /* Rocas */
        [[36, 52], [70, 52], [30, 72], [88, 66]]
            .forEach(([x, y]) => {
                this.obj("garden-rock", x, y, { ay: 50 });
                this.block(x, y, 18);
            });

        /* Arbustos: doce, y solo tres esconden una flor */
        [[14, 40, 1.1], [27, 43, 1.1], [45, 36, 1.15], [62, 42, 1.15], [80, 40, 1.1],
        [22, 62, 1.2], [42, 62, 1.2], [79, 57, 1.2], [58, 66, 1.1],
        [15, 80, 1.15], [55, 84, 1.1], [80, 84, 1.1]]
            .forEach(([x, y, k]) => {
                const f = this.flowers.find((fl) => fl.bush === `${x},${y}`);
                this.thing({
                    cls: "garden-bush", x, y, ay: 70, k,
                    verb: "REVISAR",
                    use: (t) => this.search(t, f)
                });
                this.block(x, y, 36 * k);
            });

        this.door(93, 76, () => goTo(dungeonScene),
            ["La puerta del jardín", "Está cerrada. Tres flores parecen tener la llave: encuéntralas."]);
    },

    updateGoal() {
        this.setGoal(`Flores encontradas: <span>${this.found} / 3</span>`);
        this.setClues("Pistas del jardín",
            this.flowers.map((f) => ({ text: f.clue, done: !!f.found })));
    },

    search(t, f) {
        const G = CONFIG.garden;
        t.done = true;
        t.el.classList.add("rustle", "searched");
        this.near = null;
        hidePrompt();

        if (!f) {
            say("Revisaste el arbusto", G.empty[this.emptyIndex++ % G.empty.length], 2400);

            /* Si se atora, una ayudita (una sola vez) */
            this.wrongSearches++;
            if (this.wrongSearches >= G.hintAfter && !this.hinted) {
                this.hinted = true;
                say("Un momento", G.hint, 5600);
                this.openClues(12000);
            }
            return;
        }

        /* La flor sube, brilla y se desvanece */
        const fl = this.obj("flower done", t.x, t.y - 3, {
            ay: 50,
            html: `<svg class="sprite"><use href="#${f.symbol}"></use></svg>`
        });
        fl.style.zIndex = 90;
        setTimeout(() => fl.remove(), 900);
        this.sparkles(t.x, t.y - 6, 18, "#ffc6d9", 70);

        f.found = true;
        this.found++;
        this.updateGoal();
        sounds.flower();
        say(f.title, f.text, 7200);

        if (this.found === 3) {
            this.finished = true;
            say(G.third.title, G.third.text, 7000);
            setTimeout(() => this.unlockDoor(G.doorOpen.title, G.doorOpen.text, 5600), 1000);
        }
    }
});


/* =====================================================
   10. CÁMARA DE LAS SOMBRAS

   Un pequeño calabozo con seis salas. Al principio solo ves el
   recibidor y el pasillo; las demás están a oscuras hasta que entras.

     ARRIBA IZQ.  sala de la nota        ARRIBA DER.  sala del brasero
     ABAJO IZQ.   sala de piedra         ABAJO DER.   zona oscura
     CENTRO       pasillo (arriba, con la puerta de salida) y recibidor (abajo)

   Las sombras tienen estados: dormida (idle), patrulla, alerta,
   persecución y ataque. Ven a Mey solo si tienen línea de visión
   (los muros las bloquean) y el ruido de la explosión despierta
   a las cercanas.
===================================================== */

const DUNGEON_ROOMS = {
    hall: { x0: 43, x1: 57, y0: 68, y1: 92 },
    cor:  { x0: 43, x1: 57, y0: 28, y1: 68 },
    nw:   { x0: 4,  x1: 41, y0: 28, y1: 56.4 },
    sw:   { x0: 4,  x1: 41, y0: 59.6, y1: 92 },
    ne:   { x0: 59, x1: 96, y0: 28, y1: 56.4 },
    se:   { x0: 59, x1: 96, y0: 59.6, y1: 92 }
};

/* Pasos entre salas: [punto en el hueco del muro, punto ya dentro de la otra sala] */
const DUNGEON_LINKS = {
    hall: { cor: [[50, 68], [50, 65]], sw: [[42, 81.5], [38, 81.5]], se: [[58, 81.5], [62, 81.5]] },
    cor:  { hall: [[50, 68], [50, 71]], nw: [[42, 44], [38, 44]], ne: [[58, 44], [62, 44]] },
    nw:   { cor: [[42, 44], [46, 44]], sw: [[22, 58], [22, 62]] },
    sw:   { hall: [[42, 81.5], [46, 81.5]], nw: [[22, 58], [22, 53]] },
    ne:   { cor: [[58, 44], [54, 44]], se: [[78, 58], [78, 62]] },
    se:   { hall: [[58, 81.5], [54, 81.5]], ne: [[78, 58], [78, 53]] }
};

/* Huecos de los muros que se cierran con un sello de luz.
   rooms = salas que une el hueco: se abre cuando TODAS están desbloqueadas
   (el pasillo y el recibidor siempre lo están). */
const DUNGEON_GAPS = [
    { rooms: ["nw"],       x0: 41, x1: 43, y0: 38,   y1: 50 },     // pasillo -> sala de la nota
    { rooms: ["ne"],       x0: 57, x1: 59, y0: 38,   y1: 50 },     // pasillo -> sala del brasero
    { rooms: ["sw"],       x0: 41, x1: 43, y0: 75,   y1: 88 },     // recibidor -> sala de piedra
    { rooms: ["se"],       x0: 57, x1: 59, y0: 75,   y1: 88 },     // recibidor -> zona oscura
    { rooms: ["nw", "sw"], x0: 16, x1: 28, y0: 56.4, y1: 59.6 },   // sala de la nota <-> sala de piedra
    { rooms: ["ne", "se"], x0: 72, x1: 84, y0: 56.4, y1: 59.6 }    // sala del brasero <-> zona oscura
];

/* Orden en que se abren las salas: la nota n te lleva a DUNGEON_ORDER[n] */
const DUNGEON_ORDER = ["ne", "sw", "se"];

/* El recibidor y el pasillo son un mismo espacio abierto */
const roomGroup = (r) => (r === "hall" || r === "cor") ? "main" : r;

/* Cartel de derrota (se crea una sola vez) */
function ensureDefeatOverlay() {
    let ov = $("defeat");
    if (!ov) {
        ov = document.createElement("div");
        ov.id = "defeat";
        ov.innerHTML = `<div class="defeat-box">
            <svg class="defeat-star"><use href="#star"></use></svg>
            <h3></h3><p class="defeat-line"></p><p class="defeat-tip"></p></div>`;
        game.insertBefore(ov, $("fade"));
    }
    return ov;
}

const dungeonScene = new Zone({

    id: "dungeon",
    title: "La cámara de las sombras",
    music: "dungeon",
    dark: true,
    combat: true,
    fx: [["mote", 16]],
    start: { x: 50, y: 86 },
    bounds: { x0: 4, x1: 96, y0: 28, y1: 92 },
    cluesOpenMs: 0,               // aquí el panel empieza cerrado para no tapar las salas

    intro: CONFIG.dungeon.intro,

    build() {

        this.runId = (this.runId || 0) + 1;
        this.hp = PLAYER_MAX_HP;
        this.cool = 0;
        this.inv = 0;
        this.phase = 0;          // 0 = buscar notas, 1 = buscar llave, 2 = terminado
        this.step = 0;           // cuántas notas lleva (0 a 3)
        this.open = { nw: true };   // salas desbloqueadas (al inicio solo la de la nota)
        this.beacons = [];
        this.noteThings = [];
        this.emptyIndex = 0;
        this.enemies = [];
        this.bolts = [];
        this.rage = 1;
        this.seen = { main: true };
        this.curGroup = "main";

        this.buildRooms();
        this.buildWalls();
        this.buildGates();
        this.buildProps();
        this.buildRelics();
        this.buildShadows();

        this.door(50, 33, () => goTo(forestScene), CONFIG.dungeon.lockedDoor);

        /* Barra de vida y destello de daño */
        let hpEl = this.screen.querySelector("#player-hp");
        if (!hpEl) {
            hpEl = document.createElement("div");
            hpEl.id = "player-hp";
            hpEl.innerHTML = '<div class="hp-label">VIDA</div><div class="hp-bar"><span></span></div>';
            this.screen.appendChild(hpEl);
            const flash = document.createElement("div");
            flash.className = "hit-flash";
            this.screen.appendChild(flash);
        }

        this.updateHUD();
    },


    /* ---------- construcción del calabozo ---------- */

    buildRooms() {
        this.fog = {};

        Object.entries(DUNGEON_ROOMS).forEach(([id, R]) => {
            const floor = document.createElement("div");
            floor.className = `droom r-${id}`;
            floor.style.cssText = `left:${R.x0}%;top:${R.y0}%;width:${R.x1 - R.x0}%;height:${R.y1 - R.y0}%;z-index:0`;
            this.world.appendChild(floor);

            /* Las salas laterales empiezan cubiertas de oscuridad */
            if (id === "hall" || id === "cor") return;
            const fog = document.createElement("div");
            fog.className = `room-fog ${id === "se" ? "dark-room" : ""}`;
            fog.style.cssText = `left:${R.x0}%;top:${R.y0}%;width:${R.x1 - R.x0}%;height:${R.y1 - R.y0}%`;
            this.world.appendChild(fog);
            this.fog[id] = fog;
        });

        /* Marco exterior */
        ["top", "left", "right", "bottom"].forEach((side) => {
            const f = document.createElement("div");
            f.className = `dframe ${side}`;
            this.world.appendChild(f);
        });
    },

    buildWalls() {
        const T = 2, TH = 3.2;

        /* Muros verticales a ambos lados del pasillo, con huecos de paso */
        [41, 57].forEach((x) => {
            [[28, 38], [50, 75], [88, 92.6]].forEach(([ya, yb]) => this.wall(x, ya, x + T, yb));
        });

        /* Muros horizontales entre las salas de arriba y las de abajo */
        [[4, 16], [28, 41]].forEach(([xa, xb]) => this.wall(xa, 56.4, xb, 56.4 + TH));
        [[59, 72], [84, 96]].forEach(([xa, xb]) => this.wall(xa, 56.4, xb, 56.4 + TH));

        this.walls = this.obstacles.filter((o) => o.wall);
    },

    /* Sellos de luz en los huecos: las salas se abren de una en una.
       Los huecos que ya están abiertos solo muestran una luz que indica el camino. */
    buildGates() {
        this.gates = [];

        DUNGEON_GAPS.forEach((g) => {
            const el = document.createElement("div");
            el.className = "dseal " + ((g.x1 - g.x0) > (g.y1 - g.y0) ? "h" : "v");
            el.style.cssText = `left:${g.x0}%;top:${g.y0}%;width:${g.x1 - g.x0}%;height:${g.y1 - g.y0}%;z-index:${Math.floor(g.y1)}`;
            this.world.appendChild(el);

            const gate = { ...g, el };
            this.gates.push(gate);

            if (g.rooms.every((r) => this.open[r])) {
                el.classList.add("opened");
                this.beacons.push({ el, room: g.rooms[g.rooms.length - 1] });
                return;
            }

            el.classList.add("sealed");
            gate.block = { rect: true, wall: true, x0: g.x0, y0: g.y0, x1: g.x1, y1: g.y1 };
            this.obstacles.push(gate.block);
            this.walls.push(gate.block);       // también tapa la vista y los proyectiles

            gate.thing = this.thing({
                cls: "gate-hit", x: (g.x0 + g.x1) / 2, y: (g.y0 + g.y1) / 2, ay: 50,
                verb: "EXAMINAR EL SELLO", noLos: true,
                use: () => say(CONFIG.dungeon.gate[0], CONFIG.dungeon.gate[1], 3600)
            });
        });
    },

    /* Abre una sala: deshace sus sellos y deja una luz en la entrada hasta que Mey entre */
    unlockRoom(room) {
        if (this.open[room]) return;
        this.open[room] = true;

        this.gates.forEach((g) => {
            if (!g.block || !g.rooms.includes(room) || !g.rooms.every((r) => this.open[r])) return;

            this.obstacles = this.obstacles.filter((o) => o !== g.block);
            this.walls = this.walls.filter((o) => o !== g.block);
            g.block = null;
            g.thing.done = true;
            g.el.classList.replace("sealed", "opened");
            this.beacons.push({ el: g.el, room });
            this.sparkles((g.x0 + g.x1) / 2, (g.y0 + g.y1) / 2, 22, "#ffe39a", 80);
        });

        /* La nota de esa sala brilla para que no haya que revisar todo */
        const nt = this.noteThings[DUNGEON_ORDER.indexOf(room) + 1];
        if (nt) nt.el.classList.add("clue-glow");

        this.near = null;
        sounds.reveal();
        setTimeout(() => sounds.pick(), 250);
        const U = CONFIG.dungeon.unlock[room];
        if (U) say(U[0], U[1], 4800);
    },

    buildProps() {
        /* Recibidor: antorchas, alfombra y una tablilla */
        this.obj("dtorch", 42, 72, { ay: 90 });
        this.obj("dtorch", 58, 72, { ay: 90 });
        this.thing({
            cls: "dtablet", x: 50, y: 76, ay: 100,
            verb: "LEER LA TABLILLA",
            use: () => {
                const T = CONFIG.dungeon.tablet;
                showCard({ cls: "letter", html: `<h3>${T.title}</h3><p class="clue">${T.text}</p>`, button: "SEGUIR" });
            }
        });

        /* Pasillo: dos estatuas hacen un paso estrecho */
        [[46, 64], [54, 64]].forEach(([x, y]) => {
            this.obj("dstatue", x, y, { ay: 100 });
            this.block(x, y, 12);
        });

        /* Sala del brasero (arriba a la derecha) */
        this.obj("dbrazier", 78, 40, { ay: 90 });
        this.block(78, 40, 14);

        /* Las dos pilas: la seca (sala de piedra) y la que aún guarda agua (zona oscura) */
        this.obj("dbasin dry", 14, 80, { ay: 60 });
        this.block(14, 80, 24);
        this.obj("dbasin water", 80, 80, { ay: 60 });
        this.block(80, 80, 24);

        /* Rocas y escombros: estorban y esconden, pero no guardan nada */
        [[14, 38], [9, 43],                 // sala de la nota
         [28, 66], [33, 89],                // sala de piedra
         [63, 52], [93, 34],                // sala del brasero
         [64, 82], [93, 70]]                // zona oscura
            .forEach(([x, y]) => {
                this.obj("dungeon-rock", x, y, { ay: 50 });
                this.block(x, y, 26);
            });
    },

    buildRelics() {
        /* Objetos que se pueden levantar.
           has:  note = la nota | key = la llave | heal = recupera vida | ambush = sale una sombra
           cand: vasija que podría esconder la llave (no se abre hasta leer la nota) */
        this.items = [
            { x: 46, y: 88, type: "jar" },                                   // recibidor
            { x: 7, y: 33, type: "crate", has: "note", n: 0 },               // sala de la nota (rincón): nota 1
            { x: 64, y: 35, type: "crate", has: "note", n: 1 },              // sala del brasero: nota 2
            { x: 8, y: 89, type: "crate", has: "note", n: 2 },               // sala de piedra: nota 3 (la adivinanza)
            { x: 21, y: 49, type: "jar" },
            { x: 33, y: 32, type: "jar", has: "ambush" },
            { x: 7, y: 52, type: "crate", has: "heal" },
            { x: 19, y: 85, type: "jar", cand: "dry" },                      // junto a la pila seca
            { x: 8, y: 66, type: "crate", has: "heal" },
            { x: 82, y: 44, type: "jar", cand: "brazier" },                  // junto al brasero
            { x: 93, y: 50, type: "crate", has: "heal" },
            { x: 86, y: 74, type: "jar", cand: "water", has: "key" },        // junto a la pila con agua
            { x: 70, y: 88, type: "crate" },
            { x: 92, y: 88, type: "jar", has: "ambush" }
        ];

        this.items.forEach((it) => {
            const t = this.thing({
                cls: `relic ${it.type}`,
                x: it.x, y: it.y, ay: 100,
                verb: "LEVANTAR",
                html: '<div class="relic-body"></div>',
                use: (th) => this.lift(th, it)
            });
            t.blocker = this.block(it.x, it.y, 16);

            if (it.has === "note") {
                this.noteThings[it.n] = t;
                if (it.n === 0) t.el.classList.add("clue-glow");     // la primera brilla desde el inicio
            }
        });
    },

    buildShadows() {
        /* idle = duerme hasta que te acercas | patrol = recorre una ruta */
        this.spawnShadow({ type: "melee", x: 50, y: 44, state: "patrol", route: [[50, 36], [50, 60]] });                       // pasillo
        this.spawnShadow({ type: "melee", x: 31, y: 76, state: "idle" });                                                       // sala de piedra, junto a la entrada
        this.spawnShadow({ type: "caster", x: 22, y: 40, state: "idle" });                                                      // sala de la nota
        this.spawnShadow({ type: "melee", x: 70, y: 48, state: "patrol", route: [[70, 48], [70, 34], [88, 34], [88, 48]] });    // sala del brasero
        this.spawnShadow({ type: "caster", x: 64, y: 65, state: "patrol", route: [[64, 65], [88, 65]] });                       // zona oscura
        this.spawnShadow({ type: "melee", x: 72, y: 87, state: "idle" });                                                       // zona oscura
    },


    /* ---------- HUD ---------- */

    updateHP() {
        const bar = this.screen.querySelector("#player-hp .hp-bar span");
        if (bar) bar.style.width = `${(this.hp / PLAYER_MAX_HP) * 100}%`;
    },

    updateHUD() {
        const D = CONFIG.dungeon;

        if (this.phase === 0) this.setGoal("Busca la nota en la sala que se ilumina: <span>E levanta objetos · E libre ataca</span>");
        else if (this.phase === 1) this.setGoal("Descifra la nota y encuentra la llave: <span>cuidado con las sombras</span>");
        else this.setGoal("Llave encontrada: <span>1 / 1</span>");

        this.updateHP();

        this.setClues("Tus notas", [
            { text: this.step >= 1 ? D.clueNotes[0] : "Hay una nota en la única sala que está abierta.", done: this.step >= 2 },
            { text: this.step >= 2 ? D.clueNotes[1] : "???", done: this.step >= 3 },
            { text: this.step >= 3 ? D.keyRiddle : "???", done: this.phase >= 2 }
        ]);
    },


    /* ---------- habitaciones y visibilidad ---------- */

    roomAt(x, y) {
        if (x < 43) return y < 58 ? "nw" : "sw";
        if (x > 57) return y < 58 ? "ne" : "se";
        return y < 68 ? "cor" : "hall";
    },

    /* ¿Hay un muro entre dos puntos? (solo los muros tapan la vista) */
    los(ax, ay, bx, by) {
        const W = this.screen.clientWidth;
        const H = this.screen.clientHeight;
        const d = Math.hypot(((bx - ax) / 100) * W, ((by - ay) / 100) * H);
        const n = Math.max(2, Math.ceil(d / 10));

        for (let i = 1; i < n; i++) {
            const t = i / n;
            const x = ax + (bx - ax) * t;
            const y = ay + (by - ay) * t;
            for (const o of this.walls) {
                if (x > o.x0 && x < o.x1 && y > o.y0 && y < o.y1) return false;
            }
        }
        return true;
    },

    /* No se puede levantar nada que esté detrás de un muro */
    canReach(t) {
        return t.noLos || this.los(this.x, this.y, t.x, t.y);
    },

    nextRoom(a, b) {
        const prev = { [a]: null };
        const queue = [a];
        while (queue.length) {
            const r = queue.shift();
            if (r === b) break;
            for (const n in DUNGEON_LINKS[r]) {
                if (!(n in prev)) { prev[n] = r; queue.push(n); }
            }
        }
        let cur = b;
        while (prev[cur] && prev[cur] !== a) cur = prev[cur];
        return cur;
    },

    /* A dónde caminar para llegar a (tx, ty), pasando por los huecos de los muros */
    navTarget(e, tx, ty) {
        const ra = this.roomAt(e.x, e.y);
        const rb = this.roomAt(tx, ty);
        if (ra === rb || !(rb in DUNGEON_LINKS)) return [tx, ty];

        const [mid, entry] = DUNGEON_LINKS[ra][this.nextRoom(ra, rb)];
        return this.pixelDistance(e.x, e.y, mid[0], mid[1]) < 34 * S ? entry : mid;
    },

    updateFog() {
        const cur = this.roomAt(this.x, this.y);
        const grp = roomGroup(cur);

        if (grp !== this.curGroup) {
            this.curGroup = grp;
            if (!this.seen[grp]) { this.seen[grp] = true; sounds.reveal(); }

            /* Ya entró: la luz que indicaba el camino se apaga */
            this.beacons = this.beacons.filter((b) => {
                if (b.room !== grp) return true;
                b.el.classList.add("fade");
                return false;
            });
        }

        for (const id in this.fog) {
            const f = this.fog[id];
            const R = DUNGEON_ROOMS[id];

            if (id === grp) {
                if (id === "se") {
                    /* En la zona oscura solo ves un círculo de luz alrededor de Mey */
                    const px = ((this.x - R.x0) / (R.x1 - R.x0)) * 100;
                    const py = ((this.y - R.y0) / (R.y1 - R.y0)) * 100;
                    const cy = ((36 * S) / this.screen.clientHeight) * 100 / ((R.y1 - R.y0) / 100);
                    f.style.opacity = 1;
                    f.style.background = `radial-gradient(circle at ${px}% ${py - cy}%, transparent 0, transparent ${55 * S}px, rgba(4,2,9,0.93) ${165 * S}px)`;
                } else {
                    f.style.opacity = 0;
                }
            } else {
                f.style.background = "";
                f.style.opacity = this.seen[id] ? 0.58 : 0.97;
            }
        }
    },


    /* ---------- levantar objetos ---------- */

    lift(t, it) {
        const D = CONFIG.dungeon;

        /* Las vasijas que podrían guardar la llave no ceden hasta saber qué se busca */
        if (it.cand && this.phase < 1) {
            say(D.sealed[0], D.sealed[1], 3600);
            return;
        }

        t.done = true;
        this.near = null;
        hidePrompt();

        this.obstacles = this.obstacles.filter((o) => o !== t.blocker);
        t.el.classList.add("lifted");
        setTimeout(() => t.el.remove(), 600);

        if (it.has === "note") return this.foundNote(it);
        if (it.has === "key") return this.foundKey(it);

        if (it.has === "ambush") {
            sounds.alert();
            this.spawnShadow({ type: Math.random() < 0.5 ? "melee" : "caster", x: it.x, y: it.y, state: "alert", appear: true });
            say(D.ambush[0], D.ambush[1], 2200);
            return;
        }

        if (it.has === "heal") {
            this.hp = Math.min(PLAYER_MAX_HP, this.hp + 25);
            this.updateHP();
            sounds.pick();
            this.sparkles(it.x, it.y - 6, 12, "#ffc6d9", 50);
            say(D.heal[0], D.heal[1], 2400);
            return;
        }

        if (it.cand) {
            say("Una vasija", D.decoys[it.cand], 4200);
            return;
        }

        say("Levantaste el objeto", D.empty[this.emptyIndex++ % D.empty.length], 2400);
    },

    foundNote(it) {
        const D = CONFIG.dungeon;
        const n = it.n;
        const text = n >= 2 ? D.keyRiddle : D.clueNotes[n];
        sounds.pick();
        showCard({
            cls: "letter",
            html: `<h3>${D.noteTitle}</h3><p class="clue">${text}</p>`,
            button: "GUARDAR",
            onClose: () => {
                this.step = n + 1;
                if (n >= 2) this.phase = 1;          // ya conoce la adivinanza de la llave
                this.updateHUD();
                this.openClues(14000);
                this.unlockRoom(DUNGEON_ORDER[n]);   // la nota abre la siguiente sala
                if (n === 0) {
                    this.wakeShadows();
                    say(...D.wakeUp);
                }
            }
        });
    },

    /* Al leer la nota las sombras se agitan: dos llegan desde otras salas */
    wakeShadows() {
        this.rage = 1.12;
        const spots = [[50, 90, "main"], [50, 34, "main"], [90, 34, "ne"], [90, 88, "se"]]
            .filter((s) => s[2] === "main" || this.open[s[2]]);     // no aparecen en salas selladas
        const far = spots
            .map((s) => ({ s, d: this.pixelDistance(this.x, this.y, s[0], s[1]) }))
            .sort((a, b) => b.d - a.d)
            .slice(0, 2);

        far.forEach(({ s }) => this.spawnShadow({ type: "melee", x: s[0], y: s[1], state: "chase", appear: true }));
    },

    foundKey(it) {
        const D = CONFIG.dungeon;
        this.phase = 2;
        this.finished = true;
        this.updateHUD();
        sounds.rise();

        /* La llave sube y brilla */
        const key = this.obj("key-item", it.x, it.y - 4, {
            ay: 50,
            html: '<svg class="sprite"><use href="#key"></use></svg>'
        });
        key.style.zIndex = 95;
        setTimeout(() => key.remove(), 1600);
        this.sparkles(it.x, it.y - 10, 28, "#ffe39a", 90);

        /* Las sombras se disuelven en luz */
        this.enemies.forEach((e) => { if (!e.dead) this.defeat(e, true); });
        this.bolts.forEach((b) => b.el.remove());
        this.bolts = [];

        /* Ya no hace falta ocultar nada: se ven todas las salas */
        for (const id in this.fog) {
            this.fog[id].style.background = "";
            this.fog[id].style.opacity = 0;
        }

        say(D.keyFound[0], D.keyFound[1], D.keyFound[2]);
        setTimeout(() => this.unlockDoor(D.doorOpen[0], D.doorOpen[1], D.doorOpen[2]), 1400);
    },


    /* ---------- sombras: creación y estados ---------- */

    spawnShadow(def) {
        const st = SHADOW[def.type];

        const el = this.obj(`enemy ${def.type}`, def.x, def.y, {
            ay: 50,
            html: '<div class="enemy-hp"><span></span></div><div class="enemy-bang">!</div><div class="tele"></div>' +
                `<svg class="sprite"><use href="#${def.type === "caster" ? "caster" : "shadow"}"></use></svg>`
        });

        if (def.appear) {
            el.classList.add("spawning");
            setTimeout(() => el.classList.remove("spawning"), 900);
        }

        const e = {
            type: def.type,
            x: def.x, y: def.y,
            home: { x: def.x, y: def.y },
            base: def.state === "idle" ? "idle" : "patrol",   // a qué vuelve si pierde a Mey
            route: def.route || null, ri: 0, wait: 0,
            hp: st.hp, maxHp: st.hp,
            t: 0, cd: rand(0.4, 1.4), stun: 0, lost: 0, stuck: 0, sideT: 0, sideDir: 1,
            face: 1, phase: null, shots: 0, dead: false, el
        };

        this.enemies.push(e);
        this.setState(e, def.state);
        return e;
    },

    setState(e, s) {
        const st = SHADOW[e.type];
        e.state = s;
        e.el.dataset.state = s;
        e.el.classList.toggle("chasing", s === "chase");
        e.el.classList.remove("windup", "telegraph");

        if (s === "alert") { e.t = 0.65; sounds.alert(); }
        if (s === "chase") e.lost = 0;
        if (s === "attack") {
            e.phase = "wind";
            e.t = st.wind;
            e.el.classList.add("windup");
            if (e.type === "melee") e.el.classList.add("telegraph");
        }
    },

    /* Camina hacia un punto esquivando obstáculos. Devuelve la distancia que faltaba (px). */
    stepEnemy(e, tx, ty, speed, dt) {
        const W = this.screen.clientWidth;
        const H = this.screen.clientHeight;
        const dx = ((tx - e.x) / 100) * W;
        const dy = ((ty - e.y) / 100) * H;
        const d = Math.hypot(dx, dy);
        if (d < 2) return d;

        const step = Math.min(d, speed * S * dt);
        const ux = dx / d;
        const uy = dy / d;
        const nx = clamp(e.x + (ux * step / W) * 100, 5, 95);
        const ny = clamp(e.y + (uy * step / H) * 100, 29, 91);
        let moved = false;

        if (!this.hits(nx, e.y, W, H, 16)) { e.x = nx; moved = true; }
        if (!this.hits(e.x, ny, W, H, 16)) { e.y = ny; moved = true; }

        e.stuck = moved ? 0 : e.stuck + dt;
        if (ux < -0.15) e.face = -1;
        else if (ux > 0.15) e.face = 1;
        return d;
    },

    followRoute(e, dt, speed) {
        if (!e.route) return;
        if (e.wait > 0) { e.wait -= dt; return; }

        const [tx, ty] = e.route[e.ri];
        const rem = this.stepEnemy(e, tx, ty, speed, dt);

        if (rem < 10 * S || e.stuck > 0.6) {
            e.ri = (e.ri + 1) % e.route.length;
            e.wait = 0.4 + Math.random() * 0.5;
            e.stuck = 0;
        }
    },

    updateEnemy(e, dt, W, H) {
        const st = SHADOW[e.type];
        e.cd = Math.max(0, e.cd - dt);

        if (e.stun > 0) { e.stun -= dt; return; }

        const px = ((this.x - e.x) / 100) * W;
        const py = ((this.y - e.y) / 100) * H;
        const d = Math.hypot(px, py) || 1;

        /* Solo ve a Mey si está lo bastante cerca Y no hay un muro de por medio */
        const range = (e.state === "idle" ? st.sleepDetect : st.detect) * S;
        const sees = d < range && this.los(e.x, e.y, this.x, this.y);

        switch (e.state) {

            case "idle":
                if (sees) this.setState(e, "alert");
                break;

            case "patrol":
                if (sees) { this.setState(e, "alert"); break; }
                this.followRoute(e, dt, st.patrol * this.rage);
                break;

            case "alert":
                e.face = px < 0 ? -1 : 1;
                e.t -= dt;
                if (e.t <= 0) this.setState(e, "chase");
                break;

            case "chase": {
                if (sees) e.lost = 0; else e.lost += dt;
                if (e.lost > 4.5) { this.setState(e, "return"); break; }

                let [tx, ty] = this.navTarget(e, this.x, this.y);

                /* Si se atora con una roca, rodea un poco */
                if (e.sideT > 0) {
                    e.sideT -= dt;
                    tx += (-py / d) * e.sideDir * 60 / W * 100;
                    ty += (px / d) * e.sideDir * 60 / H * 100;
                } else if (e.stuck > 0.45) {
                    e.sideT = 0.6;
                    e.sideDir *= -1;
                    e.stuck = 0;
                }

                if (e.type === "melee") {
                    if (sees && d < st.reach * S && e.cd <= 0) { this.setState(e, "attack"); break; }
                    this.stepEnemy(e, tx, ty, st.chase * this.rage, dt);
                } else {
                    if (sees && d < (st.keep + 40) * S) {
                        e.face = px < 0 ? -1 : 1;
                        if (e.cd <= 0) { this.setState(e, "attack"); break; }
                        if (d < st.keep * S * 0.6) {             // demasiado cerca: retrocede
                            this.stepEnemy(e, e.x - (px / d) * 40 / W * 100, e.y - (py / d) * 40 / H * 100, st.chase, dt);
                        }
                    } else {
                        this.stepEnemy(e, tx, ty, st.chase * this.rage, dt);
                    }
                }
                break;
            }

            case "attack":
                e.face = px < 0 ? -1 : 1;
                e.t -= dt;
                if (e.phase === "wind" && e.t <= 0) {
                    this.strike(e, px, py, d);
                    e.phase = "rec";
                    e.t = st.rec;
                    e.el.classList.remove("windup", "telegraph");
                } else if (e.phase === "rec" && e.t <= 0) {
                    e.cd = 0.7 + Math.random() * 0.7;
                    this.setState(e, "chase");
                    e.lost = 0;
                }
                break;

            case "return": {
                if (sees) { this.setState(e, "alert"); break; }
                const goal = e.route ? e.route[e.ri] : [e.home.x, e.home.y];
                const [tx, ty] = this.navTarget(e, goal[0], goal[1]);
                this.stepEnemy(e, tx, ty, st.patrol, dt);
                if (this.roomAt(e.x, e.y) === this.roomAt(goal[0], goal[1]) &&
                    this.pixelDistance(e.x, e.y, goal[0], goal[1]) < 14 * S) {
                    this.setState(e, e.base);
                }
                break;
            }
        }
    },

    /* El golpe: cuerpo a cuerpo (anillo) o disparo (proyectil) */
    strike(e, px, py, d) {
        const st = SHADOW[e.type];

        if (e.type === "melee") {
            sounds.slash();
            e.el.classList.add("striking");
            setTimeout(() => e.el.classList.remove("striking"), 320);
            this.sparkles(e.x, e.y, 12, "#ff9ec8", 70);
            if (d < (st.tele + PLAYER_R * 0.5) * S) this.hurt(st.dmg);
            return;
        }

        sounds.bolt();
        e.shots++;

        if (e.shots % 3 === 0) {
            /* Cada tercer disparo: anillo de 8 proyectiles */
            const off = Math.random() * Math.PI;
            for (let k = 0; k < 8; k++) this.addBolt(e.x, e.y, off + (k * Math.PI) / 4);
        } else {
            this.addBolt(e.x, e.y, Math.atan2(py - 36 * S, px));
        }
    },

    /* El ruido despierta a las sombras cercanas que puedan oírlo */
    alarm(x, y, radius) {
        for (const e of this.enemies) {
            if (e.dead || (e.state !== "idle" && e.state !== "patrol" && e.state !== "return")) continue;
            if (this.pixelDistance(e.x, e.y, x, y) > radius * S) continue;
            if (this.roomAt(e.x, e.y) === this.roomAt(x, y) || this.los(e.x, e.y, x, y)) this.setState(e, "alert");
        }
    },

    /* Que no se amontonen todas en el mismo punto */
    separate() {
        const W = this.screen.clientWidth;
        const H = this.screen.clientHeight;
        const live = this.enemies.filter((e) => !e.dead);

        for (let i = 0; i < live.length; i++) {
            for (let j = i + 1; j < live.length; j++) {
                const a = live[i], b = live[j];
                const dx = ((b.x - a.x) / 100) * W;
                const dy = ((b.y - a.y) / 100) * H;
                const d = Math.hypot(dx, dy);
                if (d > 30 * S || d < 0.5) continue;

                const mx = ((dx / d) * 0.5 / W) * 100;
                const my = ((dy / d) * 0.5 / H) * 100;
                if (!this.hits(b.x + mx, b.y, W, H, 16)) b.x += mx;
                if (!this.hits(b.x, b.y + my, W, H, 16)) b.y += my;
                if (!this.hits(a.x - mx, a.y, W, H, 16)) a.x -= mx;
                if (!this.hits(a.x, a.y - my, W, H, 16)) a.y -= my;
            }
        }
    },

    /* 'in' = en la misma zona que Mey | 'peek' = se ve a lo lejos por un hueco */
    enemyVisible(e, curGroup) {
        if (roomGroup(this.roomAt(e.x, e.y)) === curGroup) return "in";
        if (this.pixelDistance(e.x, e.y, this.x, this.y) < 160 * S && this.los(this.x, this.y, e.x, e.y)) return "peek";
        return false;
    },

    tick(dt) {
        this.cool = Math.max(0, this.cool - dt);
        this.inv = Math.max(0, this.inv - dt);

        this.moveBolts(dt);
        if (this.locked || this.finished) return;

        const W = this.screen.clientWidth;
        const H = this.screen.clientHeight;

        this.updateFog();
        const grp = roomGroup(this.roomAt(this.x, this.y));

        for (const e of this.enemies) {
            if (e.dead) continue;
            this.updateEnemy(e, dt, W, H);
            this.place(e.el, e.x, e.y);
            e.el.classList.toggle("flip", e.face < 0);

            const vis = this.enemyVisible(e, grp);
            e.el.style.opacity = vis ? "" : "0";
            if (vis === "peek") e.el.style.zIndex = 185;     // se ve por encima de la oscuridad
        }

        this.separate();
    },


    /* ---------- proyectiles y daño ---------- */

    addBolt(x, y, angle) {
        const el = this.obj("bolt", x, y, { ay: 50 });
        const speed = 190;
        this.bolts.push({ x, y, el, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 4 });
    },

    moveBolts(dt) {
        const W = this.screen.clientWidth;
        const H = this.screen.clientHeight;

        for (let i = this.bolts.length - 1; i >= 0; i--) {
            const b = this.bolts[i];

            if (!this.locked) {
                b.x += ((b.vx * S * dt) / W) * 100;
                b.y += ((b.vy * S * dt) / H) * 100;
                b.life -= dt;
                this.place(b.el, b.x, b.y);

                /* El centro de Mey está unos 36 px sobre sus pies */
                const d = Math.hypot(((b.x - this.x) / 100) * W, ((b.y - this.y) / 100) * H + 36 * S);

                if (d < 24 * S && this.inv <= 0) {
                    this.hurt(SHADOW.caster.dmg);
                    b.el.remove();
                    this.bolts.splice(i, 1);
                    continue;
                }

                /* Los muros detienen los proyectiles */
                if (this.walls.some((o) => b.x > o.x0 && b.x < o.x1 && b.y > o.y0 && b.y < o.y1)) {
                    b.el.remove();
                    this.bolts.splice(i, 1);
                    continue;
                }
            }

            if (b.life <= 0 || b.x < -2 || b.x > 102 || b.y < -2 || b.y > 102) {
                b.el.remove();
                this.bolts.splice(i, 1);
            }
        }
    },

    hurt(amount) {
        if (this.inv > 0 || this.locked) return;

        this.inv = 0.9;
        this.hp = Math.max(0, this.hp - amount);
        sounds.hurt();
        this.updateHP();

        this.player.classList.add("hurt");
        setTimeout(() => this.player.classList.remove("hurt"), 380);

        const flash = this.screen.querySelector(".hit-flash");
        if (flash) {
            flash.classList.remove("on");
            void flash.offsetWidth;
            flash.classList.add("on");
        }

        if (this.hp <= 0) this.playerDown();
    },

    /* Sin vida: pantalla de derrota y Mey vuelve al inicio del calabozo.
       El jardín no se toca: esto es un punto de control. */
    playerDown() {
        const D = CONFIG.dungeon.defeat;
        this.locked = true;
        keys.clear();
        this.deaths = (this.deaths || 0) + 1;
        this.player.classList.add("defeated");
        sounds.defeat();

        const ov = ensureDefeatOverlay();
        ov.querySelector("h3").textContent = D.title;
        ov.querySelector(".defeat-line").textContent = D.lines[(this.deaths - 1) % D.lines.length];
        ov.querySelector(".defeat-tip").textContent = touchText(D.tips[(this.deaths - 1) % D.tips.length]);

        const id = this.runId;
        setTimeout(() => ov.classList.add("on"), 450);

        setTimeout(() => {
            if (currentScene !== this || this.runId !== id) return;
            clearDialogue();
            hidePrompt();
            this.skipIntro = true;
            this.enter();      // la cámara se reconstruye: sombras, nota y llave vuelven
            say("Otra vez desde el principio", "Las sombras volvieron y la nota y la llave están de nuevo en su sitio. Tú también.", 4600);
        }, 3700);

        setTimeout(() => ov.classList.remove("on"), 4000);
    },


    /* ---------- ataque de Mey: explosión de luz ---------- */

    onAction() {
        this.attack();
    },

    onIdle() {
        this.attack();      // E sin nada cerca ataca
    },

    attack() {
        if (this.cool > 0 || this.locked || paused) return;
        this.cool = ATTACK_COOLDOWN;
        sounds.attack();

        /* El centro de la explosión está a la altura del pecho de Mey */
        const W = this.screen.clientWidth;
        const H = this.screen.clientHeight;
        const cy = this.y - ((36 * S) / H) * 100;

        const burst = this.obj("burst", this.x, cy, { ay: 50 });
        burst.style.zIndex = 95;
        setTimeout(() => burst.remove(), 600);

        const ring = this.obj("burst-ring", this.x, cy, { ay: 50 });
        ring.style.zIndex = 94;
        setTimeout(() => ring.remove(), 700);

        this.sparkles(this.x, cy, 16, "#f0b8ff", ATTACK_RANGE);

        this.player.classList.add("attacking");
        setTimeout(() => this.player.classList.remove("attacking"), 220);

        /* Borra los proyectiles que alcance */
        for (let i = this.bolts.length - 1; i >= 0; i--) {
            const b = this.bolts[i];
            if (Math.hypot(((b.x - this.x) / 100) * W, ((b.y - cy) / 100) * H) < ATTACK_RANGE * S) {
                b.el.remove();
                this.bolts.splice(i, 1);
            }
        }

        /* Daña a las sombras que alcance */
        for (const e of this.enemies) {
            if (e.dead) continue;
            const px = ((e.x - this.x) / 100) * W;
            const py = ((e.y - cy) / 100) * H;
            const len = Math.hypot(px, py);
            if (len > ATTACK_RANGE * S) continue;

            e.hp -= ATTACK_DAMAGE;
            sounds.hit();

            if (e.state === "attack") {
                /* En pleno ataque no se detiene: hay que esquivarla, no solo golpearla */
            } else {
                e.stun = 0.3;
                e.cd = Math.max(e.cd, 0.9);
                if (e.state !== "chase") this.setState(e, "chase");

                const kx = ((px / (len || 1)) * 22 * S / W) * 100;
                const ky = ((py / (len || 1)) * 22 * S / H) * 100;
                if (!this.hits(e.x + kx, e.y, W, H, 16)) e.x += kx;
                if (!this.hits(e.x, e.y + ky, W, H, 16)) e.y += ky;
            }

            e.el.classList.add("enemy-hit");
            setTimeout(() => e.el.classList.remove("enemy-hit"), 200);
            e.el.querySelector(".enemy-hp span").style.width = `${Math.max(0, (e.hp / e.maxHp) * 100)}%`;

            if (e.hp <= 0) this.defeat(e);
        }

        /* El estallido se oye en las salas de al lado */
        this.alarm(this.x, this.y, 300);
    },

    defeat(e, silent) {
        e.dead = true;
        e.el.classList.remove("windup", "telegraph");
        e.el.classList.add("defeated");
        e.el.style.opacity = "";
        setTimeout(() => e.el.remove(), 650);
        if (!silent) {
            sounds.defeat();
            this.sparkles(e.x, e.y, 14, "#d9b8ff", 60);
        }
    }
});


/* =====================================================
   11. BOSQUE DE LAS MELODÍAS
   Puzzle de memoria: las campanas cantan una melodía y luego
   te toca repetirla. Si te equivocas, la melodía se pierde y
   vuelve a sonar. Al lograrlo cae una nota en el bosque; su
   adivinanza dice dónde está la llave de cristal.
===================================================== */

const forestScene = new Zone({

    id: "forest",
    title: "El bosque de las melodías",
    music: "forest",
    cls: "forest",
    fx: [["petal", 14], ["firefly", 14], ["rain", 18]],
    start: { x: 50, y: 86 },
    bounds: { x0: 4, x1: 96, y0: 28, y1: 92 },

    intro: CONFIG.forest.intro,

    build() {

        this.runId = (this.runId || 0) + 1;
        const id = this.runId;
        const alive = () => currentScene === this && this.runId === id;

        this.input = [];
        this.busy = true;          // mientras suena la demostración no se puede tocar
        this.won = false;
        this.noteRead = false;
        this.keyFound = false;
        this.bells = [];
        this.spots = [];

        /* Árboles de otoño rosa y dorado.
           hollow = tronco hueco | lantern = árbol con un farol colgado */
        [[8, 32, 1.3], [22, 27, 1.1], [41, 30, 1.25], [60, 27, 1.1, "lantern"], [78, 31, 1.3],
        [10, 66, 1.2], [26, 84, 1.1], [74, 85, 1.15], [90, 70, 1.25, "hollow"], [92, 30, 1.2]]
            .forEach(([x, y, k, trait]) => {
                this.obj("garden-tree forest-tree" + (trait ? ` ${trait}` : ""), x, y, {
                    k, html: trait === "lantern" ? '<div class="lantern"></div>' : ""
                });
                this.block(x, y, 18 * k);
            });

        /* Un círculo de flores en el suelo y un tronco caído */
        this.obj("flower-ring", 30, 70, { ay: 50 });
        this.obj("fallen-log", 10, 81, { ay: 60 });
        this.block(10, 81, 22);

        /* Campanas: 1 rosa, 2 dorada, 3 lila, 4 crema */
        const colors = ["#e8a9bd", "#e6c067", "#b69ad6", "#f4e3c8"];
        [[22, 52], [40, 40], [60, 58], [78, 46]].forEach(([x, y], i) => {
            const t = this.thing({
                cls: "bell", x, y, ay: 90,
                verb: "TOCAR",
                html: '<div class="bell-halo"></div><svg class="sprite"><use href="#bell"></use></svg>',
                use: () => this.ring(i)
            });
            t.el.style.color = colors[i];
            this.bells.push(t);
            this.block(x, y, 12);
        });

        /* Piedra de la melodía: repite la demostración */
        this.thing({
            cls: "melody-stone", x: 50, y: 72, ay: 80,
            verb: "ESCUCHAR DE NUEVO",
            html: '<div class="stone-glow"></div>',
            use: () => { if (!this.busy && !this.won) this.playDemo(); }
        });
        this.block(50, 72, 20);

        /* La nota: al ganar baja flotando y aterriza en un claro bien visible, sin que haya que buscarla */
        this.noteThing = this.thing({
            cls: "note forest-note note-hidden", x: 50, y: 54, ay: 100,
            verb: "LEER LA NOTA",
            enabled: false,
            html: '<div class="note-paper"></div>',
            use: () => this.readNote()
        });

        /* Lugares donde podría estar la llave (no se pueden revisar hasta leer la nota) */
        [
            { key: "hollow", x: 88, y: 75, text: CONFIG.forest.spots.hollow },
            { key: "lantern", x: 60, y: 33, text: CONFIG.forest.spots.lantern },
            { key: "log", x: 12, y: 84, text: CONFIG.forest.spots.log },
            { key: "ring", x: 30, y: 70, isKey: true }
        ].forEach((sp) => {
            const t = this.thing({
                cls: "forest-spot", x: sp.x, y: sp.y, ay: 100,
                verb: "REVISAR", enabled: false,
                use: (th) => this.searchSpot(th, sp)
            });
            this.spots.push(t);
        });

        this.door(94, 48, () => goTo(libraryScene),
            ["La puerta del bosque", "Está cerrada con una cerradura diminuta, hecha para una llave de cristal."]);

        this.updateGoal();

        /* La melodía suena sola al entrar: primero hay que observar */
        setTimeout(() => { if (alive()) this.playDemo(); }, 3200);
    },

    updateGoal() {
        const total = CONFIG.forest.sequence.length;
        let goal;

        if (this.keyFound) goal = "Llave de cristal: <span>1 / 1</span>";
        else if (this.noteRead) goal = "Encuentra la llave de cristal: <span>lee la nota con calma</span>";
        else if (this.won) goal = "Busca la nota que cayó entre los árboles";
        else if (this.busy) goal = "Escucha la melodía: <span>mira qué campanas se iluminan</span>";
        else goal = `Repite la melodía: <span>${this.input.length} / ${total}</span>`;

        this.setGoal(goal);

        if (this.noteRead) {
            this.setClues("Nota del bosque", [{ text: CONFIG.forest.noteRiddle, done: this.keyFound }]);
        }
    },

    flash(i) {
        const el = this.bells[i].el;
        el.classList.add("ring");
        this.sparkles(this.bells[i].x, this.bells[i].y - 8, 8, getComputedStyle(el).color || "#ffe39a", 46);
        setTimeout(() => el.classList.remove("ring"), 700);
    },

    /* La demostración: las campanas se iluminan solas, una por una */
    playDemo() {
        if (this.won) return;
        const seq = CONFIG.forest.sequence;
        const id = this.runId;
        this.busy = true;
        this.input = [];
        this.updateGoal();

        seq.forEach((n, k) => {
            setTimeout(() => {
                if (currentScene !== this || this.runId !== id) return;
                this.flash(n - 1);
                sounds.ring(CONFIG.forest.notes[n - 1]);
            }, 900 + k * 850);
        });

        setTimeout(() => {
            if (currentScene !== this || this.runId !== id) return;
            this.busy = false;
            this.updateGoal();
            say(...CONFIG.forest.yourTurn);
        }, 900 + seq.length * 850 + 400);
    },

    ring(i) {
        if (this.won) return;
        if (this.busy) { say(CONFIG.forest.busy[0], CONFIG.forest.busy[1], 1800); return; }

        this.flash(i);
        sounds.ring(CONFIG.forest.notes[i]);
        this.input.push(i + 1);

        const seq = CONFIG.forest.sequence;
        const n = this.input.length;

        /* Se equivocó: la melodía se pierde y vuelve a sonar */
        if (this.input[n - 1] !== seq[n - 1]) {
            const id = this.runId;
            this.input = [];
            this.busy = true;
            setTimeout(sounds.wrong, 350);
            say(...CONFIG.forest.wrong);
            this.updateGoal();
            setTimeout(() => { if (currentScene === this && this.runId === id) this.playDemo(); }, 2600);
            return;
        }

        spawn(this.fxEl, "petal", 3);

        if (n < seq.length) { this.updateGoal(); return; }

        /* Melodía completa */
        this.won = true;
        this.screen.classList.add("lit");
        this.bells.forEach((b) => b.el.classList.add("sung"));
        spawn(this.fxEl, "petal", 26);
        spawn(this.fxEl, "firefly", 16);
        setTimeout(sounds.win, 500);
        setTimeout(sounds.win, 3000);
        this.updateGoal();
        say(...CONFIG.forest.success);

        /* Un rato después la nota baja flotando desde lo alto y se ve caer hasta el suelo */
        const id = this.runId;
        const nt = this.noteThing;
        const FALL_MS = 4600;
        setTimeout(() => {
            if (currentScene !== this || this.runId !== id) return;
            nt.el.classList.remove("note-hidden");
            nt.el.classList.add("falling");
            sounds.reveal();

            /* Estela de chispas a lo largo de la caída */
            for (let k = 0; k < 12; k++) {
                setTimeout(() => {
                    if (currentScene !== this || this.runId !== id) return;
                    const sway = Math.sin(k * 1.3) * 3;
                    this.sparkles(nt.x + sway, -2 + (nt.y + 2) * (k / 11) - 8, 5, "#fff3c4", 30);
                }, (k / 11) * (FALL_MS - 600));
            }
        }, 3000);

        /* Al aterrizar ya se puede recoger */
        setTimeout(() => {
            if (currentScene !== this || this.runId !== id) return;
            nt.el.classList.remove("falling");
            nt.enabled = true;
            this.sparkles(nt.x, nt.y - 10, 16, "#fff3c4", 60);
            sounds.pick();
        }, 3000 + FALL_MS);
    },

    readNote() {
        const F = CONFIG.forest;
        const t = this.noteThing;
        t.done = true;
        this.near = null;
        t.el.classList.add("lifted");
        sounds.pick();

        showCard({
            cls: "letter",
            html: `<h3>${F.noteTitle}</h3><p class="clue">${F.noteRiddle}</p>`,
            button: "GUARDAR",
            onClose: () => {
                this.noteRead = true;
                this.spots.forEach((s) => { s.enabled = true; });
                this.updateGoal();
                this.openClues(14000);
            }
        });
    },

    searchSpot(t, sp) {
        const F = CONFIG.forest;
        t.done = true;
        this.near = null;
        hidePrompt();

        if (!sp.isKey) {
            this.sparkles(sp.x, sp.y - 8, 8, "#e8d6b0", 40);
            say(sp.text[0], sp.text[1], 4200);
            return;
        }

        this.keyFound = true;
        this.finished = true;
        this.updateGoal();
        sounds.rise();

        const key = this.obj("key-item crystal", sp.x, sp.y - 6, {
            ay: 50,
            html: '<svg class="sprite"><use href="#key"></use></svg>'
        });
        key.style.zIndex = 95;
        setTimeout(() => key.remove(), 1600);
        this.sparkles(sp.x, sp.y - 10, 26, "#cfe8ff", 90);

        say(F.keyFound[0], F.keyFound[1], F.keyFound[2]);
        setTimeout(() => this.unlockDoor(F.doorOpen[0], F.doorOpen[1], 4800), 1400);
    }
});


/* =====================================================
   12. BIBLIOTECA BAJO LA LLUVIA
   Cadena de notas:
   ventana > libro VERDE (mesa izquierda) > libro AZUL (mesa de abajo)
   > libro lila sin adorno (estantería junto a la puerta).
   Los libros equivocados tienen su propio contenido: se leen en
   CONFIG.library.books. Los colores están fijos aquí.
===================================================== */

const LIBRARY_BOOKS = [
    { id: "tea",     x: 24, y: 50.5, color: "#c97f93", table: 52 },
    { id: "garden",  x: 32, y: 51.5, color: "#a9b98a", table: 52, note: 1 },
    { id: "map",     x: 68, y: 50.5, color: "#b69ad6", table: 52 },
    { id: "moon",    x: 76, y: 51.5, color: "#e0a85a", table: 52, mark: "moon" },
    { id: "poems",   x: 46, y: 72.5, color: "#d98f9f", table: 74 },
    { id: "sky",     x: 54, y: 73.5, color: "#8fa6c9", table: 74, note: 2 },
    { id: "flowers", x: 13, y: 36,   color: "#d9b27a" },
    { id: "letters", x: 31, y: 36,   color: "#c97f93" },
    { id: "sea",     x: 69, y: 36,   color: "#c9694f" },
    { id: "melody",  x: 87, y: 36,   color: "#b69ad6", special: true },
    { id: "coat",    x: 9,  y: 63,   color: "#b8a08f" },
    { id: "songs",   x: 90, y: 82,   color: "#d98f9f" }
];

/* Escena especial del libro final: baja el ritmo, el libro se abre y el texto aparece despacio */
function playBookScene(onDone) {
    const L = CONFIG.library;
    let c = $("cine");
    if (!c) {
        c = document.createElement("div");
        c.id = "cine";
        c.className = "hidden";
        game.insertBefore(c, $("fade"));
    }

    /* El texto se reparte entre la página izquierda y la derecha según su largo */
    const lines = L.finalBook.lines;
    const total = lines.reduce((n, l) => n + l.length, 0);
    let acc = 0, cut = lines.length;
    for (let i = 0; i < lines.length; i++) {
        acc += lines[i].length;
        if (acc >= total / 2) { cut = i + 1; break; }
    }
    const para = (l, i) => `<p style="--i:${i}">${l}</p>`;

    c.innerHTML = `
        <div class="cine-book">
            <div class="cine-spread">
                <div class="cine-leaf left"><div class="cine-text">${lines.slice(0, cut).map((l, i) => para(l, i)).join("")}</div></div>
                <div class="cine-leaf right"><div class="cine-text">${lines.slice(cut).map((l, i) => para(l, i + cut)).join("")}</div></div>
            </div>
            <div class="cine-cover">
                <svg><use href="#star"></use></svg>
                <h4>${L.bookTitle}</h4>
                <span>${L.bookSubtitle}</span>
            </div>
        </div>
        <button class="btn cine-btn" style="--n:${L.finalBook.lines.length}">${L.finalBook.button}</button>`;

    c.classList.remove("hidden");
    void c.offsetWidth;
    c.classList.add("on");
    paused = true;
    keys.clear();
    hidePrompt();
    sounds.page();
    setTimeout(sounds.rise, 1800);

    c.querySelector(".cine-btn").onclick = () => {
        c.classList.remove("on");
        setTimeout(() => c.classList.add("hidden"), 1000);
        paused = false;
        if (onDone) onDone();
    };
}

const libraryScene = new Zone({

    id: "library",
    title: "La biblioteca bajo la lluvia",
    music: "library",
    cls: "library",
    rain: true,
    fx: [["rain", 26]],
    start: { x: 50, y: 86 },
    bounds: { x0: 4, x1: 96, y0: 36, y1: 92 },

    intro: ["La biblioteca bajo la lluvia", CONFIG.library.intro, 5600],

    build() {

        this.stage = 0;     // cuántas notas lleva encontradas
        this.updateGoal();

        /* Estanterías y ventana en la pared del fondo */
        [13, 31, 69, 87].forEach((x) => this.obj("shelf", x, 30));
        this.obj("window", 50, 30);

        /* Mesas de lectura */
        [[28, 52], [72, 52], [50, 74]].forEach(([x, y]) => {
            this.obj("table", x, y, { ay: 60 });
            this.block(x - 3.5, y, 26);
            this.block(x + 3.5, y, 26);
        });

        /* Nota sobre la ventana */
        this.thing({
            cls: "note", x: 50, y: 33, ay: 100,
            verb: "LEER LA NOTA",
            html: '<div class="note-paper"></div>',
            use: () => this.readWindowNote()
        });

        /* Doce libros. note: 1 = verde (esconde la nota 2) | 2 = azul (esconde la nota 3)
           special = el libro final (sin adorno) | mark = adorno de la portada */
        LIBRARY_BOOKS.forEach((b) => {
            const info = CONFIG.library.books[b.id];
            const mark = b.mark;          // el libro final ya no lleva estrella: no debe destacar
            const t = this.thing({
                cls: "book",
                x: b.x, y: b.y, ay: 60, k: 1.4,
                verb: `LEER «${info.title.toUpperCase()}»`,
                html: '<svg class="sprite"><use href="#book"></use></svg>' +
                    (mark ? `<svg class="book-mark"><use href="#${mark}"></use></svg>` : ""),
                use: () => this.read(b, info)
            });
            t.el.style.color = b.color;

            /* Los libros de las mesas se dibujan por encima de la mesa (antes quedaban tapados) */
            if (b.table) t.el.style.zIndex = b.table + 1;
        });

        this.door(94, 62, () => goTo(moonScene),
            ["Una puerta cerrada", "Todavía no se abre. Algo en esta biblioteca guarda la llave."]);
    },

    updateGoal() {
        const notes = CONFIG.library.notes;
        this.setGoal(`Encuentra el libro de la estrella: <span>${this.finished ? 1 : 0} / 1</span>`);
        this.setClues("Notas encontradas", [
            { text: this.stage >= 1 ? notes[0] : "Lee la nota que hay en la ventana.", done: this.stage >= 2 },
            { text: this.stage >= 2 ? notes[1] : "???", done: this.stage >= 3 },
            { text: this.stage >= 3 ? notes[2] : "???", done: this.finished }
        ]);
    },

    readWindowNote() {
        const notes = CONFIG.library.notes;
        if (this.stage === 0) {
            this.stage = 1;
            this.updateGoal();
            sounds.pick();
            showCard({
                cls: "letter",
                html: `<h3>Una nota</h3><p class="clue">${notes[0]}</p>`,
                button: "GUARDAR",
                onClose: () => this.openClues(12000)
            });
        } else {
            say("La nota de la ventana", notes[0], 6200);
        }
    },

    read(b, info) {
        const L = CONFIG.library;

        /* El libro de la estrella: solo se abre al final de la cadena */
        if (b.special) {
            if (this.stage < 3) { say(L.starLocked[0], L.starLocked[1], 3800); return; }
            if (this.finished) return;

            this.finished = true;
            this.updateGoal();
            this.screen.classList.add("dim");
            playBookScene(() => {
                this.screen.classList.remove("dim");
                this.unlockDoor(L.doorOpen[0], L.doorOpen[1], 5200);
            });
            return;
        }

        /* Libros que esconden una nota (hay que encontrarlos en orden) */
        if (b.note) {
            if (this.stage === b.note) {
                this.stage++;
                this.updateGoal();
                sounds.pick();
                showCard({
                    cls: "letter",
                    html: `<h3>${info.title}</h3><p>${info.text}</p><p class="clue">${L.notes[b.note]}</p>`,
                    button: "GUARDAR",
                    onClose: () => this.openClues(12000)
                });
                return;
            }
            if (this.stage > b.note) { say(L.already[0], L.already[1], 3000); return; }
            say(info.title, info.early, 4600);
            return;
        }

        sounds.page();
        say(info.title, info.text, 5600);
    }
});


/* =====================================================
   13. LA LUNA Y LA ESTRELLA
   Recoge cuatro luces de recuerdo y toca la piedra de la colina.
===================================================== */

const moonScene = new Zone({

    id: "moon",
    title: "La luna y la estrella",
    music: "moon",
    cls: "moon-zone",
    dark: true,
    fx: [["twinkle", 22], ["firefly", 12], ["petal", 8]],
    start: { x: 50, y: 88 },
    bounds: { x0: 6, x1: 94, y0: 38, y1: 92 },

    intro: CONFIG.moon.intro,

    build() {

        this.count = 0;
        const memories = CONFIG.moon.memories;
        this.setGoal(`Toca las luces brillantes: <span>0 / ${memories.length}</span>`);

        /* Cielo: la luna y el hueco donde falta la estrella */
        this.world.insertAdjacentHTML("beforeend",
            `<svg class="sky-moon"><use href="#moon"></use></svg>
             <svg class="sky-star"><use href="#star"></use></svg>`);

        /* Luces de recuerdo */
        [[20, 62], [42, 52], [68, 66], [80, 50]].slice(0, memories.length).forEach(([x, y], i) => {
            this.thing({
                cls: "orb", x, y, ay: 50,
                verb: "RECORDAR",
                html: '<div class="orb-core"></div>',
                use: (t) => this.remember(t, memories[i])
            });
        });

        /* Piedra de la colina (se activa al reunir los recuerdos) */
        this.altar = this.thing({
            cls: "altar", x: 50, y: 44, ay: 90,
            verb: "TOCAR",
            enabled: false,
            html: '<div class="altar-glow"></div>',
            use: () => this.touchAltar()
        });
        this.block(50, 44, 20);
    },

    remember(t, m) {
        t.done = true;
        t.el.classList.add("done");
        this.near = null;
        hidePrompt();
        setTimeout(() => t.el.remove(), 600);

        this.count++;
        const total = CONFIG.moon.memories.length;
        this.setGoal(`Toca las luces brillantes: <span>${this.count} / ${total}</span>`);
        sounds.pick();

        showCard({
            cls: "letter memory",
            html: `<h3>${m.title}</h3><p>${m.text}</p>`,
            button: CONFIG.moon.cardButton,
            onClose: () => {
                if (this.count < total) return;
                this.altar.enabled = true;
                this.altar.el.classList.add("ready");
                this.setGoal("Toca la piedra brillante de la colina");
                say("Las luces se unieron", CONFIG.moon.altarReady, 5200);
            }
        });
    },

    touchAltar() {
        this.finished = true;
        this.altar.done = true;
        this.near = null;
        hidePrompt();
        this.locked = true;

        this.screen.classList.add("starlit");
        sounds.rise();
        say("La estrella volvió", CONFIG.moon.altarUse, 5400);

        setTimeout(() => { if (currentScene === this) goTo(letterScene); }, 6400);
    }
});


/* =====================================================
   14. ESCENAS SIN MOVIMIENTO: MENÚ, PRÓLOGO, CARTA, FINAL
===================================================== */

const startScene = {
    screen: $("start-screen"),
    music: "start",
    enter() { $("start-fx").innerHTML = ""; spawn($("start-fx"), "twinkle", 16); }
};

const prologueScene = {
    screen: $("prologue-screen"),
    music: "start",
    enter() { $("prologue-fx").innerHTML = ""; spawn($("prologue-fx"), "twinkle", 10); }
};

const letterScene = {
    screen: $("letter-screen"),
    music: "final",
    dark: true,

    enter() {
        const L = CONFIG.letter;
        const fx = $("letter-fx");
        fx.innerHTML = "";
        spawn(fx, "twinkle", 16);

        showCard({
            cls: "letter",
            html: `<h3>${L.title}</h3>
                   ${L.paragraphs.map((p) => `<p>${p}</p>`).join("")}
                   <p class="sign">${L.sign}</p>`,
            button: "SEGUIR",
            onClose: () => goTo(finalScene)
        });
    }
};

const finalScene = {
    screen: $("final-screen"),
    music: "final",
    dark: true,

    enter() {
        const F = CONFIG.final;
        const box = this.screen.querySelector(".final-text");

        /* Dos líneas extra (una antes y otra después), creadas aquí para no tocar index.html */
        if (!$("final-line0")) {
            const p0 = document.createElement("p");
            p0.id = "final-line0";
            box.insertBefore(p0, box.firstChild);
            const p3 = document.createElement("p");
            p3.id = "final-line3";
            $("final-line2").after(p3);
        }

        $("final-line0").textContent = F.line0;
        $("final-line1").textContent = F.line1;
        $("final-line2").textContent = F.line2;
        $("final-line3").textContent = F.line3;

        const fx = $("final-fx");
        fx.innerHTML = "";
        spawn(fx, "twinkle", 24);

        /* Un hilo dorado une la estrella con la luna: la distancia no las separa */
        const sky = this.screen.querySelector(".final-sky");
        let thread = sky.querySelector(".final-thread");
        if (!thread) {
            thread = document.createElement("div");
            thread.className = "final-thread";
            sky.appendChild(thread);
        }
        requestAnimationFrame(() => {
            const star = sky.querySelector(".final-star");
            const moon = sky.querySelector(".final-moon");
            const ax = star.offsetLeft + star.offsetWidth / 2, ay = star.offsetTop + star.offsetHeight / 2;
            const bx = moon.offsetLeft + moon.offsetWidth / 2, by = moon.offsetTop + moon.offsetHeight / 2;
            thread.style.left = `${ax}px`;
            thread.style.top = `${ay}px`;
            thread.style.width = `${Math.hypot(bx - ax, by - ay)}px`;
            thread.style.transform = `rotate(${Math.atan2(by - ay, bx - ax)}rad)`;
        });
    }
};


/* =====================================================
   15. CAMBIO DE ESCENAS
===================================================== */

const fade = $("fade");

let currentScene = null;
let changing = false;

function goTo(scene) {

    if (changing) return;
    changing = true;
    fade.classList.add("on");

    setTimeout(() => {

        if (currentScene && currentScene.leave) currentScene.leave();

        clearDialogue();
        hidePrompt();
        keys.clear();
        paused = false;
        $("overlay").classList.add("hidden");
        if ($("cine")) $("cine").classList.add("hidden");
        if ($("defeat")) $("defeat").classList.remove("on");

        document.querySelectorAll(".screen").forEach((s) => s.classList.add("hidden"));
        scene.screen.classList.remove("hidden");

        currentScene = scene;

        document.body.classList.toggle("playing", !!scene.playable);
        document.body.classList.toggle("combat", !!scene.combat);
        dialogueBox.classList.toggle("dark", !!scene.dark);
        promptEl.classList.toggle("dark", !!scene.dark);

        setMusic(scene.music);
        setRain(!!scene.rain);

        if (scene.enter) scene.enter();
        fitAll();

        fade.classList.remove("on");
        changing = false;

    }, 450);
}


/* =====================================================
   16. BOTONES PRINCIPALES
===================================================== */

$("start-button").addEventListener("click", () => {
    initAudio();
    if (isTouch) {
        try {
            const root = document.documentElement;
            const req = root.requestFullscreen || root.webkitRequestFullscreen;
            const lock = () => screen.orientation && screen.orientation.lock &&
                screen.orientation.lock("landscape").catch(() => {});
            const p = req && req.call(root);
            if (p && p.then) p.then(lock).catch(() => {}); else lock();
        } catch (e) {}
    }
    goTo(prologueScene);
});

$("continue-button").addEventListener("click", () => goTo(gardenScene));

$("replay-button").addEventListener("click", () => goTo(startScene));


/* =====================================================
   17. BUCLE PRINCIPAL
===================================================== */

let lastTime = performance.now();

function loop(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    if (currentScene && currentScene.update && !changing) currentScene.update(dt);

    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

goTo(startScene);
