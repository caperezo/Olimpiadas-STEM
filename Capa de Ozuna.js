/* ============================= */
/* script.js */
/* ============================= */
(function(){
  const sl=document.getElementById('x'),xOut=document.getElementById('xOut');
  const tVal=document.getElementById('tVal'),hVal=document.getElementById('hVal'),
        lVal=document.getElementById('lVal');
  const cv=document.getElementById('cv');
  const nf=new Intl.NumberFormat('es-CO',{minimumFractionDigits:1,maximumFractionDigits:1});
  const T=x=>0.0172*x+22.728, H=x=>0.5784*x+48.971, L=x=>-0.299*x+97.397;

  function draw(cur,modo){
    const ctx=cv.getContext('2d'),r=cv.getBoundingClientRect();
    const W=r.width||600,Hh=r.height||330,dpr=window.devicePixelRatio||1;
    cv.width=W*dpr;cv.height=Hh*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.clearRect(0,0,W,Hh);
    const pL=54,pR=24,pT=24,pB=40,cw=W-pL-pR,ch=Hh-pT-pB;
    let yMin=1e9,yMax=-1e9;
    for(let x=0;x<=60;x+=1){
      [T(x),H(x),L(x)].forEach(v=>{if(v<yMin)yMin=v;if(v>yMax)yMax=v;});}
    yMin=Math.floor(yMin/10)*10;yMax=Math.ceil(yMax/10)*10;
    const X=v=>pL+v/60*cw, Y=v=>pT+ch-(v-yMin)/(yMax-yMin)*ch;
    ctx.font='10px "Space Grotesk",sans-serif';ctx.fillStyle='#7a75a0';
    ctx.strokeStyle='rgba(0,245,212,.08)';ctx.lineWidth=1;
    ctx.textAlign='right';ctx.textBaseline='middle';
    for(let i=0;i<=5;i++){const v=yMin+(yMax-yMin)*i/5,y=Y(v);
      ctx.beginPath();ctx.moveTo(pL,y);ctx.lineTo(pL+cw,y);ctx.stroke();
      ctx.fillText(v.toFixed(0),pL-8,y);}
    ctx.textAlign='center';ctx.textBaseline='top';
    for(let v=0;v<=60;v+=10){const px=X(v);ctx.fillText(v,px,pT+ch+8);}
    const series=[[T,'#ff006e'],[H,'#00f5d4'],[L,'#a09cc0']];
    series.forEach(([fn,c])=>{
      ctx.beginPath();
      for(let x=0;x<=60;x+=.4){const px=X(x),py=Y(fn(x));
        x===0?ctx.moveTo(px,py):ctx.lineTo(px,py);}
      ctx.strokeStyle=c;ctx.lineWidth=2.5;
      ctx.shadowColor=c;ctx.shadowBlur=10;ctx.stroke();ctx.shadowBlur=0;
    });
    const mapa={temp:[T,'#ff006e'],hum:[H,'#00f5d4'],luz:[L,'#a09cc0']};
    const [fn,c]=mapa[modo];
    const px=X(cur),py=Y(fn(cur));
    ctx.beginPath();ctx.arc(px,py,7,0,Math.PI*2);ctx.fillStyle=c;
    ctx.shadowColor=c;ctx.shadowBlur=18;ctx.fill();ctx.shadowBlur=0;
    ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.stroke();
  }
  function update(){
    const x=+sl.value;
    const modo=(document.querySelector('input[name=m]:checked')||{value:'temp'}).value;
    xOut.textContent='X = '+x;
    tVal.textContent=nf.format(T(x));
    hVal.textContent=nf.format(H(x));
    lVal.textContent=nf.format(L(x));
    draw(x,modo);
  }
  sl.addEventListener('input',update);
  document.querySelectorAll('input[name=m]').forEach(r=>r.addEventListener('change',update));
  window.addEventListener('resize',update);
  update();
})();