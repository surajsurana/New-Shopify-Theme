/* Homepage hero slider (Loomiere + First Love). Spec: Docs/home-hero-slider-build-spec.md. Vanilla, no dependencies. */
(function(){
  var root=document.getElementById('ka-hero'); if(!root) return;
  var slides=[].slice.call(root.querySelectorAll('.ka-hero__slide'));
  var tabs=[].slice.call(root.querySelectorAll('.ka-hero__tab'));
  var pauseBtn=document.getElementById('ka-hero-pause');
  var status=document.getElementById('ka-hero-status');
  var wrap=document.getElementById('ka-hero-slides');
  if(!slides.length||!pauseBtn||!wrap) return;
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var idx=0, busy=false, autoplay=!reduce, userPaused=false;
  var holds={}; // hover, focus, touch, hidden, off (offscreen)

  function load(i){
    var img=slides[i].querySelector('img[data-src]'); if(!img) return Promise.resolve();
    return new Promise(function(res){
      img.onload=img.onerror=function(){res()};
      var ss=img.getAttribute('data-srcset');
      if(ss){img.setAttribute('srcset',ss);img.removeAttribute('data-srcset');}
      img.src=img.getAttribute('data-src'); img.removeAttribute('data-src');
      if(img.decode){img.decode().then(res,res)}
    });
  }
  function setClasses(){
    root.classList.toggle('is-playing',autoplay&&!userPaused);
    var held=Object.keys(holds).some(function(k){return holds[k]});
    root.classList.toggle('is-hold',held);
    wrap.setAttribute('aria-live',(autoplay&&!userPaused)?'off':'polite');
    pauseBtn.style.display=reduce?'none':'';
  }
  function go(n,manual){
    if(n===idx||busy) return;
    if(manual){autoplay=false;} // any manual choice ends autoplay for this visit
    busy=true;
    load(n).then(function(){
      var from=slides[idx], to=slides[n];
      slides.forEach(function(s){s.classList.remove('is-prev')});
      from.classList.remove('is-active'); from.classList.add('is-prev'); from.setAttribute('aria-hidden','true');
      to.classList.add('is-active'); to.removeAttribute('aria-hidden');
      [].forEach.call(from.querySelectorAll('a,button'),function(a){a.setAttribute('tabindex','-1')});
      [].forEach.call(to.querySelectorAll('a,button'),function(a){a.removeAttribute('tabindex')});
      root.classList.add('is-cycled');
      tabs.forEach(function(t,i){ if(i===n) t.setAttribute('aria-current','true'); else t.removeAttribute('aria-current'); });
      idx=n; status.textContent=to.getAttribute('aria-label');
      setTimeout(function(){from.classList.remove('is-prev');busy=false},reduce?0:1700);
      setClasses();
    });
  }
  function next(){ go((idx+1)%slides.length,false); }
  tabs.forEach(function(t,i){
    t.addEventListener('click',function(){go(i,true)});
    t.addEventListener('keydown',function(e){
      if(e.key==='ArrowRight') go((idx+1)%slides.length,true);
      if(e.key==='ArrowLeft') go((idx+slides.length-1)%slides.length,true);
    });
  });
  // single source of timing: the active progress hairline's own animation; when it ends, advance
  root.addEventListener('animationend',function(e){ if(e.animationName==='heroFill') next(); });
  pauseBtn.addEventListener('click',function(){
    userPaused=!userPaused; autoplay=true;
    pauseBtn.setAttribute('aria-pressed',userPaused);
    pauseBtn.setAttribute('aria-label',userPaused?'Play slideshow':'Pause slideshow');
    setClasses();
  });
  // holds: mouse hover, keyboard focus inside, touch, tab hidden, hero scrolled out of view
  root.addEventListener('pointerenter',function(e){if(e.pointerType==='mouse'){holds.hover=true;setClasses()}});
  root.addEventListener('pointerleave',function(e){if(e.pointerType==='mouse'){holds.hover=false;setClasses()}});
  root.addEventListener('focusin',function(){holds.focus=true;setClasses()});
  root.addEventListener('focusout',function(){holds.focus=false;setClasses()});
  document.addEventListener('visibilitychange',function(){holds.hidden=document.hidden;setClasses()});
  if('IntersectionObserver' in window) new IntersectionObserver(function(en){holds.off=!en[0].isIntersecting;setClasses()},{threshold:.5}).observe(root);
  // swipe (phones): horizontal intent only; vertical scroll untouched (touch-action:pan-y)
  var sx,sy,st=false;
  wrap.addEventListener('touchstart',function(e){var t=e.touches[0];sx=t.clientX;sy=t.clientY;st=true;holds.touch=true;setClasses()},{passive:true});
  wrap.addEventListener('touchend',function(e){
    holds.touch=false; if(!st) return; st=false;
    var t=e.changedTouches[0], dx=t.clientX-sx, dy=t.clientY-sy;
    if(Math.abs(dx)>48&&Math.abs(dx)>Math.abs(dy)*1.5){ go(dx<0?(idx+1)%slides.length:(idx+slides.length-1)%slides.length,true); }
    setClasses();
  },{passive:true});
  wrap.addEventListener('touchcancel',function(){holds.touch=false;st=false;setClasses()},{passive:true});
  // lazy second slide: fetched after window load + idle, well before the first 8s dwell ends
  function preload(){ for(var i=1;i<slides.length;i++) load(i); }
  function onLoad(){ (window.requestIdleCallback||function(f){setTimeout(f,1200)})(preload,{timeout:2500}); }
  if(document.readyState==='complete') onLoad(); else window.addEventListener('load',onLoad);
  setClasses();
})();
