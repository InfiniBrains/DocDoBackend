import {
  Count,
  CountSchema,
  Options,
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
import {User, UserCreateRequest, UserCreateResponse} from '../models';
import {UserRepository} from '../repositories';
let crypto = require('crypto');
import {HttpErrors} from '@loopback/rest';
import * as EmailValidator from 'email-validator';
import {AnyObject} from '@loopback/repository/src/common-types';
import {Command, NamedParameters} from '@loopback/repository/dist/common-types';
let jwt = require('jsonwebtoken');
let nodemailer = require("nodemailer");
let sgTransport = require('nodemailer-sendgrid-transport');


let genRandomString = function(length:number){
  return crypto.randomBytes(Math.ceil(length/2))
    .toString('hex') /** convert to hexadecimal format */
    .slice(0,length);   /** return required number of characters */
};

let sha512 = function(password:string|undefined, salt:string){
  let hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
  hash.update(password);
  return hash.digest('hex');
};

let emailCredentials = {
  auth: {
    api_user: process.env.SENDGRID_USERNAME as string,
    api_key: process.env.SENDGRID_PASSWORD as string
  }
};

let emailClient = nodemailer.createTransport(sgTransport(emailCredentials));

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository : UserRepository,
  ) {}

  async mail(from:string, to:string,subject:string,text:string) : Promise<any> {
    return emailClient.sendMail({
      from: from,
      to: to,
      subject: subject,
      text: text
    });
  }

  @post('/users', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: {'x-ts-type': UserCreateRequest}}},
      },
    },
  })
  async create(@requestBody() user: UserCreateRequest): Promise<UserCreateResponse> {
    console.log(user);

    // before creating, check if the user exists
    let existentUser = await this.userRepository.findOne( {where:{email:user.email}});
    if(existentUser)
      throw new HttpErrors.Conflict('User already exists!');

    // validate email
    if(!EmailValidator.validate(user.email))
      throw new HttpErrors.BadRequest('Email malformated!');

    // create the user
    let newuser = new User();
    newuser.email = user.email;
    newuser.salt = genRandomString(16); /** Gives us salt of length 16 */
    newuser.hash = sha512(user.password, newuser.salt);
    newuser.realmId = user.realmId ? user.realmId : 'global';
    newuser.active = true;
    newuser.createdAt = new Date().toLocaleString();
    newuser.updatedAt = newuser.createdAt;
    newuser.roles = ["patient"];
    newuser.defaultTokenExpirationTime = 1440; // TODO: use realm expirationtime here
    newuser.validated = false;

    // create the user!
    let userCreationResult = await this.userRepository.create(newuser);

    // create validation token to be validated on email
    let token = jwt.sign({ email: newuser.email }, newuser.salt, {
      expiresIn: newuser.defaultTokenExpirationTime*60 // expires in 24 hours
    });

    let emailresult = await this.mail(
      'contact@docdo.com.br',
      newuser.email,
      "[InfiniBrains] Validate you account",
      'Validate your user at DocDo by clicking <a href="https://infinibrains.herokuapp.com/validate/' + token +'">here</a>.'
    );
    console.log(emailresult);

    // prepare response
    let userCreateResponse = new UserCreateResponse();
    userCreateResponse.email = userCreationResult.email;
    userCreateResponse.createdAt = userCreationResult.createdAt;

    return userCreateResponse
  }

  @get('/users/count', {
    responses: {
      '200': {
        description: 'User model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where,
  ): Promise<Count> {
    return await this.userRepository.count(where);
  }

  @get('/users', {
    responses: {
      '200': {
        description: 'Array of User model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': User}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(User)) filter?: Filter,
  ): Promise<User[]> {
    return await this.userRepository.find(filter);
  }

  @patch('/users', {
    responses: {
      '200': {
        description: 'User PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() user: User,
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where,
  ): Promise<Count> {
    return await this.userRepository.updateAll(user, where);
  }

  @get('/users/validate/{token}',{
    responses:{
      '200': {
        description: 'Validate user email',
        content: {'application/json': {
          schema: {
            type: 'object',
            properties: {response: 'string'},
          }
        }},
      },
    }
  })
  async validate(@param.path.string('token') token: string): Promise<AnyObject> { // TODO: improve error handling
    let email64 = token.split('.')[1];
    let buff = new Buffer(email64, 'base64');
    let email = JSON.parse(buff.toString('utf8')).email;

    if(!EmailValidator.validate(email))
      throw new HttpErrors.BadRequest('Email malformated!');

    let user = await this.userRepository.findOne( {where:{email:email}});
    if(!user)
      throw new HttpErrors.NotFound('User not found!');


    try {
      await jwt.verify(token, user.salt);
    } catch (e) {
      throw new HttpErrors.ExpectationFailed('The JWT signature doesnt match with payload and secret. Details: ' + e.message);
    }

    user.validated = true;
    await this.userRepository.save(user);

    return {response: 'ok'};
  }

  @get('/users/{id}', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: {'x-ts-type': User}}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<User> {
    return await this.userRepository.findById(id);
  }

  @patch('/users/{id}', {
    responses: {
      '204': {
        description: 'User PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @put('/users/{id}', {
    responses: {
      '204': {
        description: 'User PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @del('/users/{id}', {
    responses: {
      '204': {
        description: 'User DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }
}
