import { HttpException, HttpStatus } from '@nestjs/common';

export class DatabaseErrorException extends HttpException {
  constructor() {
    super('Database error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
