import {
  All,
  Controller,
  Req,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { verifyJwt } from '../auth/jwt.utils';
import { routeMap } from '../routes/route-map';

@Controller()
export class ProxyController {
  constructor(private readonly http: HttpService) {}

  @All('*')
  async proxy(@Req() req: Request, @Res() res: Response) {
    // const user = verifyJwt(req);
    // if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const route = routeMap.find(r => req.path.startsWith(r.prefix));
    if (!route) throw new HttpException('Route not found', HttpStatus.NOT_FOUND);

    const targetUrl = `${route.target}${req.path}`;

    try {
      const { data, status } = await firstValueFrom(
        this.http.request({
          url: targetUrl,
          method: req.method,
          data: req.body,
          headers: {
            ...req.headers,
            // 'x-user-id': user.id,
            // 'x-user-role': user.role,
          },
        }),
      );
      res.status(status).json(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const message = err.response?.data || 'Gateway Error';
      res.status(status).json({ error: message });
    }
  }
}
