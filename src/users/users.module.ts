import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';

@Module({
  //se agrega la fila imports: []
  imports:[MongooseModule.forFeature([{ 
    name: User.name, 
    schema: UserSchema
  }])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
