(()=>{
  const bar=document.querySelector('.bar');
  const home=document.querySelector('.home');
  const resume=document.querySelector('#resumeView');
  const tabs=document.querySelector('.mode-tabs');
  if(!bar||!home||!resume||!tabs)return;

  const BIRTH_DATE={year:2000,month:8,day:21};
  const getCurrentAge=()=>new Date().getFullYear()-BIRTH_DATE.year+1;
  const getInternationalAge=()=>{
    const now=new Date();
    let age=now.getFullYear()-BIRTH_DATE.year;
    const birthdayPassed=(now.getMonth()+1>BIRTH_DATE.month)||((now.getMonth()+1===BIRTH_DATE.month)&&now.getDate()>=BIRTH_DATE.day);
    if(!birthdayPassed)age-=1;
    return age;
  };

  const parseMonthIndex=(value,now)=>{
    const normalized=String(value).trim().toUpperCase();
    if(normalized==='NOW')return now.getFullYear()*12+now.getMonth();
    const match=normalized.match(/^(\d{4})\.(0[1-9]|1[0-2])$/);
    return match?Number(match[1])*12+Number(match[2])-1:null;
  };
  const formatCareerMonths=months=>`${Math.floor(months/12)}년 ${months%12}개월`;
  const getCareerRange=node=>node.dataset.range||String(node.childNodes[0]?.nodeValue||node.textContent||'').trim();

  const calculateCareerMonths=(root,now=new Date())=>{
    const currentMonth=now.getFullYear()*12+now.getMonth();
    const intervals=[...root.querySelectorAll('.career-date')].flatMap(node=>{
      const parts=getCareerRange(node).split(/\s+[—–-]\s+/);
      if(parts.length!==2)return[];
      const start=parseMonthIndex(parts[0],now);
      const parsedEnd=parseMonthIndex(parts[1],now);
      if(start===null||parsedEnd===null||start>currentMonth)return[];
      const end=Math.min(parsedEnd,currentMonth);
      return end>=start?[{start,end}]:[];
    });
    const total=intervals.reduce((sum,{start,end})=>sum+(end-start+1),0);
    const merged=[];
    [...intervals].sort((a,b)=>a.start-b.start||a.end-b.end).forEach(interval=>{
      const last=merged.at(-1);
      if(!last||interval.start>last.end+1)merged.push({...interval});
      else last.end=Math.max(last.end,interval.end);
    });
    const unique=merged.reduce((sum,{start,end})=>sum+(end-start+1),0);
    return{total,unique,count:intervals.length};
  };

  const refreshAge=()=>{
    const node=resume.querySelector('#resumeAge');
    if(node)node.textContent=`${getCurrentAge()}세 (만 ${getInternationalAge()}세)`;
  };

  const refreshCareerTenures=(now=new Date())=>{
    const currentMonth=now.getFullYear()*12+now.getMonth();
    resume.querySelectorAll('.career-date').forEach(node=>{
      const range=getCareerRange(node);
      if(!range)return;
      node.dataset.range=range;
      const parts=range.split(/\s+[—–-]\s+/);
      if(parts.length!==2)return;
      const start=parseMonthIndex(parts[0],now);
      const parsedEnd=parseMonthIndex(parts[1],now);
      if(start===null||parsedEnd===null)return;
      const isCurrent=String(parts[1]).trim().toUpperCase()==='NOW';
      const end=Math.min(parsedEnd,currentMonth);
      if(end<start)return;
      const months=end-start+1;
      let tenure=node.querySelector('.career-tenure');
      if(!tenure){
        tenure=document.createElement('small');
        tenure.className='career-tenure';
        node.appendChild(tenure);
      }
      tenure.classList.toggle('is-current',isCurrent);
      tenure.textContent=`${formatCareerMonths(months)}${isCurrent?' · 재직중':''}`;
    });
  };

  const refreshCareer=()=>{
    const now=new Date();
    refreshCareerTenures(now);
    const summary=calculateCareerMonths(resume,now);
    const totalText=formatCareerMonths(summary.total);
    const uniqueText=formatCareerMonths(summary.unique);
    const totalNode=resume.querySelector('#careerTotal');
    if(totalNode){
      totalNode.innerHTML=`<span>총 경력</span> <strong>${totalText}</strong> <small>(중복기간 제외 ${uniqueText})</small>`;
      totalNode.setAttribute('aria-label',`총 경력 ${totalText}, 중복기간 제외 ${uniqueText}`);
    }
    const netNode=resume.querySelector('#resumeNetCareer');
    if(netNode)netNode.textContent=uniqueText;
    const countNode=resume.querySelector('#resumeCareerCount');
    if(countNode)countNode.textContent=String(summary.count).padStart(2,'0');
  };

  let motionTimer=0;
  const playModeMotion=(from,to)=>{
    if(from===to)return;
    clearTimeout(motionTimer);
    tabs.classList.remove('is-moving-left','is-moving-right');
    void tabs.offsetWidth;
    tabs.classList.add(to==='portfolio'?'is-moving-right':'is-moving-left');
    motionTimer=window.setTimeout(()=>tabs.classList.remove('is-moving-left','is-moving-right'),540);
  };

  const applyMode=(next,{resetResumeScroll=false}={})=>{
    document.body.dataset.view=next;
    tabs.querySelectorAll('.mode-tab').forEach(btn=>{
      const active=btn.dataset.mode===next;
      btn.classList.toggle('is-active',active);
      btn.setAttribute('aria-pressed',active?'true':'false');
    });
    if(next==='resume'){
      refreshAge();
      refreshCareer();
      if(resetResumeScroll)resume.querySelector('.resume-scroll')?.scrollTo({top:0});
    }
  };

  let activeViewTransition=null;
  let fallbackTimer=0;
  const playPanelMotion=(from,to,swap)=>{
    const root=document.documentElement;
    const reduceMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const ready=root.classList.contains('portfolio-ready');
    if(from===to||reduceMotion||!ready){
      swap();
      return;
    }

    const directionClass=to==='portfolio'?'mode-swipe-to-portfolio':'mode-swipe-to-resume';
    root.classList.remove('mode-swipe-to-portfolio','mode-swipe-to-resume');
    root.classList.add(directionClass,'mode-panel-switching');

    if(typeof document.startViewTransition==='function'){
      activeViewTransition?.skipTransition?.();
      const transition=document.startViewTransition(()=>swap());
      activeViewTransition=transition;
      transition.finished.finally(()=>{
        if(activeViewTransition!==transition)return;
        activeViewTransition=null;
        root.classList.remove(directionClass,'mode-panel-switching');
      });
      return;
    }

    swap();
    const incoming=to==='portfolio'?home:resume;
    const fallbackClass=to==='portfolio'?'mode-panel-enter-right':'mode-panel-enter-left';
    incoming.classList.remove('mode-panel-enter-right','mode-panel-enter-left');
    void incoming.offsetWidth;
    incoming.classList.add(fallbackClass);
    clearTimeout(fallbackTimer);
    fallbackTimer=window.setTimeout(()=>{
      incoming.classList.remove(fallbackClass);
      root.classList.remove(directionClass,'mode-panel-switching');
    },540);
  };

  const setMode=(mode,{resetResumeScroll=false}={})=>{
    const next=mode==='portfolio'?'portfolio':'resume';
    const current=document.body.dataset.view==='portfolio'?'portfolio':'resume';
    playModeMotion(current,next);
    playPanelMotion(current,next,()=>applyMode(next,{resetResumeScroll}));
  };

  window.__portfolioSetMode=setMode;

  /* Native scrollbar is hidden; this lightweight indicator only appears during actual scrolling. */
  const setupResumeScrollIndicator=()=>{
    const pane=resume.querySelector('.resume-career');
    const scroller=pane?.querySelector('.resume-scroll');
    if(!pane||!scroller)return;

    let indicator=pane.querySelector('.resume-scroll-indicator');
    if(!indicator){
      indicator=document.createElement('span');
      indicator.className='resume-scroll-indicator';
      indicator.setAttribute('aria-hidden','true');
      pane.appendChild(indicator);
    }

    let hideTimer=0;
    let raf=0;
    const TRACK_PAD=8;
    const MIN_THUMB=34;

    const update=()=>{
      raf=0;
      const viewport=scroller.clientHeight;
      const content=scroller.scrollHeight;
      if(viewport<=0||content<=viewport+1){
        indicator.classList.remove('is-visible');
        return;
      }
      const track=Math.max(0,viewport-TRACK_PAD*2);
      const thumb=Math.max(MIN_THUMB,track*(viewport/content));
      const maxScroll=Math.max(1,content-viewport);
      const maxTravel=Math.max(0,track-thumb);
      const progress=Math.min(1,Math.max(0,scroller.scrollTop/maxScroll));
      indicator.style.height=`${thumb}px`;
      indicator.style.top=`${TRACK_PAD+maxTravel*progress}px`;
    };

    const scheduleUpdate=()=>{
      if(!raf)raf=requestAnimationFrame(update);
    };
    const showBriefly=()=>{
      scheduleUpdate();
      indicator.classList.add('is-visible');
      clearTimeout(hideTimer);
      hideTimer=window.setTimeout(()=>indicator.classList.remove('is-visible'),650);
    };

    scroller.addEventListener('scroll',showBriefly,{passive:true});
    scroller.addEventListener('wheel',showBriefly,{passive:true});
    scroller.addEventListener('touchmove',showBriefly,{passive:true});
    window.addEventListener('resize',scheduleUpdate,{passive:true});
    if('ResizeObserver' in window)new ResizeObserver(scheduleUpdate).observe(scroller);
    scheduleUpdate();
  };

  /* The whole switch acts as one toggle: clicking either label or the gap flips modes. */
  tabs.addEventListener('click',()=>{
    if(document.documentElement.classList.contains('mode-panel-switching'))return;
    const current=document.body.dataset.view==='portfolio'?'portfolio':'resume';
    const next=current==='portfolio'?'resume':'portfolio';
    setMode(next,{resetResumeScroll:next==='resume'});
  });
  bar.querySelector('.wordmark')?.addEventListener('click',e=>{
    e.preventDefault();
    setMode('resume');
  });
  document.addEventListener('visibilitychange',()=>{
    if(!document.hidden&&document.body.dataset.view==='resume'){
      refreshAge();
      refreshCareer();
    }
  });

  setupResumeScrollIndicator();
  setMode(document.body.dataset.view||'resume');
})();