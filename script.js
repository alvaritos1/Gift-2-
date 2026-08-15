/* ========================================
   LÓGICA INTERACTIVA - GALAXIA DE AMOR PARA RUBI
   ======================================== */

// ========================================
// CONFIGURACIÓN Y VARIABLES GLOBALES
// ========================================

const CONFIG = {
    particles: 160,
    hearts: 7,
    canvasWidth: window.innerWidth,
    canvasHeight: window.innerHeight,
    centerX: window.innerWidth / 2,
    centerY: window.innerHeight / 2,
};

let particles = [];
let hearts = [];
let floatingTexts = [];
let canvas, ctx;
let isMusicPlaying = false;
let currentModalIndex = null;

// Frases flotantes que decoran la galaxia (posiciones en % del viewport)
const floatingPhrases = [
    { text: 'TE QUIERO', xPct: 0.12, yPct: 0.28 },
    { text: 'SIGUE TUS SUEÑOS', xPct: 0.80, yPct: 0.20 },
    { text: 'SIGUE SIENDO TAN AMABLE', xPct: 0.14, yPct: 0.72 },
    { text: 'TU CHISPA', xPct: 0.86, yPct: 0.66 },
    { text: 'ERES ESPECIAL', xPct: 0.50, yPct: 0.88 },
    { text: 'BUENA SUERTE', xPct: 0.50, yPct: 0.10 },
];

// Contenido de las tarjetas personalizadas
const cards = [
    {
        title: "La Chica Más Especial",
        image: "Imagenes/rubi_perfil.jpg",
        text: "Hoy 15 de mayo celebramos a una persona increíble. Rubi, tu belleza, tu amabilidad sincera y tu corazón tan amigable iluminan el mundo de todos los que te rodeamos. Eres simplemente especial. 💖"
    },
    {
        title: "Tus Raíces",
        image: "música/arequipa.jpg",
        text: "Orgullosamente de Arequipa, con la fuerza, calidez y encanto de tu tierra natal. Llevas en tu corazón la magia de la Ciudad Blanca, y eso te hace aún más hermosa. 🏔️"
    },
    {
        title: "Próxima Parada: UNAM México 🎓",
        image: "Imagenes/unam_méxico.jpg",
        text: "Sé que llegarás tan lejos como te lo propongas. Tu futuro en México y en la UNAM estará lleno de éxitos, aprendizajes e inolvidables momentos. ¡Estoy seguro de que conquistarás el mundo! 🌍"
    },
    {
        title: "Arte, Movimiento y Aventuras",
        image: "Imagenes/viajes.jpg",
        text: "Tu pasión por la danza llena de ritmo cada día, y tu espíritu viajero te llevará a conquistar nuevos lugares y horizontes. Cada paso tuyo es una aventura, cada movimiento un arte. ✈️💃"
    },
    {
        title: "Adrenalina y Valentía",
        image: "Imagenes/deportes_extremos.jpg",
        text: "Tu amor por los deportes extremos demuestra lo valiente, audaz y apasionada que eres ante la vida. No tienes miedo de los desafíos, y eso te hace extraordinaria. 🧗‍♀️⚡"
    },
    {
        title: "Delfines y Caballos 🐬🐴",
        image: "Imagenes/delfin.jpg",
        text: "Libre y noble como los caballos, dulce y brillante como los delfines en el mar. Tu espíritu es tan gracioso y libre como estos hermosos animales. Eres pura magia. ✨"
    },
    {
        title: "Para Siempre y Un Día Más",
        image: "Imagenes/inicio.jpg",
        text: "Gracias por ser exactamente como eres: sincera, dulce, amable y única. ¡Que este nuevo año de vida esté lleno de felicidad, amor y sueños cumplidos! ¡Feliz Cumpleaños, Rubi! Que brilles más cada día. 🌟💖"
    }
];

// ========================================
// CLASES Y OBJETOS
// ========================================

