(()=>{
  document.addEventListener('error',event=>{
    const video=event.target;
    if(!(video instanceof HTMLVideoElement))return;
    const content=video.closest('.lean-media-content');
    if(!content)return;

    const poster=video.getAttribute('poster')||'';
    const match=poster.match(/[?&]id=([^&]+)/);
    if(!match)return;

    const id=decodeURIComponent(match[1]);
    const title=video.getAttribute('aria-label')||'Reel';
    content.innerHTML=`<iframe src="https://drive.google.com/file/d/${encodeURIComponent(id)}/preview" title="${String(title).replace(/"/g,'&quot;')}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
  },true);
})();
