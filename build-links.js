(()=>{
  const projects={
    '체험단 매니저':{
      href:'https://cheheomdan-manager.com/',
      domain:'cheheomdan-manager.com',
      eyebrow:'LIVE PRODUCT',
      label:'서비스 바로가기'
    },
    '사이버 말랑이':{
      href:'https://nam5an.github.io/malang/',
      domain:'nam5an.github.io/malang',
      eyebrow:'PLAYABLE WEB',
      label:'프로젝트 바로가기'
    }
  };

  const cleanBuildLabels=()=>{
    document.querySelectorAll('#buildModal .build-case .meta').forEach(node=>node.remove());
  };

  const addLinks=()=>{
    cleanBuildLabels();
    document.querySelectorAll('#buildModal .build-case').forEach(card=>{
      if(card.querySelector('.project-live-link')) return;
      const title=card.querySelector('h3')?.textContent.trim();
      const item=projects[title];
      if(!item) return;
      const body=card.querySelector(':scope > div:last-child') || card;
      const link=document.createElement('a');
      link.className='project-live-link';
      link.href=item.href;
      link.target='_blank';
      link.rel='noopener noreferrer';
      link.setAttribute('aria-label',`${title} ${item.label}`);
      link.innerHTML=`<span class="project-live-copy"><small>${item.eyebrow}</small><strong>${item.label}</strong><em>${item.domain}</em></span><span class="project-live-arrow" aria-hidden="true">↗</span>`;
      body.appendChild(link);
    });
  };

  addLinks();
  document.addEventListener('click',e=>{
    if(e.target.closest('[data-open="buildModal"]')) requestAnimationFrame(addLinks);
  });
})();
