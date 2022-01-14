import { IncomingMessage, Server, ServerResponse } from "http";
import { ParameterMetadatdaKeys } from "./const";
import { Controller } from "./type";

export function getContainers() {
  return Containers;
}

export function registerControllers(param: {
  server: Server;
  controllers: Function[];
}) {
  const { server } = param;
  server.on("request", (request: IncomingMessage, response: ServerResponse) => {
    getContainers().controllers.forEach((controller) => {
      for (const api of controller.apis) {
        if (
          request.method?.toUpperCase() === api.method.toUpperCase() &&
          (request.url ?? "").split("?")[0] === api.path
        ) {
          const queryIndex = Reflect.getOwnMetadata(
            ParameterMetadatdaKeys.QUERY,
            controller.controller.prototype,
            api.handler.name
          );

          console.log(`queryIndex : ${queryIndex}`);
          const parameters = [
            request,
            response,
            ...new Array(10).fill(undefined),
          ];
          if (queryIndex) {
            parameters[queryIndex] = parseQueryString(request);
          }

          response.setHeader("Content-Type", "application/json");
          api.handler(...parameters).then((result: any) => {
            console.log(`result : ${JSON.stringify(result)}`);
            response.write(JSON.stringify(result));
            response.end();
          });
        }
      }
    });
  });
}
const Containers: {
  readonly controllers: Controller[];
} = {
  controllers: [],
};
function parseQueryString(request: IncomingMessage): {
  [key: string]: string;
} {
  const url = request.url ?? "";
  const queryString = url.split("?")[1];
  return queryString.split("&").reduce((ac, cv) => {
    const [key, value] = cv.split("=");
    return {
      ...ac,
      [key]: value,
    };
  }, {});
}
