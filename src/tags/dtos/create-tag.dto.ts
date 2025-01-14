import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { SupportedLanguage } from 'src/constants/supported-languages.constant';

export class CreateTagDto {
  @IsNotEmpty()
  @IsString()
  key: string;

  @IsObject()
  @IsNotEmpty()
  translations: Record<SupportedLanguage, string>;
}
