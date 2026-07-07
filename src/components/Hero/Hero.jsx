import React, { useEffect, useRef } from 'react';

export const Hero = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2');
    if (!gl) return;

    const vertSrc = `#version 300 es
      precision highp float;
      in vec4 position;
      void main(){gl_Position=position;}`;

    const fragSrc = `#version 300 es
      precision highp float;
      out vec4 O;
      uniform float time;
      uniform vec2 resolution;
      uniform vec3 u_color;
      #define FC gl_FragCoord.xy
      #define R resolution
      #define T (time+660.)
      float rnd(vec2 p){p=fract(p*vec2(12.9898,78.233));p+=dot(p,p+34.56);return fract(p.x*p.y);}
      float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);return mix(mix(rnd(i),rnd(i+vec2(1,0)),u.x),mix(rnd(i+vec2(0,1)),rnd(i+1.),u.x),u.y);}
      float fbm(vec2 p){float t=.0,a=1.;for(int i=0;i<5;i++){t+=a*noise(p);p*=mat2(1,-1.2,.2,1.2)*2.;a*=.5;}return t;}
      void main(){
        vec2 uv=(FC-.5*R)/R.y;
        vec3 col=vec3(1);
        uv.x+=.25;
        uv*=vec2(2,1);
        float n=fbm(uv*.28-vec2(T*.01,0));
        n=noise(uv*3.+n*2.);
        col.r-=fbm(uv+vec2(0,T*.015)+n);
        col.g-=fbm(uv*1.003+vec2(0,T*.015)+n+.003);
        col.b-=fbm(uv*1.006+vec2(0,T*.015)+n+.006);
        col=mix(col, u_color, dot(col,vec3(.21,.71,.07)));
        col=mix(vec3(.08),col,min(time*.1,1.));
        col=clamp(col,.08,1.);
        O=vec4(col,1);
      }`;

    const compileShader = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const vs = compileShader(gl.VERTEX_SHADER, vertSrc);
    const fs = compileShader(gl.FRAGMENT_SHADER, fragSrc);
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    
    const posLoc = gl.getAttribLocation(prog, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'resolution');
    const uTime = gl.getUniformLocation(prog, 'time');
    const uCol = gl.getUniformLocation(prog, 'u_color');
    const smokeColor = [0.949, 0.549, 0.220];

    const resize = () => {
      const dpr = Math.max(1, window.devicePixelRatio);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    let animationFrameId;
    const render = (now) => {
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(prog);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, now * 1e-3);
      gl.uniform3fv(uCol, smokeColor);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section id="hero">
      <canvas ref={canvasRef} className="hero-smoke-canvas" id="heroSmokeCanvas"></canvas>
      <div className="hero-smoke-overlay"></div>
      <div className="hero-content">
        <div className="hero-badge">Websites · Apps · Automations</div>
        <h1 className="hero-title">Build <em>smarter.</em><br />Launch <em>faster.</em></h1>
        <p className="hero-sub">Crafting high-performance digital experiences without burning your budget.</p>
        <div className="hero-btns">
          <a href="#contact" className="btn-primary">Start a Project →</a>
          <a href="#work" className="btn-secondary">View Work</a>
        </div>
      </div>
    </section>
  );
};
