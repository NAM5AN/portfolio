(()=>{
  const GROUPS=[
    '#videoModal .tabbar',
    '#designModal .tabbar',
    '#photoModal .photo-gallery-tabs'
  ];

  const setup=group=>{
    if(!group||group.dataset.elasticReady==='true')return;
    group.dataset.elasticReady='true';
    group.classList.add('elastic-tabset');

    const pill=document.createElement('span');
    pill.className='elastic-tab-pill';
    pill.setAttribute('aria-hidden','true');
    group.prepend(pill);

    let current=null;
    let frame=0;

    const buttons=()=>[...group.querySelectorAll(':scope > button')];
    const activeButton=()=>group.querySelector(':scope > button.active,:scope > button.is-active')||buttons()[0]||null;
    const measure=button=>{
      if(!button)return null;
      const gr=group.getBoundingClientRect();
      const br=button.getBoundingClientRect();
      if(!gr.width||!br.width)return null;
      return {left:br.left-gr.left,width:br.width};
    };
    const setFinal=target=>{
      if(!target)return;
      pill.style.width=`${target.width}px`;
      pill.style.transform=`translateX(${target.left}px) scaleX(1)`;
      current=target;
    };
    const sync=(animate=true)=>{
      cancelAnimationFrame(frame);
      frame=requestAnimationFrame(()=>{
        const target=measure(activeButton());
        if(!target)return;
        if(!animate||!current||window.matchMedia('(prefers-reduced-motion: reduce)').matches){
          pill.getAnimations().forEach(a=>a.cancel());
          setFinal(target);
          return;
        }
        if(Math.abs(target.left-current.left)<.5&&Math.abs(target.width-current.width)<.5)return;

        const from={...current};
        const direction=target.left>=from.left?1:-1;
        const stretch=Math.max(from.width,target.width)*1.07;
        pill.getAnimations().forEach(a=>a.cancel());
        const animation=pill.animate([
          {
            width:`${from.width}px`,
            transform:`translateX(${from.left}px) scaleX(1)`,
            transformOrigin:direction>0?'right center':'left center',
            easing:'cubic-bezier(.16,.78,.24,1.16)'
          },
          {
            offset:.46,
            width:`${stretch}px`,
            transform:`translateX(${target.left+direction*6}px) scaleX(1.045)`,
            transformOrigin:direction>0?'left center':'right center',
            easing:'cubic-bezier(.22,.75,.24,1.18)'
          },
          {
            offset:.74,
            width:`${target.width*.985}px`,
            transform:`translateX(${target.left-direction*2}px) scaleX(.985)`,
            transformOrigin:'center',
            easing:'cubic-bezier(.2,.8,.28,1.12)'
          },
          {
            width:`${target.width}px`,
            transform:`translateX(${target.left}px) scaleX(1)`,
            transformOrigin:'center'
          }
        ],{duration:520,fill:'both'});
        current=target;
        animation.onfinish=()=>setFinal(target);
        animation.oncancel=()=>setFinal(current);
      });
    };

    group.addEventListener('click',e=>{
      if(e.target.closest(':scope > button'))requestAnimationFrame(()=>sync(true));
    });

    const observer=new MutationObserver(mutations=>{
      if(mutations.some(m=>m.type==='attributes'&&m.attributeName==='class'))sync(true);
    });
    buttons().forEach(button=>observer.observe(button,{attributes:true,attributeFilter:['class']}));

    const modal=group.closest('dialog');
    if(modal){
      new MutationObserver(()=>{
        if(modal.open)requestAnimationFrame(()=>sync(false));
      }).observe(modal,{attributes:true,attributeFilter:['open']});
    }

    window.addEventListener('resize',()=>{if(modal?.open)sync(false)},{passive:true});
    if(modal?.open)sync(false);
  };

  GROUPS.forEach(selector=>setup(document.querySelector(selector)));
})();
