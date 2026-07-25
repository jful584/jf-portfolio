document.querySelectorAll('[data-carousel]').forEach((carousel) => {
  const track = carousel.querySelector('.carousel-track');
  const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
  const prevButton = carousel.querySelector('.prev');
  const nextButton = carousel.querySelector('.next');
  const dotsContainer = carousel.querySelector('.carousel-dots');

  if (!track || slides.length === 0 || !prevButton || !nextButton || !dotsContainer) {
    return;
  }

  let currentIndex = 0;

  function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
    dot.addEventListener('click', () => {
      currentIndex = index;
      updateCarousel();
    });
    dotsContainer.appendChild(dot);
  });

  prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel();
  });

  nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
  });

  updateCarousel();
});



document.querySelectorAll('[data-full-carousel]').forEach((carousel) => {
  const track = carousel.querySelector('.full-carousel-track');
  const slides = Array.from(carousel.querySelectorAll('.full-carousel-slide'));
  const prevButton = carousel.querySelector('.full-carousel-button.prev');
  const nextButton = carousel.querySelector('.full-carousel-button.next');
  const dotsContainer = carousel.querySelector('.full-carousel-dots');

  let currentIndex = 0;

  function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    dotsContainer.querySelectorAll('.full-carousel-dot').forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'full-carousel-dot';
    dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
    dot.addEventListener('click', () => {
      currentIndex = index;
      updateCarousel();
    });
    dotsContainer.appendChild(dot);
  });

  prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel();
  });

  nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
  });

  updateCarousel();
});