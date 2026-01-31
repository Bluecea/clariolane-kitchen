import DOMPurify from 'dompurify'

export const sanitize = (content: string): string => {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'], // Allow basic formatting if needed, or empty for strict text
    ALLOWED_ATTR: [],
  })
}
