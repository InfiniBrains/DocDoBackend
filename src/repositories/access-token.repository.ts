import {DefaultCrudRepository} from '@loopback/repository';
import {AccessToken} from '../models';
import {MongoDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class AccessTokenRepository extends DefaultCrudRepository<
  AccessToken,
  typeof AccessToken.prototype.id
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(AccessToken, dataSource);
  }
}
