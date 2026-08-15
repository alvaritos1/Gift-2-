🚀 GUÍA RÁPIDA DE DESPLIEGUE EN GITHUB PAGES
=============================================

Esta es una guía paso a paso para publicar tu Galaxia de Amor en internet.

---

OPCIÓN 1: DESPLIEGUE RÁPIDO (Recomendado para principiantes)
============================================================

Paso 1: Crea una cuenta en GitHub (si no tienes)
- Ve a https://github.com/signup
- Completa el registro

Paso 2: Ve a https://github.com/new
- Crea un nuevo repositorio
- Nombre: "regalo-para-rubi" (o el que prefieras)
- Descripción: "Galaxia de Amor interactiva para Rubi"
- Marca como PUBLIC
- Haz clic en "Create repository"

Paso 3: Descarga e instala Git
- Ve a https://git-scm.com/
- Descarga para Windows
- Sigue la instalación por defecto

Paso 4: Abre PowerShell en tu carpeta
- Navega a: c:\Users\alvar\OneDrive\Escritorio\Regalo para R si se da
- Presiona Shift + Click derecho → "Abrir ventana de PowerShell aquí"

Paso 5: Ejecuta estos comandos (uno por uno):

```powershell
# Inicializar repositorio local
git init

# Agregar todos los archivos
git add .

# Hacer commit inicial
git commit -m "Primera versión de Galaxia de Amor para Rubi 💖"

# Cambiar rama a main (si es necesario)
git branch -M main

# Agregar URL del repositorio remoto (REEMPLAZA tu-usuario)
git remote add origin https://github.com/TU-USUARIO/regalo-para-rubi.git

# Subir cambios a GitHub
git push -u origin main
```

Paso 6: Activa GitHub Pages
- Ve a tu repositorio en GitHub
- Haz clic en Settings (⚙️)
- En el menú izquierdo, busca "Pages"
- En "Source", selecciona "Deploy from a branch"
- Rama: "main", carpeta: "/ (root)"
- Haz clic en "Save"

Paso 7: ¡Listo! 🎉
- Espera 1-2 minutos
- Tu página estará en: https://TU-USUARIO.github.io/regalo-para-rubi/

---

OPCIÓN 2: DESPLIEGUE CON TERMINAL (Más avanzado)
================================================

# Desde la carpeta del proyecto:

$ git init
$ git config user.name "Tu Nombre"
$ git config user.email "tuemail@gmail.com"
$ git add .
$ git commit -m "🎉 Galaxia de Amor para Rubi"
$ git remote add origin https://github.com/TU-USUARIO/regalo-para-rubi.git
$ git branch -M main
$ git push -u origin main

---

OPCIÓN 3: DESPLIEGUE SIN LÍNEA DE COMANDOS (GitHub Web)
========================================================

Paso 1: Ve a https://github.com/new
Paso 2: Crea el repositorio
Paso 3: En tu repositorio vacío, haz clic en "Upload files"
Paso 4: Arrastra y suelta TODOS los archivos y carpetas
Paso 5: Escribe commit message: "Primera versión"
Paso 6: Haz clic en "Commit changes"
Paso 7: Ve a Settings → Pages → Deploy from a branch (main, /root)
Paso 8: ¡Listo! Espera 1-2 minutos

---

SOLUCIÓN DE PROBLEMAS
=====================

❌ "fatal: not a git repository"
✅ Solución: Abre PowerShell dentro de la carpeta del proyecto

❌ "Permission denied (publickey)"
✅ Solución: Configura SSH en GitHub o usa URL HTTPS en lugar de SSH

❌ "Could not read Username"
✅ Solución: Usa el token de GitHub en lugar de contraseña
   - Ve a https://github.com/settings/tokens
   - Crea un nuevo token
   - Úsalo como contraseña

❌ Las páginas no aparecen después de subir
✅ Solución: Espera 2-5 minutos (GitHub tarda un poco)
   - Ve a Settings → Pages para ver el estado

❌ Las imágenes no se ven
✅ Solución: Verifica que estén en la carpeta "imagenes/" con nombres exactos

❌ La música no suena
✅ Solución: 
   - Verifica que musica.mp3 esté en la carpeta raíz
   - Los navegadores pueden bloquear autoplay (debe clickear usuario primero)

---

ACTUALIZAR LA PÁGINA DESPUÉS
=============================

Después de hacer cambios locales:

$ git add .
$ git commit -m "Descripción de los cambios"
$ git push origin main

Los cambios aparecerán en 1-2 minutos en GitHub Pages.

---

COMPARTIR TU PÁGINA
===================

Una vez publicada, tu URL será:
https://TU-USUARIO.github.io/regalo-para-rubi/

Ejemplos:
- https://juan.github.io/regalo-para-rubi/
- https://maria123.github.io/regalo-para-rubi/
- https://desarrollador-web.github.io/regalo-para-rubi/

Puedes compartir este link en:
- WhatsApp
- Email
- Redes sociales
- QR (puedes generar uno con https://qr-code-generator.com/)

---

DOMINIOS PERSONALIZADOS (Opcional)
===================================

Si quieres un dominio como "galaxiadeamorparurubi.com":

1. Compra un dominio en:
   - GoDaddy.com
   - Namecheap.com
   - Google Domains

2. Ve a Settings → Pages en tu repositorio
3. En "Custom domain", ingresa tu dominio
4. Configura DNS en tu proveedor de dominio
5. Espera validación (puede tomar 24 horas)

---

MANTENER LOS ARCHIVOS ACTUALIZADOS
====================================

Para mantener sincronizado tu repositorio local con GitHub:

# Descargar cambios (si alguien más edita)
$ git pull origin main

# Crear nuevas ramas para cambios (buena práctica)
$ git checkout -b nueva-rama
$ git add .
$ git commit -m "Mensaje"
$ git push origin nueva-rama

# Luego hacer un "Pull Request" para revisar cambios

---

CONSEJOS FINALES
================

✅ Crea un archivo .gitignore (ya incluido) para no subir archivos innecesarios
✅ Usa commits descriptivos (ej: "Agregar tarjeta de danza", "Cambiar colores")
✅ Haz backup local de tus archivos importantes
✅ Revisa regularmente que GitHub Pages esté activo
✅ Prueba la página en diferentes navegadores antes de compartir

---

¿NECESITAS AYUDA?
=================

Documentación oficial:
- GitHub Pages: https://pages.github.com/
- Git: https://git-scm.com/doc
- GitHub Docs: https://docs.github.com/

Comunidad:
- Stack Overflow: https://stackoverflow.com/
- GitHub Discussions: https://github.com/discussions

---

🎉 ¡Tu Galaxia de Amor pronto estará disponible para el mundo!

¡Feliz Cumpleaños, Rubi! 💖✨
