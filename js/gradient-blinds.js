/* GradientBlinds WebGL Component from React Bits */
(function initGradientBlinds() {
    const container = document.getElementById('gradientBlindsCanvasContainer');
    const parentSection = document.getElementById('preFooterSection');
    if (!container) return;

    const canvas = document.createElement('canvas');
    container.appendChild(canvas);

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    const vertexShaderSource = `
        attribute vec2 position;
        attribute vec2 uv;
        varying vec2 vUv;

        void main() {
            vUv = uv;
            gl_Position = vec4(position, 0.0, 1.0);
        }
    `;

    const fragmentShaderSource = `
        #ifdef GL_ES
        precision mediump float;
        #endif

        uniform vec3  iResolution;
        uniform vec2  iMouse;
        uniform float iTime;

        uniform float uAngle;
        uniform float uNoise;
        uniform float uBlindCount;
        uniform float uSpotlightRadius;
        uniform float uSpotlightSoftness;
        uniform float uSpotlightOpacity;
        uniform float uMirror;
        uniform float uDistort;
        uniform float uShineFlip;
        uniform vec3  uColor0;
        uniform vec3  uColor1;
        uniform vec3  uColor2;
        uniform vec3  uColor3;
        uniform vec3  uColor4;
        uniform vec3  uColor5;
        uniform vec3  uColor6;
        uniform vec3  uColor7;
        uniform int   uColorCount;

        varying vec2 vUv;

        float rand(vec2 co){
            return fract(sin(dot(co, vec2(12.9898,78.233))) * 43758.5453);
        }

        vec2 rotate2D(vec2 p, float a){
            float c = cos(a);
            float s = sin(a);
            return mat2(c, -s, s, c) * p;
        }

        vec3 getGradientColor(float t){
            float tt = clamp(t, 0.0, 1.0);
            int count = uColorCount;
            if (count < 2) count = 2;
            float scaled = tt * float(count - 1);
            float seg = floor(scaled);
            float f = fract(scaled);

            if (seg < 1.0) return mix(uColor0, uColor1, f);
            if (seg < 2.0 && count > 2) return mix(uColor1, uColor2, f);
            if (seg < 3.0 && count > 3) return mix(uColor2, uColor3, f);
            if (seg < 4.0 && count > 4) return mix(uColor3, uColor4, f);
            if (seg < 5.0 && count > 5) return mix(uColor4, uColor5, f);
            if (seg < 6.0 && count > 6) return mix(uColor5, uColor6, f);
            if (seg < 7.0 && count > 7) return mix(uColor6, uColor7, f);
            if (count > 7) return uColor7;
            if (count > 6) return uColor6;
            if (count > 5) return uColor5;
            if (count > 4) return uColor4;
            if (count > 3) return uColor3;
            if (count > 2) return uColor2;
            return uColor1;
        }

        void mainImage( out vec4 fragColor, in vec2 fragCoord )
        {
            vec2 uv0 = fragCoord.xy / iResolution.xy;

            float aspect = iResolution.x / iResolution.y;
            vec2 p = uv0 * 2.0 - 1.0;
            p.x *= aspect;
            vec2 pr = rotate2D(p, uAngle);
            pr.x /= aspect;
            vec2 uv = pr * 0.5 + 0.5;

            vec2 uvMod = uv;
            if (uDistort > 0.0) {
                float a = uvMod.y * 6.0;
                float b = uvMod.x * 6.0;
                float w = 0.01 * uDistort;
                uvMod.x += sin(a) * w;
                uvMod.y += cos(b) * w;
            }
            float t = uvMod.x;
            if (uMirror > 0.5) {
                t = 1.0 - abs(1.0 - 2.0 * fract(t));
            }
            vec3 base = getGradientColor(t);

            vec2 offset = vec2(iMouse.x/iResolution.x, iMouse.y/iResolution.y);
            float d = length(uv0 - offset);
            float r = max(uSpotlightRadius, 1e-4);
            float dn = d / r;
            float spot = (1.0 - 2.0 * pow(dn, uSpotlightSoftness)) * uSpotlightOpacity;
            vec3 cir = vec3(spot);
            float stripe = fract(uvMod.x * max(uBlindCount, 1.0));
            if (uShineFlip > 0.5) stripe = 1.0 - stripe;
            vec3 ran = vec3(stripe);

            vec3 col = cir + base - ran;
            col += (rand(gl_FragCoord.xy + vec2(iTime)) - 0.5) * uNoise;

            fragColor = vec4(col, 1.0);
        }

        void main() {
            vec4 color;
            mainImage(color, vUv * iResolution.xy);
            gl_FragColor = color;
        }
    `;

    function createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader compile error:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program link error:', gl.getProgramInfoLog(program));
        return;
    }
    gl.useProgram(program);

    const positions = new Float32Array([
        -1, -1,
         3, -1,
        -1,  3
    ]);
    const uvs = new Float32Array([
        0, 0,
        2, 0,
        0, 2
    ]);

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);
    const uvLoc = gl.getAttribLocation(program, 'uv');
    gl.enableVertexAttribArray(uvLoc);
    gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 0, 0);

    const uLocations = {
        iResolution: gl.getUniformLocation(program, 'iResolution'),
        iMouse: gl.getUniformLocation(program, 'iMouse'),
        iTime: gl.getUniformLocation(program, 'iTime'),
        uAngle: gl.getUniformLocation(program, 'uAngle'),
        uNoise: gl.getUniformLocation(program, 'uNoise'),
        uBlindCount: gl.getUniformLocation(program, 'uBlindCount'),
        uSpotlightRadius: gl.getUniformLocation(program, 'uSpotlightRadius'),
        uSpotlightSoftness: gl.getUniformLocation(program, 'uSpotlightSoftness'),
        uSpotlightOpacity: gl.getUniformLocation(program, 'uSpotlightOpacity'),
        uMirror: gl.getUniformLocation(program, 'uMirror'),
        uDistort: gl.getUniformLocation(program, 'uDistort'),
        uShineFlip: gl.getUniformLocation(program, 'uShineFlip'),
        uColorCount: gl.getUniformLocation(program, 'uColorCount')
    };

    for (let i = 0; i < 8; i++) {
        uLocations[`uColor${i}`] = gl.getUniformLocation(program, `uColor${i}`);
    }

    const MAX_COLORS = 8;
    const hexToRGB = hex => {
        const c = hex.replace('#', '').padEnd(6, '0');
        const r = parseInt(c.slice(0, 2), 16) / 255;
        const g = parseInt(c.slice(2, 4), 16) / 255;
        const b = parseInt(c.slice(4, 6), 16) / 255;
        return [r, g, b];
    };
    const prepStops = stops => {
        const base = (stops && stops.length ? stops : ['#FF9FFC', '#5227FF']).slice(0, MAX_COLORS);
        if (base.length === 1) base.push(base[0]);
        while (base.length < MAX_COLORS) base.push(base[base.length - 1]);
        const arr = [];
        for (let i = 0; i < MAX_COLORS; i++) arr.push(hexToRGB(base[i]));
        const count = Math.max(2, Math.min(MAX_COLORS, stops ? stops.length : 2));
        return { arr, count };
    };

    const gradientColors = ['#FF9FFC', '#5227FF'];
    const angle = 0;
    const noise = 0.42;
    const blindCount = 24;
    const blindMinWidth = 25;
    const spotlightRadius = 0.5;
    const spotlightSoftness = 1;
    const spotlightOpacity = 1;
    const mouseDampening = 0.15;
    const mirrorGradient = false;
    const distortAmount = 0;
    const shineDirection = 'left';

    const { arr: colorArr, count: colorCount } = prepStops(gradientColors);

    gl.uniform1f(uLocations.uAngle, (angle * Math.PI) / 180);
    gl.uniform1f(uLocations.uNoise, noise);
    gl.uniform1f(uLocations.uSpotlightRadius, spotlightRadius);
    gl.uniform1f(uLocations.uSpotlightSoftness, spotlightSoftness);
    gl.uniform1f(uLocations.uSpotlightOpacity, spotlightOpacity);
    gl.uniform1f(uLocations.uMirror, mirrorGradient ? 1 : 0);
    gl.uniform1f(uLocations.uDistort, distortAmount);
    gl.uniform1f(uLocations.uShineFlip, shineDirection === 'right' ? 1 : 0);
    gl.uniform1i(uLocations.uColorCount, colorCount);

    for (let i = 0; i < 8; i++) {
        gl.uniform3fv(uLocations[`uColor${i}`], colorArr[i]);
    }

    let mouseTarget = [0, 0];
    let currentMouse = [0, 0];
    let dpr = window.devicePixelRatio || 1;

    function resize() {
        const rect = container.getBoundingClientRect();
        dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        gl.viewport(0, 0, canvas.width, canvas.height);

        gl.uniform3f(uLocations.iResolution, canvas.width, canvas.height, 1);

        let effectiveBlinds = blindCount;
        if (blindMinWidth && blindMinWidth > 0) {
            const maxByMinWidth = Math.max(1, Math.floor(rect.width / blindMinWidth));
            effectiveBlinds = blindCount ? Math.min(blindCount, maxByMinWidth) : maxByMinWidth;
        }
        gl.uniform1f(uLocations.uBlindCount, Math.max(1, effectiveBlinds));

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        mouseTarget = [cx, cy];
        currentMouse = [cx, cy];
    }

    resize();
    window.addEventListener('resize', resize);

    const onPointerMove = e => {
        const rect = container.getBoundingClientRect();
        const x = (e.clientX - rect.left) * dpr;
        const y = (rect.height - (e.clientY - rect.top)) * dpr;
        mouseTarget = [x, y];
    };
    (parentSection || window).addEventListener('pointermove', onPointerMove);

    let lastTime = 0;
    function loop(t) {
        requestAnimationFrame(loop);
        const timeSec = t * 0.001;
        gl.uniform1f(uLocations.iTime, timeSec);

        if (mouseDampening > 0) {
            if (!lastTime) lastTime = t;
            const dt = (t - lastTime) / 1000;
            lastTime = t;
            const tau = Math.max(1e-4, mouseDampening);
            let factor = 1 - Math.exp(-dt / tau);
            if (factor > 1) factor = 1;
            currentMouse[0] += (mouseTarget[0] - currentMouse[0]) * factor;
            currentMouse[1] += (mouseTarget[1] - currentMouse[1]) * factor;
        } else {
            currentMouse[0] = mouseTarget[0];
            currentMouse[1] = mouseTarget[1];
        }

        gl.uniform2fv(uLocations.iMouse, currentMouse);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    requestAnimationFrame(loop);
})();
