/**
 * main.js
 * Controlador principal – conecta a lógica do AFD (afd.js) com a UI (ui.js).
 * Todas as funções chamadas pelo HTML ficam aqui.
 */

// Declarar funções globais primeiro
window.chamar = function(floor) {
  const result = AFD.callFloor(floor);

  if (result) {
    UI.addLog(`Chamado andar ${floor} - adicionado à fila`);
  }

  refreshAll();
};

window.reiniciar = function() {
  AFD.reset();
  UI.clearLog();
  UI.addLog('Elevador reiniciado. Estado inicial: 0_ABERTO', false);
  UI.addLog('Aguardando chamada...', false);
  refreshAll();
};

// Inicialização
UI.initStars();
UI.buildTransTable();

// Configurar callback de transições
AFD.setOnTransition((transition) => {
  if (transition.action === 'move') {
    UI.addLog(`δ(${transition.from}, ${transition.input}) → ${transition.to}`);
  } else if (transition.action === 'open') {
    UI.addLog(`δ(${transition.from}, abrir) → ${transition.to}`);
  } else if (transition.action === 'close') {
    UI.addLog(`δ(${transition.from}, fechar) → ${transition.to}`);
  }
});

refreshAll();

UI.addLog('M = (Q, Σ, δ, q0, F)', false);
UI.addLog('Σ  = { T, 1, 2, 3 }', false);
UI.addLog('Q  = { 0_ABERTO, 0_FECHADO, 1_FECHADO, 1_ABERTO, 2_FECHADO, 2_ABERTO, 3_FECHADO, 3_ABERTO }', false);
UI.addLog('F  = { 0_ABERTO, 1_ABERTO, 2_ABERTO, 3_ABERTO }', false);
UI.addLog('q0 = 0_ABERTO ativado. Aguardando chamada...', false);

// Atualização contínua da UI durante movimento
setInterval(refreshAll, 100);

/* ── Helpers internos ────────────────────── */
function refreshAll() {
  const state = AFD.getState();
  const floor = AFD.getFloor();
  const stack = AFD.getStack();
  const last = AFD.getLastCalled();

  UI.updateElevator(floor, AFD.isOpen());
  UI.updateStatus(state);
  UI.updateStack(stack);
  UI.updateLastCalled(last);
  UI.updateTableHighlight(state);

  // Update diagram if visible
  if (window.updateDiagramaHighlight) {
    window.updateDiagramaHighlight();
  }
}