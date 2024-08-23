var ouvindo = false;
var campoSelecionado = null;
var arrayComandos = [
    {comandoVoz: 'nome', idCampo: 'campoTextoNomeCompleto'},
    {comandoVoz: 'profissão', idCampo: 'campoTextoProfissao'},
    {comandoVoz: 'dia', idCampo: 'campoValorDia'},
    {comandoVoz: 'mês', idCampo: 'campoValorMes'},
    {comandoVoz: 'ano', idCampo: 'campoValorAno'},
    {comandoVoz: 'data de nascimento', idCampo: 'campoDataNascimento'},
    {comandoVoz: 'estado civil', idCampo: 'campoSelectEstadoCivil'},
    {comandoVoz: 'sair do campo selecionado', idCampo: ''}
];

var numeros = [
    {escrito: 'zero', correspondente: '0'},
    {escrito: 'um', correspondente: '1'},
    {escrito: 'dois', correspondente: '2'},
    {escrito: 'três', correspondente: '3'},
    {escrito: 'quatro', correspondente: '4'},
    {escrito: 'cinco', correspondente: '5'},
    {escrito: 'seis', correspondente: '6'},
    {escrito: 'sete', correspondente: '7'},
    {escrito: 'oito', correspondente: '8'},
    {escrito: 'nove', correspondente: '9'}
];

let arrayCamposCadastroPessoa = [
    {idCampo: 'campoTextoNomeCompleto', fala: 'Bem-vindo ao Ultra Voice Beta! Vamos iniciar o cadastro inserindo seu nome completo.'},
    {idCampo: 'campoValorDia', fala: 'Para este campo informe o dia do seu nascimento.'},
    {idCampo: 'campoValorMes', fala: 'Para este campo informe o mês do seu nascimento.'},
    {idCampo: 'campoValorAno', fala: 'Para este campo informe o ano do seu nascimento.'},
    {idCampo: 'campoTextoProfissao', fala: 'Aqui informe a sua profissão.'},
    {idCampo: 'campoSelectEstadoCivil', fala: 'Escolha entre as opções o seu estado civil.'}
];

const reconhecimentoVoz = new window.webkitSpeechRecognition();
reconhecimentoVoz.continuous = true;
reconhecimentoVoz.interimResults = false;
reconhecimentoVoz.lang = "pt-BR";

reconhecimentoVoz.onresult = (event) => {
    let resultadoFinal = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
            resultadoFinal += event.results[i][0].transcript;
        }
    }

    let resultadoFinalTratado = resultadoFinal.toLowerCase().trim();
    console.log("log comando voz: " + resultadoFinalTratado);

    if (ouvindo == true) {
        selecionarCampoCadastroPessoa(false, resultadoFinal);
    }
};

reconhecimentoVoz.onend = () => {
    if (sintetizador.speaking == false) {
        reiniciarSpeechAPI();
    }
}

async function reiniciarSpeechAPI() {
    await reconhecimentoVoz.stop();
    await reconhecimentoVoz.start();
}

async function selecionarCampoCadastroPessoa(avancarCampo = false, resposta = '') {
    let camposData = ['campoValorDia', 'campoValorMes', 'campoValorAno'];

    if (arrayCamposCadastroPessoa.length == 1 && document.getElementById(arrayCamposCadastroPessoa[0].idCampo).value != "") {        
        if (avancarCampo == true) {
            fala("Deseja finalizar o cadastro?");
            return;
        }

        if (resposta.split(" ").includes("sim")) {
            if (!camposData.includes(arrayCamposCadastroPessoa[0].idCampo)) {
                document.getElementById(arrayCamposCadastroPessoa[0].idCampo).classList.add("campoConfirmado");
            }

            document.getElementById(arrayCamposCadastroPessoa[0].idCampo).classList.remove("emFoco");
            arrayCamposCadastroPessoa.shift();

            if (arrayCamposCadastroPessoa.length == 0) {
                campoSelecionado.blur();
                fala("Parabéns! Cadastro realizado com sucesso.");
                return;
            }
        }
    }
    
    if (document.getElementById(arrayCamposCadastroPessoa[0].idCampo).value != "") {
        if (avancarCampo == true) {
            fala("Deseja avançar para o próximo campo?");
            return;
        }

        if (resposta == "") {
            return;
        }

        if (resposta.split(" ").includes("sim")) {
            if (camposData.includes(arrayCamposCadastroPessoa[0].idCampo) && validaCampoData(arrayCamposCadastroPessoa[0].idCampo) == false) {
                return;
            }

            if (!camposData.includes(arrayCamposCadastroPessoa[0].idCampo)) {
                document.getElementById(arrayCamposCadastroPessoa[0].idCampo).classList.add("campoConfirmado");
            }

            document.getElementById(arrayCamposCadastroPessoa[0].idCampo).classList.remove("emFoco");
            arrayCamposCadastroPessoa.shift();
        }
    }

    if (document.getElementById(arrayCamposCadastroPessoa[0].idCampo) != document.activeElement) {
        fala(arrayCamposCadastroPessoa[0].fala);
        document.getElementById(arrayCamposCadastroPessoa[0].idCampo).focus();
        document.getElementById(arrayCamposCadastroPessoa[0].idCampo).classList.add("emFoco");
        return;
    }

    if (document.getElementById(arrayCamposCadastroPessoa[0].idCampo) == document.activeElement && resposta != "") {
        preencherCampoCadastroPessoa(resposta);
        return;
    }
}

