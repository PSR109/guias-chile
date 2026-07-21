import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extractGuide, pickSections } from '../lib/extract-guide.mjs';

test('extractGuide parsea torres-del-paine EN', () => {
  const g = extractGuide('en', 'torres-del-paine');
  assert.ok(g.title.length > 5, 'tiene h1');
  assert.ok(g.sections.length >= 4, 'tiene >=4 secciones');
  const headings = g.sections.map((s) => s.heading);
  assert.ok(headings.includes('The three ways to see the park'));
  assert.ok(headings.includes('Essential logistics'));
  const all = g.sections.map((s) => s.html).join('');
  assert.ok(!all.includes('wikimedia'), 'sin hotlinks Wikimedia');
  assert.ok(!all.includes('viator.com'), 'sin botones de afiliado');
  assert.ok(!all.includes('<details'), 'details convertidos');
  assert.ok(g.faq.length >= 2, 'FAQ extraida');
});

test('links relativos quedan absolutos', () => {
  const g = extractGuide('en', 'carretera-austral');
  const all = g.sections.map((s) => s.html).join('');
  assert.ok(!/href="(?!https?:|#|mailto:)/.test(all), 'no quedan hrefs relativos');
});

test('pickSections falla con heading inexistente', () => {
  const g = extractGuide('en', 'chiloe');
  assert.throws(() => pickSections(g, ['No Existe Este Heading']));
  // OJO: NO usar 'The must-sees' aqui — es un h2 seguido INMEDIATAMENTE por un h3
  // en en/chiloe.html, asi que su seccion queda con html vacio. Usar una seccion
  // con cuerpo real (verificado: el parrafo bajo este h3 menciona los palafitos):
  const html = pickSections(g, ['1. Castro: stilt houses and the San Francisco church']);
  assert.ok(html.includes('Castro'), 'heading limpio presente en el h4');
  assert.ok(html.includes('palafitos'), 'cuerpo de la seccion presente (no vacio)');
});
