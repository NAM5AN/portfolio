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
  dlg.innerHTML=`<div class="photo-lightbox-frame"><button class="photo-lightbox-close" type="button" aria-label="닫기">×</button><button class="photo-lightbox-nav photo-lightbox-prev" type="button" aria-label="이전 사진">←</button><figure><img alt=""><figcaption><span class="photo-lightbox-category"></span><strong class="photo-lightbox-counter"></strong></figcaption></figure><button class="photo-lightbox-nav photo-lightbox-next" type="button" aria-label="다음 사진">→</button></div>`;
  document.body.appendChild(dlg);

  const lightboxImg=dlg.querySelector('img');
  const lightboxCategory=dlg.querySelector('.photo-lightbox-category');
  const lightboxCounter=dlg.querySelector('.photo-lightbox-counter');

  function categoryItems(){return allItems.filter(item=>item.cat===activeCat)}
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
  function close(){if(dlg.open)dlg.close();lightboxImg.removeAttribute('src')}

  tabs.addEventListener('click',e=>{const btn=e.target.closest('[data-photo-cat]');if(btn)renderCategory(btn.dataset.photoCat)});
  root.addEventListener('click',e=>{const btn=e.target.closest('[data-photo-open]');if(btn)openLightbox(btn.dataset.photoOpen,Number(btn.dataset.photoIndex)||0)});
  dlg.querySelector('.photo-lightbox-close').addEventListener('click',close);
  dlg.querySelector('.photo-lightbox-prev').addEventListener('click',()=>step(-1));
  dlg.querySelector('.photo-lightbox-next').addEventListener('click',()=>step(1));
  dlg.addEventListener('click',e=>{if(e.target===dlg)close()});
  dlg.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')step(-1);if(e.key==='ArrowRight')step(1);if(e.key==='Escape')close()});
  dlg.addEventListener('close',()=>lightboxImg.removeAttribute('src'));

  let touchStartX=0;
  dlg.addEventListener('touchstart',e=>{touchStartX=e.changedTouches[0]?.clientX||0},{passive:true});
  dlg.addEventListener('touchend',e=>{const end=e.changedTouches[0]?.clientX||0;const diff=end-touchStartX;if(Math.abs(diff)>55)step(diff>0?-1:1)},{passive:true});

  const photoRow=document.querySelector('[data-preview="photo"]');
  const setPhotoPreview=()=>setTimeout(()=>{const img=document.getElementById('homePreview');const cap=document.getElementById('previewCaption');if(!img||!cap)return;const fallback=originalPath('snap','snap-01.jpg');img.onerror=()=>{img.onerror=null;img.src=fallback};img.src=thumbPath('snap','snap-01.jpg');img.style.opacity='.88';cap.textContent='PHOTOGRAPHY / SNAP'},130);
  photoRow?.addEventListener('mouseenter',setPhotoPreview);
  photoRow?.addEventListener('focus',setPhotoPreview);

  renderCategory('snap');
})();
