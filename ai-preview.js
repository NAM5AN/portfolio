(()=>{
  const row=document.querySelector('.work-row[data-preview="build"]');
  const preview=document.querySelector('.index-preview img');
  if(!row||!preview)return;

  const AI_PREVIEW='data:image/webp;base64,UklGRrCZAAABX0CQkI2l...';

  const apply=()=>{
    if(preview.src!==AI_PREVIEW)preview.src=AI_PREVIEW;
    preview.alt='AI tools workflow — GPT, Codex, Claude, Gemini, Seedance, Kling';
  };

  ['pointerenter','mouseenter','focus','click','touchstart'].forEach(type=>row.addEventListener(type,apply));

  const rowObserver=new MutationObserver(()=>{
    if(row.classList.contains('active'))apply();
  });
  rowObserver.observe(row,{attributes:true,attributeFilter:['class']});

  const previewObserver=new MutationObserver(()=>{
    if(row.classList.contains('active')&&preview.src!==AI_PREVIEW)apply();
  });
  previewObserver.observe(preview,{attributes:true,attributeFilter:['src']});

  if(row.classList.contains('active'))apply();
})();
