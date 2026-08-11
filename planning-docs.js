(()=>{
  const DOCS={
    startup:{url:'https://docs.google.com/document/d/1PL8a59WTbihOpH51TyIwb3oDLHyf5CnW8-HKeAvI1go/edit?usp=sharing',label:'청년 창업 지원 정책 소개 콘텐츠'},
    routine:{url:'https://docs.google.com/document/d/1M9LxJqs7o7se1RyGAhIlN3oQPQV3pl9u2WMJq83mqH8/edit?usp=sharing',label:'50억 자산가의 24시간 구성 기획'},
    stock:{url:'https://docs.google.com/document/d/1_rTl3Xhg6hGx6mKXt0NdqyVleH5yAUVSWL20lcT8Q1A/edit?usp=sharing',label:'주식 콘텐츠 총합 기획'},
    us:{url:'https://docs.google.com/document/d/1oJ3ykaGEN4A10TG1O-936kx1R0S_1W0LBJ0ZvZ2v-5k/edit?usp=sharing',label:'미국 주식 입문 콘텐츠'},
    samsung:{url:'https://docs.google.com/document/d/1ayRqGC9CB-N1nm5X7VElxSTn5kD6ZcXfn-cx7NRHgI0/edit?usp=sharing',label:'삼성전자 주가 전망'},
    timing:{url:'https://docs.google.com/document/d/1KTSjE6vD03Xy5ZZMyBIcpZtk5ruQJfdeyd4zoKv42QU/edit?usp=sharing',label:'주식 종목 매수매도 타이밍'}
  };

  const style=document.createElement('style');
  style.textContent=`
    .original-doc-cta{margin:34px 0 12px;border-top:1px solid var(--ink);padding-top:18px}
    .original-doc-card{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:24px;align-items:center;border:1px solid var(--line);border-radius:16px;background:linear-gradient(135deg,#fff 0%,#f1eee5 100%);padding:20px 20px 20px 22px;text-decoration:none;transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease}
    .original-doc-card:hover{transform:translateY(-2px);border-color:var(--ink);box-shadow:0 12px 30px rgba(23,23,20,.08)}
    .original-doc-copy{display:block;min-width:0;text-align:left}
    .original-doc-copy strong{display:block;font-family:var(--font-title);font-size:20px;font-weight:500;line-height:1.18;letter-spacing:-.025em;color:var(--ink)}
    .original-doc-copy span{display:block;margin-top:7px;font-family:var(--font-body);font-size:10px;font-weight:450;line-height:1.55;color:var(--muted)}
    .original-doc-action{display:grid;place-items:center}
    .original-doc-action i{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;background:var(--ink);color:#fff;font-style:normal;font-size:17px;transition:transform .18s ease}
    .original-doc-card:hover .original-doc-action i{transform:translate(2px,-2px)}
    @media(max-width:680px){
      .original-doc-cta{margin-top:28px;padding-top:14px}
      .original-doc-card{grid-template-columns:minmax(0,1fr) auto;gap:12px;padding:16px}
      .original-doc-copy strong{font-size:18px}
      .original-doc-action i{width:36px;height:36px;font-size:15px}
    }
  `;
  document.head.appendChild(style);

  const renderBase=selectPlan;
  selectPlan=function(key){
    renderBase(key);
    const doc=DOCS[key];
    const reader=document.getElementById('planReader');
    if(!doc||!reader)return;
    reader.insertAdjacentHTML('beforeend',`
      <div class="original-doc-cta">
        <a class="original-doc-card" href="${doc.url}" target="_blank" rel="noopener noreferrer" aria-label="${doc.label} 원본 기획서 새 창에서 열기">
          <span class="original-doc-copy">
            <strong>원본 기획서 보기</strong>
            <span>${doc.label} · Google Docs</span>
          </span>
          <span class="original-doc-action" aria-hidden="true"><i>↗</i></span>
        </a>
      </div>`);
  };

  // planning modal's first document was rendered before this patch loaded.
  selectPlan('startup');
})();