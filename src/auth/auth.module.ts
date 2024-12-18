import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schema/user.schema';

@Module({
  //se agrega la fila imports: []
  imports:[MongooseModule.forFeature([{ 
    name: User.name, 
    schema: UserSchema
  }])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}