# 🌟 Galaxia de Amor para Rubi ✨

## 🎉 Bienvenido a la página de cumpleaños interactiva

Esta es una experiencia web completamente personalizada, romántica e interactiva creada especialmente para Rubi.

---

## 📁 ESTRUCTURA DE ARCHIVOS

```
Regalo para R si se da/
├── index.html              (Archivo principal HTML)
├── style.css               (Estilos CSS con efectos neón y animaciones)
├── script.js               (Lógica JavaScript interactiva)
├── musica.mp3              (Opcional: Canción de fondo para la web)
└── imagenes/               (Carpeta de imágenes)
    ├── inicio.png          ✨ Imagen/ilustración tierna para bienvenida
    ├── rubi_perfil.jpg     👸 Foto de Rubi para la tarjeta "Sobre Ti"
    ├── delfin.png          🐬 Delfín (animal favorito)
    ├── caballo.png         🐴 Caballo (animal favorito)
    ├── arequipa.jpg        🏔️ Foto de Arequipa
    ├── unam_mexico.jpg     🎓 Logo/foto de la UNAM México
    ├── danza.jpg           💃 Foto alusiva a la danza
    ├── viajes.jpg          ✈️ Foto alusiva a viajes
    └── deportes_extremos.jpg 🧗‍♀️ Foto de deportes extremos
```

---

## 🖼️ IMÁGENES REQUERIDAS

Todas las imágenes **DEBEN** estar en la carpeta `imagenes/` con los nombres exactos listados arriba.

### Guía rápida:
- **inicio.png**: Ilustración tierna o foto bonita para la pantalla de bienvenida
- **rubi_perfil.jpg**: Foto del perfil de Rubi
- **delfin.png**: Imagen de un delfín (puede ser ilustración o foto)
- **caballo.png**: Imagen de un caballo (puede ser ilustración o foto)
- **arequipa.jpg**: Foto o imagen de Arequipa (la ciudad blanca)
- **unam_mexico.jpg**: Logo o foto de la UNAM en México
- **danza.jpg**: Foto alusiva a la danza/baile
- **viajes.jpg**: Foto de viajes o aventuras
- **deportes_extremos.jpg**: Foto de deportes extremos (escalada, paracaidismo, etc.)

**NOTA:** Si falta alguna imagen, la página mostrará un placeholder automáticamente y seguirá funcionando correctamente.

---

## 🎵 MÚSICA DE FONDO (OPCIONAL)

Para agregar una canción de fondo:
1. Guarda tu archivo de música como `musica.mp3` en la carpeta raíz
2. La música se reproducirá automáticamente cuando se haga clic en "ENTRAR A NUESTRO UNIVERSO"
3. Hay un botón flotante en la esquina inferior derecha para pausar/reproducir

---

## 🚀 DESPLIEGUE EN GITHUB PAGES

### Paso 1: Crear un repositorio en GitHub
1. Ve a https://github.com/new
2. Crea un repositorio llamado: `regalo-para-rubi` (o el nombre que prefieras)
3. Haz que sea **público** para que se pueda ver en GitHub Pages

### Paso 2: Subir los archivos
Desde tu terminal/PowerShell:
```bash
cd "c:\Users\alvar\OneDrive\Escritorio\Regalo para R si se da"

# Inicializar repositorio local
git init
git add .
git commit -m "Primera versión de Galaxia de Amor para Rubi 💖"

# Agregar repositorio remoto (reemplaza tu-usuario con tu username de GitHub)
git remote add origin https://github.com/TU-USUARIO/regalo-para-rubi.git

# Cambiar rama a 'main' si es necesario
git branch -M main

# Subir cambios
git push -u origin main
```

### Paso 3: Activar GitHub Pages
1. Ve a tu repositorio en GitHub
2. Vuelve a Settings → Pages
3. En "Source", selecciona `main` y carpeta `/ (root)`
4. Haz clic en "Save"

### Paso 4: ¡Listo!
Tu página estará disponible en: `https://tu-usuario.github.io/regalo-para-rubi/`

---

## ✨ CARACTERÍSTICAS

