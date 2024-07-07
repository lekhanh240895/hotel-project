interface Base {
  createdAt: string;
  _id: string;
  updatedAt: string;
}

interface User extends Base {
  name: string;
  image: string;
  email: string;
  username: string;
  role: string;
}

interface AvailableToken extends Base {
  user_id: string;
  refresh_token: string;
}
