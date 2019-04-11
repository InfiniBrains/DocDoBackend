import {Model, model, property} from '@loopback/repository';

@model()
export class UserCreateRequest extends Model {
  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
  })
  password?: string;

  @property({
    type: 'string',
  })
  realmId?: string;

  constructor(data?: Partial<UserCreateRequest>) {
    super(data);
  }
}
