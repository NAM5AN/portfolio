(()=>{
  if(document.getElementById('resume-profile-lightbox-style'))return;

  const style=document.createElement('style');
  style.id='resume-profile-lightbox-style';
  style.textContent=`
    .resume-profile-photo.is-loaded{
      cursor:zoom-in;
    }
    .resume-profile-photo.is-loaded:focus-visible{
      outline:2px solid var(--accent,#d43b25);
      outline-offset:4px;
    }
    .resume-profile-lightbox{
      width:100vw;
      max-width:none;
      height:100dvh;
      max-height:none;
      margin:0;
      padding:0;
      border:0;
      background:transparent;
      overflow:hidden;
    }
    .resume-profile-lightbox::backdrop{
      background:rgba(10,11,12,.84);
      backdrop-filter:blur(8px);
    }
    .resume-profile-lightbox-inner{
      position:fixed;
      inset:0;
      display:grid;
      place-items:center;
      padding:clamp(28px,5vw,72px);
    }
    .resume-profile-lightbox-image{
      display:block;
      width:auto;
      height:auto;
      max-width:min(92vw,960px);
      max-height:86dvh;
      object-fit:contain;
      object-position:center;
      background:#f7f7f7;
      box-shadow:0 20px 70px rgba(0,0,0,.36);
    }
    .resume-profile-lightbox-close{
      position:fixed;
      z-index:2;
      top:max(18px,env(safe-area-inset-top));
      right:max(18px,env(safe-area-inset-right));
      width:44px;
      height:44px;
      display:grid;
      place-items:center;
      padding:0;
      border:1px solid rgba(255,255,255,.4);
      border-radius:50%;
      background:rgba(0,0,0,.34);
      color:#fff;
      font-size:28px;
      line-height:1;
      cursor:pointer;
    }
    @media(max-width:680px){
      .resume-profile-lightbox-inner{padding:58px 16px 24px}
      .resume-profile-lightbox-image{max-width:calc(100vw - 32px);max-height:82dvh}
      .resume-profile-lightbox-close{width:40px;height:40px;font-size:25px}
    }
  `;
  document.head.appendChild(style);

  const dialog=document.createElement('dialog');
  dialog.className='resume-profile-lightbox';
  dialog.setAttribute('aria-label','프로필 사진 크게 보기');
  dialog.innerHTML=`<div class="resume-profile-lightbox-inner"><img class="resume-profile-lightbox-image" alt="김수정 프로필 사진"><button class="resume-profile-lightbox-close" type="button" aria-label="닫기">×</button></div>`;
  document.body.appendChild(dialog);

  const inner=dialog.querySelector('.resume-profile-lightbox-inner');
  const image=dialog.querySelector('.resume-profile-lightbox-image');
  const close=dialog.querySelector('.resume-profile-lightbox-close');

  const openProfile=profile=>{
    if(!profile?.classList.contains('is-loaded'))return;
    image.src=profile.currentSrc||profile.src;
    image.alt=profile.alt||'김수정 프로필 사진';
    if(!dialog.open)dialog.showModal();
  };

  const prepareProfile=profile=>{
    if(!profile||profile.dataset.lightboxReady==='true')return;
    profile.dataset.lightboxReady='true';
    profile.tabIndex=0;
    profile.setAttribute('role','button');
    profile.setAttribute('aria-label','프로필 사진 크게 보기');
    profile.addEventListener('keydown',event=>{
      if(event.key!=='Enter'&&event.key!==' ')return;
      event.preventDefault();
      openProfile(profile);
    });
  };

  const prepareAll=()=>document.querySelectorAll('.resume-profile-photo').forEach(prepareProfile);
  prepareAll();

  const observer=new MutationObserver(prepareAll);
  observer.observe(document.body,{childList:true,subtree:true});

  document.addEventListener('click',event=>{
    const profile=event.target.closest?.('.resume-profile-photo');
    if(profile)openProfile(profile);
  });
  close.addEventListener('click',()=>dialog.close());
  inner.addEventListener('click',event=>{
    if(event.target===inner)dialog.close();
  });
})();
