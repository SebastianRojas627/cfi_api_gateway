import { Controller, Post, Body, Req, Res, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request, Response } from 'express';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';

@ApiTags('CFI')
@Controller('forms')
export class CfiController {
  constructor(private readonly http: HttpService) {}

  @Post('submit')
  //@ApiBearerAuth()
  @ApiOperation({ summary: 'Submit investigation form (JSON)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        subject: { type: 'string' },
        type: { type: 'string' },
        services: { type: 'array', items: { type: 'string' } },
        caseNumber: { type: 'string' },
        investigatorId: { type: 'string' },
      },
    },
  })
  async submitForm(@Body() body: any, @Req() req: Request, @Res() res: Response) {
    // const user = verifyJwt(req);
    // if (!user) return res.status(401).json({ message: 'Unauthorized' });

    try {
      const { data, status } = await firstValueFrom(
        this.http.post('http://localhost:5001/solicitud-informacion', body, {
          // headers: { Authorization: req.headers.authorization },
        }),
      );
      return res.status(status).json(data);
    } catch (err) {
      throw new HttpException('CFI service error', HttpStatus.BAD_GATEWAY);
    }
  }
}
