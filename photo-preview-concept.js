(()=>{
  const row=document.querySelector('.work-row[data-preview="photo"]');
  const preview=document.getElementById('homePreview');
  const caption=document.getElementById('previewCaption');
  if(!row||!preview||!caption)return;

  const assetBase=typeof window.__portfolioAssetBase==='string'?window.__portfolioAssetBase:'';
  const src=assetBase
    ? `${assetBase}assets/photo/thumb/concept/concept-01.webp`
    : './assets/photo/thumb/concept/concept-01.webp';

  const apply=()=>{
    preview.src=src;
    preview.alt='Photography concept portfolio preview';
    preview.style.opacity='.88';
    caption.textContent='PHOTOGRAPHY / CONCEPT';
  };

  row.addEventListener('pointerenter',apply);
  row.addEventListener('focus',apply);
  if(row.classList.contains('active'))apply();
})();
