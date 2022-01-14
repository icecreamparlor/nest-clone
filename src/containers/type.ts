import { Method } from "./const";

export interface IContainer {
  readonly controllers: IController[];
}
export interface IApi {
  method: Method;
  path: string;
  handler: Function;
  query?: {
    index: number;
    name: string;
  };
  body?: {
    index: number;
    name: string;
  };
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
