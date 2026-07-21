import { test } from 'node:test';
import assert from 'node:assert/strict';
import { topPois } from '../lib/panoramas.mjs';

test('topPois devuelve POIs de San Pedro de Atacama', () => {
  const pois = topPois({ comunas: ['San Pedro de Atacama'], limit: 8 });
  assert.equal(pois.length, 8);
  for (const p of pois) {
    assert.ok(p.nombre && p.descripcion, 'nombre y descripcion EN presentes');
    assert.equal(typeof p.precioClp, 'number');
  }
  const nombres = pois.map((p) => p.nombre);
  assert.equal(new Set(nombres).size, nombres.length, 'sin duplicados');
});

test('topPois combina comunas Natales', () => {
  const pois = topPois({ comunas: ['Natales', 'Puerto Natales', 'Torres del Paine'], limit: 10 });
  assert.ok(pois.length >= 5);
});
