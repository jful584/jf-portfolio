const projects = [
  {
    id: 1,
    title: "Processional Promenade",
    date: "Fall 2025",
    sortDate: "2025-12-01",
    images: [
      "PROJECT-PAGES/PROCESS-PROJECT/ax3_basic1 (1).webp",
      "PROJECT-PAGES/PROCESS-PROJECT/phy_mod1 f.webp",
      "PROJECT-PAGES/PROCESS-PROJECT/SECTION_1_port.webp"
    ],
    link: "PROJECT-PAGES/PROCESS-PROJECT/process-page2.html"
  },
  {
    id: 2,
    title: "Reconfigurable Furniture",
    date: "Spring 2026",
    sortDate: "2026-03-15",
    images: [
      "PROJECT-PAGES/CHAIR-PROJECT/mesitting_good.webp",
      "PROJECT-PAGES/CHAIR-PROJECT/1722_Sectiondrawing_ copy_cover.webp"
    ],
    link: "PROJECT-PAGES/CHAIR-PROJECT/"
  },
  {
    id: 3,
    title: "Object of Arresting Novelty",
    date: "Spring 2026",
    sortDate: "2026-05-16",
    images: [
      "PROJECT-PAGES/OOAN-PROJECT/OOAN_COVBER01.webp",
      "PROJECT-PAGES/OOAN-PROJECT/exploded_axon_drawing_att05_export03.jpg",
      "PROJECT-PAGES/OOAN-PROJECT/thinginspace_cover01.webp"
    ],
    link: "PROJECT-PAGES/OOAN-PROJECT/ooan-page.html"
  },
  {
    id: 4,
    title: "Writer's Passage",
    date: "Spring 2026",
    sortDate: "2026-05-12",
    images: [
      "PROJECT-PAGES/WRITER-PROJECT/Model_photo03 copy.webp",
      "PROJECT-PAGES/WRITER-PROJECT/section-cover01.webp",
      "PROJECT-PAGES/WRITER-PROJECT/Model_photo02 copy.webp"
    ],
    link: "PROJECT-PAGES/WRITER-PROJECT/writer-page.html"
  },
  {
    id: 5,
    title: "Geometric Reasoning",
    date: "Spring 2026",
    sortDate: "2026-04-1",
    images: [
      "PROJECT-PAGES/GEO-PROJECT/Project2GR_FrameAnimation_JackFuller.gif"
    ],
    link: "PROJECT-PAGES/GEO-PROJECT/"
  },
  {
    id: 6,
    title: "Elemental Drafts",
    date: "Fall 2025",
    sortDate: "2025-11-1",
    images: [
      "PROJECT-PAGES/DRAFTS-PROJECT/MERCEDES_BENZ_cover.gif",
    ],
    link: "PROJECT-PAGES/DRAFTS-PROJECT/drafts-page.html"
  },
  {
    id: 7,
    title: "Diagramming Motion",
    date: "Spring 2026",
    sortDate: "2026-2-1",
    images: [
      "PROJECT-PAGES/DIAGRAM-PROJECT/motion_picture_2_02_PRINT.webp",
      "PROJECT-PAGES/DIAGRAM-PROJECT/proj1-1_lightrail2_print2.webp",
      "PROJECT-PAGES/DIAGRAM-PROJECT/Generative_Model_Final-Print_01.webp"
    ],
    link: "PROJECT-PAGES/DIAGRAM-PROJECT/"
  },
  {
    id: 8,
    title: "Spatial Membrane",
    date: "Fall 2025",
    sortDate: "2025-12-10",
    images: [
      "PROJECT-PAGES/SPMT-PROJECT/matrix_contours copy.webp"
    ],
    link: "PROJECT-PAGES/SPMT-PROJECT/spmt-page.html"
  },
  {
    id: 9,
    title: "Modular Airport Terminal",
    date: "Winter 2025",
    sortDate: "2025-12-20",
    images: [
      "PROJECT-PAGES/AIRPORT-PROJECT/render_ground_att1_editting peggy.webp",
      "PROJECT-PAGES/AIRPORT-PROJECT/term1 section perspective drawing f.webp",
      "PROJECT-PAGES/AIRPORT-PROJECT/term1 stair draw2 f.webp"
    ],
    link: "PROJECT-PAGES/AIRPORT-PROJECT/"
  },
];

