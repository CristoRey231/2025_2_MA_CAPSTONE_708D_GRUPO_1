document.addEventListener("DOMContentLoaded", () => {
  // === Asegura que todos los menús empiecen cerrados e invisibles ===
  document.querySelectorAll(".dropdown-menu").forEach(m => {
    m.classList.remove("show");
    m.style.display = "none"; // fuerza oculto al iniciar
  });

  // === Manejo de dropdowns (clic) ===
  const dropdowns = document.querySelectorAll(".dropdown");

  dropdowns.forEach((dropdown) => {
    const trigger = dropdown.querySelector("a");
    const submenu = dropdown.querySelector(".dropdown-menu");

    if (trigger && submenu) {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Cerrar otros abiertos
        document.querySelectorAll(".dropdown-menu.show").forEach((menu) => {
          if (menu !== submenu) menu.classList.remove("show");
        });

        // Mostrar u ocultar este
        submenu.classList.toggle("show");
      });
    }
  });

  // Cerrar al hacer clic fuera
  document.addEventListener("click", (e) => {
    document.querySelectorAll(".dropdown-menu.show").forEach((menu) => {
      if (!menu.contains(e.target)) menu.classList.remove("show");
    });
  });

  // Cerrar al hacer clic en un enlace
  document.querySelectorAll(".dropdown-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      link.closest(".dropdown-menu").classList.remove("show");
    });
  });

  // === Mostrar u ocultar enlace a "Base de Datos" según el rol ===
  setTimeout(() => {
    const baseDatosLink = document.querySelector('a[href="menu.html"]');
    if (!baseDatosLink) return;

    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const rol = localStorage.getItem("rol");

    if (!usuario) {
      baseDatosLink.style.display = "none";
      return;
    }

    // rol 1 = cliente, 2 = empleado, 3 = admin
    if (rol === "1") {
      baseDatosLink.style.display = "none";
      return;
    }

    if (rol === "2" || rol === "3") {
      baseDatosLink.style.display = "inline-block";
    }
  }, 200);
});









