export interface ILoginDTO {
  email: string;
  password: string;
}

export interface IRegisterDTO extends ILoginDTO {
  name: string;
}

export interface IUser extends ILoginDTO {
  _id: string;
  name: string;
}
