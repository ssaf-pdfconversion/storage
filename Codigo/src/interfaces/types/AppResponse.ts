export default interface AppResponse<T> {
  status: number;
  message: string;
  data: T;
}
