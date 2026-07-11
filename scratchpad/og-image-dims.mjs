// Reads real JPEG width/height from SOF marker (no deps). Pure, deterministic.
import fs from 'node:fs';

export function jpegSize(buf) {
  if (buf[0] !== 0xff || buf[1] !== 0xd8) throw new Error('not a JPEG');
  let offset = 2;
  while (offset < buf.length) {
    if (buf[offset] !== 0xff) { offset++; continue; }
    const marker = buf[offset + 1];
    // SOF0..SOF3, SOF5..SOF7, SOF9..SOF11, SOF13..SOF15 carry dimensions; skip RST/standalone markers.
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      const height = buf.readUInt16BE(offset + 5);
      const width = buf.readUInt16BE(offset + 7);
      return { width, height };
    }
    const segLen = buf.readUInt16BE(offset + 2);
    offset += 2 + segLen;
  }
  throw new Error('SOF marker not found');
}

export function jpegSizeFromFile(path) {
  return jpegSize(fs.readFileSync(path));
}
