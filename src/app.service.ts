import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  //creamos el constructor
  constructor(@InjectConnection() private connection: Connection){}

  async onModuleInit(){
    const isConnected = this.connection.readyState === 1
    console.log(`Estado de la conexion a MongoDB: ${isConnected ? 'Conectado' : 'No Conectado'}`)
  }
}
