function start(event){
    showNext();
    event.target.innerHTML = "Repetir";
    document.getElementById("btn-repeat").onclick = playAudio;
    document.getElementById('mostrar').style.visibility = 'visible';
}

function playAudio(){
    audio_element = document.getElementById("syllable_audio");
    audio_element.load();
    audio_element.play();
}
function mostrarBack(){
    back.style.visibility="visible";
    btn_acerto.style.visibility="visible";
    btn_erro.style.visibility="visible";
}
function showNext(){
    updateSelectedData();
    N = selected_data.length;
    if (N==0){
        alert('Selecione alguma sílaba!!');
        resetScore();
        return;
    }
    choice = selected_data[getRandomInt(N)];
    back.innerHTML = choice["syllable"];
    audio_element.src = choice["link"];
    updateScore();
    hideEntireBack();
    audio_element.play();
}
function updateSelectedData(){
    selected_data = [];
    for (i=0; i<data.length; i++){
        silly = data[i]["syllable"];
        if (Object.keys(selectionMatrix).includes(silly)){
            if( selectionMatrix[silly]){
                selected_data.push(data[i]);
            }
        }
    }
}
function acertei(){
    num_acertos++;
    showNext();
}
function errei(){
    num_erros++;
    showNext();
}
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
function resetScore(){
    num_acertos = 0;
    num_erros = 0;
    updateScore();
    document.getElementById("btn-repeat").innerHTML = 'Start';
    document.getElementById('mostrar').style.visibility = 'hidden';
    hideEntireBack()
    document.getElementById("btn-repeat").onclick = start;
    //showNext();
}

function updateScore(){
    score_acertos.innerHTML = num_acertos;
    score_erros.innerHTML = num_erros;
}

function hideEntireBack(){
    btn_acerto.style.visibility="hidden";
    btn_erro.style.visibility="hidden";
    back.style.visibility="hidden";
}

