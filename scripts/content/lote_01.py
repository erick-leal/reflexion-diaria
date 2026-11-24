"""Lote 1 (Fase 10): borradores escritos con IA según docs/guia-editorial.md.

Se cargan con scripts/seed_content.py en status="ai_generated", source="ai".
Ninguno se publica sin la revisión de Erick en el admin.
"""

REFLECTIONS = [
    {
        "quote": "No necesitas ganas para empezar. Las ganas suelen llegar después.",
        "body": (
            "Esperamos sentirnos con energía para ponernos con algo, y como esa energía no "
            "llega, lo vamos pateando. Pero muchas veces funciona al revés: el movimiento trae "
            "las ganas, no al contrario. No hace falta un gran impulso; alcanza con algo tan "
            "pequeño que no dé pereza."
        ),
        "action": "Elige esa tarea que vienes postergando y trabaja en ella solo cinco minutos. Si después quieres parar, para.",
        "mood_tags": ["enfoque", "desanimo"],
    },
    {
        "quote": "Descansar no es un premio que se gana. Es parte del trabajo.",
        "body": (
            "Si solo te permites parar cuando terminas todo, nunca vas a parar, porque la lista "
            "no se termina. Llegar sin energía no te hace más responsable: te hace más lento y "
            "más duro contigo. Una pausa a tiempo rinde más que una hora más de esfuerzo a la "
            "fuerza."
        ),
        "action": "Hoy, a media tarde, toma diez minutos sin pantalla. Sin culpa y sin usarlos para adelantar otra cosa.",
        "mood_tags": ["agotamiento", "calma"],
    },
    {
        "quote": "La preocupación ensaya problemas que casi nunca llegan a estrenarse.",
        "body": (
            "Tu cabeza puede pasar horas repasando una conversación que todavía no ocurre o un "
            "error que nadie ha cometido. Se siente como estar preparándose, pero casi siempre "
            "es solo gastar energía por adelantado. Ponerle nombre a lo que te preocupa le quita "
            "un poco de poder: deja de ser una nube y se vuelve una frase."
        ),
        "action": "Escribe en un papel lo que más te preocupa hoy, en una sola línea. Debajo, anota una cosa que sí depende de ti.",
        "mood_tags": ["ansiedad"],
    },
    {
        "quote": "Volver después de dejarlo también cuenta como constancia.",
        "body": (
            "Creemos que ser constante es no fallar nunca, y por eso un día perdido se siente "
            "como si todo se hubiera arruinado. Pero los hábitos que duran no son los perfectos, "
            "son los que se retoman. Lo que define el camino no es el día que lo soltaste, sino "
            "lo que haces al día siguiente."
        ),
        "action": "Piensa en un hábito que dejaste hace poco. Hoy haz la versión más pequeña posible de él, aunque sea un minuto.",
        "mood_tags": ["constancia", "autocompasion"],
    },
    {
        "quote": "Decir que no a algo es decir que sí a otra cosa que te importa.",
        "body": (
            "Cada vez que aceptas algo que no quieres hacer, ese tiempo sale de algún lado: de "
            "tu descanso, de la gente que quieres, de tus propios planes. Poner un límite no te "
            "vuelve egoísta. Te permite estar de verdad en lo que eliges, en vez de estar a medias "
            "en todo."
        ),
        "action": "Antes de aceptar el próximo pedido de hoy, responde \"déjame revisar y te confirmo\". Date ese rato para decidir.",
        "mood_tags": ["limites"],
    },
    {
        "quote": "Háblate como le hablarías a alguien que quieres.",
        "body": (
            "Si una amiga se equivocara en lo mismo que tú, probablemente le dirías que le puede "
            "pasar a cualquiera. Contigo, en cambio, la voz interna suele ser mucho más dura. "
            "Esa dureza no te hace mejorar más rápido; solo hace que equivocarse duela más y que "
            "den menos ganas de intentarlo otra vez."
        ),
        "action": "Cuando te equivoques hoy, detente un segundo y dite en voz baja lo que le dirías a alguien que quieres.",
        "mood_tags": ["autocompasion", "inseguridad"],
    },
    {
        "quote": "Lo que hiciste hoy, aunque fue poco, ya existe. Lo que no hiciste es solo una idea.",
        "body": (
            "Al final del día solemos contar lo que faltó y pasar de largo lo que sí salió. Así "
            "cualquier jornada parece un fracaso. Mirar lo hecho no es conformarse: es tener un "
            "registro honesto. Y ese registro, día tras día, es lo que te muestra que sí avanzas."
        ),
        "action": "Antes de dormir, anota tres cosas que hiciste hoy, por pequeñas que sean. Lavar los platos también cuenta.",
        "mood_tags": ["gratitud", "desanimo"],
    },
    {
        "quote": "No tienes que resolver toda tu vida esta semana.",
        "body": (
            "Cuando algo grande cambia, la cabeza quiere tener el plan completo de inmediato: "
            "dónde vas a estar en un año, qué va a pasar con todo. Esa presión paraliza. La "
            "mayoría de los cambios se atraviesan como un camino de noche con linternas: ves "
            "unos pocos metros, y con eso alcanza para dar el siguiente paso."
        ),
        "action": "Escribe la única decisión que de verdad necesitas tomar esta semana. Solo esa. Las demás pueden esperar.",
        "mood_tags": ["cambio", "ansiedad"],
    },
    {
        "quote": "Comparar tu interior con el exterior de otros siempre sale mal.",
        "body": (
            "Ves los logros de los demás, sus fotos, su seguridad al hablar. De ti conoces "
            "también las dudas, el cansancio y los días malos. Es una comparación injusta desde "
            "el principio: estás poniendo tu borrador al lado de la versión final de otra persona."
        ),
        "action": "Hoy, cada vez que te descubras comparándote, cambia la pregunta: ¿en qué estoy mejor que hace un año?",
        "mood_tags": ["inseguridad"],
    },
    {
        "quote": "Una cosa a la vez no es ir lento. Es ir de verdad.",
        "body": (
            "Saltar entre pestañas, mensajes y tareas da la sensación de estar haciendo mucho. "
            "Pero cada cambio cuesta: la cabeza tarda en volver a donde estaba. Al final del día "
            "quedan muchas cosas empezadas y pocas terminadas. Hacer una sola cosa por un rato "
            "se siente menos heroico, y rinde bastante más."
        ),
        "action": "Elige una tarea, silencia el teléfono y trabaja en ella veinte minutos sin cambiar de pestaña.",
        "mood_tags": ["enfoque"],
    },
    {
        "quote": "A veces cuidar un vínculo empieza por un mensaje corto.",
        "body": (
            "Hay personas que quieres y con las que no hablas hace tiempo, no por falta de cariño "
            "sino porque los días se llenan. Mientras más pasa, más parece que hace falta un "
            "motivo especial para escribir. No hace falta. Un \"me acordé de ti\" sostiene más de "
            "lo que parece."
        ),
        "action": "Escríbele hoy a alguien con quien no hablas hace tiempo. Algo simple, sin esperar una respuesta larga.",
        "mood_tags": ["relaciones", "gratitud"],
    },
    {
        "quote": "Respirar despacio no arregla el problema, pero te devuelve al lugar desde donde se arregla.",
        "body": (
            "Cuando algo te altera, el cuerpo se acelera antes que la cabeza: el pecho se aprieta, "
            "la respiración se vuelve corta. Desde ahí todo parece más urgente de lo que es. "
            "Unos segundos de respiración lenta no cambian la situación, pero sí cambian quién "
            "la enfrenta."
        ),
        "action": "La próxima vez que sientas tensión hoy, inhala contando cuatro y exhala contando seis. Repítelo tres veces.",
        "mood_tags": ["calma", "ansiedad"],
    },
    {
        "quote": "El cansancio también es información. Escúchalo antes de que grite.",
        "body": (
            "Seguir de largo cuando el cuerpo pide pausa parece fuerza de voluntad, pero suele "
            "salir caro después. El agotamiento rara vez llega de golpe: avisa con irritabilidad, "
            "con olvidos, con ganas de no ver a nadie. Notar esas señales temprano es más fácil "
            "que recuperarse cuando ya no das más."
        ),
        "action": "Haz una pausa ahora y pregúntate del uno al diez cuánta energía tienes. Si es menos de cinco, saca una cosa de la lista de hoy.",
        "mood_tags": ["agotamiento", "limites"],
    },
    {
        "quote": "Una versión terminada y regular te enseña más que una perfecta que solo existe en tu cabeza.",
        "body": (
            "El perfeccionismo se disfraza de exigencia, pero muchas veces es miedo: si no lo "
            "entrego, nadie puede decir que está mal. El resultado es que lo importante se queda "
            "guardado. Lo terminado se puede corregir, compartir y mejorar; lo que no sale de la "
            "cabeza, no."
        ),
        "action": "Toma algo que tienes a medias y termínalo hoy en una versión \"suficientemente buena\". Después, si quieres, lo mejoras.",
        "mood_tags": ["inseguridad", "enfoque"],
    },
    {
        "quote": "Hay días en que lo único que toca es atravesarlos. Eso también es suficiente.",
        "body": (
            "No todos los días son para avanzar, aprender o crecer. Algunos son solo para llegar "
            "a la noche. Exigirte productividad en uno de esos días solo suma culpa a lo que ya "
            "pesa. Bajar la vara por hoy no es rendirse: es saber leer el momento."
        ),
        "action": "Elige lo mínimo indispensable para hoy, máximo tres cosas, y date permiso de que el resto espere a mañana.",
        "mood_tags": ["desanimo", "autocompasion"],
    },
    {
        "quote": "Lo difícil se nota solo. Lo bueno, a veces, hay que ir a buscarlo.",
        "body": (
            "La cabeza tiende a quedarse con lo que salió mal: el comentario incómodo, el "
            "pendiente, el error. No es un defecto, es una forma de protegerse. Pero si solo "
            "miras eso, el día entero se tiñe. Entrenar la atención para notar también lo que "
            "funciona no es negar lo difícil, es completar el cuadro."
        ),
        "action": "Hoy, cada vez que tomes agua, nota una cosa concreta que esté bien en este momento. Solo notarla.",
        "mood_tags": ["gratitud", "calma"],
    },
    {
        "quote": "Un hábito pequeño que se repite le gana a un plan enorme que se abandona.",
        "body": (
            "Al empezar algo nuevo, el entusiasmo nos hace apuntar alto: una hora diaria, todos "
            "los días, sin excepción. A la semana, la vida se mete en medio y el plan entero se "
            "cae. Lo que dura suele ser lo que parece casi ridículo de tan pequeño, porque se "
            "puede hacer incluso en un mal día."
        ),
        "action": "Toma algo que quieres empezar y redúcelo hasta que tome dos minutos. Hazlo hoy en esa versión.",
        "mood_tags": ["constancia"],
    },
    {
        "quote": "Lo que está fuera de tu control no necesita tu insomnio.",
        "body": (
            "De noche, los problemas se agrandan. Repasamos lo que dijo alguien, lo que podría "
            "salir mal mañana, decisiones que no son nuestras. Darle vueltas se siente como "
            "hacer algo, pero no mueve nada. Separar lo que depende de ti de lo que no es una "
            "forma concreta de soltar."
        ),
        "action": "Antes de dormir, haz dos columnas en un papel: \"depende de mí\" y \"no depende de mí\". Reparte lo que te preocupa.",
        "mood_tags": ["ansiedad", "calma"],
    },
    {
        "quote": "Escuchar sin preparar la respuesta es un regalo raro.",
        "body": (
            "En muchas conversaciones, mientras el otro habla, ya estamos armando lo que vamos a "
            "decir. Se nota, aunque no queramos. Escuchar de verdad, con curiosidad y sin apuro "
            "por opinar, hace que la otra persona se sienta vista. Y suele cambiar el rumbo de "
            "una charla difícil."
        ),
        "action": "En tu próxima conversación de hoy, antes de responder, haz una pregunta sobre lo que la otra persona acaba de decir.",
        "mood_tags": ["relaciones"],
    },
    {
        "quote": "Empezar de nuevo no borra lo que aprendiste. Lo trae contigo.",
        "body": (
            "Cuando algo se termina, un trabajo, una etapa, un proyecto, es fácil sentir que "
            "vuelves a cero. Pero no vuelves igual: llevas lo que sabes, lo que te costó y lo que "
            "ya no quieres repetir. Ese equipaje no se ve, y es justamente lo que hace distinto "
            "este nuevo comienzo."
        ),
        "action": "Escribe una cosa que aprendiste de la última etapa que cerraste y que quieres llevar a lo que viene.",
        "mood_tags": ["cambio"],
    },
    {
        "quote": "No sentirte capaz no significa que no lo seas.",
        "body": (
            "La sensación de no estar a la altura aparece justo cuando estás haciendo algo nuevo "
            "o importante. Es incómoda, pero no es una prueba. Mucha gente que admiras siente lo "
            "mismo y lo hace igual. La seguridad no siempre llega antes de actuar; muchas veces "
            "llega después de haberlo hecho un par de veces."
        ),
        "action": "Anota una cosa que hoy te parece difícil y una vez anterior en que algo así te salió mejor de lo que esperabas.",
        "mood_tags": ["inseguridad", "cambio"],
    },
    {
        "quote": "Tu tiempo libre no tiene que justificarse.",
        "body": (
            "Hay quien no puede descansar sin convertirlo en algo útil: leer para aprender, "
            "caminar para hacer ejercicio, ver una serie para estar al día. Pero no todo tiene "
            "que rendir. Hacer algo solo porque te gusta también es una forma de cuidarte, y no "
            "le debes explicaciones a nadie."
        ),
        "action": "Reserva hoy quince minutos para algo que disfrutes sin ningún propósito. Sin medirlo y sin contárselo a nadie.",
        "mood_tags": ["agotamiento", "limites"],
    },
    {
        "quote": "La lista larga asusta. La siguiente tarea, casi nunca.",
        "body": (
            "Mirar todos los pendientes juntos produce un peso que paraliza: no sabes por dónde "
            "empezar, así que no empiezas. Pero nadie hace una lista entera de una vez. Se hace "
            "una cosa, luego otra. Achicar el foco a lo que viene ahora vuelve manejable lo que "
            "parecía imposible."
        ),
        "action": "Mira tu lista de pendientes y marca solo la siguiente tarea. Tapa el resto, literalmente si hace falta, y empieza por esa.",
        "mood_tags": ["enfoque", "ansiedad"],
    },
    {
        "quote": "Equivocarte en algo no te convierte en un error.",
        "body": (
            "Después de una falla es fácil pasar de \"hice algo mal\" a \"soy un desastre\". El "
            "primer pensamiento te permite corregir; el segundo solo te hunde. Separar lo que "
            "hiciste de quién eres no es esquivar la responsabilidad. Es lo que te deja hacerte "
            "cargo sin quedarte en el piso."
        ),
        "action": "Si hoy algo sale mal, descríbelo en una frase que empiece con \"hice\" y no con \"soy\". Y anota qué harías distinto.",
        "mood_tags": ["autocompasion"],
    },
    {
        "quote": "Un día sin avances no borra los días en que sí avanzaste.",
        "body": (
            "Basta una jornada mala para que la cabeza decida que todo es inútil. Pero un día "
            "flojo es solo un día flojo. El progreso real se ve de lejos, en semanas y meses, no "
            "en la foto de una tarde. Mirar más atrás ayuda a recuperar la proporción."
        ),
        "action": "Busca algo que hayas hecho hace un mes y compáralo con cómo lo harías hoy. Nota la diferencia, aunque sea pequeña.",
        "mood_tags": ["desanimo", "constancia"],
    },
    {
        "quote": "Ordenar un espacio pequeño ordena un poco la cabeza.",
        "body": (
            "Cuando todo se siente desbordado, no hace falta arreglar la vida entera para "
            "recuperar algo de control. A veces basta con un cajón, un escritorio, la mesa de la "
            "cocina. Terminar algo concreto, aunque sea mínimo, le recuerda a la cabeza que sí "
            "puedes poner orden."
        ),
        "action": "Elige una superficie pequeña de tu casa o de tu escritorio y ordénala durante diez minutos. Solo esa.",
        "mood_tags": ["calma", "enfoque"],
    },
    {
        "quote": "Pedir ayuda no es fallar. Es elegir no cargar solo lo que pesa entre varios.",
        "body": (
            "Muchas veces preferimos arreglárnoslas solos antes que molestar a alguien. Pero la "
            "mayoría de la gente se alegra de poder ayudar, igual que tú cuando te lo piden. "
            "Aguantar todo en silencio no demuestra fortaleza; solo hace el camino más largo. "
            "Y si lo que pesa es mucho, buscar apoyo profesional también es un paso."
        ),
        "action": "Piensa en algo que estás cargando sin ayuda y pídele a una persona concreta una cosa concreta para hoy o esta semana.",
        "mood_tags": ["relaciones", "agotamiento"],
    },
    {
        "quote": "Darle las gracias a alguien con detalle vale el doble.",
        "body": (
            "Un \"gracias\" rápido está bien, pero se olvida. Cuando le dices a alguien qué "
            "hizo exactamente y qué cambió para ti, le muestras que lo notaste. Ese tipo de "
            "agradecimiento fortalece el vínculo y, de paso, te obliga a ti a fijarte en lo que "
            "otros aportan a tus días."
        ),
        "action": "Agradécele hoy a alguien algo específico que hizo, diciéndole por qué te importó. Puede ser por mensaje.",
        "mood_tags": ["gratitud", "relaciones"],
    },
    {
        "quote": "No todo lo urgente es importante, aunque grite más fuerte.",
        "body": (
            "Los mensajes, las notificaciones y los pedidos de último momento reclaman atención "
            "inmediata. Lo importante, en cambio, rara vez apura: tu salud, un proyecto propio, "
            "una conversación pendiente. Si siempre gana lo urgente, lo importante se queda "
            "para un después que no llega."
        ),
        "action": "Antes de abrir los mensajes, dedica los primeros quince minutos de tu jornada a algo importante que no sea urgente.",
        "mood_tags": ["enfoque", "limites"],
    },
    {
        "quote": "Sentirte así no es estar haciendo algo mal.",
        "body": (
            "A veces, además de sentirnos mal, nos sentimos mal por sentirnos mal: como si la "
            "tristeza o el cansancio fueran una falla personal. Las emociones difíciles no son "
            "un error de fábrica, son parte de estar vivo. Dejar de pelearte con ellas no las "
            "agranda; muchas veces les quita fuerza."
        ),
        "action": "Cuando aparezca una emoción difícil hoy, nómbrala en silencio, \"esto es frustración\", sin intentar cambiarla de inmediato.",
        "mood_tags": ["autocompasion", "desanimo"],
    },
    {
        "quote": "Lo que se repite en silencio termina pareciendo verdad.",
        "body": (
            "\"No soy buena para esto\", \"siempre llego tarde\", \"nunca termino nada\". Frases "
            "así se dicen tantas veces que dejan de cuestionarse. Pero son resúmenes injustos, "
            "hechos a partir de los peores momentos. Revisarlas con calma suele mostrar que hay "
            "muchas excepciones."
        ),
        "action": "Escribe una frase negativa que te dices seguido y, al lado, un ejemplo real en que no fue cierta.",
        "mood_tags": ["inseguridad", "autocompasion"],
    },
    {
        "quote": "Moverte un poco cambia más de lo que parece.",
        "body": (
            "Cuando el ánimo está bajo, quedarse quieto se siente lo más natural. Pero el cuerpo "
            "y el ánimo van conectados: a veces no es la cabeza la que tiene que convencer al "
            "cuerpo, sino al revés. No hace falta un entrenamiento. Basta con cambiar de "
            "posición, de lugar, de aire."
        ),
        "action": "Sal a caminar diez minutos o, si no puedes salir, estírate junto a una ventana abierta.",
        "mood_tags": ["desanimo", "agotamiento"],
    },
    {
        "quote": "Un límite dicho con calma no necesita disculpas largas.",
        "body": (
            "Cuando por fin decimos que no, solemos acompañarlo de explicaciones, justificaciones "
            "y perdones, como si negarse fuera una falta. Esa sobreexplicación invita a negociar. "
            "Un límite claro y amable, sin rodeos, suele ser mejor recibido de lo que imaginas."
        ),
        "action": "Si hoy tienes que decir que no a algo, hazlo en una sola frase amable, sin dar más de una razón.",
        "mood_tags": ["limites", "relaciones"],
    },
    {
        "quote": "La calma no es la ausencia de ruido. Es saber volver a ti en medio de él.",
        "body": (
            "Esperamos que la tranquilidad llegue cuando se resuelva todo: cuando termine la "
            "semana, cuando pase la entrega, cuando la casa esté en silencio. Pero ese momento "
            "casi nunca llega completo. La calma práctica se parece más a un lugar al que "
            "aprendes a volver, aunque sea por un minuto."
        ),
        "action": "Pon tres alarmas suaves durante el día. Cuando suenen, suelta los hombros y respira hondo una vez antes de seguir.",
        "mood_tags": ["calma"],
    },
    {
        "quote": "No sabes cómo va a salir. Nadie lo sabe. Igual puedes dar el paso.",
        "body": (
            "Antes de un cambio queremos garantías: que va a salir bien, que no nos vamos a "
            "arrepentir. Esas garantías no existen, ni para ti ni para nadie. Esperar a estar "
            "seguro suele significar no moverse nunca. Lo que sí puedes hacer es dar un paso "
            "pequeño y ver qué aprendes."
        ),
        "action": "Piensa en un cambio que te ronda hace tiempo y da hoy un paso de prueba: averigua un dato, haz una pregunta, anota una idea.",
        "mood_tags": ["cambio", "inseguridad"],
    },
    {
        "quote": "Tu atención es limitada. Gástala en lo que quieres que crezca.",
        "body": (
            "Cada minuto que pasas deslizando contenido que no elegiste es un minuto que no "
            "estás en otra cosa. No se trata de culparte por usar el teléfono, sino de notar "
            "cuánto se va sin que lo decidas. Recuperar aunque sea un rato de esa atención ya "
            "cambia el día."
        ),
        "action": "Deja hoy el teléfono en otra habitación durante una comida o durante la primera media hora después de despertar.",
        "mood_tags": ["enfoque", "calma"],
    },
    {
        "quote": "La constancia se parece más a volver que a no irse nunca.",
        "body": (
            "Imaginamos a la gente constante como personas que nunca se desvían. En la práctica, "
            "se distraen, se cansan y dejan cosas igual que todos. La diferencia está en que no "
            "convierten una interrupción en abandono. Vuelven, sin hacer un drama de haber "
            "salido."
        ),
        "action": "Retoma hoy algo que soltaste, sin empezar \"desde cero\" ni prometer nada: solo haz la siguiente parte.",
        "mood_tags": ["constancia"],
    },
    {
        "quote": "Lo que hoy das por sentado, alguna vez fue algo que deseabas.",
        "body": (
            "El lugar donde vives, alguna habilidad que ya dominas, una persona que está en tu "
            "vida: muchas cosas que hoy son rutina fueron en algún momento un deseo o una meta. "
            "Acostumbrarse es natural, pero recordarlo de vez en cuando devuelve algo de brillo "
            "a lo cotidiano."
        ),
        "action": "Anota una cosa que hoy es normal en tu vida y que hace unos años querías o te parecía lejana.",
        "mood_tags": ["gratitud"],
    },
    {
        "quote": "Puedes estar en desacuerdo y seguir siendo amable.",
        "body": (
            "En las discusiones parece que hay que elegir: callar para cuidar el vínculo o decir "
            "lo que piensas y arriesgarlo. Pero hay un camino intermedio. Se puede sostener una "
            "postura sin atacar a la otra persona, hablando de lo que tú piensas en vez de lo "
            "que el otro hace mal."
        ),
        "action": "Si hoy no estás de acuerdo con alguien, empieza tu respuesta con \"yo lo veo distinto porque…\" en vez de \"estás equivocado\".",
        "mood_tags": ["relaciones", "limites"],
    },
    {
        "quote": "El miedo suele ser más grande en la cabeza que en el calendario.",
        "body": (
            "Una llamada difícil, un trámite, una conversación pendiente: mientras los postergas, "
            "ocupan muchísimo espacio mental. Cuando por fin los haces, muchas veces duran diez "
            "minutos. El costo de evitar algo suele ser mayor que el de enfrentarlo."
        ),
        "action": "Haz hoy esa llamada, correo o trámite que vienes evitando. Si no puedes completarlo, al menos da el primer paso.",
        "mood_tags": ["ansiedad", "enfoque"],
    },
    {
        "quote": "Llegar a la noche con energía también es un logro.",
        "body": (
            "Medimos los días por lo que producimos, casi nunca por cómo terminamos. Pero un día "
            "en que trabajaste razonablemente y todavía te queda algo para ti, para tu gente o "
            "para descansar, es un buen día. Exprimirte hasta el final no es la única forma de "
            "cumplir."
        ),
        "action": "Elige hoy una hora para dejar de trabajar o de hacer pendientes, y respétala aunque quede algo sin terminar.",
        "mood_tags": ["agotamiento", "limites"],
    },
    {
        "quote": "No te debes a la versión de ti que tomó esa decisión con menos información.",
        "body": (
            "A veces seguimos en algo solo porque ya invertimos mucho: tiempo, esfuerzo, "
            "palabras dichas. Cambiar de rumbo se siente como admitir un error. Pero tomar una "
            "decisión nueva con lo que sabes hoy no traiciona a nadie. Es justamente para eso "
            "que sirve lo que aprendiste."
        ),
        "action": "Piensa en algo que sigues haciendo solo por costumbre. Escribe si lo elegirías de nuevo hoy, y por qué.",
        "mood_tags": ["cambio", "autocompasion"],
    },
    {
        "quote": "Mirar a alguien a los ojos mientras te habla ya es una forma de cariño.",
        "body": (
            "Muchas conversaciones con la gente cercana pasan a medias: con la tele prendida, "
            "con el teléfono en la mano, pensando en otra cosa. No es falta de amor, es "
            "costumbre. Pero darle a alguien tu atención completa por unos minutos dice más que "
            "cualquier frase bonita."
        ),
        "action": "En tu próxima conversación con alguien cercano, deja el teléfono boca abajo y préstale toda tu atención.",
        "mood_tags": ["relaciones", "gratitud"],
    },
    {
        "quote": "Aprender algo nuevo siempre empieza por hacerlo mal.",
        "body": (
            "De adultos nos cuesta ser principiantes. Queremos que nos salga bien desde el primer "
            "intento y, si no, concluimos que no es lo nuestro. Pero toda habilidad que admiras "
            "en otra persona pasó por una etapa torpe. La torpeza no es una señal para parar, es "
            "parte del camino."
        ),
        "action": "Dedica diez minutos a algo que estás aprendiendo y date permiso explícito de hacerlo mal.",
        "mood_tags": ["inseguridad", "constancia"],
    },
    {
        "quote": "Un minuto de silencio puede ser el mejor momento del día.",
        "body": (
            "Pasamos de una cosa a otra sin pausa: del despertador al teléfono, del trabajo a las "
            "noticias, de las noticias a dormir. Casi nunca hay un rato sin estímulos. Un minuto "
            "de silencio no parece gran cosa, pero es un espacio donde por fin puedes escuchar "
            "cómo estás."
        ),
        "action": "Siéntate un minuto en silencio, sin teléfono ni música, y solo nota cómo te sientes. Puedes hacerlo al despertar o al llegar a casa.",
        "mood_tags": ["calma", "ansiedad"],
    },
]
