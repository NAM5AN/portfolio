(()=>{
  const wrap=document.querySelector('.index-preview');
  const preview=document.getElementById('homePreview');
  const caption=document.getElementById('previewCaption');
  const originalRows=[...document.querySelectorAll('.work-row[data-preview]')];
  if(!wrap||!preview||!caption||!originalRows.length)return;

  const rows=originalRows.map(row=>{
    const clone=row.cloneNode(true);
    row.replaceWith(clone);
    return clone;
  });

  const items={
    featured:['https://i.ytimg.com/vi/dI_J-0qeb5A/maxresdefault.jpg','FEATURED / NBN · 기자의 시선','기자의 시선 · 중장년층 고독사'],
    video:['https://i.ytimg.com/vi/TPrPnkTMmTo/maxresdefault.jpg','VIDEO / FILM · 소확행','단편영화 소확행'],
    planning:['https://i.ytimg.com/vi/jINNCqnUSL8/maxresdefault.jpg','PLANNING / CONTENT STRATEGY','창업지원금 콘텐츠'],
    photo:['https://raw.githubusercontent.com/NAM5AN/portfolio/main/assets/photo/thumb/concept/concept-01.webp','PHOTOGRAPHY / CONCEPT','Photography concept portfolio preview'],
    build:['https://raw.githubusercontent.com/NAM5AN/portfolio/main/assets/preview/ai-tools-v3.webp?v=3','AI & BUILD / WORKFLOW','AI tools workflow — GPT, Codex, Claude, Gemini, Seedance, Kling']
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
  const hideDuo=()=>{
    duo.hidden=true;
    preview.style.visibility='visible';
  };
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
    preview.style.visibility='visible';
    preview.src=item[0];
    preview.alt=item[2];
    preview.style.opacity='.88';
    caption.textContent=item[1];

    if(key==='build'){
      preview.onerror=()=>{
        preview.onerror=null;
        preview.src='https://cdn.jsdelivr.net/gh/NAM5AN/portfolio@main/assets/preview/ai-tools-v3.webp';
      };
    }
  };

  rows.forEach(row=>{
    const showRow=()=>show(row);
    row.addEventListener('mouseenter',showRow);
    row.addEventListener('pointerenter',showRow);
    row.addEventListener('focus',showRow);
    row.addEventListener('click',showRow);
    row.addEventListener('touchstart',showRow,{passive:true});
  });

  show(rows.find(row=>row.classList.contains('active'))||rows[0]);

  const warm=()=>{
    [
      ...Object.values(items).map(item=>item[0]),
      'https://drive.google.com/thumbnail?id=1IMS882egUEvxo32byMvxnYUVQnDglh0x&sz=w1200',
      'https://drive.google.com/thumbnail?id=1SvFvq5mPlbk2Oe5BR-gupfrxJu80-fmM&sz=w1200'
    ].forEach(src=>{
      const img=new Image();
      img.decoding='async';
      img.src=src;
    });
  };
  if('requestIdleCallback'in window)requestIdleCallback(warm,{timeout:2500});
  else setTimeout(warm,1400);
})();
