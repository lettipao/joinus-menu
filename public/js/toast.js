(function () {

  const container = document.createElement("div");
  container.className = "toast-container";
  document.body.appendChild(container);

  function show(message, type = "success", duration = 2500) {

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      toast.style.transition = "all .3s ease";

      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  window.toast = {
    success: (msg) => show(msg, "success"),
    error: (msg) => show(msg, "error"),
    info: (msg) => show(msg, "info")
  };

})();