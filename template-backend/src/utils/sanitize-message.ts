// src/common/utils/sanitize-message.ts
import * as sanitizeHtml from 'sanitize-html';

export function sanitizeMessage(input: string): string {
  return sanitizeHtml(input, {
    // strip out all tags – result is plain text
    allowedTags: [],
    allowedAttributes: {},
    // Escape HTML special chars instead of stripping
    textFilter: (text: string) => text,
  });
}
