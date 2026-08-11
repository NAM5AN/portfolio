(()=>{
  const V='20260812e';

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