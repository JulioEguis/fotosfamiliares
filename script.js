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
