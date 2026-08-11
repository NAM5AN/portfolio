(()=>{
  const V='20260812l';

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

  /*
    GitHub Pages runs this file normally and can use relative asset URLs.
    The Vercel bridge evaluates this file with a rawUrl() helper in scope.
    In that mode, fetch CSS/JS from GitHub and inject it inline so raw.githubusercontent.com's
    MIME type cannot block script/style execution.
  */
  const remoteMode=typeof rawUrl==='function';
  const resolveAsset=href=>remoteMode?rawUrl(href):href;

  function addCss(href){
    if(!remoteMode){
      const el=document.createElement('link');
      el.rel='stylesheet';
      el.href=href;
      document.head.appendChild(el);
      return;
    }
    fetch(resolveAsset(href),{cache:'no-store'})
      .then(r=>{
        if(!r.ok)throw new Error(`${href}: ${r.status}`);
        return r.text();
      })
      .then(css=>{
        const el=document.createElement('style');
        el.dataset.source=href;
        el.textContent=css;
        document.head.appendChild(el);
      })
      .catch(err=>console.error('[portfolio] CSS load failed',href,err));
  }

  function loadScript(src,onload){
    if(!remoteMode){
      const el=document.createElement('script');
      el.src=src;
      if(onload)el.onload=onload;
      el.onerror=err=>console.error('[portfolio] script load failed',src,err);
      document.body.appendChild(el);
      return;
    }
    fetch(resolveAsset(src),{cache:'no-store'})
      .then(r=>{
        if(!r.ok)throw new Error(`${src}: ${r.status}`);
        return r.text();
      })
      .then(code=>{
        const el=document.createElement('script');
        el.dataset.source=src;
        el.textContent=`${code}\n//# sourceURL=${resolveAsset(src).replace(/\s/g,'%20')}`;
        document.body.appendChild(el);
        if(onload)onload();
      })
      .catch(err=>console.error('[portfolio] script load failed',src,err));
  }

  addCss(`./layout-cleanup.css?v=${V}`);
  addCss(`./tab-motion.css?v=${V}`);
  addCss(`./title-number-scale.css?v=${V}`);
  addCss(`./resume-refine.css?v=${V}`);
  addCss(`./resume-contact.css?v=${V}`);
  addCss(`./portfolio-index-refine.css?v=${V}`);
  addCss(`./build-links.css?v=${V}`);
  addCss(`./photo-gallery.css?v=${V}`);
  addCss(`./modal-tabs.css?v=${V}`);

  loadScript(`./site-v2-legacy.js?v=${V}`,()=>{
    loadScript(`./media-fix.js?v=${V}`,()=>{
      loadScript(`./worker-reel-fallback.js?v=${V}`,()=>{
        loadScript(`./planning-docs.js?v=${V}`,()=>{
          loadScript(`./mode-tabs.js?v=${V}`,()=>{
            loadScript(`./build-links.js?v=${V}`,()=>{
              loadScript(`./ai-preview.js?v=${V}`,()=>{
                loadScript(`./photo-gallery.js?v=${V}`,()=>{
                  loadScript(`./photo-asset-bridge.js?v=${V}`,()=>{
                    loadScript(`./photo-fit-fix.js?v=${V}`,()=>{
                      loadScript(`./modal-tabs.js?v=${V}`,()=>{
                        loadScript(`./view-state.js?v=${V}`);
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
})();