### 🎨 Diseño Visual
- **Temática Galaxia Romántica**: Fondo oscuro con estrellas brillantes
- **Colores Neón**: Rosa (#ff1493), Magenta (#ff69b4), Dorado (#ffd700)
- **Animaciones Suaves**: Efectos glow, flotación, pulsaciones
- **Responsive**: Funciona perfectamente en móviles, tablets y computadoras

### 🎯 Funcionalidades
- **Pantalla de Bienvenida**: Overlay elegante con botón de entrada
- **Galaxia Interactiva**: 6+ corazones orbitales clickeables
- **Modales Personalizados**: 7 tarjetas con mensajes especiales sobre Rubi
- **Reproductor de Música**: Control flotante de reproducción
- **Botón Reinicio**: Vuelve a la pantalla de bienvenida en cualquier momento
- **Efectos de Sonido**: Animaciones suaves al abrir/cerrar modales

---

## 🎮 CÓMO USAR

1. **Pantalla de Bienvenida**: Haz clic en el botón "ENTRAR A NUESTRO UNIVERSO"
2. **Explorar Corazones**: Haz clic en cualquiera de los corazones que orbitan en el espacio
3. **Leer Mensajes**: Se abre un modal con una tarjeta personalizada
4. **Volver**: Haz clic en "VOLVER ♥" o la "X" para regresar a la galaxia
5. **Música**: Usa el botón flotante en la esquina inferior derecha
6. **Reiniciar**: Haz clic en el botón de inicio en la esquina superior derecha

---

## 📱 COMPATIBILIDAD

✅ **Chrome/Edge**: Totalmente compatible
✅ **Firefox**: Totalmente compatible
✅ **Safari**: Totalmente compatible
✅ **Mobile (iOS/Android)**: Totalmente compatible (versiones recientes)

---

## 🔧 PERSONALIZACIÓN

### Cambiar Colores
Abre `style.css` y modifica estas variables CSS:
```css
:root {
    --primary-color: #ff1493;      /* Rosa principal */
    --secondary-color: #ff69b4;    /* Magenta */
    --tertiary-color: #ffd700;     /* Dorado */
    --dark-bg: #0a0015;            /* Fondo oscuro */
}
```

### Agregar Más Tarjetas
Abre `script.js` y agrega objetos al array `cards`:
```javascript
{
    title: "Tu Título",
    image: "imagenes/tu-imagen.jpg",
    text: "Tu mensaje especial aquí"
}
```

### Cambiar Nombre o Mensajes
Busca en `index.html` y `script.js` por "Rubi" o "Cumpleaños" para personalizarlo.

---

## 🎓 TECNOLOGÍAS USADAS

- **HTML5**: Estructura semántica y moderna
- **CSS3**: Gradientes, animaciones, efectos glow, media queries
- **JavaScript Vanilla**: Sin dependencias, 100% funcional
- **Canvas API**: Animación interactiva de la galaxia
- **Font Awesome 6**: Iconos vectoriales
- **Google Fonts**: Tipografías elegantes (Playfair Display, Poppins)

---

## 💡 NOTAS IMPORTANTES

1. **Rutas de Imágenes**: Siempre usa rutas relativas como `imagenes/nombre.jpg`
2. **HTTPS**: GitHub Pages usa HTTPS automáticamente
3. **Música**: El archivo `musica.mp3` es opcional; la web funciona sin él
4. **Navegadores Antiguos**: Para máxima compatibilidad, actualiza tu navegador
5. **SEO**: Esta web es 100% estática y privada, ideal para compartir el link

---

## 🐛 TROUBLESHOOTING

### Las imágenes no se cargan
- Verifica que están en la carpeta `imagenes/`
- Verifica los nombres exactos (mayúsculas, extensiones)
- Abre la consola del navegador (F12) para ver errores

### La música no suena
- Verifica que `musica.mp3` está en la raíz del proyecto
- Algunos navegadores requieren interacción del usuario (clic) antes de reproducir
- Intenta hacer clic en el botón de reproducción manualmente

### Responsive no funciona
- Limpia caché del navegador (Ctrl+Shift+Del)
- Abre DevTools (F12) y verifica el viewport

---

## 🎁 MENSAJES INCLUIDOS

Las 7 tarjetas interactivas incluyen mensajes sobre:
1. 👸 La chica más especial (Rubi)
2. 🏔️ Tus raíces (Arequipa)
3. 🎓 Próxima parada (UNAM México)
4. 💃 Arte y aventuras (Danza y viajes)
5. 🧗‍♀️ Adrenalina y valentía (Deportes extremos)
6. 🐬 Delfines y caballos (Animales favoritos)
7. 🌟 Para siempre (Mensaje final especial)

---

## 📞 SOPORTE

Si tienes problemas:
1. Abre la consola del navegador (F12 → Console)
2. Busca mensajes de error
3. Verifica que todos los archivos estén en su lugar
4. Intenta borrar caché y recargar la página

---

## 🌟 ¡DISFRUTA!

Esta página ha sido creada con amor y dedicación. ¡Que Rubi disfrute cada momento de esta experiencia especial!

**¡Feliz Cumpleaños, Rubi! 🎉💖✨**

---

*Página creada por un desarrollador web enamorado del código y las experiencias mágicas.*