const gridContainer = document.getElementById("project-grid");
const sortToggleButton = document.getElementById("sort-toggle");

let sortOrder = "newest";
let carouselIntervals = [];
let carouselTimeouts = [];

function getSortedProjects() {
  return [...projects].sort((a, b) => {
    const dateA = new Date(a.sortDate);
    const dateB = new Date(b.sortDate);

    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });
}

function getProjectImages(project) {
  if (Array.isArray(project.images) && project.images.length > 0) {
    return project.images;
  }

  if (project.image) {
    return [project.image];
  }

  return [];
}

function buildProjectMedia(images, title) {
  if (images.length === 0) {
    return `
      <div class="project-media project-placeholder">
        <span>No image yet</span>
      </div>
    `;
  }

  const loopedImages = images.length > 1 ? [...images, images[0]] : images;

  return `
    <div class="project-media" data-slide-count="${images.length}">
      <div class="project-media-track">
        ${loopedImages
          .map(
            (src, index) => `
              <div class="project-slide">
                <img
                  src="${src}"
                  alt="${title} image ${Math.min(index + 1, images.length)}"
                  loading="lazy"
                >
              </div>
            `
          )
          .join("")}
      </div>
    </div>
  `;
}

function clearCarousels() {
  carouselIntervals.forEach(clearInterval);
  carouselTimeouts.forEach(clearTimeout);
  carouselIntervals = [];
  carouselTimeouts = [];
}

function initializeCarousels() {
  const mediaElements = document.querySelectorAll(".project-media[data-slide-count]");

  mediaElements.forEach((media) => {
    const track = media.querySelector(".project-media-track");
    const slideCount = Number(media.dataset.slideCount);

    if (!track || slideCount <= 1) {
      return;
    }

    let currentIndex = 0;
    let intervalId = null;
    let resetTimeoutId = null;

    function goToSlide(index, useTransition = true) {
      track.style.transition = useTransition ? "transform 1.4s ease-in-out" : "none";
      track.style.transform = `translateX(-${index * 100}%)`;
    }

    function startCarousel() {
      intervalId = setInterval(() => {
        currentIndex += 1;
        goToSlide(currentIndex, true);

        if (currentIndex === slideCount) {
          resetTimeoutId = setTimeout(() => {
            currentIndex = 0;
            goToSlide(currentIndex, false);
          }, 1450);

          carouselTimeouts.push(resetTimeoutId);
        }
      }, 8000);

      carouselIntervals.push(intervalId);
    }

    media.addEventListener("mouseenter", () => {
      clearInterval(intervalId);
      clearTimeout(resetTimeoutId);
    });

    media.addEventListener("mouseleave", () => {
      clearInterval(intervalId);
      clearTimeout(resetTimeoutId);
      startCarousel();
    });

    goToSlide(0, false);
    startCarousel();
  });
}

function renderProjects() {
  clearCarousels();

  const sortedProjects = getSortedProjects();

  gridContainer.innerHTML = sortedProjects
    .map((project) => {
      const images = getProjectImages(project);

      return `
        <article class="project-card" data-sort-date="${project.sortDate}">
          <a href="${project.link}" class="project-link">
            ${buildProjectMedia(images, project.title)}
            <div class="project-content">
              <span class="hidden-date" aria-hidden="true">${project.sortDate}</span>
              <h3>${project.title}</h3>
              <p>${project.date}</p>
            </div>
          </a>
        </article>
      `;
    })
    .join("");

  initializeCarousels();
}

function updateSortButtonLabel() {
  sortToggleButton.textContent =
    sortOrder === "newest" ? "Sort: Newest" : "Sort: Oldest";
}

sortToggleButton.addEventListener("click", () => {
  sortOrder = sortOrder === "newest" ? "oldest" : "newest";
  updateSortButtonLabel();
  renderProjects();
});

window.addEventListener("DOMContentLoaded", () => {
  updateSortButtonLabel();
  renderProjects();
});