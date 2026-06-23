(function () {

  let overlay = null;

  function open({ title = "Conferma", message = "", onConfirm, onCancel }) {

    if (overlay) overlay.remove();

    overlay = document.createElement("div");
    overlay.className = "modal-overlay";

    const modal = document.createElement("div");
    modal.className = "modal";

    modal.innerHTML = `
      <h3>${title}</h3>
      <p>${message}</p>

      <div class="modal-actions">
        <button id="cancelBtn" class="btn-secondary">Annulla</button>
        <button id="confirmBtn" class="btn-danger">Elimina</button>
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    document.getElementById("cancelBtn").onclick = () => {
      overlay.remove();
      overlay = null;
      if (onCancel) onCancel();
    };

    document.getElementById("confirmBtn").onclick = () => {
      overlay.remove();
      overlay = null;
      if (onConfirm) onConfirm();
    };

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.remove();
        overlay = null;
        if (onCancel) onCancel();
      }
    });
  }

  window.modal = { open };

})();