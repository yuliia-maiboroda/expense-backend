import { ConfigurableModuleBuilder } from '@nestjs/common';
import { DatabaseModuleOptions } from './interfaces/database-options.interface';

export const CONNECTION_POOL = 'CONNECTION_POOL';

export const {
  ConfigurableModuleClass: ConfigurableDatabaseModule,
  MODULE_OPTIONS_TOKEN: DATABASE_OPTIONS,
} = new ConfigurableModuleBuilder<DatabaseModuleOptions>()
  .setClassMethodName('forRoot')
  .build();