// Estrellas ambientales dispersas por toda la pantalla (la galaxia central
// ahora la dibuja el agujero negro 3D de blackhole.js, así que estas ya no
// orbitan el centro para no duplicar ese efecto).
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 1.6 + 0.4;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.twinkleSpeed = Math.random() * 0.025 + 0.006;
        this.hue = Math.random() < 0.5 ? (40 + Math.random() * 20) : (320 + Math.random() * 30);
    }

    update() {
        this.opacity += this.twinkleSpeed;
        if (this.opacity > 0.9 || this.opacity < 0.15) {
            this.twinkleSpeed *= -1;
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${this.opacity})`;
        ctx.fill();
    }
}

// ========================================
// AYUDANTES DE DIBUJO DE CORAZÓN
// ========================================

// Dibuja la trayectoria de un corazón centrado en (0,0), de ancho/alto `size`
function tracePath(ctx, size) {
    const w = size;
    const h = size;
    const top = -h / 2;
    const topCurveHeight = h * 0.3;
    ctx.beginPath();
    ctx.moveTo(0, top + topCurveHeight);
    ctx.bezierCurveTo(0, top, -w / 2, top, -w / 2, top + topCurveHeight);
    ctx.bezierCurveTo(-w / 2, top + (h + topCurveHeight) / 2, 0, top + (h + topCurveHeight) / 2, 0, top + h);
    ctx.bezierCurveTo(0, top + (h + topCurveHeight) / 2, w / 2, top + (h + topCurveHeight) / 2, w / 2, top + topCurveHeight);
    ctx.bezierCurveTo(w / 2, top, 0, top, 0, top + topCurveHeight);
    ctx.closePath();
}

// Dibuja una imagen recortada tipo "cover" dentro de un rectángulo w x h
function drawImageCover(ctx, img, x, y, w, h) {
    const naturalW = img.naturalWidth || w;
    const naturalH = img.naturalHeight || h;
    const imgRatio = naturalW / naturalH;
    const boxRatio = w / h;
    let sx, sy, sw, sh;

    if (imgRatio > boxRatio) {
        sh = naturalH;
        sw = sh * boxRatio;
        sx = (naturalW - sw) / 2;
        sy = 0;
    } else {
        sw = naturalW;
        sh = sw / boxRatio;
        sx = 0;
        sy = (naturalH - sh) / 2;
    }

    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

class Heart {
    constructor(x, y, index) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.radius = 30;
        this.size = 60;
        this.scale = 1;
        this.isHovered = false;
        this.pulseSpeed = 0.02;
        this.index = index;
        this.sway = Math.random() * Math.PI * 2;
        this.orbitDistance = 200 + index * 28;
        this.orbitAngle = (Math.PI * 2 / CONFIG.hearts) * index;
        this.orbitSpeed = 0.0005 + Math.random() * 0.0003;
        this.glow = 0.5;

        // Cargar la foto del recuerdo correspondiente a esta tarjeta
        this.image = new Image();
        this.image.src = cards[index] ? cards[index].image : 'Imagenes/corazones.jpg';
        this.imageLoaded = false;
        this.image.onload = () => {
            this.imageLoaded = true;
        };
        this.image.onerror = () => {
            console.warn('⚠️ No se pudo cargar la foto del corazón', this.index, '- usando fallback');
        };
    }

    update() {
        // Movimiento orbital
        this.orbitAngle += this.orbitSpeed;
        this.x = CONFIG.centerX + Math.cos(this.orbitAngle) * this.orbitDistance;
        this.y = CONFIG.centerY + Math.sin(this.orbitAngle) * this.orbitDistance;

        // Pulso de escala
        if (this.isHovered) {
            this.scale = Math.min(this.scale + 0.05, 1.3);
            this.glow = Math.min(this.glow + 0.1, 1);
        } else {
            this.scale = Math.max(this.scale - 0.02, 1);
            this.glow = Math.max(this.glow - 0.02, 0.5);
        }

        this.sway += 0.015;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(Math.sin(this.sway) * 0.12);
        ctx.scale(this.scale, this.scale);

        // Glow del corazón
        const glowSize = this.size * 0.6 * this.glow;
        ctx.beginPath();
        ctx.arc(0, 0, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 20, 147, ${0.35 * this.glow})`;
        ctx.fill();

        // Dibujar la foto recortada en forma de corazón si está lista
        if (this.imageLoaded) {
            this.drawHeartImage(ctx);
        } else {
            this.drawHeartShape(ctx);
        }

        ctx.restore();
    }

    drawHeartImage(ctx) {
        try {
            ctx.save();
            tracePath(ctx, this.size);
            ctx.clip();
            drawImageCover(ctx, this.image, -this.size / 2, -this.size / 2, this.size, this.size);
            ctx.restore();

            // Contorno para definir la forma sobre la foto
            tracePath(ctx, this.size);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.7 + this.glow * 0.3})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        } catch (e) {
            this.drawHeartShape(ctx);
        }
    }

    drawHeartShape(ctx) {
        // Fallback mientras la foto carga: corazón sólido con borde
        tracePath(ctx, this.size * 0.65);
        ctx.fillStyle = `hsl(330, 100%, ${55 + this.glow * 20}%)`;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    isClickedAt(mx, my) {
        const dx = mx - this.x;
        const dy = my - this.y;
        return Math.sqrt(dx * dx + dy * dy) < this.radius * this.scale * 1.5;
    }
}

