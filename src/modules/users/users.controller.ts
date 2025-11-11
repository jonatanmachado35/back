import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() payload: CreateUserDto) {
    return this.usersService.create(payload).then((user) => this.usersService.toPublicUser(user));
  }

  @Get()
  findAll() {
    return this.usersService
      .findAll()
      .then((users) => users.map((user) => this.usersService.toPublicUser(user)));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService
      .findById(id)
      .then((user) => this.usersService.toPublicUser(user));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: UpdateUserDto) {
    return this.usersService
      .update(id, payload)
      .then((user) => this.usersService.toPublicUser(user));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
