import * as yup from 'yup';
import { INVALID_TOKEN } from './constants/errors';

export class FetchException extends Error {
  constructor(
    message = 'Server Error: There is an issue retrieving the data.'
  ) {
    super(message);
    this.name = 'FetchException';
  }
}

export class ResponseError extends Error {
  response: Response;

  constructor(message: string, res: Response) {
    super(message);
    this.response = res;
  }
}

export class ApiError extends Error {
  constructor(
    public error_id: string,
    public title: string,
    public message: string,
    public errors: {
      error_id: string;
      title: string;
      message: string;
      field?: string;
    }[] = []
  ) {
    super(message);
  }

  static fromYupError(
    yupError: yup.ValidationError,
    error_id: string
  ): ApiError {
    const errors = yupError.inner.map((err) => ({
      error_id: error_id,
      title: 'Validation error',
      message: err.errors[0],
      field: err.path
    }));

    return new ApiError(
      'CUS-0004',
      'Validation error',
      'One or more field input values are invalid. Please check again.',
      errors
    );
  }

  static fromBadRequest() {
    return new ApiError('CUS-0608', 'NOT_FOUND', 'An unknown error occurred.');
  }

  static fromNoutfound() {
    return new ApiError('CUS-0608', 'NOT_FOUND', 'An unknown error occurred.');
  }

  static fromInvalidEmailPassword() {
    return new ApiError(
      'LO-0001',
      'Login error',
      'Invalid username or password.'
    );
  }

  static fromUnauthorized() {
    return new ApiError(INVALID_TOKEN, 'Unauthorized', 'Invalid token.');
  }

  static fromUnverified() {
    return new ApiError(
      'LO-0003',
      'Unverified user',
      'Unverified user. Please check your email.'
    );
  }

  static fromInvalidToken() {
    return new ApiError(INVALID_TOKEN, 'Auth error', 'Invalid token.');
  }

  static fromInvalidRegisterToken() {
    return new ApiError('RE-0003', 'Unauthorized', 'Invalid token.');
  }

  static fromEmailExists() {
    return new ApiError(
      'RE-0001',
      'Register error',
      'One or more field input values are invalid. Please check again.',
      [
        {
          error_id: 'RE-0001',
          title: 'Register error',
          message: 'Email already exists.',
          field: 'email'
        }
      ]
    );
  }

  static fromUnexpected(): ApiError {
    return new ApiError(
      'US-0500',
      'Internal Server Error',
      'An unexpected error occurred. Please try again later.'
    );
  }

  toJSON(): Record<string, unknown> {
    return {
      error: {
        error_id: this.error_id,
        title: this.title,
        message: this.message,
        errors: this.errors
      }
    };
  }
}

export function handleError(error: ApiError, status: number) {
  return Response.json(error.toJSON(), {
    status
  });
}
