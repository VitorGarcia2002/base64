const base64Encode = (str) => {
    const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let base64 = '';

    let bytes = [];
    for (let i = 0; i < str.length; ++i) {
        let code = str.charCodeAt(i);
        if (code < 0x80) {
            bytes.push(code);
        } else if (code < 0x800) {
            bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
        } else if (code < 0xd800 || code >= 0xe000) {
            bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
        } else {
            // Surrogate pair
            ++i;
            code = 0x10000 + (((code & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
            bytes.push(
                0xf0 | (code >> 18),
                0x80 | ((code >> 12) & 0x3f),
                0x80 | ((code >> 6) & 0x3f),
                0x80 | (code & 0x3f)
            );
        }
    }

    let i = 0;
    while (i < bytes.length) {
        let chunk = (bytes[i++] << 16) | (bytes[i++] << 8) | bytes[i++];
        base64 += base64Chars[chunk >> 18 & 0x3f] + base64Chars[chunk >> 12 & 0x3f] + base64Chars[chunk >> 6 & 0x3f] + base64Chars[chunk & 0x3f];
    }

    // Adicionando caracteres de preenchimento se necessário
    let padding = 3 - (str.length % 3) % 3;
    if (padding > 0 && padding < 3) {
        base64 += '='.repeat(padding);
    }

    return base64;
};



const base64Decode = (encodedStr) => {
    const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let str = '';
    let binary = '';

    for (let i = 0; i < encodedStr.length; i++) {
        if (encodedStr[i] !== '=') {
            const index = base64Chars.indexOf(encodedStr[i]);
            binary += index.toString(2).padStart(6, '0');
        }
    }

    // Removendo os bits extras se o comprimento não for múltiplo de 8
    const padding = binary.length % 8;
    if (padding) {
        binary = binary.slice(0, binary.length - padding);
    }

    // Convertendo cada conjunto de 8 bits em bytes
    const bytes = [];
    for (let j = 0; j < binary.length; j += 8) {
        bytes.push(parseInt(binary.slice(j, j + 8), 2));
    }

    // Decodificando bytes UTF-8
    let i = 0;
    while (i < bytes.length) {
        let byte = bytes[i];
        let charCode;
        if (byte < 0x80) {
            charCode = byte;
            i += 1;
        } else if (byte < 0xe0) {
            charCode = ((byte & 0x1f) << 6) | (bytes[i + 1] & 0x3f);
            i += 2;
        } else {
            charCode = ((byte & 0xf) << 12) | ((bytes[i + 1] & 0x3f) << 6) | (bytes[i + 2] & 0x3f);
            i += 3;
        }
        str += String.fromCharCode(charCode);
    }

    return str;
};



// Exemplo de uso
const originalString = "Olá Mundo !";
const encodedString = base64Encode(originalString);
const decodedString = base64Decode(encodedString);

console.log("String original:", originalString);
console.log("String codificada:", encodedString);
console.log("String decodificada:", decodedString);