class FloatingText {
    constructor(phrase) {
        this.text = phrase.text;
        this.xPct = phrase.xPct;
        this.yPct = phrase.yPct;
        this.bobOffset = Math.random() * Math.PI * 2;
        this.bobSpeed = 0.008 + Math.random() * 0.006;
        this.glowOffset = Math.random() * Math.PI * 2;
    }

    update() {
        this.bobOffset += this.bobSpeed;
        this.glowOffset += 0.02;
    }

    draw(ctx) {
        const x = this.xPct * CONFIG.canvasWidth;
        const y = this.yPct * CONFIG.canvasHeight + Math.sin(this.bobOffset) * 12;
        const glow = 8 + Math.sin(this.glowOffset) * 6;

        ctx.save();
        ctx.font = "600 15px 'Poppins', sans-serif";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(255, 20, 147, 0.9)';
        ctx.shadowBlur = glow;
        ctx.fillStyle = 'rgba(255, 220, 240, 0.9)';
        ctx.fillText(this.text, x, y);
        ctx.restore();
    }
}

// ========================================
// INICIALIZACIÓN DEL CANVAS
// ========================================

function initCanvas() {
    canvas = document.getElementById('galaxyCanvas');
    
    if (!canvas) {
        console.error('❌ Canvas no encontrado');
        return;
    }
    
    ctx = canvas.getContext('2d', { alpha: true }); // Transparencia habilitada
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    CONFIG.canvasWidth = window.innerWidth;
    CONFIG.canvasHeight = window.innerHeight;
    CONFIG.centerX = window.innerWidth / 2;
    CONFIG.centerY = window.innerHeight / 2;

    console.log('✅ Canvas inicializado:', canvas.width, 'x', canvas.height);
    console.log('✅ Canvas con transparencia habilitada');

    // Crear partículas (estrellas ambientales por toda la pantalla)
    particles = [];
    for (let i = 0; i < CONFIG.particles; i++) {
        particles.push(new Particle(Math.random() * CONFIG.canvasWidth, Math.random() * CONFIG.canvasHeight));
    }

    // Crear corazones interactivos
    hearts = [];
    for (let i = 0; i < CONFIG.hearts; i++) {
        hearts.push(new Heart(CONFIG.centerX, CONFIG.centerY, i));
    }

    // Crear frases flotantes
    floatingTexts = floatingPhrases.map(phrase => new FloatingText(phrase));

    console.log('✅ Corazones creados:', hearts.length);
    console.log('✅ Partículas creadas:', particles.length);
    console.log('✅ Frases flotantes creadas:', floatingTexts.length);
}

// ========================================
// ANIMACIÓN Y RENDERIZADO
// ========================================

function animate() {
    if (!ctx || !canvas) {
        console.error('❌ Canvas context no disponible');
        return;
    }
    
    // Limpiar canvas con transparencia (para ver el video de fondo)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Actualizar y dibujar partículas (estrellas)
    for (let particle of particles) {
        particle.update();
        particle.draw(ctx);
    }

    // Actualizar y dibujar frases flotantes (detrás de los corazones)
    for (let ft of floatingTexts) {
        ft.update();
        ft.draw(ctx);
    }

    // Actualizar y dibujar corazones
    for (let heart of hearts) {
        heart.update();
        heart.draw(ctx);
    }

    // Dibujar líneas de conexión (efecto de red)
    drawConnections();

    requestAnimationFrame(animate);
}

