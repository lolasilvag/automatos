/**
 * diagrama.js
 * Geração e exibição do diagrama do autômato usando Cytoscape.
 */

'use strict';

let cy;

function initDiagrama() {
  if (typeof cytoscape === "undefined") return;

  const diagramaEl = document.getElementById('diagrama');
  if (!diagramaEl) return;

  cy = cytoscape({
    container: diagramaEl,
    autoungrabify: true,
    boxSelectionEnabled: false,
    panningEnabled: true,
    userPanningEnabled: true,
    zoomingEnabled: true,
    userZoomingEnabled: true,
    minZoom: 0.5,
    maxZoom: 2.0,
    wheelSensitivity: 0.1,

    style: [
      { selector:'node', style:{'background-color':'#ff2d78','label':'data(id)','color':'white', 'text-valign':'center', 'text-halign':'center', 'font-size':'12px'} },
      { selector:'node.start', style:{'shape':'point', 'background-color':'transparent'} },
      { selector:'edge', style:{'line-color':'#00f5ff','target-arrow-color':'#00f5ff','target-arrow-shape':'triangle', 'width':2} },
      { selector:'edge.start-edge', style:{'line-color':'#ffffff','target-arrow-color':'#ffffff','target-arrow-shape':'triangle','width':3,'opacity':0.8} },
      { selector:'.ativo', style:{'background-color':'#39ff14'} },
      { selector:'.transicao', style:{'line-color':'#ff2d78','width':4} }
    ],

    elements: [
      {data:{id:'start'}, position:{x:50,y:50}, selectable:false, grabbable:false, classes:'start'},
      {data:{id:'0_ABERTO'}},{data:{id:'0_FECHADO'}},
      {data:{id:'1_FECHADO'}},{data:{id:'1_ABERTO'}},
      {data:{id:'2_FECHADO'}},{data:{id:'2_ABERTO'}},
      {data:{id:'3_FECHADO'}},{data:{id:'3_ABERTO'}},

      {data:{id:'s0', source:'start', target:'0_ABERTO'}, classes:'start-edge'},
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
      padding: 50,
      spacingFactor: 2.2,
      avoidOverlap: true,
      nodeDimensionsIncludeLabels: true,
      animate: false,
      fit: true
    }
  });

  window.addEventListener('resize', () => {
    if (cy) {
      cy.resize();
      cy.fit();
    }
  });

  /* garante inicialização com tudo visível */
  if (cy) {
    cy.fit();
    cy.center();
  }

  updateDiagramaHighlight();
}

function updateDiagramaHighlight() {
  if (!cy) return;

  // Remove previous highlights
  cy.elements().removeClass('ativo');

  // Highlight current state (usando função global do elevador.js)
  const currentState = window.getEstado ? window.getEstado() : '0_ABERTO';
  const node = cy.getElementById(currentState);
  if (node) {
    node.addClass('ativo');
  }
}

function abrirDiagrama() {
  const diagramaEl = document.getElementById('diagrama');
  if (diagramaEl) {
    diagramaEl.style.display = 'block';
    if (cy) {
      cy.resize();
      cy.fit();
      cy.center();
    }
  }
}

function fecharDiagrama() {
  const diagramaEl = document.getElementById('diagrama');
  if (diagramaEl) {
    diagramaEl.style.display = 'none';
  }
}

function exibirDOT() {
  // Generate DOT for the automaton
  const dot = `digraph AFD_Elevador {
  rankdir=LR;
  nodesep=0.6;
  ranksep=1.2;

  node [shape=circle, style=filled, fillcolor="#0f172a", fontcolor="white"];
  edge [color="#94a3b8"];

  start [shape=point];
  start -> 0_ABERTO;

  0_ABERTO [label="0_ABERTO"];
  0_FECHADO [label="0_FECHADO"];
  1_FECHADO [label="1_FECHADO"];
  1_ABERTO [label="1_ABERTO"];
  2_FECHADO [label="2_FECHADO"];
  2_ABERTO [label="2_ABERTO"];
  3_FECHADO [label="3_FECHADO"];
  3_ABERTO [label="3_ABERTO"];

  0_ABERTO -> 0_FECHADO [label="0"];
  0_FECHADO -> 1_FECHADO [label="1"];
  1_FECHADO -> 1_ABERTO [label="1"];
  1_ABERTO -> 1_FECHADO [label="1"];
  1_ABERTO -> 2_FECHADO [label="2"];
  2_FECHADO -> 2_ABERTO [label="2"];
  2_ABERTO -> 2_FECHADO [label="2"];
  2_ABERTO -> 3_FECHADO [label="3"];
  3_FECHADO -> 3_ABERTO [label="3"];
}`;

  // Open in Graphviz Online
  const encoded = encodeURIComponent(dot);
  const url = `https://dreampuf.github.io/GraphvizOnline/#${encoded}`;
  window.open(url, '_blank');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initDiagrama);

// Also update highlight when state changes (called from main.js)
window.updateDiagramaHighlight = updateDiagramaHighlight;
window.abrirDiagrama = abrirDiagrama;
window.fecharDiagrama = fecharDiagrama;
window.exibirDOT = exibirDOT;