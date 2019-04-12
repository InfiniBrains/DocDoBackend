import {Model, model, property} from '@loopback/repository';

@model()
export class UserSignInRequest extends Model {
  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;


  constructor(data?: Partial<UserSignInRequest>) {
    super(data);
  }
}
