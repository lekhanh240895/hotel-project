interface Base {
  createdAt: string;
  _id: string;
  updatedAt: string;
}

interface User extends Base {
  full_name: string;
  image: string;
  email: string;
  username: string;
  role: string;
}

interface AvailableToken extends Base {
  user: string;
  refresh_token: string;
}

interface RegisterToken extends Base {
  user: string;
  register_token: string;
}

interface ResetPasswordToken extends Base {
  user: string;
  reset_password_token: string;
}

interface Message extends Base {
  role: string;
  content: string;
  sender?: string;
}

interface Conversation extends Base {
  messages: Message[];
}
