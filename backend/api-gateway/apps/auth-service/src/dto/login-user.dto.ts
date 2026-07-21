import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsEmail({}, { message: 'El correo no es válido' })
  email: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  password: string;
}