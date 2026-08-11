(()=>{
  const menu=document.querySelector('.work-menu');
  const preview=document.getElementById('homePreview');
  const caption=document.getElementById('previewCaption');
  if(!menu||!preview||!caption)return;

  const assetBase=typeof window.__portfolioAssetBase==='string'?window.__portfolioAssetBase:'';
  const photoPreview=assetBase
    ? `${assetBase}assets/photo/thumb/snap/snap-01.webp`
    : './assets/photo/thumb/snap/snap-01.webp';

  const PREVIEWS={
    featured:['https://i.ytimg.com/vi/jINNCqnUSL8/maxresdefault.jpg','FEATURED / CONTENT STRATEGY'],
    video:['https://i.ytimg.com/vi/fY-a_4WTMnQ/maxresdefault.jpg','VIDEO / PRODUCTION'],
    planning:['https://i.ytimg.com/vi/RRaPlueNU8Y/maxresdefault.jpg','PLANNING / RESEARCH'],
    photo:[photoPreview,'PHOTOGRAPHY / SNAP'],
    design:['https://drive.google.com/thumbnail?id=1IMS882egUEvxo32byMvxnYUVQnDglh0x&sz=w1600','DESIGN / HEALTHCARE'],
    build:['https://at.adobe.com/0IK54OX5RkmXPbkF','AI & BUILD / WORKFLOW']
  };

  Object.values(PREVIEWS).forEach(([src])=>{
    const img=new Image();
    img.decoding='async';
    img.src=src;
  });

  const setPreview=row=>{
    const data=PREVIEWS[row.dataset.preview];
    if(!data)return;
    menu.querySelectorAll('.work-row').forEach(item=>item.classList.toggle('active',item===row));
    const [src,text]=data;
    if(preview.getAttribute('src')!==src)preview.setAttribute('src',src);
    caption.textContent=text;
    preview.style.opacity='.88';
  };

  [...menu.querySelectorAll('.work-row')].forEach(oldRow=>{
    const row=oldRow.cloneNode(true);
    oldRow.replaceWith(row);
    row.addEventListener('pointerenter',()=>setPreview(row));
    row.addEventListener('focus',()=>setPreview(row));
    row.addEventListener('click',()=>{
      setPreview(row);
      const id=row.dataset.open;
      const dialog=id&&document.getElementById(id);
      if(dialog&&!dialog.open)dialog.showModal();
    });
  });

  const initial=menu.querySelector('.work-row.active')||menu.querySelector('.work-row');
  if(initial)setPreview(initial);
})();
