/* QuantPol Math – Native HTML interactive textbook, based on the supplied 4th edition. */
'use strict';
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const storeKey='quantpol-v4-progress';let saved={};try{saved=JSON.parse(localStorage.getItem(storeKey)||'{}')}catch{}
saved.answers ||= {};saved.completed ||= {};saved.notes ||= {};saved.sectionChecks ||= {};saved.theme ||= 'light';
const persist=()=>{try{localStorage.setItem(storeKey,JSON.stringify(saved))}catch{}};
let content=null,book=null,route={page:'home'},activeTab='read';
const chaptersGroups=[['Foundations',1,4],['Linear Algebra',5,7],['Probability & Statistics',8,12],['Regression & Econometrics',13,17],['Political Science Applications',18,23],['Independent Research',24,25],['Game Theory · Optional',26,33]];
const labDefs=[
 ['normal','Normal distribution','Move the mean, standard deviation, and threshold to visualize cumulative probability.'],
 ['bayes','Bayes theorem','Explore base rates, sensitivity and false-positive rates.'],
 ['regression','OLS regression','Change the data-generating slope and noise; refit the line.'],
 ['did','Difference-in-differences','Manipulate treatment and comparison trends.'],
 ['event','Event-study CAR','Change daily abnormal returns to accumulate an event window.'],
 ['derivative','Derivative explorer','Change the evaluation point and view the tangent slope.'],
 ['integral','Integration explorer','Move integration limits and see the accumulated area.'],
 ['sampling','Sampling and CLT','Change the sample size and watch the standard error shrink.'],
 ['matrix','Matrix transformation','Modify a 2×2 matrix and observe how a grid transforms.'],
 ['optimize','Optimization','Move coefficients of a quadratic and find its vertex.'],
 ['inference','Hypothesis testing','Change your effect and standard error to see the z test.'],
 ['timeseries','AR(1) dependence','Explore how serial correlation changes persistence.'],
 ['game','Best responses','Adjust payoffs to see each player’s best responses in a 2×2 game.']
];
const chapter=n=>content.chapters[String(n)];
const allQuestions=()=>[...Object.values(content.chapters).flatMap(c=>[...c.checkpoint,...c.practice]),...content.reviews.flatMap(r=>r.questions)];
const allqById=()=>Object.fromEntries(allQuestions().map(q=>[q.id,q]));
const appendixDefs=[['preface','Preface and study plan','Start here'],['answers','Checkpoint answer explanations','Reference'],['solutions','Full worked solutions','Reference'],['glossary','Glossary and reading guide','Reference'],['atlas','Complete Formula Atlas','Reference'],['zguide','Z-score tables and visual guide','Reference']];
const chapterLabs={1:'optimize',2:'derivative',3:'integral',4:'optimize',5:'matrix',6:'matrix',7:'regression',8:'bayes',9:'normal',10:'sampling',11:'inference',12:'regression',13:'regression',14:'regression',15:'regression',16:'inference',17:'regression',18:'event',19:'event',20:'event',21:'did',22:'did',23:'timeseries',24:'event',25:'did',26:'game',27:'game',28:'game',29:'game',30:'game',31:'bayes',32:'game',33:'game'};
function stats(){let qs=allQuestions(),att=qs.filter(q=>saved.answers[q.id]),correct=att.filter(q=>saved.answers[q.id]===q.answer);return {attempted:att.length,correct:correct.length,total:qs.length,finished:Object.values(saved.completed).filter(Boolean).length}}
function navHTML(query=''){
 let s=`<button class="${route.page==='home'?'active':''}" data-route="home">⌂ &nbsp; Dashboard</button><button class="${route.page==='appendix'&&route.n==='preface'?'active':''}" data-route="appendix" data-n="preface">☷ &nbsp; Start here / Preface</button><button class="${route.page==='labs'?'active':''}" data-route="labs">◈ &nbsp; Interactive labs</button><button class="${route.page==='ztable'?'active':''}" data-route="ztable">Φ &nbsp; Z-score explorer</button><button class="${route.page==='formulas'?'active':''}" data-route="formulas">ƒ &nbsp; Formula shelf</button>`;
 for(const [label,a,b] of chaptersGroups){let entries=[];for(let i=a;i<=b;i++){const c=chapter(i);if((i+' '+c.title).toLowerCase().includes(query.toLowerCase()))entries.push(`<button class="${route.page==='chapter'&&route.n===i?'active':''} ${saved.completed[i]?'done':''}" data-route="chapter" data-n="${i}"><span class="num">${saved.completed[i]?'✓':String(i).padStart(2,'0')}</span><span>${esc(c.title)}</span></button>`)}if(entries.length)s+=`<h5>${esc(label)}</h5>${entries.join('')}`}
 if(!query){s+='<h5>Assessments</h5>'+content.reviews.map((r,i)=>`<button data-route="review" data-n="${i}" class="${route.page==='review'&&route.n===i?'active':''}"><span class="num">${i===7?'★':String.fromCharCode(65+i)}</span> ${esc(r.title.replace(/: .*/,''))}</button>`).join('');s+='<h5>Complete reference sections</h5>'+appendixDefs.slice(1).map(([id,title])=>`<button data-route="appendix" data-n="${id}" class="${route.page==='appendix'&&route.n===id?'active':''}">↳ ${esc(title)}</button>`).join('')}
 return s;
}
function header(t){$('#breadcrumbs').textContent=t;const s=stats();$('#progressLabel').textContent=`${s.attempted}/${s.total} questions attempted`;$('#navigation').innerHTML=navHTML($('#search').value);document.body.classList.toggle('dark',saved.theme==='dark')}
function link(page,n){route={page,n};activeTab='read';const hash='#/'+page+(n===undefined?'':'/'+n);if(location.hash!==hash){location.hash=hash}else render();window.scrollTo(0,0);$('.sidebar').classList.remove('show')}
const pill=(text)=>`<span class="pill">${text}</span>`;
function home(){let s=stats();return `<div class="hero"><span class="pill">THE PERSONALIZED MATH SERIES · NATIVE WEB EDITION</span><h1>Mathematics for<br>Quantitative Political Science</h1><p>Read every chapter directly on the website. Explore visual mathematics, solve exercises, uncover derivations and build research skills—from algebra to PBE.</p><div class="actions"><button class="btn light" data-route="chapter" data-n="${Math.min(33,Math.max(1,Number(localStorage.getItem('quantpol-last')||1)))}">Continue reading →</button><button class="btn" data-route="labs">Explore interactive labs</button><button class="btn" data-route="appendix" data-n="preface">Study guide →</button></div></div>
 <div class="stats"><div class="stat"><strong>33</strong><span>Native HTML chapters</span></div><div class="stat"><strong>${s.attempted}<span style="display:inline;font-size:16px">/${s.total}</span></strong><span>Questions attempted</span></div><div class="stat"><strong>${s.attempted?Math.round(s.correct/s.attempted*100):0}%</strong><span>Answer accuracy</span></div><div class="stat"><strong>${s.finished}</strong><span>Completed chapters</span></div></div>
 <div class="sectionhead"><h2>Choose a learning path</h2><span class="muted">33 chapters · complete web lessons</span></div><div class="cardgrid">${chaptersGroups.map(([title,a,b],i)=>`<button class="chaptercard" data-route="chapter" data-n="${a}"><span class="unit">PART ${String(i+1).padStart(2,'0')}</span><h3>${esc(title)}</h3><div class="foot"><span>Chapters ${a}–${b}</span><span>Start →</span></div></button>`).join('')}</div>
 <div class="sectionhead"><h2>Hands-on explorations</h2><button class="small" data-route="labs">All 13 labs →</button></div><div class="cardgrid">${labDefs.slice(0,6).map(([id,title,desc])=>`<button class="chaptercard" data-route="lab" data-n="${id}"><span class="unit">LIVE LAB</span><h3>${title}</h3><p class="muted" style="font-size:12px">${desc}</p></button>`).join('')}</div>
 <div class="panel"><h3>How the web textbook works</h3><p>Every chapter contains its <b>readable HTML lesson</b>, original derivations and examples, exercise checkpoints, extended practice and notes. Mathematical expressions that depend on complex PDF typography are preserved as individually cropped equations—not embedded pages. Click an equation for its extracted notation and surrounding text. Sliders and graphs are educational experiments, not empirical findings.</p><div class="actions"><button class="btn secondary" data-route="review" data-n="0">Begin Review A</button><button class="btn outline" id="exportBtn">Export study progress</button><button class="btn outline" id="importBtn">Import study progress</button></div></div>`}
