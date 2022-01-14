import { IncomingMessage, Server, ServerResponse } from "http";
import { HttpStatus, ParameterMetadatdaKeys } from "./const";
import { IApi, IContainer, TRequestParam } from "./type";

export function ContainerFactory() {
  const Containers: IContainer = {
    controllers: [],
  };
  return function () {
    return Containers;
  };
}
export const getContainer = ContainerFactory();

export async function registerControllers(param: {
  server: Server;
  controllers: Function[];
}) {
  const { server } = param;
  server.on(
    "request",
    async (request: IncomingMessage, response: ServerResponse) => {
      getContainer().controllers.forEach((controller) => {
        for (const api of controller.apis) {
          // controller 안에 있는 API 목록들을 순회
          if (
            // HTTP Method 가 같고
            isSameMethod(request, api) &&
            // 같은 URL 요청이면
            normalizeUrl(request.url ?? "") === api.path
          ) {
            const parameters: any[] = [request, response];

            Promise.all(
              // Querystring, Request Body Parsing
              [ParameterMetadatdaKeys.QUERY, ParameterMetadatdaKeys.BODY]
                .map((type) => ({
                  type,
                  ...Reflect.getOwnMetadata(
                    type,
                    controller.constructor.prototype,
                    api.handler.name
                  ),
                }))
                .filter((it) => it.parameterIndex !== undefined)
                .map(
                  async (param: {
                    type: ParameterMetadatdaKeys;
                    parameterIndex: number;
                    name: string;
                  }) => {
                    const { type, parameterIndex, name } = param;
                    // 해당하는 handler 의 파라미터에 QueryString, Request Body 를 심어준다.
                    parameters[parameterIndex] = await parseRequestParam(
                      type,
                      request,
                      name
                    );
                  }
                )
            )
              .then((_) => {
                response.setHeader("Content-Type", "application/json");
                api.handler(...parameters).then((result: any) => {
                  response.statusCode = HttpStatus.OK;
                  response.write(
                    typeof result === "object" ? JSON.stringify(result) : result
                  );
                  response.end();
                });
              })
              .catch((err) => {
                console.error(err);
                response.statusCode = HttpStatus.BAD_REQUEST;
                response.end();
              });
          }
        }
      });
    }
  );
}

async function parseRequestParam(
  type: ParameterMetadatdaKeys,
  request: IncomingMessage,
  name?: string
): Promise<TRequestParam> {
  if (type === ParameterMetadatdaKeys.QUERY) {
    return _parseQueryString(request, name);
  } else if (type === ParameterMetadatdaKeys.BODY) {
    return _parseBody(request, name);
  }
  throw new Error(`UnSupported Type ${type}`);

  function _parseQueryString(
    request: IncomingMessage,
    name?: string
  ): TRequestParam {
    const url = request.url ?? "";
    const queryString = url.split("?")[1];
    if (queryString === undefined) {
      return undefined;
    }
    const queryObject: { [key: string]: string } = queryString
      .split("&")
      .reduce((ac, cv) => {
        const [key, value] = cv.split("=");
        if (!key || !value) {
          return ac;
        }
        return {
          ...ac,
          [key]: value,
        };
      }, {});
    return name ? queryObject[name] : queryObject;
  }

  async function _parseBody(
    request: IncomingMessage,
    name?: string
  ): Promise<TRequestParam> {
    const buffers = [];
    for await (const chunk of request) {
      buffers.push(chunk);
    }
    const data = Buffer.concat(buffers).toString();

    if (data === "" || !data) {
      return undefined;
    }
    try {
      const jsonData = JSON.parse(data);
      return name ? jsonData[name] : jsonData;
    } catch (err: any) {
      throw new Error(err);
    }
  }
}
function normalizeUrl(url: string): string {
  return url.split("?")[0];
}
function isSameMethod(request: IncomingMessage, api: IApi): boolean {
  return request.method?.toUpperCase() === api.method.toUpperCase();
}