function drawConnections() {
    for (let i = 0; i < hearts.length; i++) {
        for (let j = i + 1; j < hearts.length; j++) {
            const dx = hearts[j].x - hearts[i].x;
            const dy = hearts[j].y - hearts[i].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 250) {
                ctx.beginPath();
                ctx.moveTo(hearts[i].x, hearts[i].y);
                ctx.lineTo(hearts[j].x, hearts[j].y);
                ctx.strokeStyle = `rgba(255, 20, 147, ${0.2 * (1 - distance / 250)})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }
}

// ========================================
// MANEJO DE EVENTOS - PANTALLA DE BIENVENIDA
// ========================================

document.addEventListener('DOMContentLoaded', function () {
    console.log('🌟 Iniciando Galaxia de Amor para Rubi...');

    // Pequeña pausa para asegurar que todo está cargado
    setTimeout(() => {
        initCanvas();
        animate();
        console.log('✅ Animación iniciada');
        
        // Agregar listeners del canvas (ahora que existe)
        addCanvasListeners();
    }, 100);

    const enterBtn = document.getElementById('enterBtn');
    const welcomeOverlay = document.getElementById('welcomeOverlay');
    const bgMusic = document.getElementById('bgMusic');
    const mainContent = document.getElementById('mainContent');

    if (enterBtn) {
        enterBtn.addEventListener('click', function () {
            console.log('✅ Botón ENTRAR clickeado');
            welcomeOverlay.classList.remove('active');
            
            // Intentar reproducir música automáticamente (puede estar restringido por navegador)
            playMusic();

            // Simular evento para mostrar instrucciones
            setTimeout(() => {
                mainContent.style.opacity = '1';
            }, 500);
        });
    }

    // Cerrar overlay con clic en el fondo
    if (welcomeOverlay) {
        welcomeOverlay.addEventListener('click', function (e) {
            if (e.target === welcomeOverlay) {
                welcomeOverlay.classList.remove('active');
                playMusic();
            }
        });
    }
});

// ========================================
// CONTROL DE MÚSICA
// ========================================

function playMusic() {
    const bgMusic = document.getElementById('bgMusic');
    const playPauseBtn = document.getElementById('playPauseBtn');
    
    // Intentar reproducir
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
        playPromise.then(() => {
            isMusicPlaying = true;
            updateMusicButton();
        }).catch(error => {
            console.log('Reproducción automática bloqueada:', error);
            isMusicPlaying = false;
        });
    }
}

function toggleMusic() {
    const bgMusic = document.getElementById('bgMusic');
    
    if (isMusicPlaying) {
        bgMusic.pause();
        isMusicPlaying = false;
    } else {
        bgMusic.play().catch(error => {
            console.log('Error al reproducir:', error);
        });
        isMusicPlaying = true;
    }
    
    updateMusicButton();
}

function updateMusicButton() {
    const playPauseBtn = document.getElementById('playPauseBtn');
    const icon = playPauseBtn.querySelector('i');
    
    if (isMusicPlaying) {
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
        playPauseBtn.classList.add('playing');
    } else {
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
        playPauseBtn.classList.remove('playing');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const playPauseBtn = document.getElementById('playPauseBtn');
    const modalClose = document.querySelector('.modal-close');
    const btnBack = document.querySelector('.btn-back');
    const modalOverlay = document.getElementById('modalOverlay');
    const resetBtn = document.getElementById('resetBtn');
    const welcomeOverlay = document.getElementById('welcomeOverlay');
    const bgMusic = document.getElementById('bgMusic');

    // Listener para botón de música
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', toggleMusic);
    }

    // Listeners para cerrar modal
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (btnBack) {
        btnBack.addEventListener('click', closeModal);
    }

    // Cerrar modal al hacer clic en el overlay
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function (e) {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }

    // Cerrar modal con tecla ESC
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && currentModalIndex !== null) {
            closeModal();
        }
    });

    // Listener para botón de reinicio
    if (resetBtn) {
        resetBtn.addEventListener('click', function () {
            // Pausar música
            bgMusic.pause();
            bgMusic.currentTime = 0;
            isMusicPlaying = false;
            updateMusicButton();

            // Mostrar overlay de bienvenida
            welcomeOverlay.classList.add('active');

            // Cerrar modal si está abierto
            closeModal();
        });
    }
});

// ========================================
// FUNCIÓN PARA AGREGAR LISTENERS DEL CANVAS
// ========================================

function addCanvasListeners() {
    if (!canvas) {
        console.error('❌ Canvas aún no disponible');
        return;
    }

    console.log('✅ Agregando listeners del canvas...');

    // Click para abrir modales
    canvas.addEventListener('click', function (e) {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        for (let i = 0; i < hearts.length; i++) {
            if (hearts[i].isClickedAt(mx, my)) {
                openModal(i);
                break;
            }
        }
    });

    // Detectar hover en corazones
    canvas.addEventListener('mousemove', function (e) {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        hearts.forEach((heart, index) => {
            heart.isHovered = heart.isClickedAt(mx, my);
        });

        // Cambiar cursor
        canvas.style.cursor = hearts.some(h => h.isHovered) ? 'pointer' : 'default';
    });

    // Limpiar hover al salir del canvas
    canvas.addEventListener('mouseleave', function () {
        hearts.forEach(heart => {
            heart.isHovered = false;
        });
        canvas.style.cursor = 'default';
    });

    // Soporte para móvil - touch
    canvas.addEventListener('touchstart', function (e) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const mx = touch.clientX - rect.left;
        const my = touch.clientY - rect.top;

        for (let i = 0; i < hearts.length; i++) {
            if (hearts[i].isClickedAt(mx, my)) {
                openModal(i);
                break;
            }
        }
    });
}

// ========================================
// INTERACCIÓN CON CORAZONES (MODALES) - LISTENERS REUBICADOS
// ========================================

// ========================================
// MANEJO DE MODALES
// ========================================

function openModal(index) {
    if (index < 0 || index >= cards.length) return;

    currentModalIndex = index;
    const card = cards[index];
    const modalOverlay = document.getElementById('modalOverlay');
    
    // Rellenar contenido del modal
    document.getElementById('modalTitle').textContent = card.title;
    const modalImage = document.getElementById('modalImage');
    modalImage.style.display = '';
    modalImage.src = card.image;
    document.getElementById('modalText').textContent = card.text;

    // Mostrar modal
    modalOverlay.classList.add('active');
}

function closeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    modalOverlay.classList.remove('active');
    currentModalIndex = null;
}

// ========================================
// MANEJO DE REDIMENSIONAMIENTO
// ========================================

window.addEventListener('resize', function () {
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        CONFIG.canvasWidth = window.innerWidth;
        CONFIG.canvasHeight = window.innerHeight;
        CONFIG.centerX = window.innerWidth / 2;
        CONFIG.centerY = window.innerHeight / 2;
    }
});

// ========================================
// EFECTOS ADICIONALES - CONFETI Y LUCES
// ========================================

function createConfetti() {
    const confettiPieces = [];
    for (let i = 0; i < 50; i++) {
        confettiPieces.push({
            x: Math.random() * window.innerWidth,
            y: -10,
            vx: (Math.random() - 0.5) * 4,
            vy: Math.random() * 3 + 2,
            angle: Math.random() * Math.PI * 2,
            size: Math.random() * 8 + 5,
            color: ['#ff1493', '#ff69b4', '#ffd700', '#ffffff'][Math.floor(Math.random() * 4)]
        });
    }

    function animateConfetti() {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = window.innerWidth;
        tempCanvas.height = window.innerHeight;
        const tempCtx = tempCanvas.getContext('2d');

        confettiPieces.forEach(piece => {
            piece.y += piece.vy;
            piece.vy += 0.1; // Gravedad
            piece.angle += 0.1;

            tempCtx.fillStyle = piece.color;
            tempCtx.globalAlpha = Math.max(0, 1 - piece.y / window.innerHeight);
            tempCtx.beginPath();
            tempCtx.arc(piece.x, piece.y, piece.size, 0, Math.PI * 2);
            tempCtx.fill();
        });

        if (confettiPieces.some(p => p.y < window.innerHeight)) {
            requestAnimationFrame(animateConfetti);
        }
    }

    animateConfetti();
}

// Consola de bienvenida
console.log('%c✨ Galaxia de Amor para Rubi ✨', 'color: #ff1493; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px #ff1493;');
console.log('%cFeliz Cumpleaños, Rubi! 🎉💖', 'color: #ff69b4; font-size: 16px;');
console.log('%cEste universo fue creado con amor para ti.', 'color: #ffd700; font-size: 14px; font-style: italic;');
