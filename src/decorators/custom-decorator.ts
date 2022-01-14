import "reflect-metadata";
import { getContainers } from "../containers";
import {
  ControllerMetadataKeys,
  Method,
  ParameterMetadatdaKeys,
} from "../containers/const";
import { Api } from "../containers/type";

export function Controller(controllerPath: string): ClassDecorator {
  return function (constructor: Function) {
    const apis: Api[] = [];

    const prototype = constructor.prototype;

    Reflect.ownKeys(prototype)
      .filter(
        (name) =>
          // 생성자를 제외한 함수들만 포함시킨다.
          name !== "constructor" && typeof prototype[name] === "function"
      )
      .forEach((key) => {
        const handler = prototype[key];
        const path = Reflect.getMetadata(
          ControllerMetadataKeys.PATH,
          prototype,
          key
        );
        const method = Reflect.getMetadata(
          ControllerMetadataKeys.METHOD,
          prototype,
          key
        );

        if (path) {
          apis.push({
            method,
            path: `${controllerPath}${path}`,
            handler,
          });
        }
      });
    getContainers().controllers.push({
      controller: constructor,
      apis,
    });
  };
}

function _generateRoute(method: Method) {
  return function (path: string): MethodDecorator {
    return function (
      target: object,
      key: string | symbol,
      desc: PropertyDescriptor
    ) {
      Reflect.defineMetadata(
        ControllerMetadataKeys.METHOD,
        method,
        target,
        key
      );
      Reflect.defineMetadata(ControllerMetadataKeys.PATH, path, target, key);
    };
  };
}

export function Get(path: string): MethodDecorator {
  return _generateRoute(Method.GET)(path);
}
export function Post(path: string): MethodDecorator {
  return _generateRoute(Method.POST)(path);
}
export function Delete(path: string): MethodDecorator {
  return _generateRoute(Method.DELETE)(path);
}
export function Patch(path: string): MethodDecorator {
  return _generateRoute(Method.PATCH)(path);
}
export function Put(path: string): MethodDecorator {
  return _generateRoute(Method.PUT)(path);
}
export function Query(): ParameterDecorator {
  return function (
    target: Object,
    propertyKey: string | symbol,
    parameterIndex: number
  ) {
    Reflect.defineMetadata(
      ParameterMetadatdaKeys.QUERY,
      parameterIndex,
      target,
      propertyKey
    );
  };
}
