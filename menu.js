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

  // --- Music Player Logic ---
  const audio = document.getElementById('audio-player');
  const playPauseBtn = document.getElementById('play-pause');
  const playIcon = document.getElementById('play-icon');
  const pauseIcon = document.getElementById('pause-icon');
  const seekBar = document.getElementById('seek-bar');
  const currentTime = document.getElementById('current-time');
  const duration = document.getElementById('duration');
  const volumeBar = document.getElementById('volume-bar');

  if (!audio) return;

  // Play/Pause toggle
  playPauseBtn.addEventListener('click', function () {
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  });

  audio.addEventListener('play', function () {
    playIcon.style.display = 'none';
    pauseIcon.style.display = '';
  });
  audio.addEventListener('pause', function () {
    playIcon.style.display = '';
    pauseIcon.style.display = 'none';
  });

  // Update seek bar and time
  audio.addEventListener('timeupdate', function () {
    seekBar.value = (audio.currentTime / audio.duration) * 100 || 0;
    currentTime.textContent = formatTime(audio.currentTime);
  });
  audio.addEventListener('loadedmetadata', function () {
    duration.textContent = formatTime(audio.duration);
    seekBar.value = 0;
    currentTime.textContent = '0:00';
  });
  seekBar.addEventListener('input', function () {
    audio.currentTime = (seekBar.value / 100) * audio.duration;
  });

  // Volume
  volumeBar.addEventListener('input', function () {
    audio.volume = volumeBar.value;
  });
  audio.volume = volumeBar.value;

  // Utility
  function formatTime(sec) {
    sec = Math.floor(sec);
    const min = Math.floor(sec / 60);
    const s = sec % 60;
    return min + ':' + (s < 10 ? '0' : '') + s;
  }
});
