window.onload = function(){

let estado = "0_ABERTO";
let andar = 0;
let movendo = false;

let pilha = [];

const elevador = document.getElementById("elevador");
const status = document.getElementById("status");
const log = document.getElementById("log");
const pilhaUI = document.getElementById("pilha");
const gato = document.getElementById("gato");

const pos = [0,100,200,300];

/* ===== PILHA ===== */

function atualizarPilha(){
  pilhaUI.innerHTML = "";
  pilha.forEach(v=>{
    let d = document.createElement("div");
    d.className = "item";
    d.innerText = v;
    pilhaUI.appendChild(d);
  });
}

function push(v){
  pilha.push(v);
  atualizarPilha();
}

function pop(){
  let v = pilha.pop();
  atualizarPilha();
  return v;
}

/* ===== LOG ===== */

function logar(o,e,d){
  let p = document.createElement("p");
  p.innerText = `δ(${o}, ${e}) → ${d}`;
  log.appendChild(p);
  log.scrollTop = log.scrollHeight;
}

/* ===== UI ===== */

function atualizar(){
  elevador.style.bottom = pos[andar] + "px";
  status.innerText = `Estado: ${estado}`;
}

/* ===== PORTA ===== */

function abrir(){
  let ant = estado;
  estado = `${andar}_ABERTO`;

  elevador.classList.add("aberta");
  gato.style.display = "block";

  logar(ant,"abrir",estado);
  atualizar();
}

function fechar(cb){
  let ant = estado;

  setTimeout(()=>{
    estado = `${andar}_FECHADO`;

    elevador.classList.remove("aberta");
    gato.style.display = "none";

    logar(ant,"fechar",estado);
    atualizar();

    if(cb) cb();
  },800);
}

/* ===== PDA ===== */

function processar(){

  if(movendo) return;
  if(pilha.length === 0) return;

  let destino = pop();
  mover(destino);
}

/* ===== MOVIMENTO ===== */

function mover(dest){

  if(dest === andar){
    processar();
    return;
  }

  movendo = true;

  fechar(()=>{

    let intervalo = setInterval(()=>{

      let ant = estado;

      if(andar === dest){
        clearInterval(intervalo);

        setTimeout(()=>{
          abrir();
          movendo = false;
          processar(); // continua pilha
        },500);

        return;
      }

      let dir = dest > andar ? "subir" : "descer";

      andar += dest > andar ? 1 : -1;
      estado = `${andar}_FECHADO`;

      logar(ant,dir,estado);
      atualizar();

    },700);

  });
}

/* ===== BOTÕES ===== */

window.chamar = function(n){
  push(n);      // PDA
  processar();  // executa
}

/* INIT */
abrir();

}