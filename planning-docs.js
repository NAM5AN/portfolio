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
    .original-doc-kicker{font:700 9px ui-monospace,monospace;letter-spacing:.12em;color:var(--accent);margin-bottom:9px}
    .original-doc-card{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:22px;align-items:center;border:1px solid var(--line);border-radius:16px;background:linear-gradient(135deg,#fff 0%,#f1eee5 100%);padding:18px 18px 18px 20px;text-decoration:none;transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease}
    .original-doc-card:hover{transform:translateY(-2px);border-color:var(--ink);box-shadow:0 12px 30px rgba(23,23,20,.08)}
    .original-doc-copy{min-width:0}
    .original-doc-copy strong{display:block;font-family:Georgia,'Times New Roman',serif;font-size:20px;line-height:1.15;letter-spacing:-.025em;color:var(--ink)}
    .original-doc-copy span{display:block;margin-top:7px;font-size:10px;line-height:1.55;color:var(--muted)}
    .original-doc-action{display:flex;align-items:center;gap:12px;border-left:1px solid var(--line);padding-left:20px;font-size:10px;font-weight:800;white-space:nowrap;color:var(--ink)}
    .original-doc-action i{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:var(--ink);color:#fff;font-style:normal;font-size:14px;transition:transform .18s ease}
    .original-doc-card:hover .original-doc-action i{transform:translate(2px,-2px)}
    @media(max-width:680px){
      .original-doc-cta{margin-top:28px;padding-top:14px}
      .original-doc-card{grid-template-columns:1fr;gap:14px;padding:16px}
      .original-doc-copy strong{font-size:18px}
      .original-doc-action{border-left:0;border-top:1px solid var(--line);padding:13px 0 0;justify-content:space-between}
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
        <div class="original-doc-kicker">ORIGINAL PLANNING DOCUMENT</div>
        <a class="original-doc-card" href="${doc.url}" target="_blank" rel="noopener noreferrer" aria-label="${doc.label} 원본 기획서 새 창에서 열기">
          <span class="original-doc-copy">
            <strong>축약본 너머의 전체 기획을 확인하세요.</strong>
            <span>${doc.label} · Google Docs 원본 문서</span>
          </span>
          <span class="original-doc-action">원본 기획서 보기 <i>↗</i></span>
        </a>
      </div>`);
  };

  // planning modal's first document was rendered before this patch loaded.
  selectPlan('startup');
})();