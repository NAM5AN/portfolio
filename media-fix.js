(()=>{const css=`
/* media UX patch */
.reel-poster{position:relative;overflow:hidden;background:linear-gradient(155deg,#292821,#141411);isolation:isolate}
.reel-poster .reel-thumb-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;z-index:0;transition:transform .35s ease,opacity .2s ease}
.reel-poster::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.08) 35%,rgba(0,0,0,.72));z-index:1;pointer-events:none}
.reel-poster::before{z-index:3;background:rgba(0,0,0,.42);padding:5px 7px;border-radius:999px;color:#fff}
.reel-poster strong{position:relative;z-index:2;color:#fff;text-shadow:0 1px 12px rgba(0,0,0,.45)}
.reel-card:hover .reel-thumb-img{transform:scale(1.025)}
.lean-media-viewer{margin:auto;padding:0;border:0;background:transparent;overflow:visible;color:#fff;max-width:none;max-height:none}
.lean-media-viewer::backdrop{background:rgba(0,0,0,.78);backdrop-filter:blur(8px)}
.lean-media-frame{position:relative;background:#000;box-shadow:0 24px 90px rgba(0,0,0,.38);overflow:hidden}
.lean-media-viewer.is-youtube .lean-media-frame{width:min(920px,92vw);aspect-ratio:16/9;border-radius:14px}
.lean-media-viewer.is-reel .lean-media-frame{height:min(82dvh,760px);aspect-ratio:9/16;border-radius:14px}
.lean-media-frame iframe,.lean-media-frame video{position:absolute;inset:0;width:100%;height:100%;border:0;display:block;background:#000}
.lean-media-frame video{object-fit:contain}
.lean-media-close{position:absolute;z-index:10;top:10px;right:10px;width:38px;height:38px;border:1px solid rgba(255,255,255,.55);border-radius:50%;background:rgba(0,0,0,.55);color:#fff;font-size:22px;line-height:1;display:grid;place-items:center;backdrop-filter:blur(8px);padding:0}
.lean-media-close:hover{background:#fff;color:#111}
@media(max-width:680px){
 .reel-poster{aspect-ratio:9/13}
 .lean-media-viewer.is-youtube .lean-media-frame{width:94vw;border-radius:10px}
 .lean-media-viewer.is-reel .lean-media-frame{height:min(78dvh,680px);max-width:92vw;border-radius:10px}
 .lean-media-close{top:8px;right:8px;width:36px;height:36px}
}
`;
const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);
const dlg=document.createElement('dialog');dlg.className='lean-media-viewer';dlg.innerHTML='<div class="lean-media-frame"><button class="lean-media-close" type="button" aria-label="닫기">×</button><div class="lean-media-content"></div></div>';document.body.appendChild(dlg);
const content=dlg.querySelector('.lean-media-content');
const close=()=>{if(dlg.open)dlg.close();content.innerHTML='';dlg.classList.remove('is-reel','is-youtube')};
dlg.querySelector('.lean-media-close').addEventListener('click',close);dlg.addEventListener('click',e=>{if(e.target===dlg)close()});dlg.addEventListener('close',()=>{content.innerHTML='';dlg.classList.remove('is-reel','is-youtube')});
function openYoutube(id,title='Video'){dlg.classList.add('is-youtube');content.innerHTML=`<iframe src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0" title="${String(title).replace(/"/g,'&quot;')}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;dlg.showModal()}
function openReel(id,title='Reel'){dlg.classList.add('is-reel');const poster=`https://drive.google.com/thumbnail?id=${id}&sz=w1000`;const src=`https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`;content.innerHTML=`<video controls playsinline preload="metadata" poster="${poster}" aria-label="${String(title).replace(/"/g,'&quot;')}"><source src="${src}" type="video/mp4"></video>`;const v=content.querySelector('video');v.addEventListener('error',()=>{content.innerHTML=`<iframe src="https://drive.google.com/file/d/${id}/preview" title="${String(title).replace(/"/g,'&quot;')}" allow="autoplay"></iframe>`},{once:true});dlg.showModal();v.play().catch(()=>{})}
function decorateReels(root=document){root.querySelectorAll('.reel-card[data-drive-video]').forEach(card=>{const poster=card.querySelector('.reel-poster');if(!poster||poster.querySelector('.reel-thumb-img'))return;const img=document.createElement('img');img.className='reel-thumb-img';img.loading='lazy';img.alt='';img.src=`https://drive.google.com/thumbnail?id=${card.dataset.driveVideo}&sz=w800`;img.addEventListener('error',()=>img.remove(),{once:true});poster.prepend(img)})}
document.addEventListener('click',e=>{const y=e.target.closest('[data-youtube]');const r=e.target.closest('[data-drive-video]');if(!y&&!r)return;e.preventDefault();e.stopImmediatePropagation();if(y){const title=y.closest('article')?.querySelector('h3')?.textContent||y.querySelector('strong')?.textContent||'Video';openYoutube(y.dataset.youtube,title)}else openReel(r.dataset.driveVideo,r.dataset.title||r.querySelector('strong')?.textContent||'Reel')},true);
const vp=document.getElementById('videoPanels');if(vp){decorateReels(vp);new MutationObserver(()=>decorateReels(vp)).observe(vp,{childList:true,subtree:true})}
})();