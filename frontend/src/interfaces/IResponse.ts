export interface IResponse<T> {
  data: T;
  metadata: object;
  success: boolean;
  errors: ErrorType[];
}

interface ErrorType {
  location: string;
  type: string;
  message: string;
}

export interface GenericErrorType<T> {
  location: T;
  type: string;
  message: string;
}
