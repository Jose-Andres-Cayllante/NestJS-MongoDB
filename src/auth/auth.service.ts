import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schema/user.schema';
import { Model } from 'mongoose';
import { LoginAuthDto } from './dto/login-auth.dto';
import { compare} from 'bcrypt';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtService } from '@nestjs/jwt';
import {hash} from 'bcrypt';

@Injectable()
export class AuthService {

  //Injectamos el modelo
  constructor(
    @InjectModel(User.name) private userModel:Model<User>,
    private jwtService: JwtService
  ){}
    
  async create(createAuthDto: CreateAuthDto) {

    //email existente
    const emailExist = await this.userModel.findOne({ email: createAuthDto.email})
    if(emailExist){
      throw new HttpException('El email ya existe', HttpStatus.CONFLICT) //error 409
    }

    //phone existente
    const phoneExist = await this.userModel.findOne({ phone: createAuthDto.phone})
    if(phoneExist){
      throw new HttpException('El telefono ya existe', HttpStatus.CONFLICT) //error 409
    }

    const createUser = new this.userModel(createAuthDto)
    const userSaved = await createUser.save()

    //para el token de sesion
    const payload = {id: userSaved.id, name: userSaved.name}
    const token = this.jwtService.sign(payload)

    const data = {
      user: userSaved.toObject(),
      token: 'Bearer '+token
    }
    delete data.user.password
    
    return data
  }

  async login(loginAuthDto:LoginAuthDto){

    const userFound = await this.userModel.findOne({ email: loginAuthDto.email})
    if(!userFound){
      throw  new HttpException('El email no existe', HttpStatus.NOT_FOUND) //error 404 no encontrado
    }

    const isPasswordValid = await compare(loginAuthDto.password, userFound.password)
    if(!isPasswordValid){
      throw  new HttpException('La contraseña es incorrecta', HttpStatus.FORBIDDEN) //error 403 prohibido
    }
    //para token de sesion
    const payload = {id: userFound.id, name: userFound.name}
    const token = this.jwtService.sign(payload)

    const data = {
      user: userFound.toObject(),
      token: 'Bearer '+token
    }
    delete data.user.password

    return data
  }

  async findAll() {
    return this.userModel.find().exec();
  }

  // async findOne(id: number) {
  //   return this.userModel.findById(id).exec();
  // }

  async findOne(id: string) {

    this.validateObjectId(id);

    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  // async update(id: string, updateAuthDto: UpdateAuthDto) {
  //   return this.userModel.findByIdAndUpdate(id, updateAuthDto, {new: true}).exec();
  // }

  async update(id: string, updateAuthDto: UpdateAuthDto) {
    this.validateObjectId(id);
  
    // Encriptar la contraseña si está presente
    if (updateAuthDto.password) {
      updateAuthDto.password = await hash(updateAuthDto.password, Number(process.env.HASH_SALT));
    }
  
    // Actualizar el usuario
    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateAuthDto, { new: true }).exec();
  
    if (!updatedUser) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
  
    return updatedUser;
  }

  // async remove(id: string) {
  //   return this.userModel.findByIdAndDelete(id).exec();
  // }

  async remove(id: string) {

    this.validateObjectId(id);

    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    return deletedUser;
  }

  private validateObjectId(id: string) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new HttpException('ID inválido o no existente', HttpStatus.BAD_REQUEST);
    }
  }

}
