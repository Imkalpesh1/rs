/**
 * MoltenMetal — Vanilla WebGL2 port (no React, no OGL)
 * Ported from the React Bits MoltenMetal component for use in static HTML projects.
 *
 * Usage:
 *   initMoltenMetal(containerElement, options)
 */

(function () {
  'use strict';

  function hexToRgb(hex) {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!r) return [1, 1, 1];
    return [parseInt(r[1], 16) / 255, parseInt(r[2], 16) / 255, parseInt(r[3], 16) / 255];
  }

  function colorModeToFloat(mode) {
    return mode === 'ember' ? 1 : mode === 'frost' ? 2 : 0;
  }

  const VERT_SRC = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

  const FRAG_SRC = `#version 300 es
precision highp float;
uniform vec2  iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uScale;
uniform float uDetail;
uniform float uGlow;
uniform float uCoreSize;
uniform float uSwirl;
uniform float uFold;
uniform float uBlackPoint;
uniform float uBrightness;
uniform float uColorMode;
uniform float uGrain;
uniform float uGrainIntensity;
uniform float uOpacity;
uniform vec2  uMouse;
uniform float uMouseStrength;
uniform bool  uEnableMouse;
uniform vec3  uColor1;
uniform vec3  uColor2;
uniform vec3  uColor3;
out vec4 fragColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  float time = iTime * uSpeed;
  vec2 p = uScale * ((gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y) - 0.5;

  vec2 drift = vec2(0.0);
  if (uEnableMouse) {
    drift = (uMouse - 0.5) * uMouseStrength * 2.0;
  }
  p += drift;

  vec2 i = p;
  float c   = 0.0;
  float r   = length(p + vec2(sin(time), sin(time * 0.3 + 5.0)) * 0.5);
  float d   = length(p);
  float rot = d + time + p.x * uSwirl;

  float cosRot = cos(rot);
  mat2 warp = mat2(
    cos(rot - sin(time / 5.0)), sin(rot),
    -sin(cosRot - time),         cosRot
  ) * uFold;
  float glowCore = uGlow * uCoreSize;

  for (float n = 0.0; n < 8.0; n++) {
    if (n >= uDetail) break;
    p *= warp;
    float t = r - time / (n + 3.0);
    i -= p + vec2(
      cos(t - i.x - r) + sin(t + i.y),
      sin(t - i.y)     + cos(t + i.x) + r
    );
    c += glowCore / length(vec2(sin(i.x + t), cos(i.y + t)));
  }

  c /= 6.0;

  float intensity = max(c - uBlackPoint, 0.0) * uBrightness;
  float g = clamp(intensity, 0.0, 1.0);

  float mid = 0.5;
  if      (uColorMode > 1.5) mid = 0.65;
  else if (uColorMode > 0.5) mid = 0.35;

  vec3 col = mix(uColor1, uColor2, smoothstep(0.0, mid, g));
  col      = mix(col,     uColor3, smoothstep(mid, 1.0, g));

  float a = g;
  if (uGrain > 0.5) {
    float gr = hash(gl_FragCoord.xy + iTime);
    a += (gr - 0.5) * uGrainIntensity;
  }
  a = clamp(a, 0.0, 1.0) * uOpacity;
  fragColor = vec4(col * a, a);
}`;

  function compileShader(gl, type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error('[MoltenMetal] Shader compile error:', gl.getShaderInfoLog(s));
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  function createProgram(gl) {
    const vs = compileShader(gl, gl.VERTEX_SHADER,   VERT_SRC);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
    if (!vs || !fs) return null;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('[MoltenMetal] Program link error:', gl.getProgramInfoLog(prog));
      return null;
    }
    return prog;
  }

  function initMoltenMetal(container, opts) {
    opts = Object.assign({
      color1:           '#5227FF',
      color2:           '#FF9FFC',
      color3:           '#FFFFFF',
      speed:            0.35,
      scale:            4,
      detail:           3,
      glow:             1.6,
      coreSize:         0.1,
      swirl:            1,
      fold:             -0.2,
      blackPoint:       0.05,
      brightness:       1.3,
      colorMode:        'molten',
      grain:            true,
      grainIntensity:   0.05,
      mouseInteraction: true,
      mouseStrength:    0.3,
      opacity:          1.0
    }, opts);

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;';
    container.appendChild(canvas);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const gl  = canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false
    });

    if (!gl) {
      console.warn('[MoltenMetal] WebGL2 not supported.');
      return function() {};
    }

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const prog = createProgram(gl);
    if (!prog) return function() {};

    gl.useProgram(prog);

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(prog, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const U = {};
    ['iTime','iResolution','uSpeed','uScale','uDetail','uGlow','uCoreSize',
     'uSwirl','uFold','uBlackPoint','uBrightness','uColorMode','uGrain',
     'uGrainIntensity','uOpacity','uMouse','uMouseStrength','uEnableMouse',
     'uColor1','uColor2','uColor3'
    ].forEach(function(n) { U[n] = gl.getUniformLocation(prog, n); });

    function applyUniforms() {
      var c1 = hexToRgb(opts.color1);
      var c2 = hexToRgb(opts.color2);
      var c3 = hexToRgb(opts.color3);
      gl.uniform1f(U.uSpeed,          opts.speed);
      gl.uniform1f(U.uScale,          opts.scale);
      gl.uniform1f(U.uDetail,         opts.detail);
      gl.uniform1f(U.uGlow,           opts.glow);
      gl.uniform1f(U.uCoreSize,       Math.max(opts.coreSize, 0.001));
      gl.uniform1f(U.uSwirl,          opts.swirl);
      gl.uniform1f(U.uFold,           opts.fold);
      gl.uniform1f(U.uBlackPoint,     opts.blackPoint);
      gl.uniform1f(U.uBrightness,     opts.brightness);
      gl.uniform1f(U.uColorMode,      colorModeToFloat(opts.colorMode));
      gl.uniform1f(U.uGrain,          opts.grain ? 1 : 0);
      gl.uniform1f(U.uGrainIntensity, opts.grainIntensity);
      gl.uniform1f(U.uOpacity,        opts.opacity);
      gl.uniform1f(U.uMouseStrength,  opts.mouseStrength);
      gl.uniform1i(U.uEnableMouse,    opts.mouseInteraction ? 1 : 0);
      gl.uniform3fv(U.uColor1, c1);
      gl.uniform3fv(U.uColor2, c2);
      gl.uniform3fv(U.uColor3, c3);
    }

    function resize() {
      var rect = container.getBoundingClientRect();
      var w = Math.max(1, Math.floor(rect.width  * dpr));
      var h = Math.max(1, Math.floor(rect.height * dpr));
      canvas.width  = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.useProgram(prog);
      gl.uniform2f(U.iResolution, w, h);
    }

    var ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();
    applyUniforms();

    var targetMouse  = [0.5, 0.5];
    var currentMouse = [0.5, 0.5];

    function onMouseMove(e) {
      var rect = canvas.getBoundingClientRect();
      targetMouse[0] = (e.clientX - rect.left) / rect.width;
      targetMouse[1] = 1.0 - (e.clientY - rect.top) / rect.height;
    }
    function onMouseLeave() { targetMouse[0] = 0.5; targetMouse[1] = 0.5; }
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);

    var raf = 0;
    var isVisible = true;
    var isPageVisible = !document.hidden;
    var t0 = performance.now();

    function loop(t) {
      var time = (t - t0) * 0.001;
      currentMouse[0] += 0.05 * (targetMouse[0] - currentMouse[0]);
      currentMouse[1] += 0.05 * (targetMouse[1] - currentMouse[1]);
      gl.useProgram(prog);
      gl.uniform1f(U.iTime, time);
      gl.uniform2fv(U.uMouse, currentMouse);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.bindVertexArray(vao);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(loop);
    }

    function tryStart() { if (isVisible && isPageVisible && raf === 0) raf = requestAnimationFrame(loop); }
    function tryStop()  { if (raf !== 0) { cancelAnimationFrame(raf); raf = 0; } }

    var io = new IntersectionObserver(function(entries) {
      isVisible = entries[0].isIntersecting;
      isVisible ? tryStart() : tryStop();
    }, { threshold: 0 });
    io.observe(container);

    function onVisibility() { isPageVisible = !document.hidden; isPageVisible ? tryStart() : tryStop(); }
    document.addEventListener('visibilitychange', onVisibility);

    tryStart();

    return function destroy() {
      tryStop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      try { container.removeChild(canvas); } catch (_) {}
      var ext = gl.getExtension('WEBGL_lose_context');
      if (ext) ext.loseContext();
    };
  }

  window.initMoltenMetal = initMoltenMetal;
})();
