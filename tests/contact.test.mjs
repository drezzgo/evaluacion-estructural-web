import assert from 'node:assert/strict';
import test from 'node:test';

import { buildContactMessage, whatsappLink } from '../src/lib/contact.ts';

test('recognizes only a configured international destination and rejects the old placeholder', () => {
  assert.equal(whatsappLink(undefined, 'Consulta'), null);
  assert.equal(whatsappLink('573000000000', 'Consulta'), null);
  assert.equal(whatsappLink('300 123 4567', 'Consulta'), null);
  const url = new URL(whatsappLink(' +12025550123 ', 'Bogotá & obra'));
  assert.equal(url.origin + url.pathname, 'https://wa.me/12025550123');
  assert.equal(url.searchParams.get('text'), 'Bogotá & obra');
});

test('the contact draft includes all five fields and preserves multiline details', () => {
  const form = new FormData();
  for (const [key, value] of Object.entries({
    name: '  Prueba Única ', phone: '+57 300 123 4567', city: ' Bogotá & obra ',
    service: 'Patología estructural', details: 'Fisura\nSegundo renglón',
  })) form.set(key, value);
  const message = buildContactMessage(form);
  assert.equal(message, [
    'Hola, quisiera solicitar una consulta de ingeniería estructural.',
    'Nombre: Prueba Única',
    'Teléfono: +57 300 123 4567',
    'Ciudad o proyecto: Bogotá & obra',
    'Servicio: Patología estructural',
    'Detalles: Fisura\nSegundo renglón',
  ].join('\n'));
});

test('an incomplete draft cannot produce a message', () => {
  const form = new FormData();
  for (const field of ['name', 'phone', 'city', 'service']) form.set(field, 'Dato');
  for (const value of ['', '   ']) {
    form.set('details', value);
    assert.equal(buildContactMessage(form), null);
  }
});
