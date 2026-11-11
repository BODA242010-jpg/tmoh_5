/* Tmoh — Hobby Adventure V14. No quiz needed for the hobby rewards.
   Safe local-first state; uses existing saved study sessions, not a duplicate timer.
   One 5-minute welcome pass, then one pass per 25 minutes of SAVED study.
   Does not edit chat, cloud authentication, student_data, or tmoh2 key. */
(function(){
'use strict';
if(typeof VIEWS==='undefined'||typeof PAGES==='undefined'||typeof save!=='function')return;
const E=x=>esc(String(x??''));
const PASS_MS=5*60*1000, STUDY_MS=25*60*1000;
const HOBBIES=[
 ['الرسم','🎨','ارسم حاجة جميلة وإنت بتتعلم خطوة خطوة'],
 ['القراءة','📖','رواية أصلية مشوّقة؛ كل زيارة تكشف جزء'],
 ['كرة القدم','⚽','تحديات مهارة خفيفة في مكان آمن'],
 ['البرمجة','💻','ابنِ مشروع صغير على مراحل'],
 ['التصوير','📷','شوف الحياة بعيون مصوّر'],
 ['الكتابة','✍️','ابدأ حكايتك الخاصة وكملها كل مرة'],
 ['العلوم','🔭','ملاحظات ممتعة وآمنة من العالم حواليك'],
 ['الموسيقى','🎵','جرّب إيقاع من تأليفك']
];
const drawings=[
 {name:'قطة لطيفة',tip:'ابدأ بدائرة للرأس، بعدين ودان مثلثة، وبعدها العيون والشنب.',svg:`<svg viewBox="0 0 320 230" role="img" aria-label="رسمة قطة بسيطة: رأس دائري وأذنان وعيون وشنب"><g stroke="#5d4b9c" fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M85 104 87 43 127 73 M196 73 237 43 238 104" fill="#eeeaff"/><ellipse cx="161" cy="136" rx="93" ry="79" fill="#eeeaff"/><path d="M119 131q13-13 26 0 M180 131q13-13 26 0"/><path d="m154 156 8 6 8-6-8-4z" fill="#ee9bb9"/><path d="M162 162q-5 12-17 6M162 162q5 12 17 6M129 166 83 155 M127 176 84 179 M195 166 241 155 M196 176 244 179"/></g></svg>`},
 {name:'صاروخ إلى الأحلام',tip:'جسم طويل، نافذة دائرية، جناحان صغيران، ونار تحت الصاروخ.',svg:`<svg viewBox="0 0 320 230" role="img" aria-label="رسمة صاروخ بسيط وجناحان ونجوم"><g stroke="#5e4baa" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"><path d="M140 173 Q111 75 164 28 Q219 80 191 174Z" fill="#e3e9ff"/><path d="M143 123 107 155 104 194 148 176 M187 125 221 155 221 194 182 177" fill="#c8baf9"/><circle cx="165" cy="99" r="20" fill="#94dce9"/><path d="M149 175 Q150 205 165 220 Q182 195 178 175Z" fill="#ffb66e"/><path d="M165 187 165 213" stroke="#f16b62"/><path d="m62 50 5-14 5 14 14 5-14 5-5 14-5-14-14-5zM257 64l4-9 4 9 9 4-9 4-4 9-4-9-9-4z" fill="#ffd887"/></g></svg>`},
 {name:'بيت وسط الطبيعة',tip:'ارسم مربع للبيت، مثلث للسقف، وشجرة صغيرة وشمس على الجنب.',svg:`<svg viewBox="0 0 320 230" role="img" aria-label="رسمة بيت وشجرة وشمس"><g stroke="#5363a0" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"><path d="M52 205H276"/><path d="M104 112 165 57 224 112" fill="#ebaf81"/><rect x="117" y="112" width="97" height="93" rx="4" fill="#ebe7ff"/><rect x="153" y="153" width="25" height="52" fill="#c5b4f5"/><rect x="184" y="133" width="19" height="19" fill="#9ee3ef"/><path d="M76 202V141"/><path d="M76 100c-52 6-54 59-13 62 8 27 51 24 55-1 36-14 16-61-13-61-6-33-46-32-53-5" fill="#9cdea5"/><circle cx="258" cy="50" r="19" fill="#ffe3a0"/></g></svg>`}
];
/* Entirely original fiction; chapter breaks preserve reading progress. */
const chapters=[
 {title:'رسالة من فوق السطح',body:['في آخر يوم من الإجازة، كانت ليلى بتدور على كتاب قديم في صندوق فوق سطح بيت جدتها. وسط التراب لقت ظرف أزرق مكتوب عليه بخط صغير: «افتحيني لما تحسّي إن كل الأبواب اتقفلت».','ضحكت ليلى من الجملة، لكن أول ما فتحت الظرف لقت خريطة للبيت، وعلامة على أوضة مقفولة من سنين. وكان فيه مفتاح نحاسي صغير مربوط بخيط بنفسجي.','نزلت على السلم بهدوء، ووقفت قدام الأوضة. وقبل ما تحط المفتاح في الباب، سمعت صوتًا من الناحية التانية بيقول: «اتأخرتي يا ليلى».']},
 {title:'الأوضة اللي محدش بيدخلها',body:['اتجمدت ليلى مكانها. إزاي حد عارف اسمها جوه أوضة مقفولة؟ رجعت خطوة، لكن الصوت اتكرر بهدوء: «ما تخافيش، المفتاح مستنيكي من زمان».','فتحت الباب ببطء. الأوضة كانت مليانة ساعات متوقفة، وعلى الحيطة سبورة كبيرة مكتوب عليها أسامي ناس من العيلة، وأمام كل اسم تاريخ.','فجأة، ساعة صغيرة بدأت تدق. بصت ليلى على التاريخ المكتوب جنب اسمها، فلقته تاريخ بكرة!']},
 {title:'الساعة اللي بتسبق الزمن',body:['كانت العقارب بتتحرك عكس الاتجاه. لقت ورقة تحت الساعة بتقول إن كل ساعة هنا بتحتفظ بلحظة منسية، وإن واحدة منهم فيها إجابة سؤال عيلتها عمرها ما جاوبت عليه.','حاولت ليلى تسأل جدتها عن الأوضة، لكن جدتها قالت: «فيه حاجات لازم تكتشفيها بنفسك، بس خدي بالك من الساعة اللي من غير عقارب».','رجعت ليلى للأوضة، ولقت الساعة اللي من غير عقارب مفتوحة... وجواها صورة ليها وهي أكبر بعشر سنين.']},
 {title:'الصورة المستحيلة',body:['كانت الصورة فيها ليلى واقفة قدام مكتبة ضخمة، ماسكة كتابًا على غلافه نفس النجمة المرسومة على الظرف الأزرق. خلف الصورة جملة: «كل حلم ليه باب، بس المفتاح مش دايمًا من حديد».','قلّبت ليلى الصورة، فظهر رمز من ثلاثة أشكال: قلم، كتاب، ومصباح. بدأت تدور على الرموز وسط الأوضة، لحد ما لقتهم على ثلاثة أدراج.','فتحت أول درج... فسمعت صوت خطوات بتقرب من باب السطح.']},
 {title:'سر الأدراج الثلاثة',body:['قفلت ليلى الدرج بسرعة. دخلت جدتها، وابتسمت لما شافت الرموز. قالت إن جد ليلى كان بيحب يسيب ألغاز صغيرة تشجع أولاده على التعلم والاكتشاف.','في درج القلم لقت صفحة بيضا، وفي درج الكتاب لقت فهرسًا ناقصًا، وفي درج المصباح لقت كشافًا صغيرًا. لما وجهت الكشاف على الصفحة ظهرت عليها كلمات مخفية.','الكلمات كانت: «الكنز الحقيقي تحت أول كلمة كتبتِها بإيدك».']},
 {title:'الكنز الحقيقي',body:['افتكرت ليلى أول دفتر كانت بتكتب فيه قصصها وهي صغيرة. جريت لأوضتها وطلعت الدفتر القديم من تحت السرير. فتحت الصفحة الأولى، ولقت بين الورق رسالة من جدها.','كان كاتب لها إنه مؤمن إن أحلامها تستحق فرصة، وإن الشجاعة مش معناها إنها ما تخافش، لكن إنها تبدأ حتى لو خايفة.','وفي آخر الرسالة رسم صغير لباب مكتبة، وتحته عنوان: «الجزء الثاني... لما تفتحي الباب بنفسك». النهاية الأولى — والمغامرة لسه ممكن تكمل بخيالك!']}
];
const missions={
 'كرة القدم':['دقيقتين لمس الكرة بخفة بالقدم اليمين والشمال في مكان واسع وآمن.','جرّب تمرير الكرة لنقطة قريبة بهدوء، من غير تصويب قوي أو كسر أي حاجة.','اكتب حركة جديدة نفسك تتعلمها المرة الجاية.'],
 'التصوير':['اختار لون مميز حوالينك وصوّره من زاوية جديدة.','جرّب تصور ضل أو انعكاس ضوء طبيعي من غير ما تصور أشخاص بدون إذن.','لاحظ الفرق بين صورة قريبة وصورة بعيدة لنفس الشيء.'],
 'العلوم':['راقب ظل جسم ثابت في ضوء النهار، وارسم اتجاهه.','بص على ورقة شجر: فيها خطوط واتجاهات إزاي؟ اكتب ملاحظتك.','قارن بين ملمس سطحين مختلفين من غير تجربة أي مواد خطيرة.'],
 'الموسيقى':['اعمل إيقاعًا بسيطًا بتصفيقتين وسكتة، وكرره بهدوء.','جرّب إيقاع بطيء ثم أسرع قليلًا بتصفيق خفيف.','ابتكر أربع دقات مختلفة من تأليفك ودوّنها.'],
 'البرمجة':['اكتب ثلاثة أسطر بسيطة بتطبع رسالة لنفسك في لغة بتتعلمها.','فكر في فكرة لعبة صغيرة تحب تعملها، واكتب أول خطوة.','صمّم اسمًا وشاشة ترحيب لبرنامج من خيالك.'],
 'الكتابة':['اكتب بداية حكاية فيها شخصية بتلاقي صندوقًا غريبًا.','أضف وصفًا للمكان والضوء والصوت في مشهدك.','اكتب نهاية مشوّقة للمشهد تخليك عايز تكمل المرة الجاية.']
};
const icons=Object.fromEntries(HOBBIES.map(h=>[h[0],h[1]]));
const sessionMs=()=> (Array.isArray(d.sessions)?d.sessions:[]).reduce((n,s)=>n+(Number.isFinite(s.ms)&&s.ms>0?s.ms:0),0);
function store(){
 if(!d.hobbyAdventure||typeof d.hobbyAdventure!=='object'||Array.isArray(d.hobbyAdventure)){
  d.hobbyAdventure={v:1,baseMs:sessionMs(),spent:0,artIndex:0,storyIndex:0,activityIndex:{},art:{},notes:{},active:null,finished:0};save();
 }
 return d.hobbyAdventure;
}
function available(s){return Math.max(0,1+Math.floor(Math.max(0,sessionMs()-s.baseMs)/STUDY_MS)-s.spent);}
function remainingToNext(s){const consumed=Math.max(0,s.spent-1);return Math.max(0,STUDY_MS-(sessionMs()-s.baseMs-consumed*STUDY_MS));}
function expire(s){if(s.active&&Date.now()>=Number(s.active.endsAt)){s.active=null;s.finished=(Number(s.finished)||0)+1;save();return true}return false;}
function active(s){return !!s.active && Date.now()<Number(s.active.endsAt);}
function kind(){return HOBBIES.some(h=>h[0]===d.hobby)?d.hobby:'الرسم';}
function studyRunning(){return !!d.timer?.since;}
function summary(){const s=store();expire(s);return {passes:available(s),left:remainingToNext(s),active:active(s),hobby:d.hobby||''};}
const timeFmt=ms=>`${String(Math.floor(Math.max(0,ms)/60000)).padStart(2,'0')}:${String(Math.floor(Math.max(0,ms)%60000/1000)).padStart(2,'0')}`;
function paint(k){const current=drawings[k%drawings.length];const strokes=store().art[k]||[];
 return `<div class="th-two"><div class="th-sample"><span class="th-label">✨ ارسم زي المثال ده</span><h3>${E(current.name)}</h3>${current.svg}<p>${E(current.tip)}</p></div><div class="th-pad"><div class="th-pad-header"><strong>🎨 لوحتك</strong><span>ارسم بإصبعك أو الماوس</span></div><canvas id="thDraw" width="640" height="460" aria-label="مساحة للرسم بإصبعك أو الماوس"></canvas><div class="th-pad-actions"><button class="soft" type="button" data-th="undo">↩ تراجع</button><button class="soft" type="button" data-th="erase">🧹 امسح اللوحة</button><button class="soft" type="button" data-th="download">⬇ احفظ صورة</button></div><p class="th-fine">${strokes.length?'الرسمة محفوظة على جهازك 💜':'حتى لو ما كملتهاش، هتلاقيها زي ما سيبتها المرة الجاية.'}</p></div></div><button type="button" class="th-quiet" data-th="artNext">خلصت الرسمة دي؟ جرّب رسمة جديدة بعد كده</button>`;
}
function story(){const s=store(),idx=Math.max(0,Math.min(chapters.length-1,Number(s.storyIndex)||0)),c=chapters[idx];if(s.active?.storyFinished)return `<section class="th-story-ready"><div class="th-story-ready-icon">📚✨</div><h2>الجزء الجاي مستنيك!</h2><p>أحسنت! فتحت الفصل اللي بعده، بس المفاجأة هتظهر بعد جلسة مذاكرة جديدة. رسمتك وحكايتك محفوظين.</p><button type="button" class="primary" data-th="finishNow">📚 ارجع ذاكر ونكمل بعدين</button></section>`;return `<article class="th-story"><div class="th-story-cover"><span>✦ حكايات طموح الأصلية</span><strong>رسالة من فوق السطح</strong><small>الفصل ${idx+1} من ${chapters.length}</small></div><div class="th-story-body"><h2>${E(c.title)}</h2>${c.body.map(p=>`<p>${E(p)}</p>`).join('')}<div class="th-cliff">⏳ يا ترى إيه اللي هيحصل بعد كده؟</div><button type="button" class="primary" data-th="nextChapter" ${idx===chapters.length-1?'disabled':''}>${idx===chapters.length-1?'خلصت أول حكاية!':'خلصت الجزء ده — احفظ مكاني للمرة الجاية'}</button></div></article><p class="th-fine">لو الوقت خلص وإنت بتقرأ، الفصل هيفضل محفوظ وهتكمله من نفس المكان.</p>`;}
function textActivity(h){const s=store(),idx=Math.max(0,Number(s.activityIndex?.[h])||0)%3;const p=missions[h]||missions['الكتابة'];const val=String(s.notes?.[h]||'');return `<div class="th-creative"><div class="th-creative-ill" aria-hidden="true">${icons[h]||'✨'}</div><div class="th-label">مهمة صغيرة ممتعة — ${E(h)}</div><h2>${E(p[idx])}</h2><p>جرّب براحتك، مش مطلوب تكون محترف. تقدّمك بيتحفظ، ومفيش درجات ولا أسئلة.</p><label for="thNotes">دوّن فكرة أو احفظ اللي بدأت فيه (اختياري)</label><textarea id="thNotes" maxlength="1600" rows="5" placeholder="اكتب أي فكرة عايز ترجع تكملها...">${E(val)}</textarea><div class="th-pad-actions"><button class="primary" data-th="nextMission" type="button">جرب نشاط جديد</button></div></div>`;}
function activity(s){const h=s.active?.kind||kind();if(h==='الرسم')return paint(s.artIndex||0);if(h==='القراءة')return story();return textActivity(h);}
function finishedUI(s){const needed=Math.ceil(remainingToNext(s)/60000);return `<section class="th-lock" role="status"><div class="th-lock-icon">🔒</div><h2>خمس دقايق حلوين خلصوا 💜</h2><p>${E(d.hobby||'هوايتك')} مستنياك تكمل من مكانك. ذاكر ${needed} دقيقة جديدة، وارجع افتح 5 دقايق تانية.</p><p class="th-fine">مش مهم تكون خلّصت رسمة أو فصل؛ المحاولة نفسها جميلة، وتقدّمك محفوظ.</p><button class="primary" type="button" data-go="focus">📚 يلا نذاكر ونرجع نكمل</button><button class="soft" type="button" data-go="rest">🌿 خُد راحة عادية لو محتاج</button></section>`;}
function hobbyChoice(){return `<section class="th-choice"><div class="th-small-heading"><h2>🎯 اختار الهواية اللي بتحبها</h2><p>غيّرها وقت ما تحب، وتقدّمك في كل هواية هيفضل محفوظ.</p></div><div class="th-choices">${HOBBIES.map(h=>`<button class="th-choice-item ${d.hobby===h[0]?'selected':''}" type="button" data-th="choose" data-hobby="${E(h[0])}"><span>${h[1]}</span><strong>${E(h[0])}</strong><small>${E(h[2])}</small></button>`).join('')}</div></section>`;}
function view(){const s=store();expire(s);const nowActive=active(s),count=available(s);const h=kind();
 const hero=`<section class="th-hero"><div class="th-hero-copy"><span class="th-kicker">✨ مكافآت على مقاس هوايتك</span><h1>ذاكر شوية… وارجع<br><em>كمّل اللي بتحبه!</em></h1><p>بدل مسابقات المكافآت: 5 دقايق رسم أو حكاية أو نشاط من هوايتك، وبعد المذاكرة ترجع تكمل من نفس المكان.</p><div class="th-pills"><span>⏰ 5 دقايق للهواية</span><span>📚 كل 25 دقيقة مذاكرة محفوظة</span><span>💾 تقدمك محفوظ</span></div></div><div class="th-hero-art">${icons[d.hobby]||'🎨'}</div></section>`;
 const chips=`<div class="th-stats"><div><span>🎟️ فرصتك الجاية</span><strong>${count} تذكرة</strong></div><div><span>⏱️ مذاكرة للفرصة الجديدة</span><strong>${count ? 'جاهزة!' : Math.ceil(remainingToNext(s)/60000)+' دقيقة'}</strong></div><div><span>🌈 هوايتك</span><strong>${E(d.hobby||'اختار هوايتك')}</strong></div></div>`;
 const shelf=(!nowActive&&count<=0)?finishedUI(s):(!nowActive?`<section class="th-start"><div><h2>🎉 عندك 5 دقايق متعة!</h2><p>هتبدأ وقت هوايتك، ولما يخلص مش هنمسح ولا رسمة ولا سطر قريته.</p></div><button class="primary th-launch" data-th="start" type="button" ${studyRunning()?'disabled':''}>▶ ابدأ 5 دقايق ${icons[h]||'✨'}</button>${studyRunning()?'<p class="th-fine">احفظ جلسة المذاكرة أولًا، وبعدها ابدأ مكافأتك.</p>':''}</section>`
 : `<section class="th-playing"><div class="th-countbar"><div><span class="th-kicker">وقت هوايتك بدأ</span><h2>${icons[s.active.kind]||'✨'} ${E(s.active.kind)}</h2></div><div class="th-clock" id="thClock" aria-live="off">${timeFmt(s.active.endsAt-Date.now())}</div></div><div class="th-progress"><span id="thProgress" style="width:${Math.max(0,Math.min(100,Math.floor((s.active.endsAt-Date.now())/PASS_MS*100)))}%"></span></div>${activity(s)}<div class="th-actionbar"><button type="button" class="soft" data-go="focus">📚 ارجع للمذاكرة دلوقتي</button><small>التايمر مستمر حتى لو خرجت من القسم. تقدمك محفوظ.</small></div></section>`);
 return `<div class="th-page" dir="rtl">${hero}${chips}${hobbyChoice()}${shelf}<div class="th-footerhelp"><span>🌿 خليك لطيف مع نفسك: الراحة مش عقاب، والمذاكرة من غير ضغط أفضل.</span><button class="soft" data-go="focus">مؤقت المذاكرة</button></div></div>`;
}
// Draw normalized vector strokes; store on pointer-up to keep backups small.
let pad=null;
function mountCanvas(){const el=document.getElementById('thDraw');if(!el||pad?.el===el)return;
 const s=store(),idx=s.artIndex||0,ctx=el.getContext('2d');if(!ctx)return;
 const records=()=>s.art[idx]||(s.art[idx]=[]);
 const draw=()=>{ctx.fillStyle='#fff';ctx.fillRect(0,0,el.width,el.height);ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=4.4;ctx.strokeStyle='#5546a8';for(const points of records()){if(!Array.isArray(points)||!points.length)continue;ctx.beginPath();points.forEach((p,i)=>{const x=p[0]*el.width,y=p[1]*el.height;if(i)ctx.lineTo(x,y);else ctx.moveTo(x,y)});if(points.length===1){ctx.lineTo(points[0][0]*el.width+.2,points[0][1]*el.height+.2)}ctx.stroke();}};
 const xy=ev=>{const rect=el.getBoundingClientRect();return [Math.round(Math.max(0,Math.min(1,(ev.clientX-rect.left)/rect.width))*1000)/1000,Math.round(Math.max(0,Math.min(1,(ev.clientY-rect.top)/rect.height))*1000)/1000]};
 let line=null;
 el.onpointerdown=ev=>{if(!active(s)||records().length>=60)return;ev.preventDefault();el.setPointerCapture(ev.pointerId);line=[xy(ev)];records().push(line);draw()};
 el.onpointermove=ev=>{if(!line)return;ev.preventDefault();if(line.length>=160)return;line.push(xy(ev));draw()};
 const stop=()=>{if(!line)return;line=null;save();};el.onpointerup=stop;el.onpointercancel=stop;el.onlostpointercapture=stop;
 pad={el,draw};draw();}
function updateTimer(){if(!d || page!=='rewards')return;const el=document.getElementById('thClock');if(!el)return;const s=store();const left=Math.max(0,s.active?.endsAt-Date.now());el.textContent=timeFmt(left);const b=document.getElementById('thProgress');if(b)b.style.width=Math.floor(Math.min(1,left/PASS_MS)*100)+'%';if(!left){expire(s);render('rewards');return}mountCanvas();}
setInterval(updateTimer,1000);
window.addEventListener('hashchange',()=>{if(location.hash==='#/rewards')setTimeout(mountCanvas,90)});
const contentNode=document.getElementById('content');if(contentNode){new MutationObserver(()=>{if(page==='rewards'&&document.getElementById('thDraw'))mountCanvas()}).observe(contentNode,{childList:true});}
function update(){save();render('rewards');}
document.getElementById('content')?.addEventListener('click',ev=>{const b=ev.target.closest('[data-th]');if(!b||!d)return;const s=store();expire(s);const op=b.dataset.th;
 if(op==='choose'){if(active(s))return msg('استنى لحد ما تخلص وقت هوايتك الحالي، وبعدها غيرها');const value=b.dataset.hobby;if(!HOBBIES.some(x=>x[0]===value))return;d.hobby=value;update();return;}
 if(op==='start'){if(studyRunning())return msg('احفظ جلسة المذاكرة الأول');if(active(s))return;if(!available(s))return msg('ذاكر شوية الأول علشان تفتح مكافأة جديدة');s.active={kind:kind(),startedAt:Date.now(),endsAt:Date.now()+PASS_MS};s.spent=Math.max(0,Number(s.spent)||0)+1;update();mountCanvas();return;}
 if(!active(s))return;
 if(op==='nextChapter'){if(s.active.kind!=='القراءة'||s.active.storyFinished)return;s.storyIndex=Math.min(chapters.length-1,Math.max(0,Number(s.storyIndex)||0)+1);s.active.storyFinished=true;update();return;}
 if(op==='finishNow'){s.active=null;s.finished=(Number(s.finished)||0)+1;update();go('focus');return;}
 if(op==='nextMission'){const k=s.active.kind;s.activityIndex=s.activityIndex||{};s.activityIndex[k]=(Number(s.activityIndex[k])||0)+1;update();return;}
 if(op==='artNext'){if(s.active.kind!=='الرسم')return;s.artIndex=Math.min(20,(Number(s.artIndex)||0)+1);update();mountCanvas();return;}
 if(op==='undo'){if(s.active.kind!=='الرسم')return;const k=s.artIndex||0;s.art[k]?.pop();save();pad?.draw();return;}
 if(op==='erase'){if(s.active.kind!=='الرسم')return;if(!confirm('تمسح رسمة المرحلة دي فقط؟'))return;s.art[s.artIndex||0]=[];save();pad?.draw();return;}
 if(op==='download'){if(s.active.kind!=='الرسم')return;const el=document.getElementById('thDraw');if(!el)return;const a=document.createElement('a');a.href=el.toDataURL('image/png');a.download='Tmoh-my-drawing.png';a.click();return;}
});
document.getElementById('content')?.addEventListener('input',ev=>{if(ev.target.id!=='thNotes'||!d)return;const s=store();const k=s.active?.kind;if(!k||!active(s))return;s.notes=s.notes||{};s.notes[k]=ev.target.value.slice(0,1600);save();});
// Replace ONLY the reward competition UI. Existing rewardHistory remains untouched.
const legacyReward=VIEWS.rewards;
VIEWS.rewards=()=>view();
const rewardMenu=PAGES.find(p=>p[0]==='rewards');if(rewardMenu)rewardMenu[1]='🎨 مكافأة هوايتك';
const oldHome=VIEWS.home;
VIEWS.home=()=>{const s=store();expire(s);const n=available(s);return `<section class="th-home-focus" dir="rtl"><div><span>🎮 طموح • مغامرتك الخاصة</span><h2>كل شوية مذاكرة تفتحلك شوية من هوايتك 💜</h2><p>${n?`عندك ${n} فرصة للهواية مستنياك!`:`ذاكر ${Math.ceil(remainingToNext(s)/60000)} دقيقة، وارجع تكمّل ${E(d.hobby||'هوايتك')}.`}</p><div class="th-home-actions"><button type="button" class="primary" data-go="rewards">${n?'افتح مكافأتك':'شوف مكافأتك'} 🎨</button><button type="button" class="soft" data-go="focus">ابدأ مذاكرة ⏱️</button></div></div><div class="th-home-emoji">${icons[d.hobby]||'✨'}</div></section><details class="th-previous"><summary>📊 الإنجازات والأدوات الأخرى</summary>${oldHome()}</details>`;};
// Saved profiles can enter before this enhancement loads; refresh only the home card, not the login flow.
if(d && page==='home')queueMicrotask(()=>{if(d && page==='home')render('home');});
window.TMOH_HOBBY=Object.freeze({getStatus:()=>d?summary():null,passMs:PASS_MS,studyMs:STUDY_MS});
})();
