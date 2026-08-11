(()=>{
  const base=typeof window.__portfolioAssetBase==='string'?window.__portfolioAssetBase:'';
  if(!base)return;

  const toRemote=value=>{
    const raw=String(value||'').trim();
    if(!raw||/^https?:\/\//i.test(raw)||raw.startsWith('data:')||raw.startsWith('blob:'))return raw;
    const match=raw.match(/(?:^|\.\/|\/)assets\/photo\/(.+)$/);
    return match?`${base}assets/photo/${match[1]}`:raw;
  };

  const fixImage=img=>{
    if(!(img instanceof HTMLImageElement))return;
    const attr=img.getAttribute('src')||'';
    const remote=toRemote(attr);
    if(remote&&remote!==attr)img.setAttribute('src',remote);
    const fallback=img.dataset?.fallback;
    if(fallback){
      const remoteFallback=toRemote(fallback);
      if(remoteFallback&&remoteFallback!==fallback)img.dataset.fallback=remoteFallback;
    }
  };

  const fixTree=node=>{
    if(node instanceof HTMLImageElement)fixImage(node);
    node?.querySelectorAll?.('img').forEach(fixImage);
  };

  fixTree(document);

  const roots=[
    document.getElementById('photoSeries'),
    document.querySelector('.photo-lightbox'),
    document.querySelector('.index-preview')
  ].filter(Boolean);

  roots.forEach(root=>{
    new MutationObserver(records=>{
      for(const record of records){
        if(record.type==='attributes')fixImage(record.target);
        else record.addedNodes.forEach(fixTree);
      }
    }).observe(root,{subtree:true,childList:true,attributes:true,attributeFilter:['src','data-fallback']});
    fixTree(root);
  });
})();
