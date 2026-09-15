/* Adapted from the user's «СЕКРЕТ»: normalized type atlas, coherent-noise
   dissolve and travelling radial impulses. Native WebGL; no runtime library. */
window.createLetterScene = function () {
  const hero = document.getElementById('overview');
  const title = document.getElementById('hero-title');
  const resetButton = document.getElementById('reset-type');
  const faces = [
    { family: 'YS Display Light', weight: 300 },
    { family: 'Yeseva One', weight: 400 },
    { family: 'Playfair Display', weight: 900 },
    { family: 'Unbounded', weight: 900 },
    { family: 'Ruslan Display', weight: 400 },
    { family: 'Caveat', weight: 600, style: 'normal' },
    { family: 'Lobster', weight: 400, style: 'normal' },
    { family: 'Old Standard TT', weight: 400, style: 'italic' },
    { family: 'Press Start 2P', weight: 400, style: 'normal' },
    { family: 'Rubik Mono One', weight: 400, style: 'normal' }
  ];
  const letters = [];
  title.querySelectorAll('.title-line').forEach((line, row) => {
    const text = line.textContent;
    line.replaceChildren();
    for (const char of text) {
      const el = document.createElement('span');
      el.className = 'glyph' + (char === ' ' ? ' space' : '');
      el.textContent = char === ' ' ? '\u00a0' : char;
      line.append(el);
      if (char !== ' ') letters.push({ el, char, row, x: 0, y: 0, energy: 0,
        phase: Math.random() * Math.PI * 2, seed: Math.random(), flare: -10, face: 0 });
    }
  });
  const canvas = document.createElement('canvas');
  canvas.className = 'letter-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  hero.prepend(canvas);
  let gl;
  try { gl = canvas.getContext('webgl', { alpha: true, antialias: false, depth: false, premultipliedAlpha: true }); } catch (_) {}
  let ready = false, disabled = false, visible = true, frame = 0, last = 0, time = 0;
  let width = 1, height = 1, em = 100, nextFlare = 2 + Math.random() * 2, hovered = null;
  let program, background, texture, uniforms, bgUniforms, lost = false;
  const waves = [], pointer = { x: -10000, y: -10000 };
  const chars = [...new Set(letters.map(g => g.char))];
  const columns = 8, rows = Math.ceil(chars.length / columns);
  const quad = [-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1];
  let buffer, phraseTaps = 0, burstStarted = 0, burstUntil = 0;
  const randomFace = current => (Math.round(current) + 1 + Math.floor(Math.random() * (faces.length - 1))) % faces.length;
  function setRestFace(g, face){
    g.face=face;
    if(g===hovered)g.hoverFace=face;
    g.el.style.fontFamily=faces[face].family;
    g.el.style.fontWeight=faces[face].weight;g.el.style.fontStyle=faces[face].style||'normal';
  }
  function stopBurst(){burstUntil=0;phraseTaps=0;hero.dataset.burst='idle';}
  function phraseTap(){
    if(!ready||disabled||lost||burstUntil)return;
    phraseTaps++;
    if(phraseTaps===5){
      phraseTaps=0;burstStarted=performance.now();burstUntil=burstStarted+5000;
      letters.forEach(g=>{g.burstStep=-Infinity;g.burstFace=g.face;g.burstTarget=g.face;});
      hero.dataset.burst='active';resetButton.disabled=false;
      document.getElementById('announcer').textContent='Быстрая волна на пять секунд.';
    }
  }

  // Same expanding Gaussian wavefront and decay as «СЕКРЕТ».
  const common = `
    uniform vec4 uWaves[3];
    uniform vec2 uRes;
    uniform float uTime;
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
      return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
    float ripple(vec2 p,out vec2 push){push=vec2(0);float total=0.0;
      for(int i=0;i<3;i++){vec4 r=uWaves[i];if(r.w<=0.0)continue;
        vec2 d=(p-r.xy)*vec2(uRes.x/uRes.y,1);float dist=length(d);
        float band=exp(-pow((dist-r.z*.65)*5.2,2.0));
        float amp=band*exp(-r.z*(2.4/2.6))*r.w;
        total+=amp;push+=(dist>.0001?d/dist:vec2(0))*amp;
      }return total;}
  `;
  const vertex = `attribute vec2 aPosition;uniform vec2 uRes,uCenter;uniform float uSize,uAngle,uScale;
    varying vec2 vLocal,vPage;
    void main(){vLocal=aPosition*.5+.5;vec2 p=aPosition*uSize*.5*uScale;
      float c=cos(uAngle),s=sin(uAngle);p=mat2(c,-s,s,c)*p+uCenter;
      vPage=p/uRes;gl_Position=vec4(vPage*vec2(2,-2)+vec2(-1,1),0,1);}`;
  const fragment = `precision highp float;varying vec2 vLocal,vPage;
    uniform sampler2D uAtlas;uniform float uChar,uRows,uCount,uFace,uEnergy,uSize,uScale,uSeed,uHover;uniform vec3 uInk;
    ${common}
    float sampleFace(vec2 p,float face){
      if(p.x<0.0||p.x>1.0||p.y<0.0||p.y>1.0)return 0.0;
      vec2 cell=vec2(mod(uChar,8.0),floor(uChar/8.0)+face*uRows);
      return texture2D(uAtlas,(cell+p)/vec2(8.0,uRows*uCount)).a;
    }
    void main(){vec2 push;float wave=ripple(vPage,push);
      vec2 p=vLocal-push*.05;
      float e=clamp(uEnergy+wave*.8,0.0,1.0);
      p+=vec2(noise(vPage*vec2(13.0,9.0)+uTime*.35)-.5,
              noise(vPage*vec2(11.0,8.0)-uTime*.3+17.0)-.5)*e*e*.028;
      float last=uCount-1.0;float waveFace=last*.5*(1.0+sin(uTime*5.5+uSeed*31.0));
      float f=clamp(mix(uFace,waveFace,(1.0-uHover)*smoothstep(.035,.28,wave)),0.0,last),fi=floor(f);
      float blend=smoothstep(.27,.73,fract(f));
      // Each pixel belongs to one complete face: no pale double-image crossfade.
      float n=noise(vLocal*8.0+uTime*.15);
      float chosen=min(last,fi+step(n,blend));
      float mask=sampleFace(p,chosen);
      gl_FragColor=vec4(mix(uInk,vec3(.14,.28,.78),e*.12),mask);
    }`;
  const bgVertex = `attribute vec2 aPosition;varying vec2 vPage;void main(){vPage=aPosition*.5+.5;gl_Position=vec4(aPosition*vec2(1,-1),0,1);}`;
  const bgFragment = `precision highp float;varying vec2 vPage;${common}
    void main(){vec2 push;float wave=ripple(vPage,push);gl_FragColor=vec4(.14,.28,.93,wave*.04);}`;
  function compile(type, source) {
    const shader = gl.createShader(type); gl.shaderSource(shader, source); gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
    return shader;
  }
  function makeProgram(v, f) {
    const p = gl.createProgram(), vs = compile(gl.VERTEX_SHADER, v), fs = compile(gl.FRAGMENT_SHADER, f);
    gl.attachShader(p, vs); gl.attachShader(p, fs); gl.linkProgram(p); gl.deleteShader(vs); gl.deleteShader(fs);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    return p;
  }
  function locations(p, names) { return Object.fromEntries(names.map(n => [n, gl.getUniformLocation(p, n)])); }
  function use(p) {
    gl.useProgram(p); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    const a = gl.getAttribLocation(p, 'aPosition');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);
  }
  function makeAtlas() {
    const tile = Math.min(width < 600 ? 128 : 256,Math.floor(gl.getParameter(gl.MAX_TEXTURE_SIZE)/(rows*faces.length)));
    const atlas = document.createElement('canvas');atlas.width=columns*tile;atlas.height=rows*faces.length*tile;
    const ctx=atlas.getContext('2d');ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='alphabetic';
    faces.forEach((font,f)=>{
      ctx.font=`${font.style||'normal'} ${font.weight} 160px "${font.family}"`;
      const xHeight=ctx.measureText('о').actualBoundingBoxAscent||84;
      const widest=Math.max(...chars.map(c=>ctx.measureText(c).width));
      // Preserve the supplied YS face at its native em size; normalize only expressive variants.
      const size=f===0?tile/1.6:Math.min(160*(tile*.325/xHeight),160*tile*.68/widest);
      ctx.font=`${font.style||'normal'} ${font.weight} ${size}px "${font.family}"`;
      chars.forEach((char,i)=>ctx.fillText(char,(i%columns+.5)*tile,(f*rows+Math.floor(i/columns)+.65625)*tile));
    });
    gl.bindTexture(gl.TEXTURE_2D,texture);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,atlas);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  }
  function resize() {
    const r=canvas.getBoundingClientRect();width=r.width;height=r.height;em=parseFloat(getComputedStyle(title).fontSize);
    const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
    // Keep each original glyph's advance, instead of imposing a monospace grid.
    const metrics=document.createElement('canvas').getContext('2d');
    metrics.font=`300 ${em}px "YS Display Light"`;
    for(const g of letters)g.el.style.width=`${metrics.measureText(g.char).width}px`;
    for(const g of letters){const b=g.el.getBoundingClientRect();g.x=b.x-r.x+b.width/2;g.y=b.y-r.y+b.height*.5;g.hitWidth=b.width;}
    if(ready&&!lost){gl.viewport(0,0,canvas.width,canvas.height);makeAtlas();draw(0);}
  }
  function waveData(){const a=new Float32Array(12);waves.forEach((w,i)=>a.set([w.x,w.y,time-w.at,1],i*4));return a;}
  function draw(dt) {
    const now=performance.now();
    if(burstUntil&&now>=burstUntil)stopBurst();
    const burstAge=burstUntil?(now-burstStarted)/1000:0;
    const burstEnvelope=burstUntil?Math.min(1,burstAge/.25,(burstUntil-now)/500):0;
    gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.enable(gl.BLEND);gl.blendFuncSeparate(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA,gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
    const data=waveData();use(background);gl.uniform2f(bgUniforms.uRes,width,height);gl.uniform1f(bgUniforms.uTime,time);gl.uniform4fv(bgUniforms['uWaves[0]'],data);gl.drawArrays(gl.TRIANGLES,0,6);
    use(program);gl.uniform2f(uniforms.uRes,width,height);gl.uniform1f(uniforms.uTime,time);gl.uniform4fv(uniforms['uWaves[0]'],data);gl.uniform1f(uniforms.uRows,rows);gl.uniform1f(uniforms.uCount,faces.length);gl.uniform1i(uniforms.uAtlas,0);
    for(const g of letters){
      // A wave commits one new resting face as its front reaches this letter.
      for(const w of waves){
        const distance=Math.hypot((g.x/width-w.x)*width/height,g.y/height-w.y);
        if(!w.touched.has(g)&&(time-w.at)*.65>=distance){
          setRestFace(g,randomFace(g.face));w.touched.add(g);
        }
      }
      if(g===hovered&&time>=g.nextHover){
        g.hoverFace=randomFace(g.hoverFace);g.nextHover=time+.12;
      }
      const age=time-g.flare;const flare=age>=0&&age<3.0?Math.pow(Math.sin(Math.PI*age/3.0),.8):0;
      const target=g===hovered?.86:0;g.energy+=(target-g.energy)*(1-Math.exp(-dt*5));
      const energy=Math.max(g.energy,flare*.9);
      const interactionFace=g===hovered&&g.hoverFace!=null?g.hoverFace:(g.face+1+Math.floor(g.seed*(faces.length-1)))%faces.length;
      let face=g.face+(interactionFace-g.face)*Math.min(1,energy/.75);
      let hop=0;
      if(burstUntil){
        const phase=burstAge*5.5-g.x/width*1.5-g.row*.3;
        const step=Math.floor(phase);
        if(step!==g.burstStep){g.burstStep=step;g.burstTarget=randomFace(g.burstTarget);}
        g.burstFace+=(g.burstTarget-g.burstFace)*(1-Math.exp(-dt*16));
        face+=(g.burstFace-face)*burstEnvelope;
        hop=Math.sin(phase*Math.PI*2)*em*.09*burstEnvelope;
      }
      if(g===hovered)face=g.hoverFace;
      const driftX=Math.sin(time*.22+g.phase)*em*.012,driftY=Math.sin(time*.29+g.phase)*em*.023;
      let pushX=0,pushY=0,waveEnergy=0;
      for(const w of waves){const dx=(g.x/width-w.x)*width/height,dy=g.y/height-w.y,dist=Math.hypot(dx,dy),age=time-w.at;
        const amp=Math.exp(-Math.pow((dist-age*.65)*5.2,2))*Math.exp(-age*(2.4/2.6));
        waveEnergy+=amp;if(dist){pushX+=dx/dist*amp*em*.05;pushY+=dy/dist*amp*em*.05;}}
      const scale=Math.min(1.08,1+Math.sin(time*.38+g.phase)*.018+energy*.045+waveEnergy*.03+Math.sin(burstAge*10+g.phase)*.02*burstEnvelope);
      gl.uniform2f(uniforms.uCenter,g.x+driftX+pushX,g.y+driftY+pushY+hop);
      gl.uniform1f(uniforms.uSize,em*1.6);gl.uniform1f(uniforms.uScale,scale);gl.uniform1f(uniforms.uAngle,Math.sin(time*.18+g.phase)*.008+energy*(g.seed-.5)*.08);
      gl.uniform1f(uniforms.uChar,chars.indexOf(g.char));gl.uniform1f(uniforms.uFace,face);gl.uniform1f(uniforms.uEnergy,Math.max(energy,burstEnvelope*.5));gl.uniform1f(uniforms.uSeed,g.seed);gl.uniform1f(uniforms.uHover,g===hovered?1:0);
      gl.uniform3fv(uniforms.uInk,g.row===1?[.141,.278,.933]:[.078,.137,.18]);gl.drawArrays(gl.TRIANGLES,0,6);
    }
  }
  function tick(now){frame=0;if(!ready||disabled||!visible||document.hidden||lost)return;
    const dt=Math.min((now-last)/1000||0,.05);last=now;time+=dt;
    while(waves.length&&time-waves[0].at>2.6)waves.shift();
    if(time>=nextFlare){const candidates=letters.filter(g=>g!==hovered);const count=1+Math.floor(Math.random()*5);for(let i=0;i<count;i++){const g=candidates.splice(Math.floor(Math.random()*candidates.length),1)[0];g.flare=time;}nextFlare=time+3+Math.random()*4;}
    draw(dt);frame=requestAnimationFrame(tick);
  }
  function sync(){cancelAnimationFrame(frame);frame=0;if(disabled||!visible||document.hidden||lost)stopBurst();
    hero.classList.toggle('has-letter-scene',ready&&!disabled&&!lost);
    document.getElementById('wave-type').disabled=disabled||!ready||lost;
    hero.dataset.drift=visible&&!document.hidden&&!disabled?'active':'paused';
    if(ready&&!disabled&&visible&&!document.hidden&&!lost){last=performance.now();frame=requestAnimationFrame(tick);}
  }
  function cancelActivity(){stopBurst();waves.length=0;leaveGlyph();letters.forEach(g=>{g.energy=0;g.flare=-10;});nextFlare=time+4;}
  function clear(){cancelActivity();letters.forEach(g=>setRestFace(g,0));resetButton.disabled=true;}
  function pulse(x,y){if(!ready||disabled||lost)return;if(waves.length===3)waves.shift();waves.push({x:x/width,y:y/height,at:time,touched:new Set()});resetButton.disabled=false;}
  function leaveGlyph(){
    if(hovered&&hovered.hoverFace!=null){setRestFace(hovered,hovered.hoverFace);hovered.energy=0;}
    hovered=null;
  }
  function hit(e){
    const r=canvas.getBoundingClientRect();pointer.x=e.clientX-r.x;pointer.y=e.clientY-r.y;
    const next=letters.find(g=>Math.abs(pointer.x-g.x)<g.hitWidth/2&&Math.abs(pointer.y-g.y)<em*.55)||null;
    if(next!==hovered){
      leaveGlyph();hovered=next;
      if(next){
        next.hoverFace=randomFace(next.face);next.nextHover=time+.12;next.flare=-10;resetButton.disabled=false;
        if(disabled||!ready||lost)setRestFace(next,next.hoverFace);
      }
    }
  }
  hero.addEventListener('pointermove',e=>{if(e.pointerType!=='touch')hit(e);});
  hero.addEventListener('pointerleave',leaveGlyph);
  let down=null;
  hero.addEventListener('pointerdown',e=>{
    if(e.button!==0||e.isPrimary===false||e.target.closest('button,a'))return;
    down={x:e.clientX,y:e.clientY,id:e.pointerId,onPhrase:title.contains(e.target)};
    if(e.pointerType!=='touch'){hit(e);pulse(pointer.x,pointer.y);}
  });
  hero.addEventListener('pointerup',e=>{
    if(down&&down.id===e.pointerId&&Math.hypot(e.clientX-down.x,e.clientY-down.y)<12){
      if(e.pointerType==='touch'){const r=canvas.getBoundingClientRect();pulse(e.clientX-r.x,e.clientY-r.y);}
      if(down.onPhrase&&title.contains(e.target))phraseTap();
    }
    down=null;
  });
  hero.addEventListener('pointercancel',()=>{down=null;leaveGlyph();});
  title.tabIndex=0;
  title.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&!e.repeat){e.preventDefault();const r=title.getBoundingClientRect(),c=canvas.getBoundingClientRect();pulse(r.x-c.x+r.width/2,r.y-c.y+r.height/2);phraseTap();}});
  const resizeObserver=new ResizeObserver(()=>resize());resizeObserver.observe(hero);
  if('IntersectionObserver'in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();}).observe(hero);
  document.addEventListener('visibilitychange',sync);
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();lost=true;sync();});
  canvas.addEventListener('webglcontextrestored',()=>{lost=false;boot();});
  function boot(){try{
    program=makeProgram(vertex,fragment);background=makeProgram(bgVertex,bgFragment);
    uniforms=locations(program,['uRes','uTime','uWaves[0]','uRows','uCount','uAtlas','uCenter','uSize','uScale','uAngle','uChar','uFace','uEnergy','uSeed','uHover','uInk']);
    bgUniforms=locations(background,['uRes','uTime','uWaves[0]']);
    buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(quad),gl.STATIC_DRAW);
    texture=gl.createTexture();ready=true;resize();sync();
  }catch(error){ready=false;sync();console.warn('Letter scene uses static fallback:',error.message);}}
  if(gl)Promise.all(faces.map(async f=>{
    const loaded=await document.fonts.load(`${f.style||'normal'} ${f.weight} 100px "${f.family}"`,chars.join(''));
    if(!loaded.length)throw new Error(`Font unavailable: ${f.family}`);
  })).then(boot).catch(error=>{sync();console.warn(error.message);});
  return {
    setMotion(off){disabled=off;if(off)cancelActivity();sync();},
    shuffle(){letters.forEach(g=>setRestFace(g,randomFace(g.face)));resetButton.disabled=false;},
    reset(){clear();if(ready&&!disabled)draw(0);},
    pulse(){pulse(width/2,height/2);},
  };
};
