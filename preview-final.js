(()=>{
  const wrap=document.querySelector('.index-preview');
  const preview=document.getElementById('homePreview');
  const caption=document.getElementById('previewCaption');
  const rows=[...document.querySelectorAll('.work-row[data-preview]')];
  if(!wrap||!preview||!caption||!rows.length)return;

  const base=typeof window.__portfolioAssetBase==='string'?window.__portfolioAssetBase:'';
  const local=path=>base?`${base}${path.replace(/^\.\//,'')}`:path;
  const AI_PRIMARY='https://raw.githubusercontent.com/NAM5AN/portfolio/main/assets/preview/ai-tools.webp?rev=20260812b';
  const AI_FALLBACK='https://cdn.jsdelivr.net/gh/NAM5AN/portfolio@main/assets/preview/ai-tools.webp';

  const items={
    featured:['https://i.ytimg.com/vi/dI_J-0qeb5A/maxresdefault.jpg','FEATURED / NBN · 기자의 시선','기자의 시선 · 중장년층 고독사'],
    video:['https://i.ytimg.com/vi/TPrPnkTMmTo/maxresdefault.jpg','VIDEO / FILM · 소확행','단편영화 소확행'],
    planning:['https://i.ytimg.com/vi/jINNCqnUSL8/maxresdefault.jpg','PLANNING / CONTENT STRATEGY','창업지원금 콘텐츠'],
    photo:[local('./assets/photo/thumb/concept/concept-01.webp'),'PHOTOGRAPHY / CONCEPT','Photography concept portfolio preview'],
    build:[AI_PRIMARY,'AI & BUILD / WORKFLOW','AI tools workflow — Codex, Claude, Gemini, Seedance, Kling']
  };

  let duo=wrap.querySelector('.design-preview-duo');
  if(!duo){
    duo=document.createElement('div');
    duo.className='design-preview-duo';
    duo.hidden=true;
    duo.innerHTML='<img src="https://drive.google.com/thumbnail?id=1IMS882egUEvxo32byMvxnYUVQnDglh0x&sz=w1200" alt="고주파 리프팅 디자인"><img src="https://drive.google.com/thumbnail?id=1SvFvq5mPlbk2Oe5BR-gupfrxJu80-fmM&sz=w1200" alt="설날 휴진 디자인">';
    wrap.insertBefore(duo,wrap.querySelector('.preview-shade'));
  }

  const setActive=row=>rows.forEach(item=>item.classList.toggle('active',item===row));
  const hideDuo=()=>{duo.hidden=true;preview.style.visibility='visible'};

  const show=row=>{
    const key=row.dataset.preview;
    setActive(row);
    preview.onerror=null;

    if(key==='design'){
      duo.hidden=false;
      preview.style.visibility='hidden';
      caption.textContent='DESIGN / HEALTHCARE';
      return;
    }

    const item=items[key];
    if(!item)return;
    hideDuo();
    preview.style.display='block';
    preview.style.opacity='.88';
    preview.alt=item[2];
    caption.textContent=item[1];

    if(key==='build'){
      let usedFallback=false;
      preview.onerror=()=>{
        if(usedFallback){preview.onerror=null;return}
        usedFallback=true;
        preview.src=AI_FALLBACK;
      };
    }
    preview.src=item[0];
  };

  rows.forEach(row=>{
    const hover=e=>{e.stopImmediatePropagation();show(row)};
    row.addEventListener('mouseenter',hover,true);
    row.addEventListener('pointerenter',()=>show(row),true);
    row.addEventListener('focus',hover,true);
    row.addEventListener('click',()=>show(row));
    row.addEventListener('touchstart',()=>show(row),{passive:true});
  });

  show(rows.find(row=>row.classList.contains('active'))||rows[0]);

  const warm=()=>{
    [
      ...Object.values(items).map(item=>item[0]),
      AI_FALLBACK,
      'https://drive.google.com/thumbnail?id=1IMS882egUEvxo32byMvxnYUVQnDglh0x&sz=w1200',
      'https://drive.google.com/thumbnail?id=1SvFvq5mPlbk2Oe5BR-gupfrxJu80-fmM&sz=w1200'
    ].forEach(src=>{const img=new Image();img.decoding='async';img.src=src});
  };
  if('requestIdleCallback'in window)requestIdleCallback(warm,{timeout:2500});
  else setTimeout(warm,1400);
})();
