(async()=>{
  const V='20260812ak';

  const faviconSvg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="15" fill="#101113"/><path d="M17 16v32M17 32l25-16M17 32l27 16" fill="none" stroke="#f9faf8" stroke-width="6" stroke-linecap="square"/></svg>';
  document.querySelectorAll('link[rel~="icon"]').forEach(node=>node.remove());
  const favicon=document.createElement('link');
  favicon.rel='icon';
  favicon.type='image/svg+xml';
  favicon.href=`data:image/svg+xml,${encodeURIComponent(faviconSvg)}`;
  document.head.appendChild(favicon);

  document.querySelector('.index-heading')?.remove();
  document.querySelectorAll('.section-modal .modal-head>div').forEach(node=>node.remove());
  document.querySelector('.migration-note')?.remove();

  const contact=document.querySelector('.resume-contact');
  if(contact){
    const birth={year:2000,month:8,day:21};
    const now=new Date();
    const currentAge=now.getFullYear()-birth.year+1;
    let internationalAge=now.getFullYear()-birth.year;
    const birthdayPassed=(now.getMonth()+1>birth.month)||((now.getMonth()+1===birth.month)&&now.getDate()>=birth.day);
    if(!birthdayPassed)internationalAge-=1;
    contact.innerHTML=`
      <div><small>LOCATION</small><strong>경기 부천 · 서울 전체 · 재택</strong></div>
      <div><small>CONTACT</small><strong>010-9168-2854</strong></div>
      <div><small>BIRTH</small><strong>2000.08.21</strong></div>
      <div><small>INSTAGRAM</small><strong><a href="https://www.instagram.com/5uu_uuu/" target="_blank" rel="noopener noreferrer" aria-label="인스타그램 @5uu_uuu 새 탭에서 열기">@5uu_uuu</a></strong></div>
      <div><small>AGE</small><strong id="resumeAge">${currentAge}세 (만 ${internationalAge}세)</strong></div>
      <div><small>BLOG</small><strong><a href="https://blog.naver.com/tnwjd2854" target="_blank" rel="noopener noreferrer" aria-label="네이버 블로그 tnwjd2854 새 탭에서 열기">tnwjd2854</a></strong></div>`;
  }

  const site=document.querySelector('.site');
  const tools=document.querySelector('.resume-profile-bottom');
  if(site&&tools){
    tools.classList.add('site-tools-bar');
    tools.querySelectorAll('.skill-cloud span').forEach(node=>{
      const label=node.textContent.trim().toLowerCase();
      if(label==='gpt'||label==='chatgpt')node.remove();
    });
    site.appendChild(tools);
  }

  const remoteMode=typeof rawUrl==='function';
  const rawBase=typeof window.__portfolioAssetBase==='string'?window.__portfolioAssetBase:'';
  const clean=href=>href.replace(/^\.\//,'').replace(/^\//,'');
  const resolveAsset=href=>{
    if(!remoteMode)return href;
    if(rawBase)return `${rawBase}${clean(href)}`;
    return rawUrl(href);
  };

  const loadCss=href=>new Promise(resolve=>{
    if(!remoteMode){
      const el=document.createElement('link');
      el.rel='stylesheet';
      el.href=href;
      el.onload=resolve;
      el.onerror=()=>{console.error('[portfolio] CSS load failed',href);resolve()};
      document.head.appendChild(el);
      return;
    }
    fetch(resolveAsset(href),{cache:'default'})
      .then(r=>{if(!r.ok)throw new Error(`${href}: ${r.status}`);return r.text()})
      .then(css=>{
        const el=document.createElement('style');
        el.dataset.source=href;
        el.textContent=css;
        document.head.appendChild(el);
      })
      .catch(err=>console.error('[portfolio] CSS load failed',href,err))
      .finally(resolve);
  });

  const loadScript=src=>new Promise(resolve=>{
    if(!remoteMode){
      const el=document.createElement('script');
      el.src=src;
      el.onload=resolve;
      el.onerror=err=>{console.error('[portfolio] script load failed',src,err);resolve()};
      document.body.appendChild(el);
      return;
    }
    fetch(resolveAsset(src),{cache:'default'})
      .then(r=>{if(!r.ok)throw new Error(`${src}: ${r.status}`);return r.text()})
      .then(code=>{
        const el=document.createElement('script');
        el.dataset.source=src;
        el.textContent=`${code}\n//# sourceURL=${resolveAsset(src).replace(/\s/g,'%20')}`;
        document.body.appendChild(el);
      })
      .catch(err=>console.error('[portfolio] script load failed',src,err))
      .finally(resolve);
  });

  try{
    await Promise.all([
      `./tab-motion.css?v=${V}`,
      `./title-number-scale.css?v=${V}`,
      `./resume-refine.css?v=${V}`,
      `./resume-contact.css?v=${V}`,
      `./portfolio-index-refine.css?v=${V}`,
      `./portfolio-stats-center.css?v=${V}`,
      `./portfolio-shell-refine.css?v=${V}`,
      `./build-links.css?v=${V}`,
      `./photo-gallery.css?v=${V}`,
      `./modal-tabs.css?v=${V}`,
      `./modal-scroll-refine.css?v=${V}`,
      `./brochure-book.css?v=${V}`,
      `./design-preview-duo.css?v=${V}`,
      `./font-theme.css?v=${V}`,
      `./bottom-bar-refine.css?v=${V}`
    ].map(loadCss));

    await loadScript(`./mode-tabs.js?v=${V}`);

    const fontReady=document.fonts?.load
      ? Promise.allSettled([
          document.fonts.load('500 32px Aggravo'),
          document.fonts.load("400 16px 'Pretendard Variable'")
        ])
      : Promise.resolve();

    // legacy 파일 안에 남아 있는 오래된 hover 프리뷰 바인딩만 막는다.
    const previewRows=[...document.querySelectorAll('.work-row[data-preview]')];
    previewRows.forEach(row=>{
      row.dataset.previewKey=row.dataset.preview;
      row.removeAttribute('data-preview');
    });
    await loadScript(`./site-v2-legacy.js?v=${V}`);
    previewRows.forEach(row=>{
      row.dataset.preview=row.dataset.previewKey;
      delete row.dataset.previewKey;
    });

    // 서로 의존하지 않는 기능은 동시에 내려받고 실행한다.
    await Promise.all([
      './brochure-book.js',
      './design-lightbox.js',
      './media-fix.js',
      './worker-reel-fallback.js',
      './planning-docs.js',
      './build-links.js',
      './photo-gallery.js',
      './modal-tabs.js',
      './modal-scroll-refine.js',
      './preview-controller.js'
    ].map(src=>loadScript(`${src}?v=${V}`)));

    // 기존 AI 프리뷰 컨트롤러 뒤에서 최종 프리뷰 규칙을 한 번만 적용한다.
    await Promise.all([
      loadScript(`./preview-final.js?v=${V}`),
      loadScript(`./photo-asset-bridge.js?v=${V}`),
      loadScript(`./photo-fit-fix.js?v=${V}`)
    ]);

    await loadScript(`./view-state.js?v=${V}`);

    await Promise.race([
      fontReady,
      new Promise(resolve=>setTimeout(resolve,800))
    ]).catch(()=>{});
  }catch(err){
    console.error('[portfolio] initialization error',err);
  }finally{
    document.documentElement.classList.add('portfolio-ready');
  }
})();
