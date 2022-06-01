import { Controller, Get } from '@nestjs/common';

import { Message } from '@playhits/api-interfaces';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
