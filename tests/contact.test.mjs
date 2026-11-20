import assert from 'node:assert/strict';
import test from 'node:test';

import { buildContactMessage, whatsappChatUrl } from '../src/lib/contact.ts';

test('recognizes only a configured international destination and rejects the old placeholder', () => {
  assert.equal(whatsappChatUrl(undefined), null);
  assert.equal(whatsappChatUrl('573000000000'), null);
  assert.equal(whatsappChatUrl('300 123 4567'), null);
  assert.equal(whatsappChatUrl(' +573116026712 '), 'https://wa.me/573116026712');
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
