(()=>{
  const SELECTOR='.section-modal .modal-body, .section-modal .doc-index, .section-modal .doc-reader';
  const bound=new WeakSet();
  const TRACK_PAD=8;
  const MIN_THUMB=34;

  const bind=scroller=>{
    if(!(scroller instanceof HTMLElement)||bound.has(scroller))return;
    const dialog=scroller.closest('.section-modal');
    if(!dialog)return;
    bound.add(scroller);

    const indicator=document.createElement('span');
    indicator.className='modal-scroll-indicator';
    indicator.setAttribute('aria-hidden','true');
    dialog.appendChild(indicator);

    let hideTimer=0;
    let raf=0;

    const update=()=>{
      raf=0;
      const rect=scroller.getBoundingClientRect();
      const viewport=scroller.clientHeight;
      const content=scroller.scrollHeight;
      if(rect.width<=0||rect.height<=0||viewport<=0||content<=viewport+1){
        indicator.classList.remove('is-visible');
        return;
      }

      const track=Math.max(0,rect.height-TRACK_PAD*2);
      const thumb=Math.min(track,Math.max(MIN_THUMB,track*(viewport/content)));
      const maxScroll=Math.max(1,content-viewport);
      const maxTravel=Math.max(0,track-thumb);
      const progress=Math.min(1,Math.max(0,scroller.scrollTop/maxScroll));

      indicator.style.height=`${thumb}px`;
      indicator.style.top=`${rect.top+TRACK_PAD+maxTravel*progress}px`;
      indicator.style.left=`${Math.max(0,rect.right-(window.innerWidth<=900?5:6))}px`;
    };

    const scheduleUpdate=()=>{
      if(!raf)raf=requestAnimationFrame(update);
    };
    const showBriefly=()=>{
      scheduleUpdate();
      indicator.classList.add('is-visible');
      clearTimeout(hideTimer);
      hideTimer=window.setTimeout(()=>indicator.classList.remove('is-visible'),650);
    };

    scroller.addEventListener('scroll',showBriefly,{passive:true});
    scroller.addEventListener('wheel',showBriefly,{passive:true});
    scroller.addEventListener('touchmove',showBriefly,{passive:true});
    window.addEventListener('resize',scheduleUpdate,{passive:true});
    dialog.addEventListener('close',()=>indicator.classList.remove('is-visible'));
    if('ResizeObserver' in window)new ResizeObserver(scheduleUpdate).observe(scroller);
    scheduleUpdate();
  };

  const scan=(root=document)=>{
    if(root instanceof HTMLElement&&root.matches?.(SELECTOR))bind(root);
    root.querySelectorAll?.(SELECTOR).forEach(bind);
  };

  scan();

  /* Modal contents are occasionally rendered or replaced after a click. Re-scan only then. */
  document.addEventListener('click',event=>{
    if(event.target instanceof Element&&event.target.closest('[data-open], .tab, .doc-button, .photo-gallery-tab')){
      requestAnimationFrame(()=>scan());
    }
  },true);
})();
