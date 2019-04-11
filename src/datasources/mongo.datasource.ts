import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: "mongo",
  connector: "mongodb",
  url: process.env.MONGODB_URI || "mongodb://localhost:27017/test",
  host: "",
  port: 0,
  user: "",
  password: "",
  database: ""
}

export class MongoDataSource extends juggler.DataSource {
  static dataSourceName = 'mongo';

  constructor(
    @inject('datasources.config.mongo', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
