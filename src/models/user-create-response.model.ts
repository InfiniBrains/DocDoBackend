import {Model, model, property} from '@loopback/repository';

@model()
export class UserCreateResponse extends Model {
  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'date',
  })
  createdAt?: string;


  constructor(data?: Partial<UserCreateResponse>) {
    super(data);
  }
}
