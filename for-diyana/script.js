(() => {
  const music = document.getElementById('backgroundMusic');
  const musicToggle = document.getElementById('musicToggle');
  const musicLabel = document.getElementById('musicLabel');
  const musicIcon = document.getElementById('musicIcon');
  const petalLayer = document.getElementById('petalLayer');
  const heartLayer = document.getElementById('heartLayer');
  const toast = document.getElementById('toast');
  const letterModal = document.getElementById('letterModal');
  const photoModal = document.getElementById('photoModal');
  let toastTimer;

  // Approximate city-centre coordinates: Depok, Indonesia and Kuala Terengganu, Malaysia.
  // This is an estimated straight-line distance, not a road/flight itinerary.
  function haversineKm(lat1, lon1, lat2, lon2) {
    const toRad = (degree) => degree * Math.PI / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
  const distance = Math.round(haversineKm(-6.4025, 106.7942, 5.3302, 103.1408));
  document.getElementById('distanceNumber').textContent = `${distance.toLocaleString('id-ID')} km`;

  // Music browsers often block autoplay. The player therefore starts on the first tap.
  musicToggle.addEventListener('click', async () => {
    if (music.paused) {
      try {
        await music.play();
        musicToggle.classList.add('is-playing');
        musicToggle.setAttribute('aria-label', 'Jeda musik');
        musicIcon.textContent = '♫';
        musicLabel.textContent = 'Musik sedang diputar';
      } catch (error) {
        showToast('Tambahkan file assets/for-you.mp3, lalu tekan tombol musik ♡');
      }
    } else {
      music.pause();
      musicToggle.classList.remove('is-playing');
      musicToggle.setAttribute('aria-label', 'Putar musik');
      musicLabel.textContent = 'Putar lagu kita';
    }
  });
  music.addEventListener('error', () => {
    musicToggle.classList.remove('is-playing');
    musicLabel.textContent = 'Pilih lagu kita';
  });

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  }

  function createPetals(amount = 22) {
    const symbols = ['✿', '❀', '✧', '·'];
    for (let i = 0; i < amount; i++) {
      const petal = document.createElement('span');
      petal.className = 'petal';
      petal.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      petal.style.left = `${Math.random() * 100}%`;
      petal.style.animationDuration = `${5 + Math.random() * 6}s`;
      petal.style.animationDelay = `${Math.random() * 1.8}s`;
      petal.style.setProperty('--drift', `${Math.round(Math.random() * 180 - 90)}px`);
      petal.style.fontSize = `${10 + Math.random() * 12}px`;
      petalLayer.appendChild(petal);
      petal.addEventListener('animationend', () => petal.remove(), { once: true });
    }
  }
  function sendHearts(amount = 15) {
    for (let i = 0; i < amount; i++) {
      const heart = document.createElement('span');
      heart.className = 'floating-heart';
      heart.textContent = ['♡', '♥', 'ღ'][Math.floor(Math.random() * 3)];
      heart.style.left = `${5 + Math.random() * 90}%`;
      heart.style.animationDelay = `${Math.random() * 1.1}s`;
      heart.style.animationDuration = `${2.7 + Math.random() * 2}s`;
      heart.style.fontSize = `${14 + Math.random() * 19}px`;
      heartLayer.appendChild(heart);
      heart.addEventListener('animationend', () => heart.remove(), { once: true });
    }
  }
  document.getElementById('sprinkleButton').addEventListener('click', () => {
    sendHearts(22);
    createPetals(16);
    showToast('Satu peluk virtual sedang dikirim dari Depok ♡');
  });

  // Start with a subtle sprinkle, rather than overwhelming the page.
  setTimeout(() => createPetals(9), 1200);

  function openModal(modal) {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(modal) {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    if (!document.querySelector('.letter-modal.open, .photo-modal.open')) {
      document.body.style.overflow = '';
    }
  }
  document.getElementById('openLetter').addEventListener('click', () => {
    openModal(letterModal);
    sendHearts(10);
  });
  document.getElementById('closeLetter').addEventListener('click', () => closeModal(letterModal));
  letterModal.querySelectorAll('[data-close-letter]').forEach((el) => el.addEventListener('click', () => closeModal(letterModal)));

  document.querySelectorAll('.photo-card').forEach((card) => {
    const img = card.querySelector('img');
    const frame = card.querySelector('.photo-frame');
    const caption = card.querySelector('.photo-caption').innerText.replace(/\s+/g, ' ').trim();
    img.addEventListener('load', () => frame.classList.add('has-photo'));
    img.addEventListener('error', () => frame.classList.remove('has-photo'));
    if (img.complete && img.naturalWidth > 0) frame.classList.add('has-photo');
    card.addEventListener('click', () => {
      if (!img.complete || img.naturalWidth === 0) {
        showToast(`Taruh fotomu sebagai ${img.getAttribute('src')} terlebih dahulu ♡`);
        return;
      }
      const largePhoto = document.getElementById('largePhoto');
      largePhoto.src = img.src;
      largePhoto.alt = img.alt;
      document.getElementById('largePhotoCaption').textContent = caption;
      openModal(photoModal);
    });
  });
  document.getElementById('closePhoto').addEventListener('click', () => closeModal(photoModal));
  photoModal.querySelectorAll('[data-close-photo]').forEach((el) => el.addEventListener('click', () => closeModal(photoModal)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeModal(letterModal);
      closeModal(photoModal);
    }
  });
  document.getElementById('backToTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();
