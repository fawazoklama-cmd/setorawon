export const CHUNK_SIZE = 64 * 1024; // 64 KB chunks for safe WebRTC DataChannel flow

export function getTotalChunks(byteLength: number, chunkSize = CHUNK_SIZE): number {
  if (byteLength <= 0) return 0;
  return Math.ceil(byteLength / chunkSize);
}

export function sliceChunkBounds(
  byteLength: number,
  chunkIndex: number,
  chunkSize = CHUNK_SIZE
): { start: number; end: number } {
  const start = chunkIndex * chunkSize;
  const end = Math.min(byteLength, start + chunkSize);
  return { start, end };
}

export class FileReassembler {
  public readonly transferId: string;
  public readonly fileName: string;
  public readonly mimeType: string;
  public readonly totalBytes: number;
  public readonly totalChunks: number;
  private chunks: Array<Uint8Array | undefined>;
  private receivedCount = 0;
  private receivedBytes = 0;
  private cancelled = false;

  constructor(params: {
    transferId: string;
    fileName: string;
    mimeType: string;
    totalBytes: number;
    totalChunks: number;
  }) {
    this.transferId = params.transferId;
    this.fileName = params.fileName;
    this.mimeType = params.mimeType || 'application/octet-stream';
    this.totalBytes = params.totalBytes;
    this.totalChunks = params.totalChunks;
    this.chunks = new Array(params.totalChunks);
  }

  public addChunk(
    index: number,
    data: ArrayBuffer | Uint8Array
  ): { progress: number; transferredBytes: number; complete: boolean } {
    if (this.cancelled) {
      return { progress: 0, transferredBytes: this.receivedBytes, complete: false };
    }
    if (index < 0 || index >= this.totalChunks) {
      return {
        progress: this.getProgress(),
        transferredBytes: this.receivedBytes,
        complete: this.isComplete(),
      };
    }

    const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
    if (!this.chunks[index]) {
      this.chunks[index] = bytes;
      this.receivedCount += 1;
      this.receivedBytes += bytes.byteLength;
    }

    return {
      progress: this.getProgress(),
      transferredBytes: this.receivedBytes,
      complete: this.isComplete(),
    };
  }

  public isComplete(): boolean {
    return !this.cancelled && this.totalChunks > 0 && this.receivedCount === this.totalChunks;
  }

  public getProgress(): number {
    if (this.totalChunks <= 0) return 0;
    return Math.min(100, Math.round((this.receivedCount / this.totalChunks) * 100));
  }

  public cancel(): void {
    this.cancelled = true;
    this.chunks = [];
  }

  public buildBlob(): Blob {
    if (!this.isComplete()) {
      throw new Error('Cannot build Blob before all chunks are received');
    }
    const parts = this.chunks.map((c) => {
      if (!c) return new Uint8Array(0);
      const copy = new Uint8Array(c.byteLength);
      copy.set(c);
      return copy;
    });
    return new Blob(parts, { type: this.mimeType });
  }
}
