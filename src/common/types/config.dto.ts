import { IsString, IsObject, IsNotEmpty } from "class-validator"

export class ConfigDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    method: RequestMethod.POST

    @IsObject()
    body: Record<string, any>

    @IsString()
    @IsNotEmpty()
    customValidation: string;
}

export enum RequestMethod {
    POST="POST"
}