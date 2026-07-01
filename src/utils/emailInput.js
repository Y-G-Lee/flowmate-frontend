const EMAIL_ALLOWED_PATTERN = /[^a-zA-Z0-9@._%+-]/g

export function sanitizeEmailInput(value) {
  return value.replace(EMAIL_ALLOWED_PATTERN, '')
}
