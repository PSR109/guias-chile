// boletin.js — captura de newsletter para las Guías de Chile.
//
// Reusa el pipeline de leads de la app Panoramas (POST /api/eventos,
// type:"newsletter") en vez de crear cuenta nueva en un ESP (Mailchimp,
// Brevo, etc.) — mismo backend real que valida el correo y persiste en
// public.leads. CORS ya está habilitado para este origen en el Worker.
(function () {
  var ENDPOINT = "https://viajesypanoramas.cl/api/eventos";
  var MENSAJES = {
    es: { ok: "¡Listo! Revisa tu correo la próxima semana.", error: "Algo falló. Intenta de nuevo en un momento." },
    en: { ok: "Done! Check your inbox next week.", error: "Something failed. Try again in a moment." },
    pt: { ok: "Pronto! Confira seu e-mail na próxima semana.", error: "Algo falhou. Tente novamente em instantes." },
  };
  var lang = (document.documentElement.lang || "es").slice(0, 2);
  var textos = MENSAJES[lang] || MENSAJES.es;

  function enviar(form) {
    var estado = form.parentElement.querySelector(".boletin-estado");
    var boton = form.querySelector("button[type=submit]");
    var email = form.querySelector("input[type=email]").value.trim();
    var honeypot = form.querySelector('input[name="contact_time_x9"]').value;
    boton.disabled = true;
    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "newsletter",
        email: email,
        contact_time_x9: honeypot,
        path: location.pathname,
        ref: document.referrer || undefined,
      }),
    })
      .then(function (res) {
        if (!res.ok && res.status !== 204) throw new Error("http " + res.status);
        form.hidden = true;
        estado.hidden = false;
        estado.textContent = textos.ok;
        estado.className = "boletin-estado boletin-ok";
        try { localStorage.setItem("psr_boletin_visto", "1"); } catch (e) {}
        cerrarPopup();
      })
      .catch(function () {
        boton.disabled = false;
        estado.hidden = false;
        estado.textContent = textos.error;
        estado.className = "boletin-estado boletin-error";
      });
  }

  function cerrarPopup() {
    var popup = document.getElementById("boletin-popup");
    if (popup) popup.hidden = true;
  }

  document.addEventListener("submit", function (ev) {
    var form = ev.target;
    if (!form.matches("[data-boletin]")) return;
    ev.preventDefault();
    enviar(form);
  });

  // Popup no invasivo: aparece una sola vez (localStorage), tras 50% de
  // scroll o 10s, lo que ocurra primero — nunca si ya se suscribió o lo
  // cerró antes.
  document.addEventListener("DOMContentLoaded", function () {
    var popup = document.getElementById("boletin-popup");
    if (!popup) return;
    var visto;
    try { visto = localStorage.getItem("psr_boletin_visto"); } catch (e) { visto = "1"; }
    if (visto) { popup.remove(); return; }

    var mostrado = false;
    function mostrar() {
      if (mostrado) return;
      mostrado = true;
      popup.hidden = false;
    }
    var timer = setTimeout(mostrar, 10000);
    window.addEventListener(
      "scroll",
      function onScroll() {
        var pct = (window.scrollY + window.innerHeight) / document.body.scrollHeight;
        if (pct > 0.5) {
          mostrar();
          window.removeEventListener("scroll", onScroll);
        }
      },
      { passive: true }
    );
    var cerrar = popup.querySelector(".boletin-cerrar");
    if (cerrar) {
      cerrar.addEventListener("click", function () {
        clearTimeout(timer);
        popup.hidden = true;
        try { localStorage.setItem("psr_boletin_visto", "1"); } catch (e) {}
      });
    }
  });
})();
