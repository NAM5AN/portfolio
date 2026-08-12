(()=>{
  const row=document.querySelector('.work-row[data-preview="planning"]');
  const preview=document.getElementById('homePreview');
  const caption=document.getElementById('previewCaption');
  if(!row||!preview||!caption)return;

  const src='https://i.ytimg.com/vi/jINNCqnUSL8/maxresdefault.jpg';
  const apply=()=>{
    const split=document.querySelector('.design-preview-duo');
    if(split)split.remove();
    preview.style.display='block';
    preview.src=src;
    preview.style.opacity='.88';
    caption.textContent='PLANNING / CONTENT STRATEGY';
  };

  ['pointerenter','mouseenter','focus','click','touchstart'].forEach(type=>{
    row.addEventListener(type,()=>{
      apply();
      window.setTimeout(()=>{
        if(row.classList.contains('active'))apply();
      },140);
    },{passive:true});
  });

  new MutationObserver(()=>{
    if(row.classList.contains('active'))apply();
  }).observe(row,{attributes:true,attributeFilter:['class']});
})();
