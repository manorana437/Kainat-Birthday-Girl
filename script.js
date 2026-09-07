const screen=document.getElementById("screen"),fx=document.getElementById("fx"),music=document.getElementById("music");
let page=1, popped=new Set(), mediaIndex=0, mediaTimer;

const media=[
 ["image","assets/kainat-1.jpg","Happy Birthday, My Bestie Kainat ♡","May your life be filled with as much happiness as you give to others."],
 ["image","assets/kainat-2.jpg","My Bestie Kainat ♡","Every little memory with you is special."],
 ["image","assets/kainat-3.jpg","Forever my Bestie ♡","No matter where life takes us, our memories stay."],
 ["video","assets/kainat-video.mp4","I love u Bestie ♡ Kainat","One more little memory to keep forever."]
];

function playMusic(){music.volume=.9;music.play().catch(()=>{})}
function burst(x,y){
 const glyph=["✦","✧","♡","♥","✨","❀","✿","·"];
 for(let i=0;i<22;i++){
  const s=document.createElement("span");s.className="spark";s.textContent=glyph[Math.floor(Math.random()*glyph.length)];
  s.style.left=x+"px";s.style.top=y+"px";
  s.style.setProperty("--x",(Math.random()*210-105)+"px");s.style.setProperty("--y",(Math.random()*210-105)+"px");s.style.setProperty("--r",(Math.random()*360-180)+"deg");
  fx.appendChild(s);setTimeout(()=>s.remove(),1000);
 }
}
function flash(x,y){const f=document.createElement("span");f.className="popflash";f.style.left=(x-28)+"px";f.style.top=(y-28)+"px";f.style.width="56px";f.style.height="56px";fx.appendChild(f);setTimeout(()=>f.remove(),450)}
function clear(){screen.innerHTML="";fx.innerHTML="";clearTimeout(mediaTimer)}
function setBg(n){clear();screen.style.backgroundImage=`url("assets/ref-${n}.jpg")`;}
function button(cls,fn){const b=document.createElement("button");b.className="hit "+cls;b.onclick=fn;screen.appendChild(b);return b}

document.addEventListener("pointerdown",()=>playMusic(),{once:true});

function render(n){
 page=n;setBg(n);
 button("sound",e=>{e.stopPropagation();music.paused?playMusic():music.pause()});
 if(n===1)button("fullbtn",()=>{playMusic();burst(screen.clientWidth/2,screen.clientHeight*.77);setTimeout(()=>render(2),280)});
 if(n===2){
  button("choice yes",()=>{playMusic();burst(screen.clientWidth*.32,screen.clientHeight*.74);setTimeout(()=>render(3),260)});
  button("choice maybe",()=>{playMusic();burst(screen.clientWidth*.68,screen.clientHeight*.74);setTimeout(()=>render(3),260)});
 }
 if(n===3){
  popped=new Set();
  ["b1","b2","b3","b4"].forEach((c,i)=>{
   const b=button("balloon "+c,ev=>{
    if(popped.has(i))return;popped.add(i);
    const r=screen.getBoundingClientRect(),x=ev.clientX-r.left,y=ev.clientY-r.top;
    flash(x,y);burst(x,y);
    b.style.pointerEvents="none";b.style.background="radial-gradient(circle,rgba(255,255,255,.8),rgba(255,120,200,.35),transparent 68%)";
    b.animate([{transform:"scale(1)"},{transform:"scale(1.45)",opacity:0}],{duration:420,fill:"forwards"});
    if(popped.size===4)setTimeout(()=>render(4),500);
   });
  });
 }
 if(n===4)button("fullbtn",()=>{playMusic();burst(screen.clientWidth/2,screen.clientHeight*.78);setTimeout(()=>render(5),400)});
 if(n===5)button("fullbtn",()=>{burst(screen.clientWidth/2,screen.clientHeight*.78);setTimeout(()=>render(6),280)});
 if(n===6){mediaTimer=setTimeout(()=>render(7),7000);button("skip",()=>render(7))}
 if(n===7)button("gift",()=>{burst(screen.clientWidth/2,screen.clientHeight*.54);setTimeout(()=>render(8),420)});
 if(n===8)renderMedia();
}
function renderMedia(){
 const m=media[mediaIndex];
 const wrap=document.createElement("div");wrap.className="media";
 wrap.innerHTML=`<div class="main-media" id="main"></div><div class="mediaText">${m[2]}</div><div class="mediaSub">${m[3]}</div><div class="thumbs"><div class="thumb"><img src="assets/kainat-1.jpg"></div><div class="thumb"><img src="assets/kainat-2.jpg"></div><div class="thumb"><img src="assets/kainat-3.jpg"></div></div><div class="dots">♡ · · · · ♡</div>`;
 screen.appendChild(wrap);
 const main=wrap.querySelector("#main");
 main.innerHTML=m[0]==="video"?`<video src="${m[1]}" autoplay muted playsinline controls></video>`:`<img src="${m[1]}" alt="Kainat">`;
 clearTimeout(mediaTimer);mediaTimer=setTimeout(()=>{mediaIndex=(mediaIndex+1)%media.length;renderMedia()},m[0]==="video"?10000:4200);
}
render(1);