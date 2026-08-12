(()=>{const css=`
/* media UX patch */
.reel-card{border:0!important;background:transparent!important}
.reel-poster{position:relative;overflow:hidden;background:linear-gradient(155deg,#292821,#141411);isolation:isolate}
.reel-poster .reel-thumb-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;z-index:0;transition:transform .35s ease,opacity .2s ease}
.reel-poster::before,.reel-poster::after{content:none!important;display:none!important}
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
const recentTab=document.querySelector('#videoModal .tab[data-tab="recent"]');if(recentTab)recentTab.textContent='유튜브 PD';
const dlg=document.createElement('dialog');dlg.className='lean-media-viewer';dlg.innerHTML='<div class="lean-media-frame"><button class="lean-media-close" type="button" aria-label="닫기">×</button><div class="lean-media-content"></div></div>';document.body.appendChild(dlg);
const content=dlg.querySelector('.lean-media-content');
const DRIVE_ONLY_REELS=new Set(['1h7jscxadAVogvf1_svMP8PFLhMVEcK_r']);
if(window.__portfolioAssetBase){
  DRIVE_ONLY_REELS.add('1O2brkCKpYbKnQjku_WCf6bQeQxAeD_TB');
  DRIVE_ONLY_REELS.add('1dutdynArWG8N--dBhiNmPdhilIA-mpcW');
}
const close=()=>{if(dlg.open)dlg.close();content.innerHTML='';dlg.classList.remove('is-reel','is-youtube')};
dlg.querySelector('.lean-media-close').addEventListener('click',close);dlg.addEventListener('click',e=>{if(e.target===dlg)close()});dlg.addEventListener('close',()=>{content.innerHTML='';dlg.classList.remove('is-reel','is-youtube')});
function openYoutube(id,title='Video'){dlg.classList.add('is-youtube');content.innerHTML=`<iframe src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0" title="${String(title).replace(/"/g,'&quot;')}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;dlg.showModal()}
function openReel(id,title='Reel',src=''){dlg.classList.add('is-reel');const safeTitle=String(title).replace(/"/g,'&quot;');if(src){const poster=`https://drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=w1000`;content.innerHTML=`<video controls autoplay playsinline preload="metadata" poster="${poster}" src="${src}" aria-label="${safeTitle}"></video>`;dlg.showModal();content.querySelector('video').play().catch(()=>{})}else{const safeId=encodeURIComponent(id);content.innerHTML=`<iframe src="https://drive.google.com/file/d/${safeId}/preview" title="${safeTitle}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;dlg.showModal()}}
function reelSource(card){if(DRIVE_ONLY_REELS.has(card.dataset.driveVideo))return'';if(card.dataset.videoSrc)return card.dataset.videoSrc;const grid=card.closest('.reel-grid');const cards=grid?[...grid.querySelectorAll('.reel-card[data-drive-video]')]:[];const index=cards.indexOf(card);return index<0?'':`./assets/reels/reel-${String(index+1).padStart(2,'0')}.mp4`}
function decorateReels(root=document){root.querySelectorAll('.reel-card[data-drive-video]').forEach(card=>{const src=reelSource(card);if(src)card.dataset.videoSrc=src;else delete card.dataset.videoSrc;const poster=card.querySelector('.reel-poster');if(!poster)return;poster.querySelector('strong')?.remove();[...card.children].forEach(child=>{if(child!==poster)child.remove()});if(poster.querySelector('.reel-thumb-img'))return;const img=document.createElement('img');img.className='reel-thumb-img';img.loading='lazy';img.alt='';img.src=`https://drive.google.com/thumbnail?id=${card.dataset.driveVideo}&sz=w800`;img.addEventListener('error',()=>img.remove(),{once:true});poster.prepend(img)})}
document.addEventListener('click',e=>{const y=e.target.closest('[data-youtube]');const r=e.target.closest('[data-drive-video]');if(!y&&!r)return;e.preventDefault();e.stopImmediatePropagation();if(y){const title=y.closest('article')?.querySelector('h3')?.textContent||y.querySelector('strong')?.textContent||'Video';openYoutube(y.dataset.youtube,title)}else openReel(r.dataset.driveVideo,r.dataset.title||'Reel',reelSource(r))},true);
const vp=document.getElementById('videoPanels');if(vp){decorateReels(vp);new MutationObserver(()=>decorateReels(vp)).observe(vp,{childList:true,subtree:true})}
})();
