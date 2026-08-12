(()=>{
  const STORAGE_KEY='ks-portfolio-view-state-v1';
  let restoring=true;
  let saveTimer=0;

  const mountResumeHeader=()=>{
    const intro=document.querySelector('.resume-intro');
    if(!intro||document.querySelector('.resume-header-photo'))return;

    if(!document.getElementById('resume-header-photo-style')){
      const style=document.createElement('style');
      style.id='resume-header-photo-style';
      style.textContent=`
        .resume-header-photo{
          display:block;
          width:calc(100% + clamp(48px,6vw,92px));
          height:auto;
          margin-top:calc(0px - clamp(24px,3vw,46px));
          margin-left:calc(0px - clamp(24px,3vw,46px));
          margin-bottom:26px;
          max-width:none;
          object-fit:cover;
          object-position:center;
          border:0;
        }
        @media(max-width:430px){
          .resume-header-photo{
            width:calc(100% + 36px);
            margin-top:-22px;
            margin-left:-18px;
            margin-bottom:22px;
          }
        }
      `;
      document.head.appendChild(style);
    }

    const img=document.createElement('img');
    img.className='resume-header-photo';
    img.src='./assets/resume/header-cars.jpg';
    img.alt='주차장을 위에서 촬영한 자동차 사진';
    img.decoding='async';
    img.loading='eager';
    intro.before(img);
  };

  mountResumeHeader();

  const readState=()=>{
    try{
      const raw=sessionStorage.getItem(STORAGE_KEY);
      return raw?JSON.parse(raw):null;
    }catch{return null}
  };

  const activeSection=()=>[...document.querySelectorAll('.section-modal')].find(dialog=>dialog.open)||null;
  const numberFromCounter=text=>{
    const match=String(text||'').match(/(\d+)\s*\/\s*(\d+)/);
    return match?Math.max(0,Number(match[1])-1):0;
  };
  const photoTransform=()=>{
    const img=document.querySelector('.photo-lightbox img');
    const transform=img?.style.transform||'';
    const scaleMatch=transform.match(/scale\(([^)]+)\)/);
    const scale=scaleMatch?Number(scaleMatch[1]):1;
    return Number.isFinite(scale)?Math.max(1,scale):1;
  };

  const snapshot=()=>{
    const section=activeSection();
    const photoDialog=document.querySelector('.photo-lightbox');
    const photoCounter=document.querySelector('.photo-lightbox-counter');
    const leanViewer=document.querySelector('.lean-media-viewer');
    const leanFrame=leanViewer?.querySelector('.lean-media-content');
    let media=null;

    if(leanViewer?.open&&leanFrame){
      const iframe=leanFrame.querySelector('iframe');
      const video=leanFrame.querySelector('video');
      if(iframe){
        const src=iframe.src||'';
        const youtube=src.match(/\/embed\/([^?&#/]+)/);
        const drive=src.match(/\/file\/d\/([^/]+)\/preview/);
        if(youtube)media={type:'youtube',id:decodeURIComponent(youtube[1])};
        else if(drive)media={type:'reel',id:decodeURIComponent(drive[1])};
      }else if(video){
        const poster=video.getAttribute('poster')||'';
        const drive=poster.match(/[?&]id=([^&]+)/);
        if(drive)media={type:'reel',id:decodeURIComponent(drive[1]),currentTime:Number.isFinite(video.currentTime)?video.currentTime:0};
      }
    }

    return {
      version:1,
      mode:document.body.dataset.view||'resume',
      sectionModal:section?.id||null,
      videoTab:document.querySelector('#videoModal .tab.active[data-tab]')?.dataset.tab||'recent',
      designTab:document.querySelector('[data-design-tab].active')?.dataset.designTab||'promo',
      planKey:document.querySelector('[data-plan-key].active')?.dataset.planKey||'startup',
      photoCategory:document.querySelector('.photo-gallery-tab.is-active[data-photo-cat]')?.dataset.photoCat||'snap',
      photoLightboxOpen:Boolean(photoDialog?.open),
      photoIndex:numberFromCounter(photoCounter?.textContent),
      photoScale:photoTransform(),
      media,
      detailOpen:Boolean(document.querySelector('#detailViewer')?.open),
      scroll:{
        windowY:window.scrollY||0,
        resumeProfile:document.querySelector('.resume-profile')?.scrollTop||0,
        resumeScroll:document.querySelector('.resume-scroll')?.scrollTop||0,
        modalBody:section?.querySelector('.modal-body')?.scrollTop||0,
        planReader:document.querySelector('#planReader')?.scrollTop||0
      }
    };
  };

  const save=()=>{
    if(restoring)return;
    try{sessionStorage.setItem(STORAGE_KEY,JSON.stringify(snapshot()))}catch{}
  };
  const scheduleSave=()=>{
    if(restoring)return;
    clearTimeout(saveTimer);
    saveTimer=window.setTimeout(save,90);
  };

  const clickElement=element=>{
    if(!element)return false;
    element.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window}));
    return true;
  };
  const openSection=(id)=>{
    if(!id)return;
    const trigger=[...document.querySelectorAll('[data-open]')].find(node=>node.dataset.open===id);
    if(!clickElement(trigger)){
      const dialog=document.getElementById(id);
      if(dialog&&!dialog.open)dialog.showModal();
    }
  };
  const afterFrames=(fn,count=2)=>{
    const run=remaining=>requestAnimationFrame(()=>remaining<=1?fn():run(remaining-1));
    run(count);
  };

  const restorePhotoZoom=(scale,attempt=0)=>{
    if(!(scale>1.01))return;
    const dialog=document.querySelector('.photo-lightbox');
    const viewport=dialog?.querySelector('.photo-lightbox-viewport');
    const img=viewport?.querySelector('img');
    if(!dialog?.open||!viewport||!img)return;
    if((img.dataset.fitReady!=='true'||!img.naturalWidth)&&attempt<24){
      window.setTimeout(()=>restorePhotoZoom(scale,attempt+1),50);
      return;
    }
    const rect=viewport.getBoundingClientRect();
    if(!rect.width||!rect.height)return;
    const deltaY=-Math.log(Math.min(6,scale))/0.0015;
    viewport.dispatchEvent(new WheelEvent('wheel',{
      bubbles:true,cancelable:true,deltaY,
      clientX:rect.left+rect.width/2,
      clientY:rect.top+rect.height/2
    }));
  };

  const restoreMedia=(media,attempt=0)=>{
    if(!media?.id||attempt>12)return;
    const selector=media.type==='youtube'?`[data-youtube="${CSS.escape(media.id)}"]`:`[data-drive-video="${CSS.escape(media.id)}"]`;
    const target=document.querySelector(selector);
    if(!target){window.setTimeout(()=>restoreMedia(media,attempt+1),70);return}
    clickElement(target);
    if(media.type==='reel'&&media.currentTime>0){
      window.setTimeout(()=>{
        const video=document.querySelector('.lean-media-viewer[open] video');
        if(!video)return;
        const seek=()=>{try{video.currentTime=media.currentTime}catch{}};
        if(video.readyState>=1)seek();else video.addEventListener('loadedmetadata',seek,{once:true});
      },120);
    }
  };

  const restore=()=>{
    const state=readState();
    if(!state){restoring=false;return}

    const wantedMode=state.sectionModal?'portfolio':(state.mode||'resume');
    if(typeof window.__portfolioSetMode==='function')window.__portfolioSetMode(wantedMode);
    else{
      document.body.dataset.view=wantedMode==='portfolio'?'portfolio':'resume';
      document.querySelectorAll('.mode-tab').forEach(btn=>{
        const active=btn.dataset.mode===document.body.dataset.view;
        btn.classList.toggle('is-active',active);
        btn.setAttribute('aria-pressed',active?'true':'false');
      });
    }

    if(state.sectionModal)openSection(state.sectionModal);

    window.setTimeout(()=>{
      if(state.sectionModal==='videoModal')clickElement(document.querySelector(`#videoModal .tab[data-tab="${state.videoTab||'recent'}"]`));
      if(state.sectionModal==='designModal')clickElement(document.querySelector(`[data-design-tab="${state.designTab||'promo'}"]`));
      if(state.sectionModal==='planningModal')clickElement(document.querySelector(`[data-plan-key="${state.planKey||'startup'}"]`));
      if(state.sectionModal==='photoModal')clickElement(document.querySelector(`.photo-gallery-tab[data-photo-cat="${state.photoCategory||'snap'}"]`));

      afterFrames(()=>{
        const section=state.sectionModal?document.getElementById(state.sectionModal):null;
        const scroll=state.scroll||{};
        window.scrollTo(0,Number(scroll.windowY)||0);
        const profile=document.querySelector('.resume-profile');
        const resumeScroll=document.querySelector('.resume-scroll');
        const modalBody=section?.querySelector('.modal-body');
        const planReader=document.querySelector('#planReader');
        if(profile)profile.scrollTop=Number(scroll.resumeProfile)||0;
        if(resumeScroll)resumeScroll.scrollTop=Number(scroll.resumeScroll)||0;
        if(modalBody)modalBody.scrollTop=Number(scroll.modalBody)||0;
        if(planReader)planReader.scrollTop=Number(scroll.planReader)||0;

        if(state.sectionModal==='photoModal'&&state.photoLightboxOpen){
          const cat=state.photoCategory||'snap';
          const index=Number(state.photoIndex)||0;
          const tile=document.querySelector(`#photoSeries [data-photo-open="${cat}"][data-photo-index="${index}"]`);
          if(clickElement(tile))window.setTimeout(()=>restorePhotoZoom(Number(state.photoScale)||1),80);
        }

        if(state.detailOpen)clickElement(document.querySelector('[data-project="sohwak"]'));
        if(state.media)window.setTimeout(()=>restoreMedia(state.media),100);

        window.setTimeout(()=>{
          restoring=false;
          save();
        },260);
      },3);
    },80);
  };

  window.addEventListener('pagehide',()=>{restoring=false;save()},{capture:true});
  window.addEventListener('beforeunload',()=>{restoring=false;save()},{capture:true});
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'){restoring=false;save()}},{capture:true});
  window.addEventListener('click',scheduleSave,true);
  document.addEventListener('scroll',scheduleSave,true);
  window.addEventListener('resize',scheduleSave,{passive:true});

  restore();
})();