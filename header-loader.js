document.addEventListener("DOMContentLoaded", async () => {
  const target = document.getElementById("header-placeholder");
  if (!target) return;

  try {
    const response = await fetch("/jf-portfolio/header.html");
    if (!response.ok) {
      throw new Error(`Failed to load header: ${response.status}`);
    }

    const markup = await response.text();
    target.innerHTML = markup;

    const currentPage = document.body.dataset.page;

    if (currentPage === "architecture") {
      document.querySelector(".arch-button")?.classList.add("active");
    }

    if (currentPage === "photography") {
      document.querySelector(".photo-button")?.classList.add("active");
    }
  } catch (error) {
    console.error(error);
  }
});