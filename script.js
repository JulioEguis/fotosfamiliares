document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('gallery');
    const repoOwner = 'JulioEguis'; // Tu nombre de usuario de GitHub
    const repoName = 'fotosfamiliares'; // Nombre del repositorio
    const folderPath = 'images'; // Carpeta donde están las imágenes
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folderPath}`;

    let images = []; // Array para almacenar las URLs de las imágenes
    let currentIndex = 0; // Índice de la imagen actualmente mostrada en el lightbox

    // Función para cargar imágenes desde el repositorio de GitHub
    const loadImagesFromGitHub = () => {
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) throw new Error('Error al conectar con GitHub API');
                return response.json();
            })
            .then(data => {
                data.forEach(item => {
                    if (item.type === 'file' && (
                        item.download_url.toLowerCase().endsWith('.jpeg') ||
                        item.download_url.toLowerCase().endsWith('.jpg')
                    )) {
                        const img = document.createElement('img');
                        img.src = item.download_url;
                        img.alt = item.name;
                        img.classList.add('gallery-item');
                        img.addEventListener('click', () => openLightbox(images.indexOf(item.download_url)));
                        gallery.appendChild(img);

                        images.push(item.download_url); // Añadir la URL al array de imágenes
                    }
                });
            })
            .catch(error => {
                console.error('Error al cargar las imágenes desde GitHub:', error);
            });
    };

    // Función para abrir el lightbox en la posición del índice actual
    const openLightbox = (index) => {
        currentIndex = index;
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        lightbox.style.display = 'flex';
        lightboxImg.src = images[currentIndex];
        document.body.style.overflow = 'hidden'; // Desactivar scroll de la página
    };

    // Función para cerrar el lightbox
    const closeLightbox = () => {
        const lightbox = document.getElementById('lightbox');
        lightbox.style.display = 'none';
        document.body.style.overflow = ''; // Reactivar scroll de la página
    };

    // Función para mostrar la imagen siguiente en el lightbox
    const showNextImage = () => {
        currentIndex = (currentIndex + 1) % images.length;
        document.getElementById('lightbox-img').src = images[currentIndex];
    };

    // Función para mostrar la imagen anterior en el lightbox
    const showPrevImage = () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        document.getElementById('lightbox-img').src = images[currentIndex];
    };

    // Eventos para botones de navegación
    document.getElementById('next-button').addEventListener('click', showNextImage);
    document.getElementById('prev-button').addEventListener('click', showPrevImage);

    // Evento para cerrar el lightbox al hacer clic en el fondo oscuro
    document.getElementById('lightbox').addEventListener('click', (e) => {
        if (e.target === document.getElementById('lightbox')) {
            closeLightbox();
        }
    });

    // Asignar el evento al botón de cierre (X)
    document.getElementById('close-lightbox').addEventListener('click', closeLightbox);

    // Habilitar scroll en el lightbox con las teclas
    document.addEventListener('keydown', (e) => {
        if (document.getElementById('lightbox').style.display === 'flex') {
            if (e.key === 'ArrowRight') {
                showNextImage();
            } else if (e.key === 'ArrowLeft') {
                showPrevImage();
            } else if (e.key === 'Escape') {
                closeLightbox();
            }
        }
    });

    // Inicialización de funcionalidades
    loadImagesFromGitHub();
});
