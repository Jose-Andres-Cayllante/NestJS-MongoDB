import { ConfigService } from '@nestjs/config';

export const jwtConstants = {
  secret: new ConfigService().get<string>('SECRET_JWT'), // Más robusto
};
// export const jwtConstants = {
//   secret: 'joseandres71515'
// };
