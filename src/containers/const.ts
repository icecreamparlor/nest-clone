import { Controller } from "./type";

export enum ControllerMetadataKeys {
  PATH = "path",
  METHOD = "method",
  HANDLER = "handler",
}
export enum ParameterMetadatdaKeys {
  QUERY = "query",
  BODY = "body",
}
export enum Method {
  GET = "get",
  POST = "post",
  PATCH = "patch",
  DELETE = "delete",
  PUT = "put",
}
