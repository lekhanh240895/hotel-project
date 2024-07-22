interface Base {
  createdAt: string;
  _id: string;
  updatedAt: string;
}

interface IUser extends Base {
  full_name: string;
  image: string;
  email: string;
  username: string;
  role: string;
  chatIds: string[];
}

interface IAvailableToken extends Base {
  user: string;
  refresh_token: string;
}

interface IRegisterToken extends Base {
  user: string;
  register_token: string;
}

interface IResetPasswordToken extends Base {
  user: string;
  reset_password_token: string;
}
