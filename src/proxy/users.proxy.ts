import { All, UseGuards, Req } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { Controller } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt.strategy";
import { Request } from 'express';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersProxy {
  constructor(private readonly http: HttpService) {}

  @All('*')
  async proxy(@Req() req: Request) {
    return this.http.axiosRef({
      url: `http://users:3000${req.originalUrl}`,
      method: req.method,
      data: req.body,
      headers: { Authorization: req.headers.authorization },
    }).then(res => res.data);
  }
}