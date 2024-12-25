import { type DynamicModule, Module } from '@nestjs/common';

export type MyDynamicModuleOptions = {
  apiKey: string;
  apiUrl: string;
};

export const MY_DYNAMIC_MODULE_OPTIONS = 'MY_DYNAMIC_MODULE_OPTIONS';

@Module({})
export class MyDynamicModule {
  static register(configs: MyDynamicModuleOptions): DynamicModule {
    console.log('MyDynamicModuleOptions', configs);

    return {
      module: MyDynamicModule,
      imports: [],
      providers: [
        {
          provide: MY_DYNAMIC_MODULE_OPTIONS,
          // useValue: configs,
          useFactory: async () => {
            await new Promise((resolve) => setTimeout(resolve, 5000));
            return configs;
          },
        },
      ],
      controllers: [],
      exports: [MY_DYNAMIC_MODULE_OPTIONS],
    };
  }
}
