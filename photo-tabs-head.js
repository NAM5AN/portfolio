(()=>{
  const configs=[
    {modalId:'videoModal',selector:'.tabbar'},
    {modalId:'photoModal',selector:'.photo-gallery-tabs'},
    {modalId:'designModal',selector:'.tabbar'}
  ];

  let moved=false;
  configs.forEach(({modalId,selector})=>{
    const modal=document.getElementById(modalId);
    const head=modal?.querySelector('.modal-head');
    const tabs=modal?.querySelector(selector);
    if(!modal||!head||!tabs)return;

    head.appendChild(tabs);
    tabs.classList.add('modal-tabs-in-head');
    moved=true;
  });

  /* Re-measure all elastic pills after reparenting so their positions stay exact. */
  if(moved){
    requestAnimationFrame(()=>{
      window.dispatchEvent(new Event('resize'));
    });
  }
})();
