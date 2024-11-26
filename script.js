document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('gallery');
    const repoOwner = 'julioeguis'; // Tu nombre de usuario de GitHub
    const repoName = 'fotosfamiliares'; // Nombre del repositorio
    const folderPath = 'images'; // Carpeta donde están las imágenes
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folderPath}`;

    // Función para cargar imágenes desde el repositorio de GitHub
    const loadImagesFromGitHub = () => {
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) throw new Error('Error al conectar con GitHub API');
                return response.json();
            })
            .then(data => {
                data.forEach(item => {
                    // Filtrar archivos que sean imágenes JPEG
                    if (item.type === 'file' && item.download_url.endsWith('.jpeg')) {
                        const img = document.createElement('img');
                        img.src = item.download_url; // URL directa de la imagen
                        img.alt = item.name; // Nombre del archivo como descripción
                        img.classList.add('gallery-item'); // Clase para el estilo
                        gallery.appendChild(img); // Añadir la imagen a la galería
                    }
                });
            })
            .catch(error => {
                console.error('Error al cargar las imágenes desde GitHub:', error);
            });
    };

    // Precarga de una imagen inicial desde GitHub
    const preloadInitialImage = () => {
        const initialImageName = '00B43BBE-2EC5-431F-935B-CFFD47DFA717_1_105_c.jpeg';
        const initialImageUrl = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/${folderPath}/${initialImageName}`;
        
        const img = document.createElement('img');
        img.src = initialImageUrl;
        img.alt = 'Foto inicial';
        img.classList.add('gallery-item');
        gallery.appendChild(img);
    };

    // Función para subir fotos localmente
    const handleLocalUpload = () => {
        const fileInput = document.getElementById('photo-input');
        const files = fileInput.files;

        if (files.length === 0) {
            alert('Por favor selecciona fotos para subir.');
            return;
        }

        gallery.innerHTML = ''; // Limpia la galería antes de mostrar las imágenes subidas

        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = e => {
                const img = document.createElement('img');
                img.src = e.target.result; // Genera una URL base64 para la imagen
                img.alt = file.name; // Nombre del archivo local
                img.classList.add('gallery-item');
                gallery.appendChild(img);
            };
            reader.readAsDataURL(file); // Convierte la imagen a URL base64
        });

        document.getElementById('upload-message').textContent = 'Fotos subidas localmente. Asegúrate de descargarlas.';
    };

    // Inicialización de funcionalidades
    preloadInitialImage(); // Precarga la imagen inicial
    loadImagesFromGitHub(); // Carga las imágenes desde el repositorio

    // Asignar el evento al botón de subir fotos
    document.getElementById('upload-button').addEventListener('click', handleLocalUpload);
});
