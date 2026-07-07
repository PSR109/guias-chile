// afiliados.js — interruptor central de monetización de las Guías de Chile.
//
// ÚNICO paso para encender los ingresos (acciones humanas #1 y #2 en agente/ESTADO.md):
// rellenar los IDs de afiliado de abajo y hacer commit. Nada más.
// Mientras estén vacíos, los botones funcionan como enlaces normales (sin comisión).
// gyg_partner ya viene con el ID real: la cuenta de GetYourGuide está aprobada.
window.PSR_AFILIADOS = {
  viator_pid: "P00308789", // ID de partner Viator (registrado 2026-07-07)
  civitatis_aid: "",    // ID de afiliado Civitatis, ej: "12345"
  gyg_partner: "BZYZJT4" // ID de partner GetYourGuide (aprobado, mismo de App Panoramas)
};

document.addEventListener("DOMContentLoaded", function () {
  var ids = window.PSR_AFILIADOS;
  document.querySelectorAll("a[data-afiliado]").forEach(function (a) {
    try {
      var url = new URL(a.href);
      if (a.dataset.afiliado === "viator" && ids.viator_pid) {
        url.searchParams.set("pid", ids.viator_pid);
        url.searchParams.set("mcid", "42383");
        url.searchParams.set("medium", "link");
      } else if (a.dataset.afiliado === "civitatis" && ids.civitatis_aid) {
        url.searchParams.set("aid", ids.civitatis_aid);
      } else if (a.dataset.afiliado === "gyg" && ids.gyg_partner) {
        url.searchParams.set("partner_id", ids.gyg_partner);
      }
      a.href = url.toString();
      a.rel = "sponsored noopener";
      a.target = "_blank";
    } catch (e) { /* URL inválida: dejar el enlace tal cual */ }
  });
});
