(()=>{
  const bar=document.querySelector('.bar');
  const home=document.querySelector('.home');
  const resume=document.querySelector('#resumeView');
  const tabs=document.querySelector('.mode-tabs');
  if(!bar||!home||!resume||!tabs)return;

  const BIRTH_DATE={year:2000,month:8,day:21};
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
  const calculateCareerMonths=(root,now=new Date())=>{
    const currentMonth=now.getFullYear()*12+now.getMonth();
    const intervals=[...root.querySelectorAll('.career-date')].flatMap(node=>{
      const parts=node.textContent.trim().split(/\s+[—–-]\s+/);
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
    if(node)node.textContent=`만 ${getInternationalAge()}세`;
  };
  const refreshCareer=()=>{
    const summary=calculateCareerMonths(resume);
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

  const setMode=(mode,{resetResumeScroll=false}={})=>{
    const next=mode==='portfolio'?'portfolio':'resume';
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

  tabs.addEventListener('click',e=>{
    const btn=e.target.closest('[data-mode]');
    if(btn)setMode(btn.dataset.mode,{resetResumeScroll:btn.dataset.mode==='resume'});
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

  setMode(document.body.dataset.view||'resume');
})();