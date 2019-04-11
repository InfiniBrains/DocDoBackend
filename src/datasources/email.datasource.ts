import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as config from './email.datasource.json';

var configMod = config;
configMod.transports[0].auth.user = process.env.SENDGRID_USERNAME as string;
configMod.transports[0].auth.pass = process.env.SENDGRID_PASSWORD as string;

export class EmailDataSource extends juggler.DataSource {
  static dataSourceName = 'email';

  constructor(
    @inject('datasources.config.email', {optional: true})
    dsConfig: object = configMod,
  ) {
    super(dsConfig);
  }
}
