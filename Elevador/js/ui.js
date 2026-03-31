/**
 * ui.js
 * Responsável por toda manipulação do DOM e feedback visual.
 * Não contém lógica do AFD – apenas renderização e animações.
 */

'use strict';

const UI = (() => {

  /* ── Referências DOM ──────────────────── */
  const elevador = () => document.getElementById('elevador');
  const status = () => document.getElementById('status');
  const log = () => document.getElementById('log');
  const pilhaUI = () => document.getElementById('pilha');
  const ultimoSelecionadoUI = () => document.getElementById('ultimo-selecionado');
  const gato = () => document.getElementById('gato');
  const transBody = () => document.getElementById('transBody');

  const pos = [0, 100, 200, 300];

  /* ── Stars background ─────────────────── */
  function initStars() {
    const container = document.getElementById('stars');
    if (!container) return;
    for (let i = 0; i < 40; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.cssText = `
        left: ${Math.random() * 100}%;
        top:  ${Math.random() * 100}%;
        --dur:    ${2 + Math.random() * 4}s;
        --delay:  ${Math.random() * 4}s;
        --bright: ${0.3 + Math.random() * 0.7};
      `;
      container.appendChild(star);
    }
  }

  /* ── Transition table ─────────────────── */
  function buildTransTable() {
    const body = transBody();
    if (!body) return;
    body.innerHTML = '';

    const states = AFD.STATES;
    states.forEach(state => {
      const row = document.createElement('tr');
      row.id = `row_${state}`;

      const transitions = {
        '0_ABERTO': ['0_FECHADO', '-', '-', '-'],
        '0_FECHADO': ['-', '1_FECHADO', '-', '-'],
        '1_FECHADO': ['-', '1_ABERTO', '-', '-'],
        '1_ABERTO': ['-', '1_FECHADO', '2_FECHADO', '-'],
        '2_FECHADO': ['-', '-', '2_ABERTO', '-'],
        '2_ABERTO': ['-', '-', '2_FECHADO', '3_FECHADO'],
        '3_FECHADO': ['-', '-', '-', '3_ABERTO'],
        '3_ABERTO': ['-', '-', '-', '3_FECHADO']
      };

      const trans = transitions[state] || ['-', '-', '-', '-'];

      row.innerHTML = `
        <td>${state}</td>
        <td>${trans[0]}</td>
        <td>${trans[1]}</td>
        <td>${trans[2]}</td>
        <td>${trans[3]}</td>
      `;
      body.appendChild(row);
    });
  }

  function updateTableHighlight(currentState) {
    document.querySelectorAll('.transition-table tr').forEach(r => r.classList.remove('current-row'));
    const row = document.getElementById(`row_${currentState}`);
    if (row) {
      row.classList.add('current-row');
      row.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  const pos = [0, 100, 200, 300];

  /* ── Elevator UI ──────────────────────── */
  function updateElevator(floor, isOpen) {
    const el = elevador();
    el.style.bottom = `${pos[floor]}px`;
    if (isOpen) {
      el.classList.add('aberta');
      gato().style.display = 'block';
    } else {
      el.classList.remove('aberta');
      gato().style.display = 'none';
    }
  }

  function updateStatus(state) {
    status().textContent = `Estado: ${state}`;
  }

  /* ── Stack ────────────────────────────── */
  function updateStack(stack) {
    const ui = pilhaUI();
    ui.innerHTML = '';

    if (stack.length === 0) {
      const d = document.createElement('div');
      d.className = 'item';
      d.innerText = '(vazia)';
      ui.appendChild(d);
      return;
    }

    stack.forEach(v => {
      const d = document.createElement('div');
      d.className = 'item';
      d.innerText = v;
      ui.appendChild(d);
    });
  }

  function updateLastCalled(last) {
    const ui = ultimoSelecionadoUI();
    ui.innerText = last !== null ? `Último chamado: ${last}` : 'Último chamado: -';
  }

  /* ── Log ──────────────────────────────── */
  function addLog(msg, isNew = true) {
    const box = log();
    const entry = document.createElement('div');
    entry.className = `log-entry${isNew ? ' new' : ''}`;
    entry.textContent = '> ' + msg;
    box.appendChild(entry);
    box.scrollTop = box.scrollHeight;
  }

  function clearLog() {
    log().innerHTML = '';
  }

  /* ── Public API ───────────────────────── */
  return {
    initStars,
    buildTransTable,
    updateTableHighlight,
    updateElevator,
    updateStatus,
    updateStack,
    updateLastCalled,
    addLog,
    clearLog
  };

})();