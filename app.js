const PREVIEWS={"featured": {"img": "https://i.ytimg.com/vi/jINNCqnUSL8/hqdefault.jpg", "label": "FEATURED / CONTENT STRATEGY", "title": "4.2만 조회 · 구독자 +2K"}, "video": {"img": "https://i.ytimg.com/vi/fY-a_4WTMnQ/hqdefault.jpg", "label": "VIDEO / PRODUCTION", "title": "기획 · 촬영 · 편집"}, "planning": {"img": "https://i.ytimg.com/vi/RRaPlueNU8Y/hqdefault.jpg", "label": "PLANNING / RESEARCH", "title": "6개의 실전 콘텐츠 기획서"}, "photo": {"img": "https://avatars.githubusercontent.com/u/133747621?v=4", "label": "PHOTO / RETOUCH", "title": "Snap · Concept · Cosplay · Travel"}, "design": {"img": "https://drive.google.com/thumbnail?id=1IMS882egUEvxo32byMvxnYUVQnDglh0x&sz=w1600", "label": "DESIGN / HEALTHCARE", "title": "의료 콘텐츠 · 브로슈어"}, "build": {"img": "", "label": "BUILD / VIBE CODING", "title": "콘텐츠 작업을 위한 도구까지 직접"}};
const previewMedia=document.getElementById('previewMedia'), buildPreview=document.getElementById('buildPreview'), previewLabel=document.getElementById('previewLabel'), previewTitle=document.getElementById('previewTitle');
let lastTrigger=null;
function setPreview(key){const p=PREVIEWS[key];if(!p)return;previewMedia.style.opacity='0';setTimeout(()=>{if(key==='build'){previewMedia.style.display='none';buildPreview.style.display='block'}else{buildPreview.style.display='none';previewMedia.style.display='block';previewMedia.src=p.img}previewLabel.textContent=p.label;previewTitle.textContent=p.title;previewMedia.style.opacity='.82'},120)}
document.querySelectorAll('[data-preview]').forEach(el=>{el.addEventListener('mouseenter',()=>setPreview(el.dataset.preview));el.addEventListener('focus',()=>setPreview(el.dataset.preview))});
function openDialog(id,trigger){const d=document.getElementById(id);if(!d)return;lastTrigger=trigger||document.activeElement;if(!d.open)d.showModal();history.replaceState(null,'','#'+id)}
function closeDialog(d){if(d?.open)d.close();history.replaceState(null,'',location.pathname+location.search);lastTrigger?.focus?.()}
document.querySelectorAll('[data-open]').forEach(el=>el.addEventListener('click',()=>openDialog(el.dataset.open,el)));
document.querySelectorAll('[data-close]').forEach(el=>el.addEventListener('click',()=>closeDialog(el.closest('dialog'))));
document.querySelectorAll('.portfolio-dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d)closeDialog(d)}));
// URL deep links
window.addEventListener('load',()=>{const id=location.hash.slice(1);if(document.getElementById(id)?.classList.contains('portfolio-dialog'))openDialog(id)});
// Video tabs
document.querySelectorAll('[data-video-group]').forEach(b=>b.addEventListener('click',()=>{const root=b.closest('.dialog-main');root.querySelectorAll('.subtab').forEach(x=>x.classList.remove('active'));root.querySelectorAll('.video-group').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.getElementById(b.dataset.videoGroup).classList.add('active')}));
// Media dialog
const mediaDialog=document.getElementById('mediaDialog'),mediaBody=document.getElementById('mediaBody'),mediaTitle=document.getElementById('mediaTitle');
function openVideo(id,title='Video'){mediaBody.innerHTML=`<iframe src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0" title="${title}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;mediaTitle.textContent=title;mediaDialog.showModal()}
function openImage(src,title='Image'){const img=document.createElement('img');img.src=src;img.alt=title;mediaBody.replaceChildren(img);mediaTitle.textContent=title;mediaDialog.showModal()}
document.querySelectorAll('[data-video]').forEach(el=>el.addEventListener('click',()=>openVideo(el.dataset.video,el.querySelector('strong,h3')?.textContent||'Video')));
document.querySelectorAll('[data-image]').forEach(el=>el.addEventListener('click',()=>openImage(el.dataset.image,el.dataset.imageTitle||'Design work')));
function closeMedia(){if(mediaDialog.open)mediaDialog.close();mediaBody.innerHTML=''}document.querySelector('[data-media-close]').addEventListener('click',closeMedia);mediaDialog.addEventListener('click',e=>{if(e.target===mediaDialog)closeMedia()});mediaDialog.addEventListener('close',()=>mediaBody.innerHTML='');
// Resume PDF
document.getElementById('openResumePdf').addEventListener('click',()=>window.open('https://docs.google.com/document/d/1xuPbZ-7yTfMHM7BwnR5sGOag6i5Zx-d5uBndxliAxk8/edit?usp=sharing','_blank','noopener,noreferrer'));
document.getElementById('copyPhone').addEventListener('click',async(e)=>{await navigator.clipboard.writeText('010-9168-2854');e.currentTarget.textContent='복사됨 ✓';setTimeout(()=>e.currentTarget.textContent='010-9168-2854 복사',1400)});
document.getElementById('contactBtn').addEventListener('click',()=>openDialog('resume',document.getElementById('contactBtn')));
// Timecode ambience
const startedAt=performance.now();setInterval(()=>{const elapsed=(performance.now()-startedAt)/1000;const h=Math.floor(elapsed/3600),m=Math.floor(elapsed/60)%60,s=Math.floor(elapsed)%60,f=Math.floor((elapsed%1)*30);document.getElementById('timecode').textContent=[h,m,s,f].map(n=>String(n).padStart(2,'0')).join(':')},250);
