import { test } from 'node:test';
import assert from 'node:assert/strict';
import { KITS } from '../kits.config.mjs';
import { extractGuide } from '../lib/extract-guide.mjs';

test('kits: ids y permalinks unicos, route.length === days.length', () => {
  const ids = KITS.map((k) => k.id);
  assert.equal(new Set(ids).size, ids.length, 'ids duplicados');
  const permalinks = KITS.map((k) => k.gumroadPermalink);
  assert.equal(new Set(permalinks).size, permalinks.length, 'permalinks duplicados');
  // Corte 2026-08-01 (tanda 3): 10 gen-1 EN + 5 gen-2 ES (termas, radal,
  // santiago-cajon-es, atacama-es, tdp-es). Si el conteo cambia, actualizar.
  assert.equal(KITS.length, 15, 'conteo de kits cambio — actualizar invariante');
  for (const kit of KITS) {
    assert.equal(kit.route.length, kit.days.length, `${kit.id}: route.length !== days.length`);
    assert.ok(kit.lang === undefined || kit.lang === 'es', `${kit.id}: lang inesperado`);
    assert.ok(kit.priceUsd >= 9.9 && kit.priceUsd <= 29, `${kit.id}: precio fuera del rango declarado`);
  }
});

test('kits: pulls, budget y faq referencian headings reales de las guias', () => {
  const cache = {};
  const g = (lang, slug) => (cache[`${lang}/${slug}`] ??= extractGuide(lang, slug));
  for (const kit of KITS) {
    const lang = kit.lang ?? 'en';
    const headingsOf = (slug) => new Set(g(lang, slug).sections.map((s) => s.heading));
    for (const day of kit.days) {
      for (const pull of day.pulls) {
        const avail = headingsOf(pull.guide);
        for (const h of pull.headings) {
          assert.ok(avail.has(h), `${kit.id}: heading "${h}" no existe en ${lang}/${pull.guide}`);
        }
      }
    }
    for (const b of kit.budget) {
      assert.ok(headingsOf(b.guide).has(b.heading), `${kit.id}: budget heading "${b.heading}" no existe en ${lang}/${b.guide}`);
    }
    for (const slug of kit.faqFrom) {
      assert.ok(g(lang, slug).faq.length >= 1, `${kit.id}: ${lang}/${slug} sin FAQ`);
    }
  }
});
