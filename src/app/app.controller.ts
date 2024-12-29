import { Controller, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import appConfig from './app.config';
import { ConfigType } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(appConfig.KEY)
    private readonly appConfigurations: ConfigType<typeof appConfig>,
  ) {}
}
