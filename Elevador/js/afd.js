/**
 * afd.js
 * Lógica do Autômato Finito Determinístico (AFD) do Elevador
 * Baseado no código original elevador.js
 */

'use strict';

const AFD = (() => {

  /* ── Estados ─────────────────────────── */
  const STATES = [
    '0_ABERTO', '0_FECHADO',
    '1_FECHADO', '1_ABERTO',
    '2_FECHADO', '2_ABERTO',
    '3_FECHADO', '3_ABERTO'
  ];

  /* ── Estado interno ──────────────────── */
  let estado = "0_ABERTO";
  let andar = 0;
  let movendo = false;
  let pilha = [];
  let historicoPilha = [];
  let ultimoSelecionado = null;

  let onTransition = null;

  function setOnTransition(callback) {
    onTransition = callback;
  }

  /* ── API pública ─────────────────────── */
  function getState() { return estado; }
  function getFloor() { return andar; }
  function getStack() { return pilha; }
  function getHistory() { return historicoPilha; }
  function getLastCalled() { return ultimoSelecionado; }
  function isMoving() { return movendo; }

  function callFloor(floorNum) {
    ultimoSelecionado = floorNum;
    push(floorNum);
    processar();
    return { action: 'called', floor: floorNum };
  }

  /* ── PILHA ───────────────────────────── */
  function push(v) {
    pilha.push(v);
    historicoPilha.push(v);
    ultimoSelecionado = v;
  }

  function pop() {
    let v = pilha.pop();
    if (v !== undefined) {
      ultimoSelecionado = v;
    }
    return v;
  }

  /* ── PROCESSAMENTO ───────────────────── */
  function processar() {
    if (movendo || pilha.length === 0) return;
    mover(pop());
  }

  function mover(dest) {
    if (dest === andar) {
      processar();
      return;
    }

    movendo = true;

    fechar(() => {
      let intervalo = setInterval(() => {
        let ant = estado;

        if (andar === dest) {
          clearInterval(intervalo);

          setTimeout(() => {
            abrir();
            movendo = false;
            processar();
          }, 400);

          return;
        }

        let dir = dest > andar ? "subir" : "descer";
        andar += dest > andar ? 1 : -1;
        estado = `${andar}_FECHADO`;

        if (onTransition) onTransition({ from: ant, to: estado, action: 'move', input: dir });

      }, 600);
    });
  }

  function abrir() {
    let ant = estado;
    estado = `${andar}_ABERTO`;

    if (onTransition) onTransition({ from: ant, to: estado, action: 'open' });
  }

  function fechar(cb) {
    let ant = estado;
    estado = `${andar}_FECHADO`;

    if (onTransition) onTransition({ from: ant, to: estado, action: 'close' });

    setTimeout(() => {
      if (cb) cb();
    }, 800);
  }

  function reset() {
    estado = "0_ABERTO";
    andar = 0;
    movendo = false;
    pilha = [];
    ultimoSelecionado = null;
  }

  function isOpen() {
    return estado.includes('ABERTO');
  }

  function isClosed() {
    return estado.includes('FECHADO');
  }

  return {
    getState,
    getFloor,
    getStack,
    getHistory,
    getLastCalled,
    isMoving,
    setOnTransition,
    callFloor,
    reset,
    isOpen,
    isClosed,
    STATES
  };

})();