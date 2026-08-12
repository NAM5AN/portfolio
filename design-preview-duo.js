(()=>{
  const preview=document.querySelector('.index-preview');
  const baseImg=document.getElementById('homePreview');
  const caption=document.getElementById('previewCaption');
  const rows=[...document.querySelectorAll('.work-row[data-preview]')];
  if(!preview||!baseImg||!caption||!rows.length)return;

  const duo=document.createElement('div');
  duo.className='design-preview-duo';
  duo.hidden=true;
  duo.innerHTML=`
    <img src="https://drive.google.com/thumbnail?id=1IMS882egUEvxo32byMvxnYUVQnDglh0x&sz=w1400" alt="고주파 리프팅 디자인">
    <img src="https://drive.google.com/thumbnail?id=1SvFvq5mPlbk2Oe5BR-gupfrxJu80-fmM&sz=w1400" alt="설날 휴진 디자인">`;
  preview.insertBefore(duo,preview.querySelector('.preview-shade'));

  const showDuo=()=>{
    duo.hidden=false;
    baseImg.style.visibility='hidden';
    caption.textContent='DESIGN / HEALTHCARE';
  };
  const hideDuo=()=>{
    duo.hidden=true;
    baseImg.style.visibility='visible';
  };

  rows.forEach(row=>{
    const sync=()=>row.dataset.preview==='design'?showDuo():hideDuo();
    row.addEventListener('pointerenter',sync);
    row.addEventListener('focus',sync);
    row.addEventListener('click',sync);
  });

  new MutationObserver(()=>{
    const active=document.querySelector('.work-row.active[data-preview]');
    if(active?.dataset.preview==='design')showDuo();
    else hideDuo();
  }).observe(document.querySelector('.work-menu'),{subtree:true,attributes:true,attributeFilter:['class']});

  [
    'https://drive.google.com/thumbnail?id=1IMS882egUEvxo32byMvxnYUVQnDglh0x&sz=w1400',
    'https://drive.google.com/thumbnail?id=1SvFvq5mPlbk2Oe5BR-gupfrxJu80-fmM&sz=w1400'
  ].forEach(src=>{const img=new Image();img.decoding='async';img.src=src});
})();
