window.onload = function(){
  let cy;

  /*  GRAFO  */
  if (typeof cytoscape !== "undefined") {
    cy = cytoscape({
      container: document.getElementById('diagrama'),
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
        { selector:'node', style:{'background-color':'#ff2d78','label':'data(id)','color':'white', 'text-valign':'center', 'text-halign':'center'} },
        { selector:'node.start', style:{'shape':'point', 'background-color':'transparent'} },
        { selector:'edge', style:{'line-color':'#00f5ff','target-arrow-color':'#00f5ff','target-arrow-shape':'triangle'} },
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
  }
};