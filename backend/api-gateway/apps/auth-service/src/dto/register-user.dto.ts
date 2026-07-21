import {
  IsEmail,
  IsNotEmpty,
  MinLength,
} from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty({
    message: 'El nombre es obligatorio',
  })
  name: string;

  @IsEmail(
    {},
    {
      message: 'El correo no es válido',
    },
  )
  email: string;

  @MinLength(6, {
    message: 'La contraseña debe tener al menos 6 caracteres',
  })
  password: string;
}