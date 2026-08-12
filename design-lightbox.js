(()=>{
  const panel=document.getElementById('designPanels');
  if(!panel)return;

  const dlg=document.createElement('dialog');
  dlg.className='photo-lightbox design-lightbox';
  dlg.innerHTML=`<div class="photo-lightbox-frame"><button class="photo-lightbox-close" type="button" aria-label="닫기">×</button><button class="photo-lightbox-nav photo-lightbox-prev" type="button" aria-label="이전 디자인">←</button><figure><div class="photo-lightbox-viewport" aria-label="디자인 작업 확대 보기. 마우스 휠로 확대 및 축소하고, 확대 후 드래그하여 이동할 수 있습니다."><img alt="" draggable="false"></div><div class="photo-lightbox-help">휠 확대·축소 · 드래그 이동 · 더블클릭 초기화</div><figcaption><span class="photo-lightbox-category">Design</span><strong class="photo-lightbox-counter"></strong></figcaption><div class="photo-lightbox-tools" aria-label="디자인 확대 도구"><button type="button" data-design-zoom-out aria-label="축소">−</button><span class="photo-lightbox-zoom">100%</span><button type="button" data-design-zoom-in aria-label="확대">+</button><button type="button" data-design-zoom-reset aria-label="원래 크기로">RESET</button></div></figure><button class="photo-lightbox-nav photo-lightbox-next" type="button" aria-label="다음 디자인">→</button></div>`;
  document.body.appendChild(dlg);

  const viewport=dlg.querySelector('.photo-lightbox-viewport');
  const img=dlg.querySelector('img');
  const category=dlg.querySelector('.photo-lightbox-category');
  const counter=dlg.querySelector('.photo-lightbox-counter');
  const zoomLabel=dlg.querySelector('.photo-lightbox-zoom');
  const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
  let items=[],index=0,scale=1,panX=0,panY=0,dragging=false,dragStartX=0,dragStartY=0,dragPanX=0,dragPanY=0;

  const currentTabLabel=()=>document.querySelector('#designModal [data-design-tab].active')?.textContent?.trim()||'Design';
  const collect=()=>[...panel.querySelectorAll('[data-image]')].map(node=>({src:node.dataset.image,title:node.dataset.title||node.querySelector('span')?.textContent||'Design'}));
  const limits=()=>({x:Math.max(0,((img.clientWidth||0)*scale-viewport.clientWidth)/2),y:Math.max(0,((img.clientHeight||0)*scale-viewport.clientHeight)/2)});
  const apply=(animate=false)=>{const l=limits();panX=clamp(panX,-l.x,l.x);panY=clamp(panY,-l.y,l.y);img.style.transition=animate?'transform .18s ease':'none';img.style.transform=`translate3d(${panX}px,${panY}px,0) scale(${scale})`;zoomLabel.textContent=`${Math.round(scale*100)}%`;viewport.classList.toggle('is-zoomed',scale>1.001);if(animate)setTimeout(()=>img.style.transition='none',190)};
  const reset=(animate=false)=>{scale=1;panX=0;panY=0;apply(animate)};
  const zoomAt=(x,y,next,animate=false)=>{next=clamp(next,1,6);if(Math.abs(next-scale)<.0001)return;const r=viewport.getBoundingClientRect(),px=x-(r.left+r.width/2),py=y-(r.top+r.height/2),ratio=next/scale;panX=px-(px-panX)*ratio;panY=py-(py-panY)*ratio;scale=next;apply(animate)};
  const zoomCenter=f=>{const r=viewport.getBoundingClientRect();zoomAt(r.left+r.width/2,r.top+r.height/2,scale*f,true)};

  const render=()=>{
    if(!items.length)return;
    index=(index+items.length)%items.length;
    const item=items[index];reset(false);img.onload=()=>reset(false);img.src=item.src;img.alt=item.title;category.textContent=currentTabLabel();counter.textContent=`${String(index+1).padStart(2,'0')} / ${String(items.length).padStart(2,'0')}`;
    const prev=items[(index-1+items.length)%items.length],next=items[(index+1)%items.length];[prev,next].forEach(x=>{const p=new Image();p.src=x.src});
  };
  const open=(src)=>{items=collect();index=Math.max(0,items.findIndex(x=>x.src===src));render();if(!dlg.open)dlg.showModal()};
  const step=d=>{if(scale>1.001)return;index+=d;render()};
  const close=()=>{if(dlg.open)dlg.close();reset(false);img.removeAttribute('src')};

  document.addEventListener('click',e=>{
    const card=e.target.closest('#designModal [data-image]');
    if(!card)return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();open(card.dataset.image);
  },true);

  dlg.querySelector('.photo-lightbox-close').addEventListener('click',close);
  dlg.querySelector('.photo-lightbox-prev').addEventListener('click',()=>step(-1));
  dlg.querySelector('.photo-lightbox-next').addEventListener('click',()=>step(1));
  dlg.addEventListener('click',e=>{if(e.target===dlg)close()});
  dlg.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')step(-1);if(e.key==='ArrowRight')step(1);if(e.key==='Escape')close();if(e.key==='0')reset(true);if(e.key==='+'||e.key==='=')zoomCenter(1.28);if(e.key==='-')zoomCenter(1/1.28)});
  dlg.addEventListener('close',()=>{reset(false);img.removeAttribute('src')});
  dlg.querySelector('[data-design-zoom-in]').addEventListener('click',()=>zoomCenter(1.35));
  dlg.querySelector('[data-design-zoom-out]').addEventListener('click',()=>zoomCenter(1/1.35));
  dlg.querySelector('[data-design-zoom-reset]').addEventListener('click',()=>reset(true));
  viewport.addEventListener('wheel',e=>{e.preventDefault();zoomAt(e.clientX,e.clientY,scale*Math.exp(-e.deltaY*.0015),false)},{passive:false});
  viewport.addEventListener('dblclick',e=>{e.preventDefault();scale>1.01?reset(true):zoomAt(e.clientX,e.clientY,2,true)});
  viewport.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'||scale<=1.001)return;dragging=true;dragStartX=e.clientX;dragStartY=e.clientY;dragPanX=panX;dragPanY=panY;viewport.classList.add('is-dragging');viewport.setPointerCapture?.(e.pointerId);e.preventDefault()});
  viewport.addEventListener('pointermove',e=>{if(!dragging)return;panX=dragPanX+e.clientX-dragStartX;panY=dragPanY+e.clientY-dragStartY;apply(false)});
  const stop=e=>{if(!dragging)return;dragging=false;viewport.classList.remove('is-dragging');if(e?.pointerId!==undefined&&viewport.hasPointerCapture?.(e.pointerId))viewport.releasePointerCapture(e.pointerId)};
  viewport.addEventListener('pointerup',stop);viewport.addEventListener('pointercancel',stop);

  const distance=t=>Math.hypot(t[0].clientX-t[1].clientX,t[0].clientY-t[1].clientY);const center=t=>({x:(t[0].clientX+t[1].clientX)/2,y:(t[0].clientY+t[1].clientY)/2});
  let sx=0,sy=0,lx=0,ly=0,lastD=0,lastC=null,pinch=false;
  viewport.addEventListener('touchstart',e=>{if(e.touches.length===1){sx=lx=e.touches[0].clientX;sy=ly=e.touches[0].clientY}else if(e.touches.length>=2){pinch=true;lastD=distance(e.touches);lastC=center(e.touches)}},{passive:true});
  viewport.addEventListener('touchmove',e=>{if(e.touches.length>=2){e.preventDefault();const d=distance(e.touches),c=center(e.touches);if(lastD){zoomAt(c.x,c.y,scale*(d/lastD),false);if(lastC){panX+=c.x-lastC.x;panY+=c.y-lastC.y;apply(false)}}lastD=d;lastC=c;return}if(e.touches.length===1&&scale>1.001){e.preventDefault();const t=e.touches[0];panX+=t.clientX-lx;panY+=t.clientY-ly;lx=t.clientX;ly=t.clientY;apply(false)}},{passive:false});
  viewport.addEventListener('touchend',e=>{if(e.touches.length)return;const t=e.changedTouches[0];if(t&&!pinch&&scale<=1.001){const dx=t.clientX-sx,dy=t.clientY-sy;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.2)step(dx>0?-1:1)}lastD=0;lastC=null;pinch=false},{passive:true});
})();
