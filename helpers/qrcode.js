const QRCode = require('qrcode');

async function toDataURL(text) {
  try {
    return await QRCode.toDataURL(text);
  } catch (err) {
    console.error("QR error:", err);
    return null;
  }
}

module.exports = { toDataURL };
