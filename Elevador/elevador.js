window.onload = function(){

let estado = "0_ABERTO";
let andar = 0;
let movendo = false;
let pilha = [];
let historicoPilha = [];
let ultimoSelecionado = null;

const elevador = document.getElementById("elevador");
const status = document.getElementById("status");
const log = document.getElementById("log");
const pilhaUI = document.getElementById("pilha");
const ultimoSelecionadoUI = document.getElementById("ultimo-selecionado");
const gato = document.getElementById("gato");

const pos = [0,100,200,300];

/*  GRAFO  */
if (typeof cytoscape !== "undefined") {
  // Diagrama movido para diagrama.js
}

/*  PILHA  */
function atualizarPilha(){
  pilhaUI.innerHTML="";

  if(historicoPilha.length === 0){
    let d = document.createElement("div");
    d.className = "item";
    d.innerText = "(vazia)";
    pilhaUI.appendChild(d);
    return;
  }

  historicoPilha.forEach(v=>{
    let d=document.createElement("div");
    d.className="item";
    d.innerText=v;
    pilhaUI.appendChild(d);
  });
}

function atualizarUltimo(){
  let texto = "Último chamado: -";
  if(ultimoSelecionado !== null){
    texto = `Último chamado: ${ultimoSelecionado}`;
  }
  ultimoSelecionadoUI.innerText = texto;
}

function push(v){
  pilha.push(v);
  historicoPilha.push(v);
  ultimoSelecionado = v;
  atualizarPilha();
  atualizarUltimo();
}

function pop(){
  let v = pilha.pop();
  if(v !== undefined){
    ultimoSelecionado = v;
  }
  atualizarPilha();
  atualizarUltimo();
  return v;
}

/*  LOG  */
function logar(o,e,d){

  let p=document.createElement("p");
  p.textContent=`δ(${o}, ${e}) → ${d}`;
  log.appendChild(p);
  log.scrollTop=log.scrollHeight;

  // Diagrama movido para diagrama.js
}
function reiniciar(){
  estado = "0_ABERTO";
  andar = 0;
  movendo = false;
  pilha = [];
  ultimoSelecionado = null;

  log.innerHTML = "";
  atualizarPilha();
  atualizarUltimo();

  elevador.classList.remove("aberta");
  gato.style.display = "none";

  // Diagrama movido para diagrama.js

  atualizar();
  abrir();
}
/*  UI  */
function atualizar(){
  elevador.style.bottom = pos[andar]+"px";
  status.innerText = `Estado: ${estado}`;
}

/*  PORTA  */
function abrir(){
  let ant=estado;
  estado=`${andar}_ABERTO`;

  elevador.classList.add("aberta");
  gato.style.display="block";

  logar(ant,"abrir",estado);
  atualizar();
}

function fechar(cb){
  let ant=estado;

  setTimeout(()=>{
    estado=`${andar}_FECHADO`;

    elevador.classList.remove("aberta");
    gato.style.display="none";

    logar(ant,"fechar",estado);
    atualizar();

    if(cb) cb();
  },800);
}

/*  PDA  */
function processar(){
  if(movendo || pilha.length===0) return;
  mover(pop());
}

/*  MOVIMENTO  */
function mover(dest){

  if(dest===andar){ processar(); return; }

  movendo=true;

  fechar(()=>{

    let intervalo=setInterval(()=>{

      let ant=estado;

      if(andar===dest){
        clearInterval(intervalo);

        setTimeout(()=>{
          abrir();
          movendo=false;
          processar();
        },400);

        return;
      }

      let dir = dest>andar?"subir":"descer";

      andar += dest>andar?1:-1;
      estado=`${andar}_FECHADO`;

      logar(ant,dir,estado);
      atualizar();

    },600);

  });
}

/*  CONTROLES DO DIAGRAMA */
window.abrirDiagrama = function(){
  window.open('diagrama.html', '_blank');
}

window.gerarDOT = function(){
  if(!cy) return '';
  let dot = 'digraph Elevador {\n  rankdir=LR;\n  splines=true;\n  nodesep=0.7;\n  ranksep=1.0;\n';

  cy.nodes().forEach(node => {
    const id = node.id();
    dot += `  "${id}" [shape=circle, style=filled, fillcolor=\"#0f172a\", fontcolor=\"white\"];\n`;
  });

  cy.edges().forEach(edge => {
    const source = edge.source().id();
    const target = edge.target().id();
    dot += `  "${source}" -> "${target}" [color=\"#94a3b8\"];\n`;
  });

  dot += '  start [shape=point];\n  start -> "0_ABERTO";\n';
  dot += '}';
  return dot;
}

window.exibirDOT = function(){
  const output = document.getElementById('dotOutput');
  output.style.display = 'block';
  output.textContent = window.gerarDOT();
}

/*  BOTÕES  */
window.chamar = function(n){
  ultimoSelecionado = n;
  push(n);
  processar();
}

/* INIT */
abrir();

};