function blockHTML(b,i,key){
 const body=esc(b.text||'');
 if(b.type==='heading'){let k=`${key}-${i}`,checked=Boolean(saved.sectionChecks[k]);return `<div class="lesson-section-heading" id="section-${i}"><h2>${body}</h2><button class="section-check ${checked?'is-checked':''}" data-section="${esc(k)}" title="Mark section read">${checked?'✓ Studied':'○ Mark studied'}</button></div>`}
 if(b.type==='subheading')return `<h3 class="lesson-subheading">${body}</h3>`;
 if(b.type==='label')return `<h4 class="lesson-label ${/Fast lane/.test(body)?'tiplabel':''}">${body}</h4>`;
 if(b.type==='code')return `<div class="codeWrap"><span class="codeLang">R / Code</span><button class="small" data-copy="${esc(b.text)}">Copy</button><pre><code>${body}</code></pre></div>`;
 if(b.type==='quote')return `<blockquote class="lesson-quote">${body}</blockquote>`;
 if(b.type==='equation'||b.type==='diagram')return `<figure class="math-figure"><button class="math-zoom" data-math="${esc(key)}:${i}" aria-label="Explore original typeset mathematical expression"><img loading="lazy" alt="${esc(b.alt)}" src="${b.src}" style="max-width:min(100%,${Math.ceil(b.width*1.3)}px)" /><span>↗ Open equation</span></button></figure>`;
 if(/^(?:\d+\.\s|\d+\)\s)/.test(body))return `<p class="lesson-listlike">${body}</p>`;
 return `<p class="lesson-paragraph">${body}</p>`;
}
function blockArticle(blocks,key){return `<article class="lesson-prose">${blocks.map((b,i)=>blockHTML(b,i,key)).join('')}</article>`}
function outline(blocks,key){const heads=blocks.map((b,i)=>({b,i})).filter(({b})=>b.type==='heading');return `<div class="toc-heading">IN THIS LESSON</div>${heads.map(({b,i})=>`<a href="#section-${i}" data-section-link="${i}">${esc(b.text)}</a>`).join('')}<div class="sidebar-lesson-footer"><button class="btn secondary" data-tab="checkpoint">Test your understanding →</button></div>`}
function chapterView(n){const c=chapter(n),lesson=book.chapters[String(n)];if(!c||!lesson)return '<div class="panel">Chapter unavailable.</div>';localStorage.setItem('quantpol-last',n);
 const tabs=[['read','Learn'],['checkpoint',`Checkpoint (${c.checkpoint.length})`],['practice',`Practice (${c.practice.length})`],['notes','My notes']];
 return `<div class="chapter-heading"><span class="eyebrow">CHAPTER ${String(n).padStart(2,'0')} · ${esc(chaptersGroups.find(x=>n>=x[1]&&n<=x[2])[0])}</span><h1>${esc(c.title)}</h1><p class="muted">Complete interactive HTML lesson · ${lesson.sections} sections · ${lesson.blocks.filter(b=>b.type==='equation').length} original mathematical expressions · ${c.checkpoint.length+c.practice.length} exercises</p></div>
 <div class="tabs" role="tablist">${tabs.map(([k,t])=>`<button data-tab="${k}" class="${activeTab===k?'selected':''}">${t}</button>`).join('')}</div><div id="tabContent">${chapterTab(n)}</div>
 <div class="chapter-actions"><button class="btn ${saved.completed[n]?'secondary':'outline'}" id="markComplete">${saved.completed[n]?'✓ Chapter completed':'Mark chapter complete'}</button>${n>1?`<button class="btn outline" data-route="chapter" data-n="${n-1}">← Previous</button>`:''}${n<33?`<button class="btn secondary" data-route="chapter" data-n="${n+1}">Next chapter →</button>`:''}</div>`;
}
function chapterTab(n){const c=chapter(n),lesson=book.chapters[String(n)];
 if(activeTab==='read')return `<div class="reading-layout"><section class="reading-main"><div class="lesson-intro"><span>FULL WEB LESSON</span><p>Read explanations, inspect original typeset equations, try the linked visual experiment, and mark each section as studied.</p></div>${blockArticle(lesson.blocks,`ch${n}`)}<div class="lesson-end"><h3>Put it into practice</h3><p>This chapter has ${c.checkpoint.length} checkpoint questions and ${c.practice.length} additional practice problems with worked feedback.</p><div class="actions"><button class="btn" data-tab="checkpoint">Start checkpoint →</button><button class="btn secondary" data-route="lab" data-n="${chapterLabs[n]}">Open related math lab ↗</button></div></div></section><aside class="reading-toc">${outline(lesson.blocks,`ch${n}`)}<div class="toc-micro"><span>RELATED EXPERIMENT</span><button data-route="lab" data-n="${chapterLabs[n]}">${esc(labDefs.find(l=>l[0]===chapterLabs[n])[1])} ↗</button></div></aside></div>`;
 if(activeTab==='checkpoint'||activeTab==='practice'){const qs=c[activeTab];return `<div class="notice">Choose an answer to reveal worked feedback. Your selections are saved on this device. Explanation details come from the textbook's answer appendices.</div>${qs.map((q,i)=>questionHTML(q,i)).join('')}<div class="actions"><button class="btn secondary" data-route="appendix" data-n="solutions">Full worked-solutions appendix →</button><button class="btn outline" data-tab="read">Back to lesson</button></div>`}
 return `<div class="panel"><h3>Your chapter ${n} notes</h3><p class="muted">These notes stay in your browser unless you export progress.</p><textarea id="chapterNotes" class="notes" placeholder="What did I learn? What should I review? Which assumptions matter for my research?">${esc(saved.notes[n]||'')}</textarea><div class="actions"><button class="btn secondary" id="exportBtn">Export notes and progress</button></div></div>`;
}
function questionHTML(q,i){let val=saved.answers[q.id],checked=Boolean(val),ok=val===q.answer,exp=q.explanation||'Refer to the full worked-solutions appendix for the printed derivation.';
 return `<article class="question" data-qid="${esc(q.id)}"><div class="qtop"><span>QUESTION ${i+1}</span><span class="difficulty">${esc(q.difficulty||'Practice')}</span></div><h3>${esc(q.question)}</h3><div class="options">${Object.entries(q.options||{}).map(([letter,opt])=>`<button data-answer="${letter}" class="option ${val===letter?'selected':''} ${checked&&letter===q.answer?'correct':''} ${checked&&letter===val&&!ok?'incorrect':''}"><b>${letter}</b> ${esc(opt)}</button>`).join('')}</div><div class="qfooter"><span class="muted" style="font-size:12px">${checked?'Select another option to retry.':'Select one answer for feedback.'}</span>${checked?`<button class="small" data-reset="${esc(q.id)}">Clear response</button>`:''}</div>${checked?`<div class="feedback ${ok?'good':'bad'}"><b>${ok?'✓ Correct':'✕ Try again'} · Answer ${esc(q.answer)}</b><div class="workedanswer">${esc(exp)}</div></div>`:''}</article>`;
}
function reviewView(i){let r=content.reviews[i],attempt=r.questions.filter(q=>saved.answers[q.id]),correct=attempt.filter(q=>saved.answers[q.id]===q.answer);return `<span class="eyebrow">${i===7?'FINAL EXAMINATION':'CUMULATIVE REVIEW'}</span><h1>${esc(r.title)}</h1><p class="muted">${r.questions.length} interactive questions · The original exam is integrated into this page, not displayed in a PDF.</p><div class="panel review-score"><div class="big-number">${correct.length} / ${r.questions.length}</div><span class="muted">Correct · ${attempt.length} answered</span><div class="progressbar"><i style="width:${Math.round(100*attempt.length/r.questions.length)}%"></i></div><button class="btn outline" data-clearreview="${i}">Reset assessment</button></div>${r.questions.map((q,k)=>questionHTML(q,k)).join('')}<div class="actions"><button class="btn secondary" data-route="appendix" data-n="solutions">Study the full solutions →</button></div>`}
function appendixView(id){const info=appendixDefs.find(x=>x[0]===id),part=book.appendices[id];if(!info||!part)return '<h2>Reference section not found.</h2>';
 const pages=part.blocks;return `<div class="appendix-header"><span class="eyebrow">FULL INTERACTIVE REFERENCE · ${info[2].toUpperCase()}</span><h1>${esc(info[1])}</h1><p class="muted">Native HTML · ${pages.length} source text and equation blocks · Search within this section using the browser's Find command (Ctrl+F).</p></div><div class="reading-layout"><div class="reading-main">${blockArticle(pages,`app${id}`)}</div><aside class="reading-toc">${outline(pages,`app${id}`)}${id==='atlas'?'<button class="btn secondary" data-route="formulas">Formula shelf ↗</button>':''}${id==='zguide'?'<button class="btn secondary" data-route="ztable">Live Z table ↗</button>':''}</aside></div>`;
}
function labsView(){return `<span class="eyebrow">INTERACTIVE MATHEMATICS</span><h1>Learn by changing the numbers.</h1><p class="muted">Move sliders, compare plots, inspect consequences. All data and payoffs in these experiments are simulated illustrations.</p><div class="labgrid">${labDefs.map(([id,title,desc],i)=>`<div class="labcard"><span class="eyebrow">EXPERIMENT ${String(i+1).padStart(2,'0')}</span><h3>${esc(title)}</h3><p>${esc(desc)}</p><button class="btn secondary" data-route="lab" data-n="${id}">Explore →</button></div>`).join('')}</div>`}
const normalCDF=z=>{const s=z<0?-1:1;const x=Math.abs(z)/Math.SQRT2,t=1/(1+.3275911*x),v=1-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-.284496736)*t+.254829592)*t*Math.exp(-x*x);return .5*(1+s*v)};
function slider(id,label,min,max,value,step){return `<div class="control"><label for="${id}">${label}</label><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${value}"><output id="${id}Val">${value}</output></div>`}
function plotSVG(points,other){return `<svg class="svgplot" viewBox="0 0 500 210" aria-label="Interactive math graph" role="img"><line x1="40" y1="175" x2="477" y2="175" stroke="#8794ad"/><line x1="40" y1="15" x2="40" y2="175" stroke="#8794ad"/>${other||''}${points}</svg>`}
function labView(id){let d=labDefs.find(x=>x[0]===id);if(!d)return labsView();let conf={normal:[slider('mu','Mean μ',-3,3,0,.1),slider('sigma','Std. dev. σ',.5,3,1,.1),slider('z','Threshold x',-4,4,1,.1)],bayes:[slider('prior','Prevalence',1,80,10,1),slider('sens','Sensitivity',10,100,90,1),slider('fpr','False-positive %',1,60,10,1)],regression:[slider('slope','Trend β',-3,3,1,.1),slider('noise','Noise scale',0,4,1,.1),slider('intercept','Intercept',-3,3,0,.1)],did:[slider('tb','Treatment pre',0,20,8,1),slider('ta','Treatment post',0,20,15,1),slider('cb','Control pre',0,20,6,1),slider('ca','Control post',0,20,9,1)],event:[...[-2,-1,0,1,2].map((k,i)=>slider('ar'+i,`AR day ${k}`,-5,5,[1,-2,-3,2,1][i],.5))]}[id].join('');return `<span class="eyebrow">INTERACTIVE LABORATORY</span><h1>${d[1]}</h1><p class="muted">${d[2]}</p><div class="split"><div class="panel"><h3>Experiment</h3><div class="controls">${conf}</div><p class="muted">Adjust sliders and observe the result instantly.</p></div><div class="panel"><h3>Visual response</h3><div id="labMetric" class="metric"></div><div id="labPlot"></div><p id="labInterpret" class="muted"></p></div></div><div class="notice">Research reminder: changing an assumption in a model is not the same as observing a causal effect in real data.</div>`}
function updateLab(id){let get=k=>Number($('#'+k)?.value||0);document.querySelectorAll('.control input').forEach(input=>$('#'+input.id+'Val').textContent=input.value);let svg='',metric='',interp='';
if(id==='normal'){let mu=get('mu'),sig=get('sigma'),z=get('z'),p=normalCDF((z-mu)/sig);let pts=[],area=[];for(let k=0;k<=160;k++){let x=-7+14*k/160,y=Math.exp(-.5*((x-mu)/sig)**2)/sig,px=40+(x+7)/14*435,py=175-y*115;pts.push(`${k?'L':'M'}${px.toFixed(1)} ${py.toFixed(1)}`);if(x<=z)area.push(`${px.toFixed(1)},${py.toFixed(1)}`)}let baseX=40+(Math.max(-7,Math.min(7,z))+7)/14*435;svg=plotSVG(`<path d="${pts.join(' ')}" fill="none" stroke="#716cf1" stroke-width="3"/><polygon points="40,175 ${area.join(' ')} ${baseX},175" fill="#9790fc" opacity=".35"/><line x1="${baseX}" x2="${baseX}" y1="15" y2="175" stroke="#16a486" stroke-dasharray="5 5"/>`);metric=`P(X ≤ ${z}) = ${(p*100).toFixed(2)}%`;interp=`Standard score z = (x − μ)/σ = ${((z-mu)/sig).toFixed(2)}. The shaded region is the left-tail cumulative probability.`}
if(id==='bayes'){let pr=get('prior')/100,se=get('sens')/100,fp=get('fpr')/100,p=se*pr/(se*pr+fp*(1-pr));metric=`P(condition | positive) = ${(p*100).toFixed(1)}%`;svg=plotSVG(`<rect x="70" y="80" width="350" height="40" fill="#d9def2" rx="6"/><rect x="70" y="80" width="${350*p}" height="40" fill="#726aeb" rx="6"/><text x="70" y="64" font-size="12" fill="currentColor">Positive results that are true positives</text>`);interp=`Bayes rule: (${se.toFixed(2)} × ${pr.toFixed(2)}) / [(${se.toFixed(2)} × ${pr.toFixed(2)}) + (${fp.toFixed(2)} × ${(1-pr).toFixed(2)})]. A low base rate can make even a strong test have a modest positive predictive value.`}
if(id==='regression'){let beta=get('slope'),noise=get('noise'),a=get('intercept'),pts=[],n=13;for(let i=0;i<n;i++){let x=-4+i*8/(n-1),y=a+beta*x+noise*Math.sin(i*9.7);pts.push([x,y])}let mx=pts.reduce((s,p)=>s+p[0],0)/n,my=pts.reduce((s,p)=>s+p[1],0)/n,b=pts.reduce((s,p)=>s+(p[0]-mx)*(p[1]-my),0)/pts.reduce((s,p)=>s+(p[0]-mx)**2,0),aa=my-b*mx;let coord=(x,y)=>[255+x*47,105-y*7.2];svg=plotSVG(`<line x1="${coord(-4,aa-4*b)[0]}" y1="${coord(-4,aa-4*b)[1]}" x2="${coord(4,aa+4*b)[0]}" y2="${coord(4,aa+4*b)[1]}" stroke="#716cf1" stroke-width="3"/>${pts.map(([x,y])=>{let [xx,yy]=coord(x,y);return `<circle cx="${xx}" cy="${yy}" r="5" fill="#18aa90"/>`}).join('')}`);metric=`Estimated slope β̂ = ${b.toFixed(3)}`;interp=`The plotted line is OLS fitted to 13 simulated observations. The fitted slope need not equal the generating slope when the noise is correlated with the input pattern.`}
if(id==='did'){let [tb,ta,cb,ca]=['tb','ta','cb','ca'].map(get),did=(ta-tb)-(ca-cb);metric=`DiD = ${did>0?'+':''}${did.toFixed(1)} units`;let y=v=>173-v*6,x1=130,x2=385;svg=plotSVG(`<line x1="${x1}" y1="${y(tb)}" x2="${x2}" y2="${y(ta)}" stroke="#716cf1" stroke-width="4"/><line x1="${x1}" y1="${y(cb)}" x2="${x2}" y2="${y(ca)}" stroke="#16a486" stroke-width="4"/>${[[x1,tb,'#716cf1'],[x2,ta,'#716cf1'],[x1,cb,'#16a486'],[x2,ca,'#16a486']].map(([x,v,c])=>`<circle cx="${x}" cy="${y(v)}" r="6" fill="${c}"/>`).join('')}<text x="125" y="195" font-size="12" fill="currentColor">Pre</text><text x="374" y="195" font-size="12" fill="currentColor">Post</text>`);interp=`Treatment change = ${(ta-tb).toFixed(1)}; comparison change = ${(ca-cb).toFixed(1)}. DiD subtracts the comparison change. Causal interpretation needs the parallel-trends assumption and careful design.`}
if(id==='event'){let ar=[0,1,2,3,4].map(i=>get('ar'+i)),cum=0,vals=ar.map(x=>cum+=x);metric=`CAR(−2,+2) = ${cum>0?'+':''}${cum.toFixed(1)} percentage points`;svg=plotSVG(`<polyline points="${vals.map((v,i)=>`${75+i*90},${110-v*9}`).join(' ')}" stroke="#716cf1" stroke-width="4" fill="none"/>${vals.map((v,i)=>`<circle cx="${75+i*90}" cy="${110-v*9}" r="6" fill="#16a486"/><text x="${70+i*90}" y="194" font-size="11" fill="currentColor">${i-2}</text>`).join('')}<line x1="40" y1="110" x2="477" y2="110" stroke="#aaa" stroke-dasharray="4 4"/>`);interp=`CAR is the sum of abnormal returns: ${ar.map(x=>x.toFixed(1)).join(' + ')} = ${cum.toFixed(1)} percentage points. Statistical and causal interpretation are separate questions.`}
$('#labMetric').textContent=metric;$('#labPlot').innerHTML=svg;$('#labInterpret').textContent=interp}
function zView(){return `<span class="eyebrow">REFERENCE TOOL</span><h1>Standard normal Z-table</h1><p class="muted">Original reference convention: Φ(z) = P(Z ≤ z), the left-tail area. This interactive table gives approximately four-decimal results.</p><div class="panel"><h3>Find a probability</h3><div class="controls">${slider('zlookup','z value',-3.5,3.5,1.96,.01)}</div><div class="big-number" id="zanswer"></div><p id="zexplain" class="muted"></p></div><div class="panel"><h3>Positive z: cumulative left-tail probabilities</h3><div class="tablewrap"><table class="ztable"><thead><tr><th>z</th>${Array.from({length:10},(_,j)=>`<th>.0${j}</th>`).join('')}</tr></thead><tbody>${Array.from({length:35},(_,i)=>`<tr><th>${(i/10).toFixed(1)}</th>${Array.from({length:10},(_,j)=>`<td title="z=${(i/10+j/100).toFixed(2)}">${normalCDF(i/10+j/100).toFixed(4)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>`}
// Extra interactive laboratories extend the five experiments from the previous edition.
const extraIds=new Set(['derivative','integral','sampling','matrix','optimize','inference','timeseries','game']);
function extraLabView(id){let d=labDefs.find(x=>x[0]===id);if(!d)return labsView();
 const C={
 derivative:[slider('k','Curvature k',.2,3,1,.1),slider('x0','At x',-4,4,1,.1)],
 integral:[slider('a','Lower bound a',-4,3,-1,.1),slider('b','Upper bound b',-3,4,2,.1)],
 sampling:[slider('n','Sample size n',5,400,50,5),slider('sd','Population σ',.2,5,2,.1)],
 matrix:[slider('aa','Matrix a',-2,2,1,.1),slider('bb','Matrix b',-2,2,.4,.1),slider('cc','Matrix c',-2,2,0,.1),slider('dd','Matrix d',-2,2,1,.1)],
 optimize:[slider('qa','Quadratic a',-3,3,-1,.1),slider('qb','Linear b',-5,5,2,.2),slider('qc','Constant c',-5,5,1,.2)],
 inference:[slider('effect','Estimate',-4,4,2,.1),slider('nullval','H₀ value',-2,2,0,.1),slider('se','Std error',.2,3,1,.1)],
 timeseries:[slider('rho','Persistence ρ',-.9,.95,.6,.05),slider('shock','Initial shock',-3,3,2,.1)],
 game:[slider('payA','P1 payoff at A,A',0,6,3,1),slider('payB','P1 payoff at B,A',0,6,4,1),slider('payC','P2 payoff at A,A',0,6,3,1),slider('payD','P2 payoff at A,B',0,6,4,1)]
 };
 return `<span class="eyebrow">LIVE MATHEMATICAL EXPERIMENT</span><h1>${esc(d[1])}</h1><p class="muted">${esc(d[2])}</p><div class="split"><div class="panel"><h3>Change assumptions</h3><div class="controls">${C[id].join('')}</div><p class="muted small-copy">Every plot recalculates directly in your browser.</p></div><div class="panel"><h3>What changes?</h3><div class="metric" id="labMetric"></div><div id="labPlot"></div><p class="muted" id="labInterpret"></p></div></div><div class="notice">Educational demonstration with synthetic values; no observed firm-level policy data are involved.</div>`;
}
function extraLabUpdate(id){const g=k=>Number($('#'+k)?.value??0);document.querySelectorAll('.control input').forEach(el=>{const out=$('#'+el.id+'Val');if(out)out.textContent=el.value});let metric='',svg='',interp='';
 if(id==='derivative'){
  const k=g('k'),x=g('x0'),f=t=>.5*k*t*t,fp=k*x;
  let p=Array.from({length:101},(_,i)=>{let u=-5+i/10;return `${i?'L':'M'}${250+u*43} ${170-f(u)*8}`}).join(' ');
  let y=(u)=>170-(f(x)+fp*(u-x))*8;
  svg=plotSVG(`<path d="${p}" fill="none" stroke="#716cf1" stroke-width="3"/><line x1="45" y1="${y(-4.7)}" x2="465" y2="${y(5)}" stroke="#17a387" stroke-width="3"/><circle cx="${250+x*43}" cy="${170-f(x)*8}" r="6" fill="#f39e42"/>`);metric=`f′(${x.toFixed(1)}) = ${fp.toFixed(2)}`;interp=`For f(x) = ${(.5*k).toFixed(2)}x², the tangent slope is f′(x) = ${k.toFixed(2)}x. Change the evaluation point to see the local slope.`;
 }
 if(id==='integral'){
  let a=g('a'),b=g('b');const F=x=>x*x*x/3-2*x;const signed=F(b)-F(a);const X=x=>255+x*42,Y=y=>112-y*12;
  const poly=Array.from({length:121},(_,i)=>{let x=-5+10*i/120;return `${i?'L':'M'}${X(x)} ${Y(x*x/5-2)}`}).join(' ');
  const pts=Array.from({length:80},(_,i)=>{let x=a+(b-a)*i/79;return `${X(x)},${Y(x*x/5-2)}`}).join(' ');
  svg=plotSVG(`<path d="${poly}" stroke="#716cf1" fill="none" stroke-width="3"/><polygon points="${X(a)},${Y(0)} ${pts} ${X(b)},${Y(0)}" fill="#726aeb" opacity=".22"/><line x1="40" x2="470" y1="${Y(0)}" y2="${Y(0)}" stroke="#777" stroke-dasharray="4 3"/>`);
  const val=(b*b*b-a*a*a)/15-2*(b-a);metric=`∫[${a.toFixed(1)}, ${b.toFixed(1)}] f(x) dx = ${val.toFixed(2)}`;interp=`Here f(x) = x²/5 − 2. The integral is signed: below-axis contributions are negative, and reversing the bounds reverses the sign. Formula: [x³/15 − 2x] from a to b.`;
 }
 if(id==='sampling'){
  let n=g('n'),sd=g('sd'),se=sd/Math.sqrt(n),scale=92/se;
  const p=Array.from({length:121},(_,i)=>{let x=-4+8*i/120,y=Math.exp(-.5*(x/se)**2);return `${i?'L':'M'}${250+x*53} ${176-y*130}`}).join(' ');
  svg=plotSVG(`<path d="${p}" fill="none" stroke="#716cf1" stroke-width="3"/>`);metric=`SE(x̄) = ${se.toFixed(3)}`;interp=`Under independent identical sampling, SE = σ/√n = ${sd.toFixed(1)}/√${n}. Four times as many observations halves the standard error, not the variance of individual observations.`;
 }
 if(id==='matrix'){
  let a=g('aa'),b=g('bb'),c=g('cc'),d=g('dd'),det=a*d-b*c,lines='';let X=x=>250+26*x,Y=y=>112-26*y;
  for(let z=-3;z<=3;z++){
   lines+=`<line x1="${X(a*-3+b*z)}" y1="${Y(c*-3+d*z)}" x2="${X(a*3+b*z)}" y2="${Y(c*3+d*z)}" stroke="#706cf0" opacity=".75"/>`;
   lines+=`<line x1="${X(a*z+b*-3)}" y1="${Y(c*z+d*-3)}" x2="${X(a*z+b*3)}" y2="${Y(c*z+d*3)}" stroke="#16a486" opacity=".75"/>`;
  }
  svg=plotSVG(lines);metric=`det(A) = ${det.toFixed(2)}`;interp=`A = [[${a.toFixed(1)}, ${b.toFixed(1)}], [${c.toFixed(1)}, ${d.toFixed(1)}]]. If det(A) = 0, the grid collapses to a lower dimension and the inverse does not exist.`;
 }
 if(id==='optimize'){
  const a=g('qa'),b=g('qb'),c=g('qc'),vertex=Math.abs(a)>1e-8?-b/(2*a):null, val=vertex===null?null:a*vertex*vertex+b*vertex+c;
  let p=Array.from({length:121},(_,i)=>{let x=-5+i/12,y=a*x*x+b*x+c;return `${i?'L':'M'}${255+x*41} ${115-y*5}`}).join(' ');
  svg=plotSVG(`<path d="${p}" fill="none" stroke="#716cf1" stroke-width="3"/>${vertex!==null&&Math.abs(vertex)<5?`<circle cx="${255+vertex*41}" cy="${115-val*5}" r="6" fill="#17a387"/>`:''}`);
  metric=vertex===null?'Linear: no interior quadratic vertex':`x* = ${vertex.toFixed(2)}`;interp=vertex===null?'When a = 0, the quadratic collapses to a line.':`Differentiate f(x)=ax²+bx+c: f′(x)=2ax+b. The stationary point solves 2ax+b=0 and is a ${a<0?'maximum':'minimum'} when a ${a<0?'<':'>'} 0.`;
 }
 if(id==='inference'){
  let effect=g('effect'),nullv=g('nullval'),se=g('se'),z=(effect-nullv)/se,p=2*(1-normalCDF(Math.abs(z)));
  const x=Math.max(-4,Math.min(4,z)),boundary=255+x*51;
  let pts=Array.from({length:101},(_,i)=>{let xx=-4+i*.08;return `${i?'L':'M'}${255+xx*51} ${174-135*Math.exp(-xx*xx/2)}`}).join(' ');
  svg=plotSVG(`<path d="${pts}" stroke="#716cf1" fill="none" stroke-width="3"/><line x1="${boundary}" x2="${boundary}" y1="28" y2="175" stroke="#e58854" stroke-width="3" stroke-dasharray="5 5"/>`);
  metric=`z = ${z.toFixed(2)} · p ≈ ${p.toFixed(4)}`;interp=`z=(estimate−null)/SE = (${effect.toFixed(1)}−${nullv.toFixed(1)})/${se.toFixed(1)}. This two-sided p-value uses the standard normal approximation. Statistical significance does not establish causation.`;
 }
 if(id==='timeseries'){
  const rho=g('rho'),initial=g('shock');let series=[initial];for(let i=1;i<=15;i++)series.push(rho*series[i-1]);
  let coords=series.map((v,i)=>`${50+i*27},${110-v*21}`).join(' ');
  svg=plotSVG(`<polyline points="${coords}" stroke="#716cf1" fill="none" stroke-width="3"/>${series.map((v,i)=>`<circle cx="${50+i*27}" cy="${110-v*21}" r="3.5" fill="#16a486"/>`).join('')}<line x1="40" y1="110" x2="477" y2="110" stroke="#aaa" stroke-dasharray="5 5"/>`);
  metric=`ρ = ${rho.toFixed(2)}`;interp=`Simulated deterministic AR(1) impulse response xₜ=${rho.toFixed(2)}xₜ₋₁. |ρ| < 1 makes shocks decay; negative ρ makes responses oscillate. No random disturbances are added here.`;
 }
 if(id==='game'){
  let a=g('payA'),b=g('payB'),c=g('payC'),d=g('payD');
  svg=`<div class="game-matrix"><div></div><div>Player 2: A</div><div>Player 2: B</div><div>Player 1: A</div><div class="${a>=b?'best':''} ${c>=d?'otherbest':''}">(${a}, ${c})</div><div class="${c<=d?'otherbest':''}">(1, ${d})</div><div>Player 1: B</div><div class="${b>=a?'best':''}">(${b}, 1)</div><div>(2, 2)</div></div>`;
  metric=`Player 1 prefers ${a>=b?'A':'B'} if P2 plays A`;
  interp=`Compare P1 payoffs ${a} (A) versus ${b} (B), holding P2 at A. Compare P2 payoffs ${c} (A) versus ${d} (B), holding P1 at A. Best responses depend on what the other player chooses. For full Nash equilibrium, check all four cells.`;
 }
 $('#labMetric').textContent=metric;$('#labPlot').innerHTML=svg;$('#labInterpret').textContent=interp;
}
function formulaView(){
 const formulas=[['Algebra','Σ(xᵢ − x̄) = 0','Deviations from a sample mean sum to zero.'],['Power rule','d(xⁿ)/dx = nxⁿ⁻¹','Differentiate a power.'],['Optimization','f′(x*) = 0','Necessary condition for a differentiable interior optimum.'],['Fundamental theorem','∫ₐᵇ f(x) dx = F(b) − F(a)','Accumulation and antiderivatives.'],['Conditional probability','P(A | B) = P(A ∩ B) / P(B)','Only defined when P(B) is positive.'],['Bayes','P(A | B) = P(B | A)P(A) / P(B)','Prior × likelihood, normalized.'],['Expectation','E[X] = Σx · P(X = x)','Weighted average for discrete variables.'],['Variance','Var(X) = E[(X − E[X])²]','Dispersion around the mean.'],['Standard error','SE(x̄) = σ / √n','Under independent identical sampling.'],['z statistic','z = (estimate − null) / SE','Normal-reference test statistic.'],['Simple OLS','β̂ = Σ(xᵢ−x̄)(yᵢ−ȳ) / Σ(xᵢ−x̄)²','Slope with an intercept.'],['Matrix OLS','β̂ = (XᵀX)⁻¹Xᵀy','Requires full column rank.'],['Omitted variable bias','Bias = γ · Cov(X,Z) / Var(X)','Simplified single omitted-regressor case.'],['Expected return','E[Rᵢₜ] = αᵢ + βᵢRₘₜ','Market model.'],['Abnormal return','ARᵢₜ = Rᵢₜ − E[Rᵢₜ]','Observed minus benchmark return.'],['CAR','CARᵢ[a,b] = Σ ARᵢₜ','Cumulative abnormal return.'],['Difference-in-differences','(ȲT,post − ȲT,pre) − (ȲC,post − ȲC,pre)','Double difference.'],['Mixed strategies','EU(a) = EU(b)','Indifference for strategies with positive mixing probability.']];
 return `<span class="eyebrow">QUICK FORMULAS · NATIVE HTML</span><h1>Formula shelf</h1><p class="muted">A quick interactive index. For the <b>entire original formula reference</b>, open Appendix D—it is also rendered natively as HTML sections and precise formula excerpts.</p><div class="actions"><button class="btn secondary" data-route="appendix" data-n="atlas">Read full Formula Atlas →</button></div><div class="searchbox" style="padding:20px 0"><input id="formulaSearch" style="background:var(--surface);color:var(--text);border-color:var(--line)" placeholder="Find a formula…"></div><div class="cardgrid">${formulas.map(([title,f,description])=>`<div class="chaptercard formulaCard" data-search="${esc((title+' '+description).toLowerCase())}"><span class="eyebrow">${esc(title)}</span><div class="formula">${esc(f)}</div><p class="muted" style="font-size:12px">${esc(description)}</p></div>`).join('')}</div>`;
}
function render(){if(!content||!book)return;
 const title=route.page==='chapter'?`Chapter ${route.n} / ${chapter(route.n)?.title||''}`:route.page==='review'?'Assessments':route.page==='lab'?'Interactive experiment':route.page==='appendix'?'Reference book':route.page==='home'?'Learning dashboard':'Study resources';
 header(title);
 let markup='';switch(route.page){case 'home':markup=home();break;case 'chapter':markup=chapterView(route.n);break;case 'review':markup=reviewView(route.n);break;case 'labs':markup=labsView();break;case 'lab':markup=extraIds.has(route.n)?extraLabView(route.n):labView(route.n);break;case 'ztable':markup=zView();break;case 'formulas':markup=formulaView();break;case 'appendix':markup=appendixView(route.n);break;default:markup=home()};
 $('#view').innerHTML=markup;
 if(route.page==='lab'){extraIds.has(route.n)?extraLabUpdate(route.n):updateLab(route.n)}
 if(route.page==='ztable')updateZ();
}
function updateZ(){const z=Number($('#zlookup').value);$('#zlookupVal').textContent=z.toFixed(2);$('#zanswer').textContent=`Φ(${z.toFixed(2)}) ≈ ${normalCDF(z).toFixed(4)}`;$('#zexplain').textContent=`P(Z > ${z.toFixed(2)}) ≈ ${(1-normalCDF(z)).toFixed(4)} · P(|Z| > ${Math.abs(z).toFixed(2)}) ≈ ${(2*(1-normalCDF(Math.abs(z)))).toFixed(4)}`}
function exportProgress(){let blob=new Blob([JSON.stringify({version:'web',date:new Date().toISOString(),progress:saved},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='quantpol-math-progress.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function importProgress(){let inp=document.createElement('input');inp.type='file';inp.accept='application/json';inp.onchange=()=>{let f=inp.files?.[0];if(!f)return;f.text().then(t=>{try{let p=JSON.parse(t).progress;if(!p||!p.answers)throw Error('Unrecognized progress file');saved={...saved,...p,answers:p.answers||{},notes:p.notes||{},completed:p.completed||{},sectionChecks:p.sectionChecks||{}};persist();render()}catch(e){alert('Invalid progress file: '+e.message)}})};inp.click()}
function parseHash(){let parts=location.hash.replace(/^#\/?/,'').split('/'),type=parts[0],n=parts[1];
 if(type==='chapter'&&Number(n)>=1&&Number(n)<=33)route={page:type,n:Number(n)};
 else if(type==='review'&&Number.isInteger(Number(n))&&Number(n)>=0&&Number(n)<=7)route={page:type,n:Number(n)};
 else if(type==='lab'&&labDefs.some(d=>d[0]===n))route={page:type,n};
 else if(type==='appendix'&&appendixDefs.some(d=>d[0]===n))route={page:type,n};
 else if(['labs','ztable','formulas'].includes(type))route={page:type};
 else route={page:'home'};
}
document.addEventListener('click',e=>{
 let t=e.target.closest('[data-section-link]');if(t){e.preventDefault();document.getElementById(`section-${t.dataset.sectionLink}`)?.scrollIntoView({behavior:'smooth',block:'start'});return}
 t=e.target.closest('[data-route]');if(t){let n=t.dataset.n;if(/^\d+$/.test(n||''))n=Number(n);link(t.dataset.route,n);return}
 t=e.target.closest('[data-tab]');if(t){activeTab=t.dataset.tab;$('#tabContent').innerHTML=chapterTab(route.n);window.scrollTo({top:200,behavior:'smooth'});return}
 t=e.target.closest('[data-answer]');if(t){const card=t.closest('[data-qid]'),id=card.dataset.qid;qUpdate(id,t.dataset.answer,card);return}
 t=e.target.closest('[data-reset]');if(t){delete saved.answers[t.dataset.reset];persist();render();return}
 t=e.target.closest('[data-section]');if(t){saved.sectionChecks[t.dataset.section]=!saved.sectionChecks[t.dataset.section];persist();let completed=Boolean(saved.sectionChecks[t.dataset.section]);t.classList.toggle('is-checked',completed);t.textContent=completed?'✓ Studied':'○ Mark studied';return}
 t=e.target.closest('[data-clearreview]');if(t){if(confirm('Clear all answers to this assessment?')){content.reviews[Number(t.dataset.clearreview)].questions.forEach(q=>delete saved.answers[q.id]);persist();render()}return}
 t=e.target.closest('[data-math]');if(t){openEquation(t.dataset.math);return}
 t=e.target.closest('[data-close-dialog]');if(t){$('#mathDialog').close();return}
 t=e.target.closest('[data-copy]');if(t){navigator.clipboard?.writeText(t.dataset.copy).then(()=>{t.textContent='✓ Copied';setTimeout(()=>t.textContent='Copy',1000)}).catch(()=>alert('Copy not available here.'));return}
 if(e.target.id==='markComplete'){saved.completed[route.n]=!saved.completed[route.n];persist();render()}
 if(e.target.id==='exportBtn')exportProgress();
 if(e.target.id==='importBtn')importProgress();
 if(e.target.id==='themeToggle'){saved.theme=saved.theme==='dark'?'light':'dark';persist();render()}
 if(e.target.id==='menu')$('.sidebar').classList.toggle('show');
});
function qUpdate(id,letter,card){saved.answers[id]=letter;persist();const q=allqById()[id],idx=Array.from(card.parentNode.children).filter(x=>x.matches?.('.question')).indexOf(card);card.outerHTML=questionHTML(q,idx<0?0:idx);header($('#breadcrumbs').textContent)}
function openEquation(key){const [head,i]=key.split(':'),index=Number(i),blocks=head.startsWith('ch')?book.chapters[head.slice(2)]?.blocks:book.appendices[head.slice(3)]?.blocks;const b=blocks?.[index];if(!b)return;
 const prev=blocks.slice(Math.max(0,index-2),index).filter(b=>b.type==='paragraph').slice(-1)[0];const next=blocks.slice(index+1,index+3).find(b=>b.type==='paragraph');
 $('#mathDialogContent').innerHTML=`<span class="eyebrow">ORIGINAL MATHEMATICAL EXPRESSION</span><h2>Inspect the equation</h2><img src="${b.src}" alt="${esc(b.alt)}" class="dialogEquation"><details><summary>Extracted mathematical notation (approximate text)</summary><p>${esc(b.alt)}</p></details>${prev?`<h4>Before this equation</h4><p>${esc(prev.text)}</p>`:''}${next?`<h4>How the book continues</h4><p>${esc(next.text)}</p>`:''}<div class="notice">The graphic reproduces the exact typeset formula. The optional text transcription may flatten stacked fractions or superscripts.</div>`;
 $('#mathDialog').showModal();
}
document.addEventListener('input',e=>{
 if(e.target.id==='search'){$('#navigation').innerHTML=navHTML(e.target.value);return}
 if(e.target.id==='formulaSearch'){document.querySelectorAll('.formulaCard').forEach(x=>x.classList.toggle('hidden',!x.dataset.search.includes(e.target.value.toLowerCase())));return}
 if(e.target.id==='chapterNotes'){saved.notes[route.n]=e.target.value;persist();return}
 if(route.page==='lab'&&e.target.matches('.control input')){extraIds.has(route.n)?extraLabUpdate(route.n):updateLab(route.n);return}
 if(route.page==='ztable'&&e.target.id==='zlookup')updateZ();
});
window.addEventListener('hashchange',()=>{parseHash();activeTab='read';render();window.scrollTo(0,0)});
Promise.all(['data/content.json','data/book.json'].map(url=>fetch(url).then(r=>{if(!r.ok)throw Error(`Failed to load ${url}: ${r.status}`);return r.json()})))
 .then(([quizzes,nativeBook])=>{content=quizzes;book=nativeBook;parseHash();render()})
 .catch(e=>{$('#view').innerHTML=`<div class="panel"><h2>Could not open course files</h2><p>${esc(e.message)}</p><p>Use GitHub Pages or a local web server, e.g. <code>python -m http.server 8000</code>.</p></div>`});
