import test from 'node:test';
import assert from 'node:assert/strict';
import {
  categorizeFile,
  formatDuration,
  formatFileSize,
  generateRoomCode,
  generateUserId,
  getGuestPeerId,
  getRoomHostPeerId,
  isValidRoomCode,
  sanitizeRoomCode,
  validateFileForTransfer,
} from './identity';
import { CHUNK_SIZE, FileReassembler, getTotalChunks, sliceChunkBounds } from './fileTransfer';

test('generateUserId and generateRoomCode follow expected formats', () => {
  const uid = generateUserId();
  assert.match(uid, /^STW-[A-Z0-9]{6}$/);

  const room = generateRoomCode();
  assert.match(room, /^ROOM-[A-Z0-9]{4}$/);
  assert.equal(isValidRoomCode(room), true);
});

test('sanitizeRoomCode cleans whitespace and invalid characters', () => {
  assert.equal(sanitizeRoomCode('  manda-01!@#  '), 'MANDA-01');
  assert.equal(isValidRoomCode('abc'), false);
  assert.equal(isValidRoomCode('ABCD'), true);
  assert.equal(getRoomHostPeerId('Manda-01'), 'setorawon-room-manda-01');
  assert.match(getGuestPeerId('STW-ABC123'), /^setorawon-peer-stwabc123-[a-z0-9]{4}$/);
});

test('formatFileSize and formatDuration format numbers accurately', () => {
  assert.equal(formatFileSize(0), '0 B');
  assert.equal(formatFileSize(512), '512 B');
  assert.equal(formatFileSize(1536), '1.50 KB');
  assert.equal(formatFileSize(10 * 1024 * 1024), '10.0 MB');

  assert.equal(formatDuration(0), '00:00');
  assert.equal(formatDuration(65), '01:05');
  assert.equal(formatDuration(3661), '01:01:01');
});

test('validateFileForTransfer enforces empty, size, and executable security rules', () => {
  assert.deepEqual(validateFileForTransfer({ name: 'empty.txt', size: 0 }, 50), {
    valid: false,
    reason: 'empty',
  });
  assert.deepEqual(validateFileForTransfer({ name: 'huge.mp4', size: 60 * 1024 * 1024 }, 50), {
    valid: false,
    reason: 'too_large',
  });
  assert.deepEqual(validateFileForTransfer({ name: 'payload.exe', size: 1024 }, 50), {
    valid: false,
    reason: 'unsafe_type',
  });
  assert.deepEqual(validateFileForTransfer({ name: 'script.sh', size: 1024 }, 50), {
    valid: false,
    reason: 'unsafe_type',
  });
  assert.deepEqual(validateFileForTransfer({ name: 'notes.pdf', size: 2048 }, 50), {
    valid: true,
  });
});

test('categorizeFile classifies media, documents, and archives properly', () => {
  assert.equal(categorizeFile('image/png', 'photo.png'), 'image');
  assert.equal(categorizeFile('video/mp4', 'clip.mp4'), 'video');
  assert.equal(categorizeFile('application/pdf', 'report.pdf'), 'document');
  assert.equal(categorizeFile('', 'deck.pptx'), 'document');
  assert.equal(categorizeFile('', 'bundle.zip'), 'archive');
  assert.equal(categorizeFile('application/octet-stream', 'data.bin'), 'other');
});

test('FileReassembler reassembles chunked binary data accurately', async () => {
  const payload = new Uint8Array(CHUNK_SIZE * 2 + 123);
  for (let i = 0; i < payload.length; i += 1) {
    payload[i] = i % 251;
  }
  const totalChunks = getTotalChunks(payload.byteLength);
  assert.equal(totalChunks, 3);

  const reassembler = new FileReassembler({
    transferId: 'tx-1',
    fileName: 'sample.bin',
    mimeType: 'application/octet-stream',
    totalBytes: payload.byteLength,
    totalChunks,
  });

  for (let idx = 0; idx < totalChunks; idx += 1) {
    const { start, end } = sliceChunkBounds(payload.byteLength, idx);
    const slice = payload.slice(start, end);
    const res = reassembler.addChunk(idx, slice);
    assert.equal(res.complete, idx === totalChunks - 1);
  }

  assert.equal(reassembler.getProgress(), 100);
  const blob = reassembler.buildBlob();
  assert.equal(blob.size, payload.byteLength);
  const out = new Uint8Array(await blob.arrayBuffer());
  assert.deepEqual(out, payload);
});

test('FileReassembler handles cancellation safely', () => {
  const reassembler = new FileReassembler({
    transferId: 'tx-cancel',
    fileName: 'photo.jpg',
    mimeType: 'image/jpeg',
    totalBytes: 100,
    totalChunks: 2,
  });
  reassembler.addChunk(0, new Uint8Array(50));
  reassembler.cancel();
  assert.equal(reassembler.isComplete(), false);
  assert.throws(() => reassembler.buildBlob());
});
