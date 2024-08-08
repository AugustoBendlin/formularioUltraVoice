function opcaoSelecionada() {
    if (document.getElementById("campoSelectEstadoCivil").value == ""){
        document.getElementById("campoSelectEstadoCivil").setAttribute("class", "camposSelect selecionePlaceHolder");
    } else {
        document.getElementById("campoSelectEstadoCivil").setAttribute("class", "camposSelect selecionado");
    }
}

function validarData(dataString) {
    let data = new Date(dataString);
    return !isNaN(data.getTime());
}

function validaUltimoDiaDoMes(mes, ano) {
    let data = new Date(ano, mes, 0);
    return data.getDate();
}

function validaCampoData(campoData) {
    let ano = document.getElementById("campoValorAno").value;
    let mes = document.getElementById("campoValorMes").value;
    let dia = document.getElementById("campoValorDia").value;
    let dataInvalida = false;

    if (campoData == "campoValorDia" && dia > 31) {
        fala("Não é permitido datas com o dia maior que 31.");
        dataInvalida = true;
    }

    if (campoData == "campoValorMes" && mes > 12) {
        fala("Não é permitido datas com o mês maior que 12.");
        dataInvalida = true;
    }

    if (dataInvalida === true) {
        document.getElementById(campoData).classList.remove("emFoco");
        document.getElementById(campoData).blur();
        document.getElementById(campoData).value = '';
        selecionarCampoCadastroPessoa(false);

        return false;
    }

    if (campoData == "campoValorAno") {
        let dataString = ano + '-' + mes + '-' + dia;

        if (validarData(dataString) === false) {
            fala("Data inválida! Por favor preencha os campos de data novamente.");
            dataInvalida = true;
        }

        if (validaUltimoDiaDoMes(mes, ano) == 28 && dia > 28) {
            fala("Não é permitido dia maior que 28 em Fevereiro, com excessão do ano Bissexto.");
            dataInvalida = true;
        }

        if (validaUltimoDiaDoMes(mes, ano) == 29 && dia > 29) {
            fala("Ano bissexto! Não é permitido dia maior que 29.");
            dataInvalida = true;
        }

        if (validaUltimoDiaDoMes(mes, ano) == 30 && dia > 30) {
            fala("Não é permitido dia maior que 30 para este mês.");
            dataInvalida = true;
        }

        if (dataInvalida === true) {
            document.getElementById("campoValorAno").classList.remove("emFoco");
            arrayCamposCadastroPessoa.unshift({idCampo: 'campoValorMes', fala: 'Para este campo informe o mês do seu nascimento.'});
            arrayCamposCadastroPessoa.unshift({idCampo: 'campoValorDia', fala: 'Para este campo informe o dia do seu nascimento.'});
            document.getElementById("campoValorAno").value = '';
            document.getElementById("campoValorMes").value = '';
            document.getElementById("campoValorDia").value = '';
            selecionarCampoCadastroPessoa(false);

            return false;
        }

        document.getElementById("containerData").classList.add("dataValida");
        return true;
    }
}

window.onload = () => {
    reconhecimentoVoz.start();
}