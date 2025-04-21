export default interface AppResponse<T> {
  status: boolean;
  message: string;
  data: T;
}
