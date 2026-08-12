(async()=>{
  const V='20260813bp';

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
  document.querySelectorAll('#featuredModal .modal-body>.lead,#photoModal .modal-body>.lead,#buildModal .modal-body>.lead').forEach(node=>node.remove());
  document.querySelector('.resume-note')?.remove();

  const newsroomCopy=[...document.querySelectorAll('#featuredModal .feature-copy p')].find(node=>node.textContent.includes('채널을 인수해'));
  if(newsroomCopy)newsroomCopy.textContent=newsroomCopy.textContent.replace('채널을 인수해','채널 운영을 시작해');

  const heroSummary=document.querySelector('.hero-summary');
  if(heroSummary)heroSummary.textContent='영상 제작을 중심으로 기획, 촬영, 편집, 사진, 실무 디자인을 다룹니다. 기계 및 프로그램을 쉽게 익히며, AI를 능숙하게 사용합니다.';

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
      <div><small>EMAIL</small><strong><button class="resume-copy-email" type="button" data-copy-email="tnwjd2854@naver.com" aria-label="이메일 주소 tnwjd2854@naver.com 복사">tnwjd2854@naver.com</button></strong></div>`;

    const emailButton=contact.querySelector('[data-copy-email]');
    if(emailButton){
      emailButton.addEventListener('click',async()=>{
        const email=emailButton.dataset.copyEmail||'';
        let copied=false;
        try{
          await navigator.clipboard.writeText(email);
          copied=true;
        }catch{
          const area=document.createElement('textarea');
          area.value=email;
          area.setAttribute('readonly','');
          area.style.position='fixed';
          area.style.opacity='0';
          document.body.appendChild(area);
          area.select();
          try{copied=document.execCommand('copy')}catch{}
          area.remove();
        }
        if(!copied)return;
        emailButton.classList.add('is-copied');
        emailButton.setAttribute('aria-label','이메일 주소 복사됨');
        window.setTimeout(()=>{
          emailButton.classList.remove('is-copied');
          emailButton.setAttribute('aria-label','이메일 주소 tnwjd2854@naver.com 복사');
        },1200);
      });
    }
  }

  const resumeStats=document.querySelector('.resume-stats');
  if(resumeStats){
    resumeStats.innerHTML=`
      <div class="resume-stat"><strong id="resumeNetCareer">-</strong><span>중복기간 제외 경력</span></div>
      <div class="resume-stat resume-stat-gear"><strong>Canon R6 II</strong><span>RF 24mm 4.0L</span></div>`;
  }
  const gearLine=document.querySelector('.resume-gear');
  if(gearLine)gearLine.textContent='개인 장비 · Canon R6 II · RF 24mm 4.0L';

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

  const resumeIntro=document.querySelector('.resume-intro');
  if(resumeIntro&&!document.querySelector('.resume-download-link')){
    const link=document.createElement('a');
    link.className='resume-download-link';
    link.href=resolveAsset('./assets/resume/kim-sujeong-resume.pdf');
    link.download='김수정_이력서.pdf';
    link.setAttribute('aria-label','김수정 PDF 이력서 다운로드');
    link.textContent='PDF 이력서 다운로드';
    resumeIntro.after(link);
  }

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
      `./resume-download.css?v=${V}`,
      `./portfolio-index-refine.css?v=${V}`,
      `./portfolio-stats-center.css?v=${V}`,
      `./portfolio-shell-refine.css?v=${V}`,
      `./build-links.css?v=${V}`,
      `./photo-gallery.css?v=${V}`,
      `./modal-tabs.css?v=${V}`,
      `./photo-tabs-sticky.css?v=${V}`,
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

    await Promise.all([
      './brochure-book.js',
      './design-lightbox.js',
      './media-fix.js',
      './worker-reel-fallback.js',
      './planning-docs.js',
      './build-links.js',
      './photo-gallery.js',
      './modal-tabs.js',
      './modal-scroll-refine.js'
    ].map(src=>loadScript(`${src}?v=${V}`)));

    await loadScript(`./photo-tabs-head.js?v=${V}`);

    await Promise.all([
      loadScript(`./preview-final.js?v=${V}`),
      loadScript(`./photo-asset-bridge.js?v=${V}`),
      loadScript(`./photo-fit-fix.js?v=${V}`)
    ]);

    await loadScript(`./view-state.js?v=${V}`);
    await loadScript(`./resume-profile-lightbox.js?v=${V}`);

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