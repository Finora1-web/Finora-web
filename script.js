const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];

window.addEventListener("load",()=>{
  setTimeout(()=>$("#loader").classList.add("done"),650);
  $$(".reveal").forEach((el,i)=>setTimeout(()=>el.classList.add("in"),500+i*100));
});

const nav=$(".nav"), progress=$(".progress");
window.addEventListener("scroll",()=>{
  const y=scrollY, max=document.documentElement.scrollHeight-innerHeight;
  nav.classList.toggle("scrolled",y>40);
  progress.style.width=(max?y/max*100:0)+"%";
  const steps=$$(".step"), line=$(".timeline-line i");
  if(line){
    const box=$(".timeline").getBoundingClientRect();
    const amount=Math.max(0,Math.min(1,(innerHeight*.65-box.top)/(box.height)));
    line.style.height=(amount*100)+"%";
    steps.forEach((s,i)=>{
      const r=s.getBoundingClientRect();
      s.classList.toggle("active",r.top<innerHeight*.65 && r.bottom>innerHeight*.22);
    });
  }
},{passive:true});

const dot=$(".cursor-dot"), ring=$(".cursor-ring");
if(matchMedia("(pointer:fine)").matches){
  let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
  addEventListener("pointermove",e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+"px";dot.style.top=my+"px"});
  const loop=()=>{rx+=(mx-rx)*.16;ry+=(my-ry)*.16;ring.style.left=rx+"px";ring.style.top=ry+"px";requestAnimationFrame(loop)};loop();
  $$("a,button,.magnetic").forEach(el=>{el.addEventListener("mouseenter",()=>ring.classList.add("active"));el.addEventListener("mouseleave",()=>ring.classList.remove("active"))});
}

$$(".magnetic").forEach(el=>{
  if(!matchMedia("(pointer:fine)").matches)return;
  el.addEventListener("pointermove",e=>{
    const r=el.getBoundingClientRect(),x=(e.clientX-r.left-r.width/2)*.12,y=(e.clientY-r.top-r.height/2)*.12;
    el.style.transform=`translate(${x}px,${y}px)`;
  });
  el.addEventListener("pointerleave",()=>el.style.transform="");
});

const menu=$(".menu"), mobile=$(".mobile-menu");
menu.addEventListener("click",()=>{
  const open=mobile.classList.toggle("open"); document.body.classList.toggle("menu-open",open); menu.setAttribute("aria-expanded",open);
});
$$(".mobile-menu a").forEach(a=>a.addEventListener("click",()=>{mobile.classList.remove("open");document.body.classList.remove("menu-open");menu.setAttribute("aria-expanded","false")}));

const services=[
 ["Accounting","Structured financial records that give your business a dependable foundation for decisions, reporting and growth.",["ACCURACY","CONTROL","CLARITY"]],
 ["Financial Reporting","Clear, organized reporting designed to make important financial information easier to understand and use.",["INSIGHT","REPORTING","CONTEXT"]],
 ["Tax & VAT","A structured approach to tax and VAT work, designed around accurate information and clear communication.",["STRUCTURE","COMPLIANCE","CLARITY"]],
 ["Business Advisory","Practical financial thinking that connects the numbers with the decisions a business needs to make.",["STRATEGY","CONTEXT","DIRECTION"]],
 ["Payroll","A dependable payroll process designed around organized records, accuracy and a clear employee experience.",["ACCURACY","PROCESS","CARE"]]
];
$$(".service-item").forEach(btn=>btn.addEventListener("click",()=>{
  $$(".service-item").forEach(x=>x.classList.remove("active"));btn.classList.add("active");
  const s=services[+btn.dataset.id];
  const panel=$(".service-panel"); panel.animate([{opacity:.45,transform:"translateY(8px)"},{opacity:1,transform:"none"}],{duration:450,easing:"cubic-bezier(.16,1,.3,1)"});
  $("#service-no").textContent=String(+btn.dataset.id+1).padStart(2,"0");
  $("#service-title").textContent=s[0];$("#service-text").textContent=s[1];
  $("#service-tags").innerHTML=s[2].map(x=>`<span>${x}</span>`).join("");
}));

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("in")}),{threshold:.12});
$$(".reveal").forEach(x=>observer.observe(x));

$("#contact-form").addEventListener("submit",e=>{
  e.preventDefault();
  const form=e.currentTarget,status=$(".form-status");
  if(!form.checkValidity()){status.textContent="Please complete the required fields.";form.reportValidity();return}
  const data=new FormData(form);
  status.textContent=`Thank you, ${data.get("name")}. Your inquiry is ready to be connected to the company's email/backend.`;
  form.reset();
});
