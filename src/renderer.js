const app=document.querySelector('#app');
const orb=document.querySelector('#orb');
const primary=document.querySelector('#orb-primary');
const secondary=document.querySelector('#orb-secondary');
const panel=document.querySelector('#calendar-panel');
const grid=document.querySelector('#calendar-grid');
const week=document.querySelector('#calendar-week');
const yearEl=document.querySelector('#year-label');
const monthEl=document.querySelector('#month-label');
const info=document.querySelector('#selected-lunar');
const TZ='Asia/Shanghai';
const weekNames=['一','二','三','四','五','六','日'];
const holidays=[{name:'中秋节',start:'2026-09-25',end:'2026-09-27'},{name:'国庆节',start:'2026-10-01',end:'2026-10-07'}];
let hoverTimer=null,holidayMode=false,open=false,viewYear,viewMonth,selectedDate='';
const pad=n=>String(n).padStart(2,'0');
function beijingParts(date=new Date()){const parts=new Intl.DateTimeFormat('zh-CN',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(date);const out={};for(const p of parts)out[p.type]=Number(p.value);return out;}
function shanghaiMs(iso){return Date.parse(iso+'T00:00:00+08:00');}
function countdown(msLeft){let seconds=Math.max(0,Math.floor(msLeft/1000));const days=Math.floor(seconds/86400);seconds%=86400;const hours=Math.floor(seconds/3600);seconds%=3600;const minutes=Math.floor(seconds/60);const secs=seconds%60;return days?pad(days)+'d '+pad(hours)+'h':pad(hours)+':'+pad(minutes)+':'+pad(secs);}
function nextHoliday(){const now=Date.now();for(const h of holidays){const start=shanghaiMs(h.start);if(start>now)return Object.assign({},h,{startMs:start});}return null;}
function next1800(){const p=beijingParts();const day=p.hour>=18?1:0;return Date.parse(p.year+'-'+pad(p.month)+'-'+pad(p.day+day)+'T18:00:00+08:00');}
function updateOrb(){const now=Date.now(),p=beijingParts();if(!app.classList.contains('hovering')){primary.textContent=pad(p.hour)+':'+pad(p.minute);secondary.textContent='北京时间';return;}if(holidayMode){const h=nextHoliday();if(!h){primary.textContent='—';secondary.textContent='暂无节假日';return;}primary.textContent=countdown(h.startMs-now);secondary.textContent=h.name;}else{primary.textContent=countdown(next1800()-now);secondary.textContent='距 18:00';}}
orb.addEventListener('mouseenter',()=>{if(open)return;app.classList.add('hovering');app.classList.remove('holiday-mode');holidayMode=false;clearTimeout(hoverTimer);hoverTimer=setTimeout(()=>{holidayMode=true;app.classList.add('holiday-mode');updateOrb();},3000);updateOrb();});
orb.addEventListener('mouseleave',()=>{clearTimeout(hoverTimer);app.classList.remove('hovering','holiday-mode');holidayMode=false;updateOrb();});
orb.addEventListener('click',()=>open?closeCalendar():openCalendar());
function openCalendar(){open=true;const p=beijingParts();viewYear=p.year;viewMonth=p.month-1;selectedDate=p.year+'-'+pad(p.month)+'-'+pad(p.day);app.classList.add('expanded');renderCalendar();if(window.floatingClock)window.floatingClock.setExpanded(true);}
function closeCalendar(){open=false;app.classList.remove('expanded');if(window.floatingClock)window.floatingClock.setExpanded(false);updateOrb();}
function lunarLabel(date){try{return new Intl.DateTimeFormat('zh-CN-u-ca-chinese',{timeZone:TZ,month:'long',day:'numeric'}).format(date);}catch(e){return '农历';}}
function renderCalendar(){yearEl.textContent=viewYear+'年';monthEl.textContent=(viewMonth+1)+'月';week.innerHTML=weekNames.map(x=>'<div class="weekday">'+x+'</div>').join('');const first=new Date(Date.UTC(viewYear,viewMonth,1));const start=(first.getUTCDay()+6)%7;const count=new Date(Date.UTC(viewYear,viewMonth+1,0)).getUTCDate();const total=Math.ceil((start+count)/7)*7;let html='';for(let i=0;i<total;i++){let d=i-start+1,y=viewYear,m=viewMonth;if(d<1){m--;if(m<0){m=11;y--;}d=new Date(Date.UTC(y,m+1,0)).getUTCDate()+d;}else if(d>count){m++;if(m>11){m=0;y++;}d-=count;}const key=y+'-'+pad(m+1)+'-'+pad(d);const muted=m!==viewMonth;const holiday=holidays.some(h=>shanghaiMs(key)>=shanghaiMs(h.start)&&shanghaiMs(key)<=shanghaiMs(h.end));const now=beijingParts();const today=y===now.year&&m===now.month-1&&d===now.day;const lunar=lunarLabel(new Date(key+'T04:00:00+08:00'));html+='<button class="day '+(muted?'muted ':'')+(today?'today ':'')+(key===selectedDate?'selected ':'')+(holiday?'day-holiday':'')+'" data-date="'+key+'"><span class="day-inner"><span class="day-face">'+d+'</span><span class="day-face lunar-face">'+lunar+'</span></span></button>';}grid.innerHTML=html;grid.querySelectorAll('.day').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();selectedDate=btn.dataset.date;grid.querySelectorAll('.day').forEach(x=>{if(x!==btn)x.classList.remove('selected','flipped');});btn.classList.add('selected','flipped');info.textContent=selectedDate+' · '+lunarLabel(new Date(selectedDate+'T04:00:00+08:00'));}));}
document.querySelector('#prev-month').addEventListener('click',e=>{e.stopPropagation();viewMonth--;if(viewMonth<0){viewMonth=11;viewYear--;}renderCalendar();});
document.querySelector('#next-month').addEventListener('click',e=>{e.stopPropagation();viewMonth++;if(viewMonth>11){viewMonth=0;viewYear++;}renderCalendar();});
panel.addEventListener('mouseleave',()=>{if(open)closeCalendar();});
setInterval(updateOrb,250);updateOrb();