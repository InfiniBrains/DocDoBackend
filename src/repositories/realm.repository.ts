import {DefaultCrudRepository} from '@loopback/repository';
import {Realm} from '../models';
import {MongoDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class RealmRepository extends DefaultCrudRepository<
  Realm,
  typeof Realm.prototype.id
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(Realm, dataSource);
  }
}
