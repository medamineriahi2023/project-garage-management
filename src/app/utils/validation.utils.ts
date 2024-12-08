export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPassword(password: string): boolean {
  return password.length >= 8;
}

export function isNotEmpty(value: string | null | undefined): boolean {
  return value !== null && value !== undefined && value.trim() !== '';
}

export function isPositiveNumber(value: number): boolean {
  return !isNaN(value) && value > 0;
}