// Measure every authored state at the current width, so switching never resizes the panel.
window.stabilizePanel = function(panel, visitStates) {
 let timer, lastWidth=0;
 function measure(){
  const width=panel.getBoundingClientRect().width;if(!width)return;
  lastWidth=width;
  const clone=panel.cloneNode(true);
  clone.setAttribute('aria-hidden','true');clone.inert=true;
  Object.assign(clone.style,{position:'fixed',left:'-10000px',top:'0',width:`${width}px`,height:'auto',minHeight:'0',visibility:'hidden',pointerEvents:'none'});
  panel.parentElement.append(clone);
  let height=0;
  try {visitStates(clone,()=>{height=Math.max(height,clone.getBoundingClientRect().height);});}
  finally {clone.remove();}
  panel.style.height=`${Math.ceil(height)}px`;
 }
 function schedule(){clearTimeout(timer);timer=setTimeout(measure,100);}
 const observer=new ResizeObserver(()=>{if(Math.abs(panel.getBoundingClientRect().width-lastWidth)>.5)schedule();});
 observer.observe(panel);document.fonts.ready.then(measure);
 return {refresh:measure};
};
