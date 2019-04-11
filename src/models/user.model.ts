import {Entity, model, property} from '@loopback/repository';

@model()
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    required: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  salt: string;

  @property({
    type: 'string',
    required: true,
  })
  hash: string;

  @property({
    type: 'boolean',
    required: true,
    default: false,
  })
  validated: boolean;

  @property({
    type: 'boolean',
    required: true,
    default: true,
  })
  active: boolean;

  @property({
    type: 'string',
    required: true,
  })
  realmId: string;

  @property({
    type: 'array',
    itemType: 'string',
    required: true,
    // default: defaultTokenExpirationTime,
  })
  roles: string[];

  @property({
    type: 'date',
    required: true,
  })
  defaultTokenExpirationTime: string;

  @property({
    type: 'date',
    required: true,
  })
  createdAt: string;

  @property({
    type: 'date',
    required: true,
  })
  updatedAt: string;


  constructor(data?: Partial<User>) {
    super(data);
  }
}
