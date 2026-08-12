(()=>{
  const dlg=document.querySelector('.photo-lightbox');
  if(!dlg)return;
  const viewport=dlg.querySelector('.photo-lightbox-viewport');
  const img=viewport?.querySelector('img');
  if(!viewport||!img)return;

  const fitImage=()=>{
    if(!img.naturalWidth||!img.naturalHeight)return;
    const vw=viewport.clientWidth;
    const vh=viewport.clientHeight;
    if(!vw||!vh)return;

    const compact=window.matchMedia('(max-width:760px)').matches;
    const insetX=compact
      ? 12
      : Math.min(56,Math.max(28,vw*0.035));
    const insetY=compact
      ? 18
      : Math.min(64,Math.max(34,vh*0.05));
    const availableWidth=Math.max(1,vw-insetX*2);
    const availableHeight=Math.max(1,vh-insetY*2);
    const ratio=Math.min(
      availableWidth/img.naturalWidth,
      availableHeight/img.naturalHeight
    );
    const fittedWidth=Math.max(1,Math.floor(img.naturalWidth*ratio));
    const fittedHeight=Math.max(1,Math.floor(img.naturalHeight*ratio));

    img.style.maxWidth='none';
    img.style.maxHeight='none';
    img.style.width=`${fittedWidth}px`;
    img.style.height=`${fittedHeight}px`;
    img.style.objectFit='fill';
    img.style.visibility='visible';
    img.dataset.fitReady='true';
  };

  img.style.visibility='hidden';
  img.addEventListener('load',()=>requestAnimationFrame(fitImage));

  const srcObserver=new MutationObserver(mutations=>{
    if(mutations.some(m=>m.attributeName==='src')){
      img.style.visibility='hidden';
      img.dataset.fitReady='false';
      if(img.complete&&img.naturalWidth)requestAnimationFrame(fitImage);
    }
  });
  srcObserver.observe(img,{attributes:true,attributeFilter:['src']});

  let resizeTimer=0;
  const refit=()=>{
    clearTimeout(resizeTimer);
    resizeTimer=window.setTimeout(()=>{
      if(!dlg.open||!img.naturalWidth)return;
      const transform=img.style.transform||'';
      const match=transform.match(/scale\(([^)]+)\)/);
      const currentScale=match?Number(match[1]):1;
      if(!Number.isFinite(currentScale)||currentScale<=1.001)fitImage();
    },60);
  };
  window.addEventListener('resize',refit,{passive:true});
  if('ResizeObserver' in window)new ResizeObserver(refit).observe(viewport);
})();
