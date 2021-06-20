import { Injectable } from '@nestjs/common';
import { promisify } from 'util';

const redis = require('redis');

@Injectable()
export class RedisConfig {
  client = redis
    .createClient(process.env.REDIS_PORT, process.env.REDIS_ENDPOINT, {
      auth_pass: process.env.REDIS_PASSWORD,
      return_buffers: true
    })
    .on('error', (err) => console.error('ERR:REDIS: ', err));

  get = promisify(this.client.get).bind(this.client);
  set = promisify(this.client.set).bind(this.client);
  getList = promisify(this.client.lrange).bind(this.client);
}
