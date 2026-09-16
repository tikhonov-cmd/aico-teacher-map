// Route panels use one measured size; the demo uses a compact and an expanded size.
window.stabilizePanel = function(panel, visitStates, {twoSizes=false}={}) {
 let timer,lastWidth=0,compact=0,expanded=0;
 function probe(){
  const clone=panel.cloneNode(true);clone.setAttribute('aria-hidden','true');clone.inert=true;
  Object.assign(clone.style,{position:'fixed',left:'-10000px',top:'0',width:`${panel.getBoundingClientRect().width}px`,height:'auto',minHeight:'0',visibility:'hidden',pointerEvents:'none',transition:'none'});
  panel.parentElement.append(clone);return clone;
 }
 function fit(){
  if(!expanded)return;
  let size='expanded';
  if(twoSizes){const clone=probe();try{if(clone.getBoundingClientRect().height<=compact+.5)size='compact';}finally{clone.remove();}}
  panel.dataset.size=size;panel.style.height=`${size==='compact'?compact:expanded}px`;
 }
 function measure(){
  const width=panel.getBoundingClientRect().width;if(!width)return;lastWidth=width;
  const clone=probe();compact=0;expanded=0;
  try{visitStates(clone,(size='expanded')=>{const height=Math.ceil(clone.getBoundingClientRect().height);expanded=Math.max(expanded,height);if(size==='compact')compact=Math.max(compact,height);});}
  finally{clone.remove();}
  fit();
 }
 function schedule(){clearTimeout(timer);timer=setTimeout(measure,100);}
 const observer=new ResizeObserver(()=>{if(Math.abs(panel.getBoundingClientRect().width-lastWidth)>.5)schedule();});
 observer.observe(panel);document.fonts.ready.then(measure);
 return {refresh:measure,fit};
};
