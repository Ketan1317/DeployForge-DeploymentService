export interface ErrorInfo {
  message: string;
  statusCode?: number;
  type: 'network' | 'validation' | 'authentication' | 'authorization' | 'server' | 'unknown';
}

export function parseError(error: unknown): ErrorInfo {
  if (error instanceof Error) {
    return {
      message: error.message,
      type: 'unknown',
    };
  }

  if (typeof error === 'string') {
    return {
      message: error,
      type: 'unknown',
    };
  }

  return {
    message: 'An unexpected error occurred',
    type: 'unknown',
  };
}

export function isNetworkError(error: unknown): boolean {
  return (error instanceof Error && error.message.includes('Network error'));
}

export function isAuthError(error: unknown): boolean {
  return (error instanceof Error && (
    error.message.includes('Authentication failed') ||
    error.message.includes('log in again')
  ));
}

export function formatErrorMessage(error: unknown): string {
  const errorInfo = parseError(error);
  return errorInfo.message;
}
