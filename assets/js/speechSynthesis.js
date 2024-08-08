const sintetizador = window.speechSynthesis;
var vozesBrasileiras = [];

function defineVozes() {
    sintetizador.getVoices().forEach(voz => {
        if (voz.lang == "pt-BR") {
            vozesBrasileiras.push(voz);
        }
    });
};

if (sintetizador.onvoiceschanged !== undefined) {
    sintetizador.onvoiceschanged = defineVozes;
}

function fala(textoFala) {
    const sintetizadorEnunciado = new window.SpeechSynthesisUtterance(textoFala);

    vozesBrasileiras.forEach(voz => {
        if (voz.name == "Google português do Brasil") {
            sintetizadorEnunciado.voice = voz;
        }
    });

    sintetizadorEnunciado.rate = 1.2;
    sintetizadorEnunciado.pitch = 1;
    sintetizadorEnunciado.lang = 'pt-BR';

    sintetizadorEnunciado.onstart = () => {
        reconhecimentoVoz.stop();
        pronunciarFrase(textoFala);
    }

    sintetizadorEnunciado.onend = () => {
        reconhecimentoVoz.start();
    }

    sintetizador.speak(sintetizadorEnunciado);
}