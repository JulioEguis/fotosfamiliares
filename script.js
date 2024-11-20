document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('gallery');
    const repoOwner = 'julioeguis'; // Tu nombre de usuario de GitHub
    const repoName = 'fotosfamiliares'; // Nombre del repositorio
    const folderPath = 'images'; // Carpeta donde están las imágenes
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folderPath}`;

    // Función para cargar imágenes desde la API de GitHub
    const loadImagesFromGitHub = () => {
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) throw new Error('Error al conectar con GitHub API');
                return response.json();
            })
            .then(data => {
                data.forEach(item => {
                    if (item.type === 'file' && item.download_url.endsWith('.jpeg')) { // Filtrar por imágenes JPEG
                        const img = document.createElement('img');
                        img.src = item.download_url;
                        img.alt = item.name;
                        img.classList.add('gallery-item'); // Clase para estilo
                        gallery.appendChild(img);
                    }
                });
            })
            .catch(error => {
                console.error('Error al cargar las imágenes desde GitHub:', error);
            });
    };

    // Precarga de imagen inicial
    const preloadInitialImage = () => {
        const initialImageName = '00B43BBE-2EC5-431F-935B-CFFD47DFA717_1_105_c.jpeg';
        const initialImageUrl = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/${folderPath}/${initialImageName}`;
        
        const img = document.createElement('img');
        img.src = initialImageUrl;
        img.alt = 'Foto inicial';
        img.classList.add('gallery-item'); // Clase para estilo
        gallery.appendChild(img);
    };

    // Carga de imágenes
    loadImagesFromGitHub();
    preloadInitialImage();

    // Funcionalidad de subir fotos localmente
    document.getElementById('upload-button').addEventListener('click', () => {
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
                img.src = e.target.result;
                img.alt = file.name;
                img.classList.add('gallery-item');
                gallery.appendChild(img);
            };
            reader.readAsDataURL(file);
        });

        document.getElementById('upload-message').textContent = 'Fotos subidas localmente. Asegúrate de descargarlas.';
    });
});
