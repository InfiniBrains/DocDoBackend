import {Entity, model, property} from '@loopback/repository';

@model()
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
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
    default: false,
    required: true,
  })
  validated: boolean;

  @property({
    type: 'boolean',
    default: true,
    required: true,
  })
  active: boolean;

  @property({
    type: 'string',
    required: true,
  })
  realmId: string|undefined;

  @property({
    type: 'array',
    itemType: 'string',
    required: true,
    // default: defaultTokenExpirationTime,
  })
  roles: string[];

  // in minutes
  @property({
    type: 'number',
    required: true,
  })
  defaultTokenExpirationTime: number;

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
