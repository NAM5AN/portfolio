(()=>{
  const pane=document.querySelector('.resume-career');
  const scroller=pane?.querySelector('.resume-scroll');
  if(!pane||!scroller)return;

  let indicator=pane.querySelector('.resume-scroll-indicator');
  if(!indicator){
    indicator=document.createElement('span');
    indicator.className='resume-scroll-indicator';
    indicator.setAttribute('aria-hidden','true');
    pane.appendChild(indicator);
  }

  let hideTimer=0;
  let raf=0;
  const TRACK_PAD=8;
  const MIN_THUMB=34;

  const update=()=>{
    raf=0;
    const viewport=scroller.clientHeight;
    const content=scroller.scrollHeight;
    if(viewport<=0||content<=viewport+1){
      indicator.classList.remove('is-visible');
      return;
    }
    const track=Math.max(0,viewport-TRACK_PAD*2);
    const thumb=Math.max(MIN_THUMB,track*(viewport/content));
    const maxScroll=Math.max(1,content-viewport);
    const maxTravel=Math.max(0,track-thumb);
    const progress=Math.min(1,Math.max(0,scroller.scrollTop/maxScroll));
    indicator.style.height=`${thumb}px`;
    indicator.style.top=`${TRACK_PAD+maxTravel*progress}px`;
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
  new ResizeObserver(scheduleUpdate).observe(scroller);
  scheduleUpdate();
})();
