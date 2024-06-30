export type TLoginUser = {
  email: string;
  password: string;
};

export interface IApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  token?: string; // Include token as an optional property
}