function preencherCampoCadastroPessoa(resposta) {
    campoSelecionado = document.getElementById(arrayCamposCadastroPessoa[0].idCampo);

    let respostaDividida = resposta.split(" ");
    let parteNumerica = '';

    if (respostaDividida.length > 1) {
        parteNumerica = respostaDividida[1];

        if (isNaN(parteNumerica.trim())) {
            let numeroEncontrado = numeros.find(function(numero) {
                return numero.escrito == respostaDividida[1];
            });

            if (numeroEncontrado !== undefined) {
                parteNumerica = numeroEncontrado.correspondente;
            }
        }
    } else {
        parteNumerica = respostaDividida[0];
    }

    if (isNaN(parteNumerica.trim()) && arrayCamposCadastroPessoa[0].idCampo.startsWith("campoValor") && respostaDividida[0] != "número") {
        fala("Para este campo é permitido apenas números!");
        return;
    }


    if (!isNaN(parteNumerica.trim()) && campoSelecionado.tagName.toLocaleLowerCase() === "input") {
        campoSelecionado.value = parteNumerica.trim().padStart(2, "0");
    }  else if (campoSelecionado.tagName.toLocaleLowerCase() === "input") {
        let respostaTratada = respostaDividida.map((palavra) => {
            return palavra[0].toUpperCase() + palavra.substring(1);
        }).join(" ");

        campoSelecionado.value = respostaTratada.trim();
    } else if (campoSelecionado.tagName.toLocaleLowerCase() === "select") {
        if (resposta.trim() == "solteiro" || resposta.trim() == "solteira") {
            campoSelecionado.value = 1;
        } else if (resposta.trim() == "casado" || resposta.trim() == "casada") {
            campoSelecionado.value = 2;
        } else if (resposta.trim() == "divorciado" || resposta.trim() == "divorciada") {
            campoSelecionado.value = 3;
        } else if (resposta.trim() == "viúvo" || resposta.trim() == "viúva") {
            campoSelecionado.value = 4;
        } else {
            fala("Estado Civil inexistente!");
        }
    }
    selecionarCampoCadastroPessoa(true);
}

function sairDoCampo() {
    for (let j = 0; j < document.getElementById("tabelaPrincipal").querySelectorAll("input").length; j++) {
        if (document.getElementById("tabelaPrincipal").querySelectorAll("input")[j] == document.activeElement) {
            document.getElementById("tabelaPrincipal").querySelectorAll("input")[j].blur();
            campoSelecionado = null;
        }
    }

    for (let j = 0; j < document.getElementById("tabelaPrincipal").querySelectorAll("select").length; j++) {
        if (document.getElementById("tabelaPrincipal").querySelectorAll("select")[j] == document.activeElement) {
            document.getElementById("tabelaPrincipal").querySelectorAll("select")[j].blur();
            campoSelecionado = null;
        }
    }
}

function validacaoComandoDeVoz() {
    if (ouvindo == false) {
        document.getElementById("btnIcone").setAttribute("class", "fa-solid fa-microphone fa-fade");
        document.getElementById("btnIcone").setAttribute("style", "color: #008000;");
        ouvindo = true;

        selecionarCampoCadastroPessoa(false);
    } else if (ouvindo == true) {
        document.getElementById(arrayCamposCadastroPessoa[0].idCampo).blur();
        document.getElementById(arrayCamposCadastroPessoa[0].idCampo).classList.remove("emFoco");
        document.getElementById("btnIcone").setAttribute("class", "fa-solid fa-microphone-slash");
        document.getElementById("btnIcone").setAttribute("style", "color: #FF0000;");
        document.getElementById("campoInteracaoAPI").value = 'Clique no microfone ao lado para iniciar o cadastro com comando de voz!';
        ouvindo = false;
    }
}

async function pronunciarFrase(frase) {
    let arrayFrase = frase.split("");
    document.getElementById("campoInteracaoAPI").value = '';

    const temporizador = setInterval(() => {
        document.getElementById("campoInteracaoAPI").value += arrayFrase[0];
        arrayFrase.shift();

        if (arrayFrase.length == 0) {
            clearInterval(temporizador);
        }
    }, 58)
}