/* ========================================
   AGUJERO NEGRO 3D - HORIZONTE DE SUCESOS + DISCO DE ACRECIÓN
   Three.js (script clásico, sin ES modules)
   ======================================== */

// Nota: se usa la build clásica (three.min.js, variable global THREE) en vez
// de ES modules porque `type="module"` es bloqueado por CORS cuando la página
// se abre como archivo local (file://) en vez de servirse por http. Por la
// misma razón, el "bloom" no usa EffectComposer/UnrealBloomPass (solo existen
// como ES modules en versiones recientes de three.js): en su lugar se simula
// con sprites de resplandor (textura radial + blending aditivo).

(function () {
    if (typeof THREE === 'undefined') {
        console.warn('⚠️ THREE no está disponible; no se puede iniciar el agujero negro 3D');
        return;
    }

    const canvasEl = document.getElementById('blackholeCanvas');
    if (!canvasEl) return;

    const isSmallScreen = window.innerWidth < 768;

    // ========================================
    // ESCENA, CÁMARA Y RENDERER
    // ========================================

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 5.5, 15);
    camera.lookAt(0, 2.2, 0);

    const renderer = new THREE.WebGLRenderer({ canvas: canvasEl, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // ========================================
    // TEXTURA DE RESPLANDOR (para simular bloom con sprites aditivos)
    // ========================================

    function makeGlowTexture() {
        const size = 256;
        const glowCanvas = document.createElement('canvas');
        glowCanvas.width = size;
        glowCanvas.height = size;
        const gctx = glowCanvas.getContext('2d');
        const gradient = gctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.35, 'rgba(255,255,255,0.5)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        gctx.fillStyle = gradient;
        gctx.fillRect(0, 0, size, size);
        const texture = new THREE.CanvasTexture(glowCanvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        return texture;
    }

    const glowTexture = makeGlowTexture();

    function addGlowSprite(color, x, y, z, scale, opacity) {
        const material = new THREE.SpriteMaterial({
            map: glowTexture,
            color,
            transparent: true,
            opacity,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        const sprite = new THREE.Sprite(material);
        sprite.position.set(x, y, z);
        sprite.scale.set(scale, scale, 1);
        scene.add(sprite);
        return sprite;
    }

    // ========================================
    // HORIZONTE DE SUCESOS (esfera negra absoluta)
    // ========================================

    const EVENT_HORIZON_RADIUS = 1.15;

    const eventHorizon = new THREE.Mesh(
        new THREE.SphereGeometry(EVENT_HORIZON_RADIUS, 64, 64),
        new THREE.MeshBasicMaterial({ color: 0x000000 })
    );
    scene.add(eventHorizon);

    // ========================================
    // DISCO DE ACRECIÓN (gradiente blanco -> fucsia, con fade en los bordes)
    // ========================================

    const DISK_INNER = EVENT_HORIZON_RADIUS * 1.02;
    const DISK_OUTER = EVENT_HORIZON_RADIUS * 3.4;

    // Resplandor ambiental del disco (simula el bloom neón alrededor del anillo)
    addGlowSprite(0xff2fa8, 0, 0.15, 0, DISK_OUTER * 2.6, 0.55);
    addGlowSprite(0xffffff, 0, 0.2, 0, DISK_INNER * 3.2, 0.8);

    const diskMaterial = new THREE.ShaderMaterial({
        uniforms: {
            innerColor: { value: new THREE.Color(0xffffff) },
            outerColor: { value: new THREE.Color(0xff007f) },
            innerRadius: { value: DISK_INNER },
            outerRadius: { value: DISK_OUTER },
            intensity: { value: 1.5 },
        },
        vertexShader: `
            varying vec2 vPos;
            void main() {
                vPos = position.xy;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 innerColor;
            uniform vec3 outerColor;
            uniform float innerRadius;
            uniform float outerRadius;
            uniform float intensity;
            varying vec2 vPos;
            void main() {
                float r = length(vPos);
                float t = clamp((r - innerRadius) / (outerRadius - innerRadius), 0.0, 1.0);
                vec3 col = mix(innerColor, outerColor, t);

                float innerFade = smoothstep(innerRadius, innerRadius * 1.12, r);
                float outerFade = 1.0 - smoothstep(outerRadius * 0.72, outerRadius, r);
                float alpha = innerFade * outerFade;

                gl_FragColor = vec4(col * intensity, alpha);
            }
        `,
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });

    const disk = new THREE.Mesh(
        new THREE.RingGeometry(DISK_INNER, DISK_OUTER, 160, 1),
        diskMaterial
    );
    disk.rotation.x = -Math.PI / 2;
    scene.add(disk);

    // ========================================
    // PARTÍCULAS DEL DISCO (materia girando antes de cruzar el horizonte)
    // ========================================

    const DISK_PARTICLE_COUNT = isSmallScreen ? 2200 : 5000;
    const diskGeo = new THREE.BufferGeometry();
    const diskPos = new Float32Array(DISK_PARTICLE_COUNT * 3);
    const diskCol = new Float32Array(DISK_PARTICLE_COUNT * 3);
    const diskRadius = new Float32Array(DISK_PARTICLE_COUNT);
    const diskAngle = new Float32Array(DISK_PARTICLE_COUNT);
    const diskSpeed = new Float32Array(DISK_PARTICLE_COUNT);

    const whiteC = new THREE.Color(0xffffff);
    const pinkC = new THREE.Color(0xff007f);

    // El radio se extiende bastante más allá del anillo brillante (DISK_OUTER)
    // para que el "torbellino" de puntos se vea como una corona suelta y
    // claramente visible en el espacio oscuro que rodea el disco, en vez de
    // fundirse con el resplandor.
    const PARTICLE_FIELD_OUTER = DISK_OUTER * 1.9;

    for (let i = 0; i < DISK_PARTICLE_COUNT; i++) {
        const r = DISK_INNER + Math.pow(Math.random(), 0.85) * (PARTICLE_FIELD_OUTER - DISK_INNER);
        const a = Math.random() * Math.PI * 2;
        const thickness = 0.05 + (r / DISK_OUTER) * 0.16;

        diskRadius[i] = r;
        diskAngle[i] = a;
        // Velocidad angular ~ 1/sqrt(r): rotación diferencial tipo kepleriana
        diskSpeed[i] = (0.6 / Math.sqrt(r)) * (0.6 + Math.random() * 0.4);

        diskPos[i * 3] = Math.cos(a) * r;
        diskPos[i * 3 + 1] = (Math.random() - 0.5) * thickness;
        diskPos[i * 3 + 2] = Math.sin(a) * r;

        const t = THREE.MathUtils.clamp((r - DISK_INNER) / (DISK_OUTER - DISK_INNER), 0, 1);
        const c = whiteC.clone().lerp(pinkC, t);
        diskCol[i * 3] = c.r;
        diskCol[i * 3 + 1] = c.g;
        diskCol[i * 3 + 2] = c.b;
    }

    diskGeo.setAttribute('position', new THREE.BufferAttribute(diskPos, 3));
    diskGeo.setAttribute('color', new THREE.BufferAttribute(diskCol, 3));

    const diskPoints = new THREE.Points(
        diskGeo,
        new THREE.PointsMaterial({
            size: 0.035,
            vertexColors: true,
            transparent: true,
            opacity: 0.85,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            sizeAttenuation: true,
            map: glowTexture,
        })
    );
    scene.add(diskPoints);

    function updateDiskParticles(delta) {
        const pos = diskGeo.attributes.position.array;
        for (let i = 0; i < DISK_PARTICLE_COUNT; i++) {
            diskAngle[i] += diskSpeed[i] * delta;
            pos[i * 3] = Math.cos(diskAngle[i]) * diskRadius[i];
            pos[i * 3 + 2] = Math.sin(diskAngle[i]) * diskRadius[i];
        }
        diskGeo.attributes.position.needsUpdate = true;
    }

    // ========================================
    // HAZ VERTICAL (inyección de partículas rosas hacia +Y)
    // ========================================

    const BEAM_COUNT = isSmallScreen ? 700 : 1400;
    const BEAM_HEIGHT = 6.5;
    const BEAM_BASE_RADIUS = 0.22;

    const beamGeo = new THREE.BufferGeometry();
    const beamPos = new Float32Array(BEAM_COUNT * 3);
    const beamCol = new Float32Array(BEAM_COUNT * 3);
    const beamProgress = new Float32Array(BEAM_COUNT);
    const beamAngle = new Float32Array(BEAM_COUNT);
    const beamRadial = new Float32Array(BEAM_COUNT);
    const beamSpeed = new Float32Array(BEAM_COUNT);

    const beamPink = new THREE.Color(0xff2fa8);
    const beamWhite = new THREE.Color(0xffffff);

    for (let i = 0; i < BEAM_COUNT; i++) {
        beamProgress[i] = Math.random();
        beamAngle[i] = Math.random() * Math.PI * 2;
        beamRadial[i] = Math.sqrt(Math.random()) * BEAM_BASE_RADIUS;
        beamSpeed[i] = 0.18 + Math.random() * 0.18;

        const c = beamWhite.clone().lerp(beamPink, 0.4 + Math.random() * 0.5);
        beamCol[i * 3] = c.r;
        beamCol[i * 3 + 1] = c.g;
        beamCol[i * 3 + 2] = c.b;
    }

    beamGeo.setAttribute('position', new THREE.BufferAttribute(beamPos, 3));
    beamGeo.setAttribute('color', new THREE.BufferAttribute(beamCol, 3));

    const beamPoints = new THREE.Points(
        beamGeo,
        new THREE.PointsMaterial({
            size: 0.06,
            vertexColors: true,
            transparent: true,
            opacity: 0.95,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            sizeAttenuation: true,
            map: glowTexture,
        })
    );
    scene.add(beamPoints);

    function updateBeam(delta) {
        const pos = beamGeo.attributes.position.array;
        for (let i = 0; i < BEAM_COUNT; i++) {
            beamProgress[i] += beamSpeed[i] * delta;
            if (beamProgress[i] > 1) beamProgress[i] -= 1;

            // Estrecho en la base, se abre levemente hacia arriba (efecto "inyección")
            const taper = 0.35 + beamProgress[i] * 0.65;
            const r = beamRadial[i] * taper;
            const y = EVENT_HORIZON_RADIUS + beamProgress[i] * BEAM_HEIGHT;

            pos[i * 3] = Math.cos(beamAngle[i]) * r;
            pos[i * 3 + 1] = y;
            pos[i * 3 + 2] = Math.sin(beamAngle[i]) * r;
        }
        beamGeo.attributes.position.needsUpdate = true;
    }

    // ========================================
    // RESIZE
    // ========================================

    function handleResize() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }
    window.addEventListener('resize', handleResize);

    // ========================================
    // BUCLE DE ANIMACIÓN
    // ========================================

    let isVisible = true;
    document.addEventListener('visibilitychange', () => {
        isVisible = document.visibilityState === 'visible';
    });

    let lastTime = performance.now();

    function animate() {
        requestAnimationFrame(animate);

        const now = performance.now();
        const delta = Math.min((now - lastTime) / 1000, 0.1);
        lastTime = now;

        if (!isVisible) return;

        updateDiskParticles(delta);
        updateBeam(delta);
        eventHorizon.rotation.y += delta * 0.05;

        renderer.render(scene, camera);
    }

    animate();

    console.log('✅ Agujero negro 3D inicializado');
})();
