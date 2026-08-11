(()=>{
  const home=document.querySelector('.home');
  const resume=document.querySelector('.resume-home');
  const bar=document.querySelector('.bar');

  // Portfolio hero: keep the main motto/content only.
  home?.querySelector('.hero-topline')?.remove();
  home?.querySelector('.hero-kicker')?.remove();

  // Top bar: keep only the name on the left and move the mode switch to the right.
  document.querySelector('.wordmark-role')?.remove();
  document.querySelector('.availability')?.remove();
  const modeTabs=document.querySelector('.mode-tabs');
  const barRight=bar?.querySelector('.bar-right');
  if(modeTabs&&barRight)barRight.appendChild(modeTabs);

  // Resume left pane: remove the large name/title block so a horizontal header image can be added later.
  if(resume){
    const profile=resume.querySelector('.resume-profile');
    profile?.querySelector(':scope > div > .resume-label')?.remove();
    profile?.querySelector(':scope > div > .resume-role')?.remove();
    profile?.querySelector(':scope > div > .resume-name')?.remove();

    // Move the live career total into the first "경력" section heading.
    const careerPane=resume.querySelector('.resume-career');
    const careerHead=careerPane?.querySelector('.resume-career-head');
    const careerTotal=careerHead?.querySelector('#careerTotal');
    const firstSectionTitle=careerPane?.querySelector('.resume-section .resume-section-title');
    if(careerTotal&&firstSectionTitle){
      firstSectionTitle.classList.add('career-heading-row');
      firstSectionTitle.appendChild(careerTotal);
    }
    careerHead?.remove();
  }

  // Bottom bar is no longer part of the composition.
  document.querySelector('.foot')?.remove();
})();
