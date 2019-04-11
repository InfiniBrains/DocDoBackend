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
import {AccessToken} from '../models';
import {AccessTokenRepository} from '../repositories';

export class AccessTokenController {
  constructor(
    @repository(AccessTokenRepository)
    public accessTokenRepository : AccessTokenRepository,
  ) {}

  @post('/access-tokens', {
    responses: {
      '200': {
        description: 'AccessToken model instance',
        content: {'application/json': {schema: {'x-ts-type': AccessToken}}},
      },
    },
  })
  async create(@requestBody() accessToken: AccessToken): Promise<AccessToken> {
    return await this.accessTokenRepository.create(accessToken);
  }

  @get('/access-tokens/count', {
    responses: {
      '200': {
        description: 'AccessToken model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(AccessToken)) where?: Where,
  ): Promise<Count> {
    return await this.accessTokenRepository.count(where);
  }

  @get('/access-tokens', {
    responses: {
      '200': {
        description: 'Array of AccessToken model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': AccessToken}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(AccessToken)) filter?: Filter,
  ): Promise<AccessToken[]> {
    return await this.accessTokenRepository.find(filter);
  }

  @patch('/access-tokens', {
    responses: {
      '200': {
        description: 'AccessToken PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() accessToken: AccessToken,
    @param.query.object('where', getWhereSchemaFor(AccessToken)) where?: Where,
  ): Promise<Count> {
    return await this.accessTokenRepository.updateAll(accessToken, where);
  }

  @get('/access-tokens/{id}', {
    responses: {
      '200': {
        description: 'AccessToken model instance',
        content: {'application/json': {schema: {'x-ts-type': AccessToken}}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<AccessToken> {
    return await this.accessTokenRepository.findById(id);
  }

  @patch('/access-tokens/{id}', {
    responses: {
      '204': {
        description: 'AccessToken PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody() accessToken: AccessToken,
  ): Promise<void> {
    await this.accessTokenRepository.updateById(id, accessToken);
  }

  @put('/access-tokens/{id}', {
    responses: {
      '204': {
        description: 'AccessToken PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() accessToken: AccessToken,
  ): Promise<void> {
    await this.accessTokenRepository.replaceById(id, accessToken);
  }

  @del('/access-tokens/{id}', {
    responses: {
      '204': {
        description: 'AccessToken DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.accessTokenRepository.deleteById(id);
  }
}
