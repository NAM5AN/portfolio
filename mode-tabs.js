(()=>{
  const css=document.createElement('link');css.rel='stylesheet';css.href='./mode-tabs.css?v=20260811j';document.head.appendChild(css);
  const bar=document.querySelector('.bar');
  const home=document.querySelector('.home');
  if(!bar||!home)return;

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
      if(parts.length!==2)return [];
      const start=parseMonthIndex(parts[0],now);
      const parsedEnd=parseMonthIndex(parts[1],now);
      if(start===null||parsedEnd===null||start>currentMonth)return [];
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

  const tabs=document.createElement('nav');
  tabs.className='mode-tabs';tabs.setAttribute('aria-label','보기 모드');
  tabs.innerHTML='<button class="mode-tab is-active" type="button" data-mode="resume" aria-pressed="true">이력서</button><button class="mode-tab" type="button" data-mode="portfolio" aria-pressed="false">포트폴리오</button>';
  const right=bar.querySelector('.bar-right');
  bar.insertBefore(tabs,right||null);

  const wordmark=bar.querySelector('.wordmark');
  if(wordmark){wordmark.removeAttribute('data-open');wordmark.addEventListener('click',e=>{e.preventDefault();setMode('resume')})}
  const quiet=bar.querySelector('.quiet-btn');if(quiet)quiet.style.display='none';

  const motto=home.querySelector('.hero-copy h1');
  if(motto){
    motto.classList.add('hero-motto');
    motto.innerHTML='<span class="motto-line">시작은 <em>탐구</em>,</span> <span class="motto-phrase">과정은 <em>실행력</em>,</span> <span class="motto-phrase">완성은 <em>책임감</em>이라는</span> <span class="motto-line">좌우명으로 살고 있습니다.</span>';
  }

  const resume=document.createElement('main');
  resume.className='resume-home';resume.id='resumeView';
  resume.innerHTML=`
    <section class="resume-profile" aria-labelledby="resumeTitle" tabindex="0">
      <div>
        <span class="resume-label">Resume · Updated 2026.08.11</span>
        <h1 class="resume-name" id="resumeTitle">김수정</h1>
        <p class="resume-role">Content Producer</p>
        <p class="resume-intro">영상 제작을 중심으로 촬영, 편집, 사진, 디자인 실무를 이어왔습니다. 공공기관·대학 온라인 강의, 웨딩, 유튜브 채널, 인터넷 언론사, 병원 홍보물까지 서로 다른 제작 환경에서 현장과 후반작업을 함께 경험했습니다.</p>
        <div class="resume-contact">
          <div><small>LOCATION</small><strong>경기 부천 · 서울 전체 · 재택</strong></div>
          <div><small>CONTACT</small><strong>010-9168-2854</strong></div>
          <div><small>BIRTH</small><strong>2000.08.21</strong></div>
          <div><small>AGE</small><strong id="resumeAge">만 ${getInternationalAge()}세</strong></div>
        </div>
        <div class="resume-stats">
          <div class="resume-stat"><strong id="resumeNetCareer">-</strong><span>중복기간 제외 경력</span></div>
          <div class="resume-stat"><strong id="resumeCareerCount">-</strong><span>기재 경력</span></div>
          <div class="resume-stat"><strong>02</strong><span>자격증</span></div>
          <div class="resume-stat"><strong>R6 II</strong><span>개인 촬영 장비</span></div>
        </div>
      </div>
      <div class="resume-profile-bottom">
        <div class="resume-skills">
          <h3>Tools & skills</h3>
          <div class="skill-cloud"><span>Premiere Pro</span><span>Photoshop</span><span>Lightroom</span><span>After Effects</span><span>영상 촬영</span><span>사진 촬영</span><span>영상 편집</span><span>사진 편집</span><span>DSLR</span><span>AI</span><span>ChatGPT</span></div>
          <p class="resume-gear">개인 장비 · Canon R6 Mark II · RF 24–105mm · 영상용 삼각대</p>
        </div>
      </div>
    </section>
    <section class="resume-career" aria-label="이력서 상세">
      <header class="resume-career-head"><div><span class="resume-label">Career record</span><h2>Experience</h2></div><p class="career-total" id="careerTotal" aria-live="polite"></p></header>
      <div class="resume-scroll">
        <section class="resume-section">
          <div class="resume-section-title"><span>01</span><h3>경력</h3></div>
          <div class="career-list">
            <article class="career-row"><div class="career-date">2026.03 — NOW</div><div class="career-main"><h4>페리앤로즈</h4><p class="career-role">공공기관·대학 온라인 강의 제작</p><p>나라장터 입찰 기반 프로젝트의 제안자료 디자인 보조, 촬영 준비·장비 세팅·현장 운영, Photoshop 자막·레이아웃·정보 화면 제작, Premiere 컷 편집, After Effects 자막 애니메이션·모션그래픽 작업.</p></div></article>
            <article class="career-row"><div class="career-date">2025.05 — NOW</div><div class="career-main"><h4>블리어스</h4><p class="career-role">웨딩 영상</p><p>결혼식 현장 영상촬영 메인 작가.</p></div></article>
            <article class="career-row"><div class="career-date">2025.01 — 2025.12</div><div class="career-main"><h4>젊은부자들TV</h4><p class="career-role">유튜브 PD · 인스타 릴스</p><p>젊은부자들TV, 주식아티스트, 법학자훈훈이 유튜브 채널 PD 및 베이커리 카페·다이닝 파티 홍보용 인스타 릴스 제작.</p></div></article>
            <article class="career-row"><div class="career-date">2024.04 — 2024.09</div><div class="career-main"><h4>모션픽쳐</h4><p class="career-role">웨딩 사진</p><p>웨딩 본식 서브스냅.</p></div></article>
            <article class="career-row"><div class="career-date">2023.07 — 2026.03</div><div class="career-main"><h4>맑은석피부과</h4><p class="career-role">병원 콘텐츠 · 디자인</p><p>블로그 포스팅, 원내 홍보용 PPT 제작, Photoshop을 활용한 원내 공지 이미지 제작.</p></div></article>
            <article class="career-row"><div class="career-date">2021.12 — 2023.06</div><div class="career-main"><h4>nbn내외뉴스통신</h4><p class="career-role">영상 제작</p><p>뉴스기사 영상화 및 영상 제작 담당.</p></div></article>
            <article class="career-row"><div class="career-date">2021.10 — 2022.01</div><div class="career-main"><h4>대치몬스터Live</h4><p class="career-role">강의 편집</p><p>온라인 강의 영상 편집.</p></div></article>
            <article class="career-row"><div class="career-date">2020.06 — 2021.02</div><div class="career-main"><h4>용감한 컴퍼니</h4><p class="career-role">강의 촬영</p><p>강의 촬영.</p></div></article>
            <article class="career-row"><div class="career-date">2020.05 — 2021.07</div><div class="career-main"><h4>이젠미디어</h4><p class="career-role">웨딩 영상</p><p>결혼식 현장 영상촬영 메인 작가.</p></div></article>
            <article class="career-row"><div class="career-date">2019.04 — 2020.04</div><div class="career-main"><h4>메가스터디 김영 편입학원</h4><p class="career-role">강의 촬영</p><p>강의 촬영.</p></div></article>
          </div>
        </section>
        <section class="resume-section">
          <div class="resume-section-title"><span>02</span><h3>학력 · 자격</h3></div>
          <div class="resume-duo">
            <div class="resume-mini"><small>EDUCATION · 2019—2024</small><strong>학점은행제 백석대학교 평생교육원</strong><p>디지털아트 · 수료</p></div>
            <div class="resume-mini"><small>EDUCATION · 2019—2023</small><strong>백석예술대학교</strong><p>영상학부</p></div>
            <div class="resume-mini"><small>CERTIFICATE · 2024</small><strong>멀티미디어콘텐츠제작전문가</strong><p>한국산업인력공단</p></div>
            <div class="resume-mini"><small>CERTIFICATE · 2021</small><strong>ACA / Premiere Pro</strong><p>Adobe</p></div>
          </div>
        </section>
        <section class="resume-section">
          <div class="resume-section-title"><span>03</span><h3>업무 범위 · 강점</h3></div>
          <div class="resume-bullets">
            <div><strong>영상</strong><p>영상 제작 · 촬영 · 편집 · Premiere Pro</p></div>
            <div><strong>사진</strong><p>사진 촬영 · 편집 · Lightroom · DSLR</p></div>
            <div><strong>디자인 & AI</strong><p>Photoshop · AI · ChatGPT 활용</p></div>
          </div>
          <p class="resume-note">이력서 기재 강점 · 긍정적 · 강철멘탈 · 성실</p>
        </section>
        <section class="resume-section">
          <div class="resume-section-title"><span>04</span><h3>희망근무조건</h3></div>
          <div class="resume-duo">
            <div class="resume-mini"><small>LOCATION</small><strong>서울 전체 · 경기 부천시 · 재택근무</strong></div>
            <div class="resume-mini"><small>FIELD</small><strong>사진촬영·편집 · 동영상촬영·편집 · 그래픽·영상·편집디자인</strong></div>
            <div class="resume-mini"><small>EMPLOYMENT</small><strong>알바 · 정규직 · 계약직</strong></div>
            <div class="resume-mini"><small>PERIOD</small><strong>1년 이상 · 근무일시 무관</strong></div>
          </div>
        </section>
      </div>
    </section>`;
  home.parentNode.insertBefore(resume,home);

  function refreshAge(){
    const ageNode=resume.querySelector('#resumeAge');
    if(ageNode)ageNode.textContent=`만 ${getInternationalAge()}세`;
  }
  function refreshCareer(){
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
  }
  function setMode(mode){
    document.body.dataset.view=mode;
    tabs.querySelectorAll('.mode-tab').forEach(btn=>{const active=btn.dataset.mode===mode;btn.classList.toggle('is-active',active);btn.setAttribute('aria-pressed',active?'true':'false')});
    if(mode==='resume'){refreshAge();refreshCareer();resume.querySelector('.resume-scroll')?.scrollTo({top:0});}
  }
  tabs.addEventListener('click',e=>{const btn=e.target.closest('[data-mode]');if(btn)setMode(btn.dataset.mode)});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&document.body.dataset.view==='resume'){refreshAge();refreshCareer();}});
  setMode('resume');
})();
