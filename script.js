document.addEventListener('DOMContentLoaded', () => {
    // Cargar imágenes desde GitHub al cargar la página
    const gallery = document.getElementById('gallery');
    const repoOwner = 'julioeguis'; // Tu nombre de usuario de GitHub
    const repoName = 'fotosfamiliares'; // El nombre de tu repositorio
    const folderPath = 'images'; // La carpeta que contiene las imágenes

    // URL de la API de GitHub para obtener los archivos en la carpeta 'images'
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folderPath}`;

    // Hacer una solicitud GET a la API de GitHub
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Verifica si hay imágenes y añádelas a la galería
            data.forEach(item => {
                if (item.type === 'file') {
                    const img = document.createElement('img');
                    img.src = item.download_url; // URL para descargar la imagen
                    img.alt = item.name;
                    img.style.maxWidth = '200px';
                    img.style.margin = '10px';
                    img.classList.add('gallery-item'); // Clase para las imágenes
                    gallery.appendChild(img);
                }
            });
        })
        .catch(error => {
            console.error('Error al cargar las imágenes desde GitHub:', error);
        });

    // Precargar una imagen inicial si es necesario
    const preloadedImage = document.createElement('img');
    preloadedImage.src = './images/00B43BBE-2EC5-431F-935B-CFFD47DFA717_1_105_c.jpeg'; // Cambiar según el nombre real
    preloadedImage.alt = 'Foto inicial';
    preloadedImage.style.maxWidth = '200px';
    preloadedImage.style.margin = '10px';
    gallery.appendChild(preloadedImage);
});

// Funcionalidad de subir fotos localmente
document.getElementById('upload-button').addEventListener('click', () => {
    const fileInput = document.getElementById('photo-input');
    const files = fileInput.files;

    if (files.length === 0) {
        alert('Por favor selecciona fotos para subir.');
        return;
    }

    const gallery = document.getElementById('gallery');
    gallery.innerHTML = ''; // Limpia la galería

    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = e => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = file.name;
            img.style.maxWidth = '200px';
            img.style.margin = '10px';
            gallery.appendChild(img);
        };
        reader.readAsDataURL(file);
    });

    document.getElementById('upload-message').textContent =
        'Fotos subidas localmente. Asegúrate de descargarlas.';
});
