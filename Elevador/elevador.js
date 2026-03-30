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

let cy; 

/*  GRAFO  */
if (typeof cytoscape !== "undefined") {
  cy = cytoscape({
    container: document.getElementById('diagrama'),

    style: [
      { selector:'node', style:{'background-color':'#ff2d78','label':'data(id)','color':'white'} },
      { selector:'edge', style:{'line-color':'#00f5ff','target-arrow-color':'#00f5ff','target-arrow-shape':'triangle'} },
      { selector:'.ativo', style:{'background-color':'#39ff14'} },
      { selector:'.transicao', style:{'line-color':'#ff2d78','width':4} }
    ],

    elements: [
      {data:{id:'0_ABERTO'}},{data:{id:'0_FECHADO'}},
      {data:{id:'1_FECHADO'}},{data:{id:'1_ABERTO'}},
      {data:{id:'2_FECHADO'}},{data:{id:'2_ABERTO'}},
      {data:{id:'3_FECHADO'}},{data:{id:'3_ABERTO'}},

      {data:{id:'e1',source:'0_ABERTO',target:'0_FECHADO'}},
      {data:{id:'e2',source:'0_FECHADO',target:'1_FECHADO'}},
      {data:{id:'e3',source:'1_FECHADO',target:'1_ABERTO'}},
      {data:{id:'e4',source:'1_ABERTO',target:'1_FECHADO'}},
      {data:{id:'e5',source:'1_FECHADO',target:'2_FECHADO'}},
      {data:{id:'e6',source:'2_FECHADO',target:'2_ABERTO'}},
      {data:{id:'e7',source:'2_ABERTO',target:'2_FECHADO'}},
      {data:{id:'e8',source:'2_FECHADO',target:'3_FECHADO'}},
      {data:{id:'e9',source:'3_FECHADO',target:'3_ABERTO'}}
    ],

    layout: {
      name: 'breadthfirst',
      directed: true,
      padding: 20,
      spacingFactor: 1.8,
      avoidOverlap: true,
      nodeDimensionsIncludeLabels: true,
      animate: false,
      fit: true,
      boundingBox: { x1: 0, y1: 0, x2: 900, y2: 500 }
    }
  });
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

  //  proteção
  if(cy){
    cy.nodes().removeClass("ativo");
    cy.edges().removeClass("transicao");

    let node=cy.getElementById(d);
    if(node) node.addClass("ativo");

    cy.edges().forEach(edge=>{
      if(edge.source().id()===o && edge.target().id()===d){
        edge.addClass("transicao");
      }
    });
  }
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

  if(cy){
    cy.nodes().removeClass("ativo");
    cy.edges().removeClass("transicao");
    cy.getElementById(estado).addClass("ativo");
  }

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

/*  BOTÕES  */
window.chamar = function(n){
  ultimoSelecionado = n;
  push(n);
  processar();
}

/* INIT */
abrir();

};