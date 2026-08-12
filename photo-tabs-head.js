(()=>{
  const modal=document.getElementById('photoModal');
  const head=modal?.querySelector('.modal-head');
  const tabs=modal?.querySelector('.photo-gallery-tabs');
  if(!modal||!head||!tabs)return;

  head.appendChild(tabs);
  tabs.classList.add('photo-tabs-in-head');

  /* Re-measure the elastic pill after reparenting so its position stays exact. */
  requestAnimationFrame(()=>{
    window.dispatchEvent(new Event('resize'));
  });
})();
