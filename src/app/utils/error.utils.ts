export function getErrorMessage(error: any): string {
  if (!error) {
    return 'An unknown error occurred';
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error.error?.message) {
    return error.error.message;
  }

  if (error.message) {
    return error.message;
  }

  return 'An unexpected error occurred';
}

export function isNetworkError(error: any): boolean {
  return error.status === 0 || error.name === 'NetworkError';
}

export function isAuthenticationError(error: any): boolean {
  return error.status === 401 || error.status === 403;
}