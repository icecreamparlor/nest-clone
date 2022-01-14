import {
  Body,
  Controller,
  Get,
  Post,
  Query,
} from "../decorators/custom-decorator";

@Controller("/users")
export class UsersController {
  @Get("/get")
  async getUser(@Query("name") query: any, @Body() body: any) {
    console.log(`[GET] /users/get`);
    return {
      success: true,
      query,
      body,
    };
  }
  @Post("/save")
  async saveUser(@Body("dana") body: any, @Query() query: any) {
    console.log(`[POST] /users/save`);
    return {
      success: true,
      query,
      body,
    };
  }
}
