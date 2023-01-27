async function generatePassword(passphrase, application, increment, length, characters) {
  if (passphrase === '' || application === '') return '';

  passphrase = passphrase.replaceAll(' ', '');

  const gen = genBytes(passphrase, application + increment);
  let password = '';
  for (let i = 0; i < length; i++) {
      password += characters[(await gen.next()).value % characters.length];
  }
  return password;
}

async function* genBytes(phrase1, phrase2) {
  for (let index = 0; ; index += 1) {
    const hash = await sha256Bytes(JSON.stringify([phrase1, phrase2, index]));
    for (const byte of hash) yield byte;
  }
}

async function sha256Bytes(str) {
  const buffer = new TextEncoder('utf-8').encode(str);
  return new Uint8Array(await crypto.subtle.digest('SHA-256', buffer));
}

async function sha256String(content) {
  return arrayToHex(await sha256Bytes(content));
}

function arrayToHex(arr) {
  const byteToHex = byte => (byte < 16 ? '0' : '') + byte.toString(16);
  return [...arr].map(byteToHex).join('');
}

function getRandomValues(n) {
  const array = new Uint8Array(n);
  window.crypto.getRandomValues(array);
  return array;
}

export {
  arrayToHex,
  generatePassword,
  getRandomValues,
  sha256String,
  sha256Bytes,
};