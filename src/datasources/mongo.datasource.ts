import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as config from './mongo.datasource.json';

var configMod = config;
configMod.url = process.env.MONGODB_URI || "mongodb://localhost:27017/test";

export class MongoDataSource extends juggler.DataSource {
  static dataSourceName = 'mongo';

  constructor(
    @inject('datasources.config.mongo', {optional: true})
    dsConfig: object = configMod,
  ) {
    super(dsConfig);
  }
}
