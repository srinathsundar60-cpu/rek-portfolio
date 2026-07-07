import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../../services/supabase';

export const Portfolio = () => {
  const canvasRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // WebGL Shadow Canvas
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
      #define FC gl_FragCoord.xy
      #define R resolution
      #define T (time+200.)
      float rnd(vec2 p){p=fract(p*vec2(12.9898,78.233));p+=dot(p,p+34.56);return fract(p.x*p.y);}
      float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);return mix(mix(rnd(i),rnd(i+vec2(1,0)),u.x),mix(rnd(i+vec2(0,1)),rnd(i+1.),u.x),u.y);}
      float fbm(vec2 p){float t=.0,a=1.;for(int i=0;i<6;i++){t+=a*noise(p);p*=mat2(1.6,-1.2,.2,1.4);a*=.5;}return t;}
      void main(){
        vec2 uv=(FC-.5*R)/R.y;
        uv*=1.4;
        float n=fbm(uv*.5+vec2(T*.008,0.));
        float n2=fbm(uv*.8-vec2(0.,T*.006)+n*.7);
        float n3=fbm(uv*1.2+vec2(T*.004,T*.003)+n2*.5);
        /* Orange core */
        vec3 col=vec3(0.04,0.04,0.05);
        col+=vec3(0.95,0.43,0.08)*pow(max(0.,n3-.2),2.2)*1.8;
        col+=vec3(0.6,0.22,0.02)*pow(max(0.,n2-.3),1.6)*1.1;
        col+=vec3(0.15,0.08,0.02)*n*0.6;
        /* Vignette */
        float dist=length(uv*vec2(0.7,1.0));
        col*=smoothstep(1.6,0.1,dist);
        col=clamp(col,0.,1.);
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
      gl.useProgram(prog);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, now * 1e-3);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Fetch Supabase Data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, title, description, image_url, product_url')
          .eq('visible', true)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section id="work" className="section bg-black" style={{ padding: '0', overflow: 'hidden' }}>
      <div className="work-hero reveal js-reveal">
        <canvas ref={canvasRef} id="workShadowCanvas" className="work-hero-canvas" aria-hidden="true"></canvas>
        <div className="work-hero-mask"></div>
        <div className="work-hero-noise"></div>
        <div className="work-hero-content">
          <span className="section-label">Portfolio</span>
          <h2 className="section-title">What we build.</h2>
          <p className="portfolio-intro">We don't just plan. We build. Here's what we've shipped, and what's next.</p>
        </div>
      </div>

      <div id="portfolioGrid" className="portfolio-grid" aria-live="polite" aria-label="Portfolio projects">
        {loading ? (
          <>
            <div className="portfolio-card portfolio-skeleton" aria-hidden="true">
              <div className="portfolio-preview" style={{ background: 'var(--grey-bg)' }}></div>
              <div className="portfolio-body">
                <div className="skel-line" style={{ width: '40%', height: '10px', marginBottom: '.6rem' }}></div>
                <div className="skel-line" style={{ width: '80%', height: '14px', marginBottom: '.4rem' }}></div>
                <div className="skel-line" style={{ width: '65%', height: '10px' }}></div>
              </div>
            </div>
            <div className="portfolio-card portfolio-skeleton" aria-hidden="true">
              <div className="portfolio-preview" style={{ background: 'var(--grey-bg)' }}></div>
              <div className="portfolio-body">
                <div className="skel-line" style={{ width: '40%', height: '10px', marginBottom: '.6rem' }}></div>
                <div className="skel-line" style={{ width: '80%', height: '14px', marginBottom: '.4rem' }}></div>
                <div className="skel-line" style={{ width: '65%', height: '10px' }}></div>
              </div>
            </div>
          </>
        ) : products.length > 0 ? (
          products.map((product) => (
            <a key={product.id} href={product.product_url} target="_blank" rel="noopener noreferrer" className="portfolio-card fade-up">
              <div className="portfolio-preview">
                <img src={product.image_url} alt={`${product.title} preview`} loading="lazy" />
              </div>
              <div className="portfolio-body">
                <div className="portfolio-title">{product.title}</div>
                <p className="portfolio-desc">{product.description}</p>
                <div className="portfolio-link">View Project →</div>
              </div>
            </a>
          ))
        ) : (
          <div className="portfolio-empty">
            <p>No visible projects found.</p>
          </div>
        )}
      </div>
    </section>
  );
};
