import {
  Body,
  Controller,
  Get,
  Post,
  Query,
} from "../decorators/custom-decorator";

@Controller("/orders")
export class OrdersController {
  @Get("/get")
  async getOrder(@Query("name") query: any, @Body() body: any) {
    return {
      success: true,
      query,
      body,
    };
  }
  @Post("/save")
  async saveOrder(@Body("dana") body: any, @Query() query: any) {
    return {
      success: true,
      query,
      body,
    };
  }
}
