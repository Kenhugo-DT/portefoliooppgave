document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("main section");
  const scrollMenu = document.getElementById("scroll-menu");
  
  // Create progress indicator
  const progressContainer = document.createElement("div");
  progressContainer.id = "progress-container";
  scrollMenu.appendChild(progressContainer);
  
  // Create section markers
  const markers = [];
  sections.forEach((section, index) => {
    const marker = document.createElement("div");
    marker.className = "section-marker";
    marker.dataset.section = section.id;
    marker.title = section.id.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    marker.style.display = "none";
    
    // Add click handler
    marker.addEventListener("click", () => {
      section.scrollIntoView({ behavior: "smooth" });
    });
    
    progressContainer.appendChild(marker);
    markers.push(marker);
  });

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    // Update progress bar (scaled for shorter menu)
    const scaledProgress = Math.min(scrollPercent * 2, 100); // Double the progress for shorter menu
    progressContainer.style.setProperty('--scroll-progress', `${scaledProgress}%`);
    
    // Reveal checkpoints as soon as their section is at least halfway into the viewport
    let highestRevealedIndex = -1;
    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.5) {
        highestRevealedIndex = index;
      }
    });
    
    // Show only revealed markers, hide the rest
    markers.forEach((marker, index) => {
      if (index <= highestRevealedIndex) {
        marker.style.display = "block";
        marker.classList.add('revealed');
      } else {
        marker.style.display = "none";
        marker.classList.remove('revealed');
        marker.classList.remove('active');
      }
    });

    // Set active state for the current section
    sections.forEach((section, index) => {
      const marker = markers[index];
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      const scrollPos = window.scrollY + window.innerHeight / 3;
      if (marker && marker.style.display === "block") {
        if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
          marker.classList.add('active');
        } else {
          marker.classList.remove('active');
        }
      }
    });
  }

  window.addEventListener('scroll', updateProgress);
  updateProgress();

  // --- Before/After Slider Logic ---
  const slider = document.querySelector('.before-after-slider');
  const afterWrapper = document.querySelector('.after-wrapper');
  const handle = document.querySelector('.slider-handle');
  if (!slider || !afterWrapper || !handle) return;

  let isDragging = false;
  let sliderPercent = 50;

  function setSlider(x) {
    const rect = slider.getBoundingClientRect();
    let offset = x - rect.left;
    offset = Math.max(0, Math.min(offset, rect.width));
    const percent = (offset / rect.width) * 100;
    sliderPercent = percent;
    afterWrapper.style.width = percent + '%';
    handle.style.left = `calc(${percent}% - 10px)`;
  }

  function onMove(e) {
    if (!isDragging) return;
    let clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setSlider(clientX);
  }

  handle.addEventListener('mousedown', (e) => {
    isDragging = true;
    document.body.style.cursor = 'ew-resize';
    e.preventDefault();
  });
  window.addEventListener('mouseup', () => {
    isDragging = false;
    document.body.style.cursor = '';
  });
  window.addEventListener('mousemove', onMove);

  // Touch support
  handle.addEventListener('touchstart', (e) => {
    isDragging = true;
    document.body.style.cursor = 'ew-resize';
    e.preventDefault();
  });
  window.addEventListener('touchend', () => {
    isDragging = false;
    document.body.style.cursor = '';
  });
  window.addEventListener('touchmove', onMove);

  // Set initial position to 50%
  setSlider(slider.getBoundingClientRect().left + slider.offsetWidth / 2);

  // Ensure handle stays in sync on window resize
  window.addEventListener('resize', () => {
    const rect = slider.getBoundingClientRect();
    const offset = (sliderPercent / 100) * rect.width;
    setSlider(rect.left + offset);
  });
});
