// eslint-disable-next-line no-underscore-dangle, @typescript-eslint/naming-convention
import _sanitizeHtml from 'sanitize-html'

export function sanitizeHtml(htmlSource: string): string {
  const sanitizedHtml = _sanitizeHtml(htmlSource, {
    allowedAttributes: {
      a: ['href'],
    },
    allowedTags: ['a', 'b', 'blockquote', 'br', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'i', 'p', 'strong'],
  })

  return sanitizedHtml
    .replace(/&nbsp;/g, ' ')
    .replace(/(<br>){2,}/g, '<br><br>')
    .replace(/\s+/g, ' ')
    .trim()
}
