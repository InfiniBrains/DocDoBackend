import {Model, model, property} from '@loopback/repository';

@model()
export class UserSignInResponse extends Model {
  @property({
    type: 'string',
    required: true,
  })
  token: string;

  @property({
    type: 'date',
    required: true,
  })
  expiresAt: string;


  constructor(data?: Partial<UserSignInResponse>) {
    super(data);
  }
}
