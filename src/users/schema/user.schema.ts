import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { hash } from "bcrypt"

export type UserSchema = HydratedDocument<User> //HydratedDocument->Documento de MongoDB que incluye datos y funcionalidades

@Schema()
export class User{
    
  @Prop({ required: true })  
  name: string;

  @Prop({ required: true })
  lastname: string;

  @Prop({ unique: true, required: true })
  email: string; // El correo será único

  @Prop({ unique: true, required: true })
  phone: string; // El teléfono será único

  @Prop({ required: true })
  password: string;

}

//convierte la clase User en un esquema de mongoose que sirve para interactuar con MongoDB
export const UserSchema = SchemaFactory.createForClass(User)
// Middleware para hash de la contraseña antes de guardar
UserSchema.pre<UserSchema>("save", async function (next) {
    if (this.isModified("password")) {
      this.password = await hash(this.password, Number(process.env.HASH_SALT));
    }
    next();
  });