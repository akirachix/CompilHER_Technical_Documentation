document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll(".architecture-image");

  images.forEach((img) => {
    img.addEventListener("click", () => {
      const lightbox = document.createElement("div");
      lightbox.className = "architecture-lightbox active";

      lightbox.innerHTML = `
        <button class="architecture-lightbox-close">&times;</button>
        <img src="${img.src}" alt="${img.alt}">
      `;

      document.body.appendChild(lightbox);

      const close = () => lightbox.remove();

      lightbox.querySelector("button").onclick = close;

      lightbox.onclick = (e) => {
        if (e.target === lightbox) close();
      };

      document.addEventListener("keydown", function escape(e) {
        if (e.key === "Escape") {
          close();
          document.removeEventListener("keydown", escape);
        }
      });
    });
  });
});