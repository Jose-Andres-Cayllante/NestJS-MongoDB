import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schema/user.schema';
import { Model } from 'mongoose';
import { LoginAuthDto } from './dto/login-auth.dto';
import { compare} from 'bcrypt';

@Injectable()
export class AuthService {

  //Injectamos el modelo
  constructor(
    @InjectModel(User.name) private userModel:Model<User>
  ){}
    
  async create(createAuthDto: CreateAuthDto) {

    //email existente
    const emailExist = await this.userModel.findOne({ email: createAuthDto.email})
    if(emailExist){
      return new HttpException('El email ya existe', HttpStatus.CONFLICT) //error 409
    }

    //phone existente
    const phoneExist = await this.userModel.findOne({ phone: createAuthDto.phone})
    if(phoneExist){
      return new HttpException('El telefono ya existe', HttpStatus.CONFLICT) //error 409
    }

    const createUser = new this.userModel(createAuthDto)
    return await createUser.save()
  }

  async login(loginAuthDto:LoginAuthDto){

    const userFound = await this.userModel.findOne({ email: loginAuthDto.email})
    if(!userFound){
      return new HttpException('El email no existe', HttpStatus.NOT_FOUND) //error 404 no encontrado
    }

    const isPasswordValid = await compare(loginAuthDto.password, userFound.password)
    if(!isPasswordValid){
      return new HttpException('La contraseña es incorrecta', HttpStatus.FORBIDDEN) //error 403 prohibido
    }

    return userFound;
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
