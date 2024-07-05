export type Message = {
  role: 'user' | 'assistant' | 'system' | 'function' | 'data' | 'tool';
  content: string;
  id: string;
  name?: string;
  display?: {
    name: string;
    props: Record<string, any>;
  };
};

export interface Chat extends Record<string, any> {
  id: string;
  title: string;
  userId: string;
  path: string;
  messages: Message[];
  sharePath?: string;
}

export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string;
    }
>;

export interface Session {
  user: {
    id: string;
    email: string;
  };
}

export interface AuthResult {
  type: string;
  message: string;
}

export interface User extends Record<string, any> {
  id: string;
  email: string;
  password: string;
  salt: string;
}
