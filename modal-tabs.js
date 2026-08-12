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

  const MODALS=[
    {id:'featuredModal',no:'01',label:'Featured'},
    {id:'videoModal',no:'02',label:'Video'},
    {id:'planningModal',no:'03',label:'Planning'},
    {id:'photoModal',no:'04',label:'Photography'},
    {id:'designModal',no:'05',label:'Design'},
    {id:'buildModal',no:'06',label:'AI & Build'}
  ];

  const openSection=index=>{
    const item=MODALS[index];
    if(!item)return;
    const target=document.getElementById(item.id);
    if(!target)return;

    const current=MODALS.map(entry=>document.getElementById(entry.id)).find(dialog=>dialog?.open);
    if(current&&current!==target)current.close();

    requestAnimationFrame(()=>{
      if(!target.open)target.showModal();
      const body=target.querySelector('.modal-body');
      if(body)body.scrollTop=0;
      target.querySelector('.doc-reader')?.scrollTo?.(0,0);
    });
  };

  MODALS.forEach((item,index)=>{
    const dialog=document.getElementById(item.id);
    const head=dialog?.querySelector('.modal-head');
    if(!dialog||!head)return;

    head.querySelector('.modal-section-nav')?.remove();

    const nav=document.createElement('nav');
    nav.className='modal-section-nav';
    nav.setAttribute('aria-label','포트폴리오 상세 카테고리 이동');

    const prev=document.createElement('button');
    prev.type='button';
    prev.className='modal-section-arrow modal-section-prev';
    prev.setAttribute('aria-label',index>0?`이전 카테고리 ${MODALS[index-1].label}`:'이전 카테고리 없음');
    if(index===0){
      prev.disabled=true;
      prev.setAttribute('aria-hidden','true');
    }else prev.addEventListener('click',event=>{
      event.preventDefault();
      event.stopPropagation();
      openSection(index-1);
    });

    const no=document.createElement('span');
    no.className='modal-section-no';
    no.textContent=item.no;

    const label=document.createElement('span');
    label.className='modal-section-label';
    label.textContent=item.label;

    const next=document.createElement('button');
    next.type='button';
    next.className='modal-section-arrow modal-section-next';
    next.setAttribute('aria-label',index<MODALS.length-1?`다음 카테고리 ${MODALS[index+1].label}`:'다음 카테고리 없음');
    if(index===MODALS.length-1){
      next.disabled=true;
      next.setAttribute('aria-hidden','true');
    }else next.addEventListener('click',event=>{
      event.preventDefault();
      event.stopPropagation();
      openSection(index+1);
    });

    nav.append(prev,no,label,next);
    head.appendChild(nav);
  });
})();
