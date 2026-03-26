window.onload = function () {

let estado = "0_ABERTO";
let andar = 0;
let movendo = false;

const elevador = document.getElementById("elevador");
const status = document.getElementById("status");
const log = document.getElementById("log");
const tabela = document.getElementById("tabela");
const gato = document.getElementById("gato");

const pos = [0, 100, 200, 300];

/* TRANSIÇÕES */
const transicoes = [
  ["0_ABERTO","fechar","0_FECHADO"],
  ["0_FECHADO","subir","1_FECHADO"],
  ["1_FECHADO","abrir","1_ABERTO"],
  ["1_ABERTO","fechar","1_FECHADO"],
  ["1_FECHADO","subir","2_FECHADO"],
  ["2_FECHADO","abrir","2_ABERTO"],
  ["2_ABERTO","fechar","2_FECHADO"],
  ["2_FECHADO","subir","3_FECHADO"],
  ["3_FECHADO","abrir","3_ABERTO"]
];

/* MONTA TABELA */
transicoes.forEach((t,i)=>{
  let tr = document.createElement("tr");
  tr.id = "r"+i;
  tr.innerHTML = `<td>${t[0]}</td><td>${t[1]}</td><td>${t[2]}</td>`;
  tabela.appendChild(tr);
});

/* DESTACAR */
function destacar(o,e,d){
  document.querySelectorAll("tr").forEach(r=>{
    r.classList.remove("ativo","pulse");
  });

  transicoes.forEach((t,i)=>{
    if(t[0]===o && t[1]===e && t[2]===d){
      let row = document.getElementById("r"+i);
      row.classList.add("ativo","pulse");
    }
  });
}

/* LOG */
function logar(o,e,d){
  let p = document.createElement("p");
  p.textContent = `δ(${o}, ${e}) → ${d}`;
  log.appendChild(p);
  log.scrollTop = log.scrollHeight;
  destacar(o,e,d);
}

/* UI */
function atualizar(){
  elevador.style.bottom = pos[andar] + "px";
  status.innerText = `Estado: ${estado}`;
}

/* PORTA */
function abrir(){
  let ant = estado;
  estado = `${andar}_ABERTO`;
  elevador.classList.add("aberta");
  gato.style.display = "block"; // 🐱 aparece
  logar(ant,"abrir",estado);
  atualizar();
}

function fechar(callback){
  let ant = estado;

  setTimeout(()=>{
    estado = `${andar}_FECHADO`;
    elevador.classList.remove("aberta");
    gato.style.display = "none"; // 🐱 some
    logar(ant,"fechar",estado);
    atualizar();

    if(callback) callback();
  },1000);
}

/* MOVIMENTO */
function mover(destino){

  if(movendo || destino === andar) return;

  movendo = true;

  fechar(()=>{

    const intervalo = setInterval(()=>{

      let ant = estado;

      if(andar === destino){
        clearInterval(intervalo);
        abrir();
        movendo = false;
        return;
      }

      andar += destino > andar ? 1 : -1;
      estado = `${andar}_FECHADO`;

      logar(ant,"subir",estado);
      atualizar();

    },800);

  });
}

/* BOTÕES */
window.chamar = function(n){
  mover(n);
};

/* INICIO */
abrir();

};