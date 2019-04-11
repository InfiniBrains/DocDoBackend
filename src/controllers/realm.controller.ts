import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Realm} from '../models';
import {RealmRepository} from '../repositories';

export class RealmController {
  constructor(
    @repository(RealmRepository)
    public realmRepository : RealmRepository,
  ) {}

  @post('/realms', {
    responses: {
      '200': {
        description: 'Realm model instance',
        content: {'application/json': {schema: {'x-ts-type': Realm}}},
      },
    },
  })
  async create(@requestBody() realm: Realm): Promise<Realm> {
    return await this.realmRepository.create(realm);
  }

  @get('/realms/count', {
    responses: {
      '200': {
        description: 'Realm model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Realm)) where?: Where,
  ): Promise<Count> {
    return await this.realmRepository.count(where);
  }

  @get('/realms', {
    responses: {
      '200': {
        description: 'Array of Realm model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Realm}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Realm)) filter?: Filter,
  ): Promise<Realm[]> {
    return await this.realmRepository.find(filter);
  }

  @patch('/realms', {
    responses: {
      '200': {
        description: 'Realm PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() realm: Realm,
    @param.query.object('where', getWhereSchemaFor(Realm)) where?: Where,
  ): Promise<Count> {
    return await this.realmRepository.updateAll(realm, where);
  }

  @get('/realms/{id}', {
    responses: {
      '200': {
        description: 'Realm model instance',
        content: {'application/json': {schema: {'x-ts-type': Realm}}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<Realm> {
    return await this.realmRepository.findById(id);
  }

  @patch('/realms/{id}', {
    responses: {
      '204': {
        description: 'Realm PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody() realm: Realm,
  ): Promise<void> {
    await this.realmRepository.updateById(id, realm);
  }

  @put('/realms/{id}', {
    responses: {
      '204': {
        description: 'Realm PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() realm: Realm,
  ): Promise<void> {
    await this.realmRepository.replaceById(id, realm);
  }

  @del('/realms/{id}', {
    responses: {
      '204': {
        description: 'Realm DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.realmRepository.deleteById(id);
  }
}
