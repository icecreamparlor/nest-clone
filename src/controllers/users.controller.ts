import { Controller, Get, Post, Query } from "../decorators/custom-decorator";
import { IncomingMessage, ServerResponse } from "http";

@Controller("/users")
export class UsersController {
  constructor() {}

  @Get("/get")
  async getUser(
    request: IncomingMessage,
    response: ServerResponse,
    @Query() query: any
  ) {
    return {
      success: true,
      data: query,
    };
  }
  @Post("/save")
  async saveUser(request: IncomingMessage, response: ServerResponse) {
    console.log("save");
    return {
      success: true,
      data: {
        user: "Heejae",
      },
    };
  }
}
