(()=>{
  const TOTAL=18;
  const assetBase=typeof window.__portfolioAssetBase==='string'?window.__portfolioAssetBase:'';
  const pageUrl=index=>assetBase
    ? `${assetBase}assets/brochure/page-${String(index+1).padStart(2,'0')}.webp`
    : `./assets/brochure/page-${String(index+1).padStart(2,'0')}.webp`;
  const PAGES=Array.from({length:TOTAL},(_,i)=>pageUrl(i));
  const bookStates=new WeakMap();

  const bookMarkup=()=>`
    <div class="embedded-doc brochure-embedded">
      <aside class="embedded-doc-note brochure-note">
        <span>INDESIGN · 18 PAGES</span>
        <h3>맑은석피부과 가격 안내책자</h3>
        <p>템플릿 없이 Adobe InDesign으로 제작한 18페이지 편집디자인 작업입니다. 페이지의 왼쪽·오른쪽을 클릭해 실제 책처럼 넘겨볼 수 있습니다.</p>
      </aside>
      <section class="brochure-book" aria-label="가격 안내책자 18페이지 책 보기">
        <div class="brochure-stage">
          <div class="brochure-spread">
            <button class="brochure-page brochure-left" type="button" aria-label="이전 페이지">
              <img alt="" draggable="false">
              <span class="brochure-page-no"></span>
            </button>
            <button class="brochure-page brochure-right" type="button" aria-label="다음 페이지">
              <img alt="" draggable="false">
              <span class="brochure-page-no"></span>
            </button>
            <div class="brochure-spine" aria-hidden="true"></div>
          </div>
        </div>
        <div class="brochure-progress" aria-live="polite"></div>
      </section>
    </div>`;

  /* site-v2-legacy.js calls brochure() whenever the brochure tab is selected. */
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
    const maxW=Math.max(200,state.stage.clientWidth-24);
    const maxH=Math.max(180,state.stage.clientHeight-24);
    const ratio=22/15;
    const width=Math.min(maxW,maxH*ratio);
    state.spread.style.width=`${Math.round(width)}px`;
    state.spread.style.height=`${Math.round(width/ratio)}px`;
  };

  const paint=(state,start)=>{
    state.start=Math.max(0,Math.min(TOTAL-2,start));
    setImg(state.left,state.start);
    setImg(state.right,state.start+1);
    state.left.disabled=state.start<=0;
    state.right.disabled=state.start>=TOTAL-2;
    const a=state.start+1,b=Math.min(TOTAL,state.start+2);
    state.progress.textContent=`${a}-${b} / ${TOTAL}`;
    fitSpread(state);
  };

  const turn=(state,dir)=>{
    if(state.turning)return;
    const target=state.start+(dir==='next'?2:-2);
    if(target<0||target>TOTAL-2)return;
    state.turning=true;
    state.book.classList.add('is-turning',dir==='next'?'turning-next':'turning-prev');

    const sheet=document.createElement('div');
    sheet.className=`brochure-turn-sheet ${dir}`;
    const front=document.createElement('div');
    front.className='brochure-turn-face brochure-turn-front';
    const back=document.createElement('div');
    back.className='brochure-turn-face brochure-turn-back';
    const frontImg=document.createElement('img');
    const backImg=document.createElement('img');
    frontImg.draggable=false;
    backImg.draggable=false;
    front.appendChild(frontImg);
    back.appendChild(backImg);
    sheet.append(front,back);

    if(dir==='next'){
      frontImg.src=PAGES[state.start+1];
      backImg.src=PAGES[target];
      setImg(state.right,target+1);
    }else{
      frontImg.src=PAGES[state.start];
      backImg.src=PAGES[target+1];
      setImg(state.left,target);
    }

    state.spread.appendChild(sheet);
    requestAnimationFrame(()=>requestAnimationFrame(()=>sheet.classList.add('animate')));

    let finished=false;
    const done=()=>{
      if(finished)return;
      finished=true;
      sheet.remove();
      paint(state,target);
      state.book.classList.remove('is-turning','turning-next','turning-prev');
      state.turning=false;
    };
    sheet.addEventListener('animationend',done,{once:true});
    window.setTimeout(done,900);
  };

  const initBook=book=>{
    if(bookStates.has(book))return;
    const state={
      book,
      stage:book.querySelector('.brochure-stage'),
      spread:book.querySelector('.brochure-spread'),
      left:book.querySelector('.brochure-left'),
      right:book.querySelector('.brochure-right'),
      progress:book.querySelector('.brochure-progress'),
      start:0,
      turning:false
    };
    if(!state.stage||!state.spread||!state.left||!state.right)return;
    bookStates.set(book,state);
    state.left.addEventListener('click',()=>turn(state,'prev'));
    state.right.addEventListener('click',()=>turn(state,'next'));
    if('ResizeObserver' in window)new ResizeObserver(()=>fitSpread(state)).observe(state.stage);

    state.left.querySelector('img').addEventListener('error',()=>{
      if(book.querySelector('.brochure-load-error'))return;
      const message=document.createElement('div');
      message.className='brochure-load-error';
      message.textContent='안내책자 페이지를 불러오는 중입니다.';
      state.stage.appendChild(message);
      window.setTimeout(()=>message.remove(),1600);
    });

    paint(state,0);
    [2,3,4,5].forEach(i=>{const img=new Image();img.decoding='async';img.src=PAGES[i]});
  };

  const scan=()=>document.querySelectorAll('.brochure-book').forEach(initBook);
  new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});
  scan();

  document.addEventListener('keydown',e=>{
    const modal=document.getElementById('designModal');
    if(!modal?.open)return;
    const book=modal.querySelector('.brochure-book');
    const state=book&&bookStates.get(book);
    if(!state)return;
    if(e.key==='ArrowLeft'){e.preventDefault();turn(state,'prev')}
    if(e.key==='ArrowRight'){e.preventDefault();turn(state,'next')}
  });
})();
