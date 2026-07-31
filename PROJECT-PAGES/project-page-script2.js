document.addEventListener('DOMContentLoaded', () => {
  const initializeCarousel = ({
    blocks,
    viewportSelector,
    trackSelector,
    slideSelector,
    prevSelector,
    nextSelector,
    dotsSelector,
    dotClass,
    captionSelector,
    captionDisplayClass,
    navTopVariable,
    navOffset = 0
  }) => {
    blocks.forEach((block) => {
      const viewport = block.querySelector(viewportSelector) || block;
      const track = block.querySelector(trackSelector);
      const slides = Array.from(block.querySelectorAll(slideSelector));
      const prevButton = block.querySelector(prevSelector);
      const nextButton = block.querySelector(nextSelector);
      const dotsContainer = block.querySelector(dotsSelector);

      if (!viewport || !track || !slides.length || !prevButton || !nextButton || !dotsContainer) {
        return;
      }

      const captions = slides.map((slide) => {
        const caption = slide.querySelector(captionSelector);
        return caption ? caption.textContent.trim() : '';
      });

      const hasCaptions = captions.some((text) => text.length > 0);
      let captionDisplay = null;

      if (hasCaptions) {
        captionDisplay = document.createElement('div');
        captionDisplay.className = captionDisplayClass;
        captionDisplay.setAttribute('aria-live', 'polite');
        dotsContainer.before(captionDisplay);
      }

      let currentIndex = 0;
      let pointerStartX = null;
      let pointerDeltaX = 0;

      const wrapIndex = (value) => {
        const total = slides.length;
        return ((value % total) + total) % total;
      };

      const updateNavPosition = () => {
        if (!navTopVariable) {
          return;
        }

        const navTop = viewport.offsetTop + viewport.clientHeight / 2 + navOffset;
        block.style.setProperty(navTopVariable, `${navTop}px`);
      };

      const measureCaptionHeight = () => {
        if (!captionDisplay) {
          return;
        }

        let maxHeight = 0;
        const originalText = captionDisplay.textContent;

        captions.forEach((text) => {
          captionDisplay.textContent = text;
          maxHeight = Math.max(maxHeight, captionDisplay.offsetHeight);
        });

        captionDisplay.textContent = originalText;
        captionDisplay.style.minHeight = `${maxHeight}px`;
      };

      const update = (animate = true) => {
        track.style.transition = animate ? 'transform 0.35s ease' : 'none';
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        if (captionDisplay) {
          captionDisplay.textContent = captions[currentIndex] || '';
        }

        dotsContainer.querySelectorAll(`.${dotClass}`).forEach((dot, index) => {
          const isActive = index === currentIndex;
          dot.classList.toggle('active', isActive);
          dot.setAttribute('aria-current', isActive ? 'true' : 'false');
        });

        prevButton.disabled = false;
        nextButton.disabled = false;
        updateNavPosition();
      };

      dotsContainer.innerHTML = '';

      slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = dotClass;
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        dot.addEventListener('click', () => {
          currentIndex = index;
          update();
        });
        dotsContainer.appendChild(dot);
      });

      prevButton.addEventListener('click', () => {
        currentIndex = wrapIndex(currentIndex - 1);
        update();
      });

      nextButton.addEventListener('click', () => {
        currentIndex = wrapIndex(currentIndex + 1);
        update();
      });

      viewport.style.touchAction = 'pan-y';

      viewport.addEventListener('pointerdown', (event) => {
        pointerStartX = event.clientX;
        pointerDeltaX = 0;
      });

      viewport.addEventListener('pointermove', (event) => {
        if (pointerStartX === null) {
          return;
        }

        pointerDeltaX = event.clientX - pointerStartX;
      });

      const endSwipe = () => {
        if (pointerStartX === null) {
          return;
        }

        if (Math.abs(pointerDeltaX) > 50) {
          currentIndex = wrapIndex(currentIndex + (pointerDeltaX < 0 ? 1 : -1));
        }

        pointerStartX = null;
        pointerDeltaX = 0;
        update();
      };

      viewport.addEventListener('pointerup', endSwipe);
      viewport.addEventListener('pointercancel', endSwipe);
      viewport.addEventListener('pointerleave', () => {
        if (pointerStartX !== null) {
          endSwipe();
        }
      });

      const refreshLayout = () => {
        measureCaptionHeight();
        update(false);
      };

      window.addEventListener('resize', refreshLayout);

      block.querySelectorAll('img').forEach((img) => {
        if (img.complete) {
          return;
        }

        img.addEventListener(
          'load',
          () => {
            refreshLayout();
          },
          { once: true }
        );
      });

      refreshLayout();
    });
  };

  initializeCarousel({
    blocks: document.querySelectorAll('[data-full-carousel]'),
    viewportSelector: '.full-carousel-viewport',
    trackSelector: '.full-carousel-track',
    slideSelector: '.full-carousel-slide',
    prevSelector: '.full-carousel-button.prev',
    nextSelector: '.full-carousel-button.next',
    dotsSelector: '.full-carousel-dots',
    dotClass: 'full-carousel-dot',
    captionSelector: '.full-carousel-caption',
    captionDisplayClass: 'full-carousel-caption-display',
    navTopVariable: '--full-carousel-nav-top'
  });

  initializeCarousel({
    blocks: document.querySelectorAll('[data-carousel]'),
    viewportSelector: '.carousel-viewport',
    trackSelector: '.carousel-track',
    slideSelector: '.carousel-slide',
    prevSelector: '.carousel-button.prev',
    nextSelector: '.carousel-button.next',
    dotsSelector: '.carousel-dots',
    dotClass: 'carousel-dot',
    captionSelector: '.carousel-caption',
    captionDisplayClass: 'carousel-caption-display',
    navTopVariable: '--carousel-nav-top'
  });
});