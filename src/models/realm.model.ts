import {Entity, model, property} from '@loopback/repository';

@model()
export class Realm extends Entity {
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
  name: string;

  @property({
    type: 'boolean',
    required: true,
    default: true,
  })
  active: boolean;

  @property({
    type: 'string',
  })
  logoUrl?: string;

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

  constructor(data?: Partial<Realm>) {
    super(data);
  }
}
