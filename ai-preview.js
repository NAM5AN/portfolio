(()=>{
  const row=document.querySelector('.work-row[data-preview="build"]');
  const preview=document.querySelector('.index-preview img');
  if(!row||!preview)return;

  const AI_PREVIEW='https://at.adobe.com/0IK54OX5RkmXPbkF';

  const apply=()=>{
    if(preview.src!==AI_PREVIEW)preview.src=AI_PREVIEW;
    preview.alt='AI tools workflow — GPT, Codex, Claude, Gemini, Seedance, Kling';
  };

  ['pointerenter','mouseenter','focus','click','touchstart'].forEach(type=>row.addEventListener(type,apply,{passive:true}));

  new MutationObserver(()=>{
    if(row.classList.contains('active'))apply();
  }).observe(row,{attributes:true,attributeFilter:['class']});

  new MutationObserver(()=>{
    if(row.classList.contains('active')&&preview.src!==AI_PREVIEW)apply();
  }).observe(preview,{attributes:true,attributeFilter:['src']});

  if(row.classList.contains('active'))apply();
})();
