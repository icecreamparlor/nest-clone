import { Method } from "./const";

export interface Api {
  method: Method;
  path: string;
  handler: Function;
}
export interface Controller {
  controller: Function;
  apis: Api[];
}
