(()=>{
  const TOTAL=18;
  const MOBILE_QUERY='(max-width:760px)';
  const assetBase=typeof window.__portfolioAssetBase==='string'?window.__portfolioAssetBase:'';
  const pageUrl=index=>assetBase
    ? `${assetBase}assets/brochure/page-${String(index+1).padStart(2,'0')}.webp`
    : `./assets/brochure/page-${String(index+1).padStart(2,'0')}.webp`;
  const PAGES=Array.from({length:TOTAL},(_,i)=>pageUrl(i));
  const bookStates=new WeakMap();
  const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
  const isMobile=()=>window.matchMedia(MOBILE_QUERY).matches;

  const bookMarkup=()=>`
    <div class="embedded-doc brochure-embedded">
      <aside class="embedded-doc-note brochure-note">
        <span>INDESIGN · 18 PAGES</span>
        <h3>맑은석피부과 가격 안내책자</h3>
        <p>템플릿 없이 Adobe InDesign으로 제작한 18페이지 편집디자인 작업입니다. 페이지를 클릭하거나 스와이프해 넘겨볼 수 있습니다.</p>
      </aside>
      <section class="brochure-book" aria-label="가격 안내책자 18페이지 책 보기">
        <div class="brochure-stage">
          <button class="brochure-expand" type="button" aria-label="안내책자 크게 보기" title="크게 보기">⛶</button>
          <div class="brochure-spread">
            <button class="brochure-page brochure-left" type="button" aria-label="이전 페이지"><img alt="" draggable="false"><span class="brochure-page-no"></span></button>
            <button class="brochure-page brochure-right" type="button" aria-label="다음 페이지"><img alt="" draggable="false"><span class="brochure-page-no"></span></button>
            <div class="brochure-spine" aria-hidden="true"></div>
          </div>
        </div>
        <div class="brochure-progress" aria-live="polite"></div>
      </section>
    </div>`;

  window.brochure=bookMarkup;

  const setImg=(button,index)=>{
    const img=button.querySelector('img');
    const no=button.querySelector('.brochure-page-no');
    if(index>=0&&index<TOTAL){
      button.hidden=false;
      img.src=PAGES[index];
      img.alt=`가격 안내책자 ${index+1}페이지`;
      no.textContent=String(index+1).padStart(2,'0');
    }else{
      button.hidden=true;
      img.removeAttribute('src');
      img.alt='';
      no.textContent='';
    }
  };

  const fitSpread=state=>{
    const mobile=isMobile();
    state.book.classList.toggle('is-single-page',mobile);
    if(mobile){
      state.spread.style.width='100%';
      state.spread.style.height='100%';
      return;
    }
    const maxW=Math.max(200,state.stage.clientWidth-24);
    const maxH=Math.max(180,state.stage.clientHeight-24);
    const ratio=22/15;
    const width=Math.min(maxW,maxH*ratio);
    state.spread.style.width=`${Math.round(width)}px`;
    state.spread.style.height=`${Math.round(width/ratio)}px`;
  };

  const paint=(state,index)=>{
    const mobile=isMobile();
    if(mobile){
      state.index=clamp(index,0,TOTAL-1);
      setImg(state.left,state.index);
      setImg(state.right,-1);
      state.left.disabled=false;
      state.progress.textContent=`${state.index+1} / ${TOTAL}`;
    }else{
      const start=clamp(index-(index%2),0,TOTAL-2);
      state.index=start;
      setImg(state.left,start);
      setImg(state.right,start+1);
      state.left.disabled=start<=0;
      state.right.disabled=start>=TOTAL-2;
      state.progress.textContent=`${start+1}-${start+2} / ${TOTAL}`;
    }
    fitSpread(state);
  };

  const preloadAround=index=>{
    [-2,-1,1,2].forEach(delta=>{
      const i=index+delta;
      if(i>=0&&i<TOTAL){const img=new Image();img.decoding='async';img.src=PAGES[i]}
    });
  };

  const turn=(state,dir)=>{
    if(state.turning)return;
    const mobile=isMobile();
    const step=mobile?1:2;
    const target=state.index+(dir==='next'?step:-step);
    const max=mobile?TOTAL-1:TOTAL-2;
    if(target<0||target>max)return;
    state.turning=true;
    const sheet=document.createElement('div');
    sheet.className=`brochure-turn-sheet ${dir}${mobile?' single':''}`;
    const front=document.createElement('div');front.className='brochure-turn-face brochure-turn-front';
    const back=document.createElement('div');back.className='brochure-turn-face brochure-turn-back';
    const frontImg=document.createElement('img');const backImg=document.createElement('img');
    frontImg.draggable=false;backImg.draggable=false;front.appendChild(frontImg);back.appendChild(backImg);sheet.append(front,back);

    if(mobile){
      frontImg.src=PAGES[state.index];
      backImg.src=PAGES[target];
    }else if(dir==='next'){
      frontImg.src=PAGES[state.index+1];backImg.src=PAGES[target];setImg(state.right,target+1);
    }else{
      frontImg.src=PAGES[state.index];backImg.src=PAGES[target+1];setImg(state.left,target);
    }

    state.spread.appendChild(sheet);
    requestAnimationFrame(()=>requestAnimationFrame(()=>sheet.classList.add('animate')));
    let finished=false;
    const done=()=>{
      if(finished)return;finished=true;sheet.remove();paint(state,target);preloadAround(target);state.turning=false;
    };
    sheet.addEventListener('animationend',done,{once:true});
    window.setTimeout(done,900);
  };

  function createFullscreen(state){
    const dlg=document.createElement('dialog');
    dlg.className='photo-lightbox brochure-lightbox';
    dlg.innerHTML=`<div class="photo-lightbox-frame brochure-lightbox-frame">
      <button class="photo-lightbox-close" type="button" aria-label="닫기">×</button>
      <button class="photo-lightbox-nav photo-lightbox-prev" type="button" aria-label="이전 페이지">←</button>
      <figure>
        <div class="photo-lightbox-viewport brochure-lightbox-viewport" aria-label="안내책자 확대 보기. 휠 또는 핀치로 확대하고 드래그할 수 있습니다.">
          <div class="brochure-lightbox-pages"><img class="brochure-full-left" alt="" draggable="false"><img class="brochure-full-right" alt="" draggable="false"></div>
        </div>
        <div class="photo-lightbox-help">휠 확대·축소 · 드래그 이동 · 더블클릭 초기화</div>
        <figcaption><span class="photo-lightbox-category">가격 안내책자</span><strong class="photo-lightbox-counter"></strong></figcaption>
        <div class="photo-lightbox-tools" aria-label="안내책자 확대 도구"><button type="button" data-brochure-zoom-out aria-label="축소">−</button><span class="photo-lightbox-zoom">100%</span><button type="button" data-brochure-zoom-in aria-label="확대">+</button><button type="button" data-brochure-zoom-reset aria-label="원래 크기로">RESET</button></div>
      </figure>
      <button class="photo-lightbox-nav photo-lightbox-next" type="button" aria-label="다음 페이지">→</button>
    </div>`;
    document.body.appendChild(dlg);

    const viewport=dlg.querySelector('.brochure-lightbox-viewport');
    const pages=dlg.querySelector('.brochure-lightbox-pages');
    const left=dlg.querySelector('.brochure-full-left');
    const right=dlg.querySelector('.brochure-full-right');
    const counter=dlg.querySelector('.photo-lightbox-counter');
    const zoomLabel=dlg.querySelector('.photo-lightbox-zoom');
    let index=state.index,scale=1,panX=0,panY=0,dragging=false,dragStartX=0,dragStartY=0,dragPanX=0,dragPanY=0;
    const MIN=1,MAX=6;

    const limits=()=>({x:Math.max(0,(pages.clientWidth*scale-viewport.clientWidth)/2),y:Math.max(0,(pages.clientHeight*scale-viewport.clientHeight)/2)});
    const apply=(animate=false)=>{
      const l=limits();panX=clamp(panX,-l.x,l.x);panY=clamp(panY,-l.y,l.y);
      pages.style.transition=animate?'transform .18s ease':'none';
      pages.style.transform=`translate3d(${panX}px,${panY}px,0) scale(${scale})`;
      zoomLabel.textContent=`${Math.round(scale*100)}%`;viewport.classList.toggle('is-zoomed',scale>1.001);
      if(animate)setTimeout(()=>pages.style.transition='none',190);
    };
    const reset=(animate=false)=>{scale=1;panX=0;panY=0;apply(animate)};
    const zoomAt=(x,y,next,animate=false)=>{
      next=clamp(next,MIN,MAX);if(Math.abs(next-scale)<.0001)return;
      const r=viewport.getBoundingClientRect(),px=x-(r.left+r.width/2),py=y-(r.top+r.height/2),ratio=next/scale;
      panX=px-(px-panX)*ratio;panY=py-(py-panY)*ratio;scale=next;apply(animate);
    };
    const zoomCenter=f=>{const r=viewport.getBoundingClientRect();zoomAt(r.left+r.width/2,r.top+r.height/2,scale*f,true)};

    const render=()=>{
      const mobile=isMobile();
      dlg.classList.toggle('is-single-page',mobile);
      if(mobile){
        index=clamp(index,0,TOTAL-1);left.src=PAGES[index];left.alt=`가격 안내책자 ${index+1}페이지`;right.removeAttribute('src');right.hidden=true;counter.textContent=`${index+1} / ${TOTAL}`;
      }else{
        index=clamp(index-(index%2),0,TOTAL-2);left.src=PAGES[index];right.src=PAGES[index+1];left.alt=`가격 안내책자 ${index+1}페이지`;right.alt=`가격 안내책자 ${index+2}페이지`;right.hidden=false;counter.textContent=`${index+1}-${index+2} / ${TOTAL}`;
      }
      reset(false);preloadAround(index);
    };
    const step=delta=>{
      if(scale>1.001)return;
      const amount=isMobile()?1:2,target=index+delta*amount,max=isMobile()?TOTAL-1:TOTAL-2;
      if(target<0||target>max)return;index=target;render();
    };
    const close=()=>{state.index=index;paint(state,index);if(dlg.open)dlg.close()};

    dlg.querySelector('.photo-lightbox-close').addEventListener('click',close);
    dlg.querySelector('.photo-lightbox-prev').addEventListener('click',()=>step(-1));
    dlg.querySelector('.photo-lightbox-next').addEventListener('click',()=>step(1));
    dlg.addEventListener('click',e=>{if(e.target===dlg)close()});
    dlg.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')step(-1);if(e.key==='ArrowRight')step(1);if(e.key==='Escape')close();if(e.key==='0')reset(true);if(e.key==='+'||e.key==='=')zoomCenter(1.28);if(e.key==='-')zoomCenter(1/1.28)});
    dlg.querySelector('[data-brochure-zoom-in]').addEventListener('click',()=>zoomCenter(1.35));
    dlg.querySelector('[data-brochure-zoom-out]').addEventListener('click',()=>zoomCenter(1/1.35));
    dlg.querySelector('[data-brochure-zoom-reset]').addEventListener('click',()=>reset(true));
    viewport.addEventListener('wheel',e=>{e.preventDefault();zoomAt(e.clientX,e.clientY,scale*Math.exp(-e.deltaY*.0015),false)},{passive:false});
    viewport.addEventListener('dblclick',e=>{e.preventDefault();scale>1.01?reset(true):zoomAt(e.clientX,e.clientY,2,true)});
    viewport.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'||scale<=1.001)return;dragging=true;dragStartX=e.clientX;dragStartY=e.clientY;dragPanX=panX;dragPanY=panY;viewport.classList.add('is-dragging');viewport.setPointerCapture?.(e.pointerId);e.preventDefault()});
    viewport.addEventListener('pointermove',e=>{if(!dragging)return;panX=dragPanX+e.clientX-dragStartX;panY=dragPanY+e.clientY-dragStartY;apply(false)});
    const stop=e=>{if(!dragging)return;dragging=false;viewport.classList.remove('is-dragging');if(e?.pointerId!==undefined&&viewport.hasPointerCapture?.(e.pointerId))viewport.releasePointerCapture(e.pointerId)};
    viewport.addEventListener('pointerup',stop);viewport.addEventListener('pointercancel',stop);

    const dist=t=>Math.hypot(t[0].clientX-t[1].clientX,t[0].clientY-t[1].clientY);
    const center=t=>({x:(t[0].clientX+t[1].clientX)/2,y:(t[0].clientY+t[1].clientY)/2});
    let touchStartX=0,touchStartY=0,lastX=0,lastY=0,lastD=0,lastC=null,pinch=false;
    viewport.addEventListener('touchstart',e=>{if(e.touches.length===1){touchStartX=lastX=e.touches[0].clientX;touchStartY=lastY=e.touches[0].clientY}else if(e.touches.length>=2){pinch=true;lastD=dist(e.touches);lastC=center(e.touches)}},{passive:true});
    viewport.addEventListener('touchmove',e=>{
      if(e.touches.length>=2){e.preventDefault();const d=dist(e.touches),c=center(e.touches);if(lastD){zoomAt(c.x,c.y,scale*(d/lastD),false);if(lastC){panX+=c.x-lastC.x;panY+=c.y-lastC.y;apply(false)}}lastD=d;lastC=c;return}
      if(e.touches.length===1&&scale>1.001){e.preventDefault();const t=e.touches[0];panX+=t.clientX-lastX;panY+=t.clientY-lastY;lastX=t.clientX;lastY=t.clientY;apply(false)}
    },{passive:false});
    viewport.addEventListener('touchend',e=>{
      if(e.touches.length)return;
      const t=e.changedTouches[0];if(t&&!pinch&&scale<=1.001){const dx=t.clientX-touchStartX,dy=t.clientY-touchStartY;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.2)step(dx>0?-1:1)}
      lastD=0;lastC=null;pinch=false;
    },{passive:true});

    state.fullscreen={dlg,render,open:()=>{index=state.index;render();dlg.showModal()}};
  }

  const initBook=book=>{
    if(bookStates.has(book))return;
    const state={book,stage:book.querySelector('.brochure-stage'),spread:book.querySelector('.brochure-spread'),left:book.querySelector('.brochure-left'),right:book.querySelector('.brochure-right'),progress:book.querySelector('.brochure-progress'),index:0,turning:false,fullscreen:null};
    if(!state.stage||!state.spread||!state.left||!state.right)return;
    bookStates.set(book,state);

    state.left.addEventListener('click',e=>{if(isMobile()){const r=state.left.getBoundingClientRect();turn(state,e.clientX<r.left+r.width/2?'prev':'next')}else turn(state,'prev')});
    state.right.addEventListener('click',()=>turn(state,'next'));
    book.querySelector('.brochure-expand')?.addEventListener('click',e=>{e.stopPropagation();if(!state.fullscreen)createFullscreen(state);state.fullscreen.open()});

    let sx=0,sy=0;
    state.stage.addEventListener('touchstart',e=>{if(e.touches.length===1){sx=e.touches[0].clientX;sy=e.touches[0].clientY}},{passive:true});
    state.stage.addEventListener('touchend',e=>{if(!isMobile())return;const t=e.changedTouches[0];if(!t)return;const dx=t.clientX-sx,dy=t.clientY-sy;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.2)turn(state,dx>0?'prev':'next')},{passive:true});

    if('ResizeObserver' in window)new ResizeObserver(()=>fitSpread(state)).observe(state.stage);
    paint(state,0);preloadAround(0);
  };

  const scan=()=>document.querySelectorAll('.brochure-book').forEach(initBook);
  new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});scan();

  document.addEventListener('keydown',e=>{
    const modal=document.getElementById('designModal');if(!modal?.open)return;
    const book=modal.querySelector('.brochure-book'),state=book&&bookStates.get(book);if(!state||state.fullscreen?.dlg?.open)return;
    if(e.key==='ArrowLeft'){e.preventDefault();turn(state,'prev')}if(e.key==='ArrowRight'){e.preventDefault();turn(state,'next')}
  });
})();
