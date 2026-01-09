// src/security/clamav.service.ts
import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import * as net from 'node:net';

export interface ClamOptions {
  host?: string;
  port?: number;
  timeoutMs?: number;
  enabled?: boolean;
}

@Injectable()
export class ClamavService {
  private readonly host: string;
  private readonly port: number;
  private readonly timeoutMs: number;
  private readonly enabled: boolean;

  constructor(opts: ClamOptions = {}) {
    this.host = opts.host ?? '127.0.0.1';
    this.port = opts.port ?? 3310;
    this.timeoutMs = opts.timeoutMs ?? 20_000;
    this.enabled = opts.enabled ?? true;
  }

  /**
   * Scans a buffer for viruses using the ClamAV INSTREAM command.
   * @param buffer The file buffer to scan.
   * @throws {BadRequestException} if the buffer is empty or a virus is found.
   * @throws {ServiceUnavailableException} if ClamAV is not reachable or times out.
   */
  async scanBuffer(buffer: Buffer): Promise<void> {
    if (!this.enabled) {
      return;
    }

    if (!buffer?.length) {
      throw new BadRequestException('Cannot scan an empty file buffer.');
    }

    return new Promise<void>((resolve, reject) => {
      const socket = net.createConnection({ host: this.host, port: this.port });

      const cleanup = (error?: Error) => {
        try {
          socket.destroy();
        } catch {}
        if (error) reject(error);
        else resolve();
      };

      const timer = setTimeout(
        () =>
          cleanup(new ServiceUnavailableException('ClamAV scan timed out.')),
        this.timeoutMs,
      );

      socket.once('error', (err) => {
        clearTimeout(timer);
        cleanup(
          new ServiceUnavailableException(
            `ClamAV connection error: ${err.message}`,
          ),
        );
      });

      socket.once('connect', () => {
        // Use zINSTREAM for modern ClamAV versions; 'z' signifies zero-termination.
        socket.write('zINSTREAM\0');

        // Send file in chunks: [4-byte size][chunk data]
        const chunkSize = 64 * 1024; // 64KB [cite: 66]
        let offset = 0;

        const sendChunk = () => {
          if (offset >= buffer.length) {
            // Send a zero-length chunk to terminate the stream
            socket.write(Buffer.alloc(4));
            return;
          }
          const chunk = buffer.subarray(offset, offset + chunkSize);
          const header = Buffer.alloc(4);
          header.writeUInt32BE(chunk.length, 0);
          socket.write(Buffer.concat([header, chunk]));
          offset += chunkSize;
          setImmediate(sendChunk);
        };

        sendChunk();
      });

      let response = '';
      socket.on('data', (chunk) => (response += chunk.toString()));

      socket.on('end', () => {
        clearTimeout(timer);
        response = response.trim(); // "stream: OK" or "stream: <virus> FOUND"
        if (response.includes('FOUND')) {
          return cleanup(new BadRequestException('INFECTED_FILE_DETECTED'));
        }
        if (!response.includes('OK')) {
          return cleanup(
            new ServiceUnavailableException(
              `ClamAV returned an unexpected response: ${response}`,
            ),
          );
        }
        cleanup(); // Success
      });
    });
  }
}
