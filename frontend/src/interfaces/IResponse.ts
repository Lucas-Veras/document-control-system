export interface IResponse<T> {
  data: T;
  metadata?: IMetadata;
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

export interface IMetadata {
  links: {
    next: string | null;
    previous: string | null;
  };
  all_count: number;
  current_count: number;
  pages: number;
  current_page: number;
  per_page: number;
}
