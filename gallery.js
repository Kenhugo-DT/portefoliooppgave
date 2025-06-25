// Simple Image Gallery
// Usage: Place a <div id="image-gallery"></div> in your HTML
// and include this script after the DOM is loaded.

let currentImageIndex = 0;

function getGalleryHTML(property) {
    const fallbackImage = '../public/DHRlogo.png';
    if (!property.images || property.images.length === 0) {
        return '<div class="no-images">No images available</div>';
    }

    // Use first image for initial display
    const firstImg = property.images[0];
    const mainImage = `
        <div class="main-image-container">
            <img id="mainImage" src="${firstImg.src}" alt="${property.name}" onerror="this.src='${fallbackImage}'; this.onerror=null;" />
            <div class="gallery-description" id="galleryDescription">${firstImg.description || ''}</div>
            ${property.images.length > 1 ? `
                <button class="gallery-nav prev" data-gallery="normal" data-dir="-1"><i class="fas fa-chevron-left"></i></button>
                <button class="gallery-nav next" data-gallery="normal" data-dir="1"><i class="fas fa-chevron-right"></i></button>
            ` : ''}
        </div>
    `;

    const thumbnails = property.images.length > 1 ? `
        <div class="gallery-thumbnails">
            ${property.images.map((img, index) => `
                <div class="thumbnail ${index === 0 ? 'active' : ''}" style="background-image: url('${img.src}')" data-gallery="normal" data-index="${index}"></div>
            `).join('')}
        </div>
    ` : '';

    const fullscreen = `
        <div class="fullscreen-gallery" id="fullscreenGallery">
            <button class="fullscreen-close" id="closeFullscreen"><i class="fas fa-times"></i></button>
            <div class="fullscreen-main">
                <img src="${firstImg.src}" alt="${property.name}" id="fullscreenImage">
                <div class="gallery-description fullscreen-description" id="fullscreenDescription">${firstImg.description || ''}</div>
                <button class="fullscreen-nav fullscreen-prev" data-gallery="fullscreen" data-dir="-1"><i class="fas fa-chevron-left"></i></button>
                <button class="fullscreen-nav fullscreen-next" data-gallery="fullscreen" data-dir="1"><i class="fas fa-chevron-right"></i></button>
            </div>
            <div class="fullscreen-thumbnails">
                ${property.images.map((img, index) => `
                    <div class="fullscreen-thumbnail ${index === 0 ? 'active' : ''}" style="background-image: url('${img.src}')" data-gallery="fullscreen" data-index="${index}"></div>
                `).join('')}
            </div>
        </div>
    `;

    setTimeout(() => setupGalleryHandlers(), 0); // Wait for DOM

    return mainImage + thumbnails + fullscreen;
}

function updateGallery(type, index) {
    const prop = state.currentProperty;
    if (!prop || !prop.images) return;

    const imgId = type === 'fullscreen' ? 'fullscreenImage' : 'mainImage';
    const descId = type === 'fullscreen' ? 'fullscreenDescription' : 'galleryDescription';
    const thumbClass = type === 'fullscreen' ? 'fullscreen-thumbnail' : 'thumbnail';

    const mainImage = document.getElementById(imgId);
    const descDiv = document.getElementById(descId);
    currentImageIndex = index;
    if (mainImage) {
        mainImage.src = prop.images[index].src;
        mainImage.onerror = () => {
            mainImage.src = '/api/placeholder/800/600';
        };
    }
    if (descDiv) {
        descDiv.textContent = prop.images[index].description || '';
    }

    document.querySelectorAll(`.${thumbClass}`).forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

function navigateGallery(type, dir) {
    const prop = state.currentProperty;
    if (!prop || !prop.images) return;
    const length = prop.images.length;
    const newIndex = (currentImageIndex + dir + length) % length;
    updateGallery(type, newIndex);
}

function setupGalleryHandlers() {
    document.getElementById('mainImage')?.addEventListener('click', openFullscreen);
    document.getElementById('closeFullscreen')?.addEventListener('click', closeFullscreen);

    document.querySelectorAll('[data-dir]').forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.gallery;
            const dir = parseInt(btn.dataset.dir);
            navigateGallery(type, dir);
        });
    });

    document.querySelectorAll('[data-index]').forEach(thumb => {
        thumb.addEventListener('click', () => {
            const type = thumb.dataset.gallery;
            const index = parseInt(thumb.dataset.index);
            updateGallery(type, index);
        });
    });
}

function openFullscreen() {
    document.getElementById('fullscreenGallery')?.classList.add('active');
    document.body.style.overflow = 'hidden';
    updateGallery('fullscreen', currentImageIndex);
}

function closeFullscreen() {
    document.getElementById('fullscreenGallery')?.classList.remove('active');
    document.body.style.overflow = '';
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    const fg = document.getElementById('fullscreenGallery');
    if (!fg || !fg.classList.contains('active')) return;
    if (e.key === 'Escape') closeFullscreen();
    if (e.key === 'ArrowLeft') navigateGallery('fullscreen', -1);
    if (e.key === 'ArrowRight') navigateGallery('fullscreen', 1);
});

// --- Minimal setup for your gallery ---
window.state = {
  currentProperty: {
    name: "Ken's Gallery",
    images: [
      { src: 'gallery/before.png', description: 'Before: Before Ken started photoshopping.' },
      { src: 'gallery/after.png', description: 'After: the result of Ken\'s photoshopping.' },
      { src: 'gallery/hylle.jpg', description: 'A custom vinyl showcase. made for and by Ken.' },
      { src: 'gallery/SVAMPEBOBBERN.jpg', description: 'Profile picture Ken made for a browser game.' },
      { src: 'gallery/Vermillion.png', description: 'Profile picture Ken made for a browser game.' },
      { src: 'gallery/VIVE_LA_VENIMEUX.png', description: 'Profile picture Ken made for a browser game.' }
    ]
  }
};

document.addEventListener('DOMContentLoaded', function () {
  const galleryDiv = document.getElementById('image-gallery');
  if (galleryDiv && window.state && window.state.currentProperty) {
    galleryDiv.innerHTML = getGalleryHTML(window.state.currentProperty);
  }
});
