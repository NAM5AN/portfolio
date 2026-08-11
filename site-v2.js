(()=>{
  const V='20260812f';

  /* Build the final contact grid immediately so the old four-cell layout never flashes. */
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

  /* Promote the resume tools block to a site-wide footer before the rest of the UI boots. */
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

  const addCss=href=>{
    const el=document.createElement('link');
    el.rel='stylesheet';
    el.href=href;
    document.head.appendChild(el);
  };
  const loadScript=(src,onload)=>{
    const el=document.createElement('script');
    el.src=src;
    if(onload)el.onload=onload;
    document.body.appendChild(el);
  };

  addCss(`./layout-cleanup.css?v=${V}`);
  addCss(`./tab-motion.css?v=${V}`);
  addCss(`./title-number-scale.css?v=${V}`);
  addCss(`./resume-refine.css?v=${V}`);
  addCss(`./resume-contact.css?v=${V}`);
  addCss(`./build-links.css?v=${V}`);
  addCss(`./photo-gallery.css?v=${V}`);

  loadScript(`./site-v2-legacy.js?v=${V}`,()=>{
    loadScript(`./media-fix.js?v=${V}`,()=>{
      loadScript(`./planning-docs.js?v=${V}`,()=>{
        loadScript(`./mode-tabs.js?v=${V}`,()=>{
          loadScript(`./build-links.js?v=${V}`,()=>{
            loadScript(`./ai-preview.js?v=${V}`,()=>{
              loadScript(`./photo-gallery.js?v=${V}`,()=>{
                loadScript(`./photo-fit-fix.js?v=${V}`,()=>{
                  loadScript(`./view-state.js?v=${V}`);
                });
              });
            });
          });
        });
      });
    });
  });
})();