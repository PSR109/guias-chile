// analytics.js — beacon mínimo de analítica para Guías de Chile.
//
// Envía dos tipos de evento, sin cookies ni identificadores personales:
//   - "pageview" al cargar cada página.
//   - "click" cuando alguien pulsa un botón de afiliado (data-afiliado).
//
// Contrato del payload: { type: "pageview"|"click", path, ctx? } — mismo
// shape que espera POST /api/eventos del Worker de Panoramas (ver
// app_panoramas/worker/index.js: TYPES incluye "pageview" y "click", y lee
// `path` + el resto de campos como extra). El endpoint vive en el dominio
// hermano viajesypanoramas.cl, así que esta petición es cross-origin.
//
// Se envía con Content-Type "text/plain" a propósito: es un valor
// CORS-safelisted, así que el navegador manda el POST real sin preflight y el
// Worker recibe y procesa el evento igual. El navegador SÍ bloqueará la
// lectura de la respuesta hasta que ese origen tenga CORS habilitado (lane
// aparte, repo app_panoramas) — por eso todo va envuelto en try/catch con
// fallos silenciosos: esta guía nunca debe depender de que la analítica
// funcione.
(function () {
  "use strict";
  var ENDPOINT = "https://viajesypanoramas.cl/api/eventos";
  var PATH = location.pathname || "/";

  function enviar(payload) {
    var body;
    try {
      body = JSON.stringify(payload);
    } catch (e) {
      return;
    }
    try {
      if (navigator.sendBeacon) {
        var blob = new Blob([body], { type: "text/plain;charset=UTF-8" });
        if (navigator.sendBeacon(ENDPOINT, blob)) return;
      }
    } catch (e) { /* sigue al fallback de fetch */ }
    try {
      fetch(ENDPOINT, {
        method: "POST",
        mode: "cors",
        keepalive: true,
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: body
      }).catch(function () { /* red o CORS aún no listos: no-op */ });
    } catch (e) { /* no-op */ }
  }

  function init() {
    enviar({ type: "pageview", path: PATH });

    var botones = document.querySelectorAll("a[data-afiliado]");
    for (var i = 0; i < botones.length; i++) {
      botones[i].addEventListener("click", (function (a) {
        return function () {
          enviar({ type: "click", path: PATH, ctx: a.getAttribute("data-afiliado") });
        };
      })(botones[i]), { passive: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
