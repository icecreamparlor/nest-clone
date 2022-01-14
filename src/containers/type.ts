import { Method } from "./const";

export interface IContainer {
  readonly controllers: IController[];
}
export interface IApi {
  method: Method;
  path: string;
  handler: Function;
}
export interface IController {
  constructor: Function;
  apis: IApi[];
}

export type TRequestParam =
  | {
      [key: string]: string;
    }
  | string
  | undefined;
