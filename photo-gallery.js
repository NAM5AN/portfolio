(()=>{
  const root=document.getElementById('photoSeries');
  if(!root)return;

  const PHOTO_CATEGORIES=[
    {id:'snap',label:'스냅',items:[
      {file:'snap-01.jpg',name:'5___0223-향상됨-NR.jpg'},
      {file:'snap-02.jpg',name:'5___0688-Enhanced-NR.jpg'},
      {file:'snap-03.jpg',name:'5___0707.jpg'}
    ]},
    {id:'concept',label:'컨셉',items:[
      {file:'concept-01.jpg',name:'KakaoTalk_20240908_1705207972.jpg'},
      {file:'concept-02.jpg',name:'5___0443.jpg'},
      {file:'concept-03.jpg',name:'5___7386.jpg',note:'모델 보정'},
      {file:'concept-04.jpg',name:'3E0A7528__2.jpg'},
      {file:'concept-05.jpg',name:'3E0A7261__.jpg'}
    ]},
    {id:'cosplay',label:'코스프레',items:[
      {file:'cosplay-01.jpg',name:'5___0197.jpg'},
      {file:'cosplay-02.jpg',name:'563A4657__복사.jpg'},
      {file:'cosplay-03.jpg',name:'5___4923.jpg',note:'모델 보정'},
      {file:'cosplay-04.jpg',name:'563A5416.jpg'}
    ]},
    {id:'travel',label:'여행',items:[
      {file:'travel-01.jpg',name:'3E0A8675.jpg'},
      {file:'travel-04.jpg',name:'3E0A9426.jpg'},
      {file:'travel-02.jpg',name:'3E0A8918.jpg'},
      {file:'travel-03.jpg',name:'3E0A9459.jpg'}
    ]}
  ];

  const originalPath=(cat,file)=>`./assets/photo/original/${cat}/${file}`;
  const thumbPath=(cat,file)=>`./assets/photo/thumb/${cat}/${file.replace(/\.jpe?g$/i,'.webp')}`;
  const allItems=PHOTO_CATEGORIES.flatMap(cat=>cat.items.map((item,index)=>({...item,cat:cat.id,catLabel:cat.label,index})));
  let activeCat='snap';
  let activeGlobalIndex=0;

  const modalBody=root.closest('.modal-body');
  modalBody?.querySelector('.migration-note')?.remove();
  root.className='photo-gallery-grid';

  const tabs=document.createElement('nav');
  tabs.className='photo-gallery-tabs';
  tabs.setAttribute('aria-label','사진 카테고리');
  tabs.innerHTML=PHOTO_CATEGORIES.map((cat,i)=>`<button type="button" class="photo-gallery-tab${i===0?' is-active':''}" data-photo-cat="${cat.id}">${cat.label}<span>${String(cat.items.length).padStart(2,'0')}</span></button>`).join('');
  root.parentNode.insertBefore(tabs,root);

  const dlg=document.createElement('dialog');
  dlg.className='photo-lightbox';
  dlg.innerHTML=`<div class="photo-lightbox-frame"><button class="photo-lightbox-close" type="button" aria-label="닫기">×</button><button class="photo-lightbox-nav photo-lightbox-prev" type="button" aria-label="이전 사진">←</button><figure><div class="photo-lightbox-viewport" aria-label="확대 사진. 마우스 휠로 확대 및 축소하고, 확대 후 드래그하여 이동할 수 있습니다."><img alt="" draggable="false"></div><div class="photo-lightbox-help">휠 확대·축소 · 드래그 이동 · 더블클릭 초기화</div><figcaption><span class="photo-lightbox-category"></span><strong class="photo-lightbox-counter"></strong></figcaption><div class="photo-lightbox-tools" aria-label="사진 확대 도구"><button type="button" data-photo-zoom-out aria-label="축소">−</button><span class="photo-lightbox-zoom">100%</span><button type="button" data-photo-zoom-in aria-label="확대">+</button><button type="button" data-photo-zoom-reset aria-label="원래 크기로">RESET</button></div></figure><button class="photo-lightbox-nav photo-lightbox-next" type="button" aria-label="다음 사진">→</button></div>`;
  document.body.appendChild(dlg);

  const viewport=dlg.querySelector('.photo-lightbox-viewport');
  const lightboxImg=dlg.querySelector('img');
  const lightboxCategory=dlg.querySelector('.photo-lightbox-category');
  const lightboxCounter=dlg.querySelector('.photo-lightbox-counter');
  const zoomLabel=dlg.querySelector('.photo-lightbox-zoom');
  const zoomInButton=dlg.querySelector('[data-photo-zoom-in]');
  const zoomOutButton=dlg.querySelector('[data-photo-zoom-out]');
  const zoomResetButton=dlg.querySelector('[data-photo-zoom-reset]');

  const MIN_SCALE=1;
  const MAX_SCALE=6;
  let scale=1;
  let panX=0;
  let panY=0;
  const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));

  function categoryItems(){return allItems.filter(item=>item.cat===activeCat)}
  function panLimits(){
    const vw=viewport.clientWidth||1;
    const vh=viewport.clientHeight||1;
    const iw=lightboxImg.clientWidth||0;
    const ih=lightboxImg.clientHeight||0;
    return {x:Math.max(0,(iw*scale-vw)/2),y:Math.max(0,(ih*scale-vh)/2)};
  }
  function clampPan(){
    const limits=panLimits();
    panX=clamp(panX,-limits.x,limits.x);
    panY=clamp(panY,-limits.y,limits.y);
  }
  function applyTransform(animate=false){
    clampPan();
    lightboxImg.style.transition=animate?'transform .18s ease':'none';
    lightboxImg.style.transform=`translate3d(${panX}px,${panY}px,0) scale(${scale})`;
    zoomLabel.textContent=`${Math.round(scale*100)}%`;
    viewport.classList.toggle('is-zoomed',scale>1.001);
    if(animate)window.setTimeout(()=>{lightboxImg.style.transition='none'},190);
  }
  function resetZoom(animate=false){scale=1;panX=0;panY=0;applyTransform(animate)}
  function zoomAt(clientX,clientY,nextScale,animate=false){
    nextScale=clamp(nextScale,MIN_SCALE,MAX_SCALE);
    if(Math.abs(nextScale-scale)<0.0001)return;
    const rect=viewport.getBoundingClientRect();
    const pointX=clientX-(rect.left+rect.width/2);
    const pointY=clientY-(rect.top+rect.height/2);
    const ratio=nextScale/scale;
    panX=pointX-(pointX-panX)*ratio;
    panY=pointY-(pointY-panY)*ratio;
    scale=nextScale;
    applyTransform(animate);
  }
  function zoomFromCenter(factor){
    const rect=viewport.getBoundingClientRect();
    zoomAt(rect.left+rect.width/2,rect.top+rect.height/2,scale*factor,true);
  }

  function renderCategory(catId){
    activeCat=catId;
    const cat=PHOTO_CATEGORIES.find(x=>x.id===catId)||PHOTO_CATEGORIES[0];
    tabs.querySelectorAll('.photo-gallery-tab').forEach(btn=>btn.classList.toggle('is-active',btn.dataset.photoCat===cat.id));
    root.innerHTML=cat.items.map((item,i)=>{
      const original=originalPath(cat.id,item.file);
      const thumb=thumbPath(cat.id,item.file);
      const note=item.note?`<span class="photo-tile-note">${item.note}</span>`:'';
      return `<button class="photo-tile" type="button" data-photo-open="${cat.id}" data-photo-index="${i}" aria-label="${cat.label} ${i+1} 사진 확대"><img loading="lazy" decoding="async" src="${thumb}" data-fallback="${original}" alt="${cat.label} 사진 ${i+1}"><span class="photo-tile-meta"><b>${String(i+1).padStart(2,'0')}</b>${note}</span></button>`;
    }).join('');
    root.querySelectorAll('img[data-fallback]').forEach(img=>img.addEventListener('error',()=>{const fallback=img.dataset.fallback;if(fallback&&img.src!==new URL(fallback,location.href).href){img.src=fallback}else img.closest('.photo-tile')?.classList.add('is-missing')},{once:true}));
  }

  function openLightbox(catId,index){
    activeCat=catId;
    const items=categoryItems();
    const localIndex=(index+items.length)%items.length;
    const current=items[localIndex];
    activeGlobalIndex=localIndex;
    resetZoom(false);
    lightboxImg.onload=()=>resetZoom(false);
    lightboxImg.src=originalPath(current.cat,current.file);
    lightboxImg.alt=`${current.catLabel} 사진 ${localIndex+1}`;
    lightboxCategory.textContent=current.catLabel;
    lightboxCounter.textContent=`${String(localIndex+1).padStart(2,'0')} / ${String(items.length).padStart(2,'0')}`;
    if(!dlg.open)dlg.showModal();
    const prev=items[(localIndex-1+items.length)%items.length];
    const next=items[(localIndex+1)%items.length];
    [prev,next].forEach(item=>{const preload=new Image();preload.src=originalPath(item.cat,item.file)});
  }
  function step(delta){openLightbox(activeCat,activeGlobalIndex+delta)}
  function close(){if(dlg.open)dlg.close();resetZoom(false);lightboxImg.removeAttribute('src')}

  tabs.addEventListener('click',e=>{const btn=e.target.closest('[data-photo-cat]');if(btn)renderCategory(btn.dataset.photoCat)});
  root.addEventListener('click',e=>{const btn=e.target.closest('[data-photo-open]');if(btn)openLightbox(btn.dataset.photoOpen,Number(btn.dataset.photoIndex)||0)});
  dlg.querySelector('.photo-lightbox-close').addEventListener('click',close);
  dlg.querySelector('.photo-lightbox-prev').addEventListener('click',()=>step(-1));
  dlg.querySelector('.photo-lightbox-next').addEventListener('click',()=>step(1));
  dlg.addEventListener('click',e=>{if(e.target===dlg)close()});
  dlg.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')step(-1);if(e.key==='ArrowRight')step(1);if(e.key==='Escape')close();if(e.key==='0')resetZoom(true);if(e.key==='+'||e.key==='=')zoomFromCenter(1.28);if(e.key==='-')zoomFromCenter(1/1.28)});
  dlg.addEventListener('close',()=>{resetZoom(false);lightboxImg.removeAttribute('src')});

  zoomInButton.addEventListener('click',()=>zoomFromCenter(1.35));
  zoomOutButton.addEventListener('click',()=>zoomFromCenter(1/1.35));
  zoomResetButton.addEventListener('click',()=>resetZoom(true));

  viewport.addEventListener('wheel',e=>{e.preventDefault();const factor=Math.exp(-e.deltaY*0.0015);zoomAt(e.clientX,e.clientY,scale*factor,false)},{passive:false});
  viewport.addEventListener('dblclick',e=>{e.preventDefault();if(scale>1.01)resetZoom(true);else zoomAt(e.clientX,e.clientY,2,true)});

  let dragging=false;
  let dragStartX=0;
  let dragStartY=0;
  let dragPanX=0;
  let dragPanY=0;
  viewport.addEventListener('pointerdown',e=>{
    if(e.pointerType==='touch'||scale<=1.001)return;
    dragging=true;dragStartX=e.clientX;dragStartY=e.clientY;dragPanX=panX;dragPanY=panY;
    viewport.classList.add('is-dragging');viewport.setPointerCapture?.(e.pointerId);e.preventDefault();
  });
  viewport.addEventListener('pointermove',e=>{if(!dragging)return;panX=dragPanX+(e.clientX-dragStartX);panY=dragPanY+(e.clientY-dragStartY);applyTransform(false)});
  const stopDragging=e=>{if(!dragging)return;dragging=false;viewport.classList.remove('is-dragging');if(e?.pointerId!==undefined&&viewport.hasPointerCapture?.(e.pointerId))viewport.releasePointerCapture(e.pointerId)};
  viewport.addEventListener('pointerup',stopDragging);
  viewport.addEventListener('pointercancel',stopDragging);
  viewport.addEventListener('pointerleave',e=>{if(e.buttons===0)stopDragging(e)});

  const touchDistance=touches=>Math.hypot(touches[0].clientX-touches[1].clientX,touches[0].clientY-touches[1].clientY);
  const touchCenter=touches=>({x:(touches[0].clientX+touches[1].clientX)/2,y:(touches[0].clientY+touches[1].clientY)/2});
  let touchStartX=0;
  let touchStartY=0;
  let lastTouchX=0;
  let lastTouchY=0;
  let lastPinchDistance=0;
  let lastPinchCenter=null;
  let gestureWasPinch=false;

  viewport.addEventListener('touchstart',e=>{
    if(e.touches.length===1){const touch=e.touches[0];touchStartX=lastTouchX=touch.clientX;touchStartY=lastTouchY=touch.clientY}
    else if(e.touches.length>=2){gestureWasPinch=true;lastPinchDistance=touchDistance(e.touches);lastPinchCenter=touchCenter(e.touches)}
  },{passive:true});
  viewport.addEventListener('touchmove',e=>{
    if(e.touches.length>=2){
      e.preventDefault();
      const distance=touchDistance(e.touches);const center=touchCenter(e.touches);
      if(lastPinchDistance>0){zoomAt(center.x,center.y,scale*(distance/lastPinchDistance),false);if(lastPinchCenter){panX+=center.x-lastPinchCenter.x;panY+=center.y-lastPinchCenter.y;applyTransform(false)}}
      lastPinchDistance=distance;lastPinchCenter=center;return;
    }
    if(e.touches.length===1&&scale>1.001){e.preventDefault();const touch=e.touches[0];panX+=touch.clientX-lastTouchX;panY+=touch.clientY-lastTouchY;lastTouchX=touch.clientX;lastTouchY=touch.clientY;applyTransform(false)}
  },{passive:false});
  viewport.addEventListener('touchend',e=>{
    if(e.touches.length>=2){lastPinchDistance=touchDistance(e.touches);lastPinchCenter=touchCenter(e.touches);return}
    if(e.touches.length===1){const touch=e.touches[0];lastTouchX=touch.clientX;lastTouchY=touch.clientY;lastPinchDistance=0;lastPinchCenter=null;return}
    const changed=e.changedTouches[0];
    if(changed&&!gestureWasPinch&&scale<=1.001){const diffX=changed.clientX-touchStartX;const diffY=changed.clientY-touchStartY;if(Math.abs(diffX)>55&&Math.abs(diffX)>Math.abs(diffY)*1.2)step(diffX>0?-1:1)}
    lastPinchDistance=0;lastPinchCenter=null;gestureWasPinch=false;
  },{passive:true});

  window.addEventListener('resize',()=>{if(dlg.open)applyTransform(false)});

  const photoRow=document.querySelector('[data-preview="photo"]');
  const setPhotoPreview=()=>setTimeout(()=>{const img=document.getElementById('homePreview');const cap=document.getElementById('previewCaption');if(!img||!cap)return;const fallback=originalPath('snap','snap-01.jpg');img.onerror=()=>{img.onerror=null;img.src=fallback};img.src=thumbPath('snap','snap-01.jpg');img.style.opacity='.88';cap.textContent='PHOTOGRAPHY / SNAP'},130);
  photoRow?.addEventListener('mouseenter',setPhotoPreview);
  photoRow?.addEventListener('focus',setPhotoPreview);

  renderCategory('snap');
})();
