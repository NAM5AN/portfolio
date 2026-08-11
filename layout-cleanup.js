(()=>{
  const home=document.querySelector('.home');
  const resume=document.querySelector('.resume-home');

  // Portfolio hero: keep the main motto/content only.
  home?.querySelector('.hero-topline')?.remove();
  home?.querySelector('.hero-kicker')?.remove();

  // Top bar: remove the right-side capability label.
  document.querySelector('.availability')?.remove();

  // Resume left pane: keep the name, remove the red kicker and role line.
  if(resume){
    const profile=resume.querySelector('.resume-profile');
    profile?.querySelector(':scope > div > .resume-label')?.remove();
    profile?.querySelector(':scope > div > .resume-role')?.remove();

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
