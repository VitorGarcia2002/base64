const crypto = require('crypto');

// Função para realizar o padding do chave
function padKey(key) {
  if (key.length > 64) {
    return crypto.createHash('sha256').update(key).digest('hex');
  } else if (key.length < 64) {
    return key + '0'.repeat(64 - key.length);
  }
  return key;
}

// Função para realizar o XOR entre dois buffers
function xorBuffers(buf1, buf2) {
  const result = [];
  for (let i = 0; i < buf1.length; i++) {
    result.push(buf1[i] ^ buf2[i]);
  }
  return result;
}

// Função para codificar uma mensagem usando HMAC SHA256
function encodeHMAC(message, key) {
  const blockSize = 64; // Tamanho do bloco em bytes
  const ipad = Array(blockSize).fill(0x36); // Inner padding
  const opad = Array(blockSize).fill(0x5c); // Outer padding

  const paddedKey = padKey(key);

  const innerKey = xorBuffers(paddedKey.split('').map(c => c.charCodeAt(0)), ipad);
  const outerKey = xorBuffers(paddedKey.split('').map(c => c.charCodeAt(0)), opad);

  const innerHash = crypto.createHash('sha256').update(innerKey.concat(message.split('').map(c => c.charCodeAt(0)))).digest('hex');
  const outerHash = crypto.createHash('sha256').update(outerKey.concat(innerHash.split('').map(c => c.charCodeAt(0)))).digest('hex');

  return outerHash;
}

// Mensagem e chave para teste
const message = 'Hello, world!';
const key = 'mySecretKey';

// Codificar a mensagem
const encodedMessage = encodeHMAC(message, key);
console.log('Encoded message:', encodedMessage);
