import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  REGISTER_TOKEN_SECRET
} from '../constants/token';
import jwt from 'jsonwebtoken';

export const generateAccessToken = (userId: string) => {
  if (ACCESS_TOKEN_SECRET) {
    return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, {
      expiresIn: '15m'
    });
  } else {
    throw new Error('ACCESS_TOKEN_SECRET is not defined');
  }
};

export const generateRegisterToken = (userId: string) => {
  if (REGISTER_TOKEN_SECRET) {
    return jwt.sign({ userId }, REGISTER_TOKEN_SECRET, {
      expiresIn: '1h'
    });
  } else {
    throw new Error('REGISTER_TOKEN_SECRET is not defined');
  }
};

// Function to generate refresh token
export const generateRefreshToken = (userId: string) => {
  if (REFRESH_TOKEN_SECRET) {
    return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: '1h' });
  } else {
    throw new Error('REFRESH_TOKEN_SECRET is not defined');
  }
};

export const refreshToken = () => {
  if (REFRESH_TOKEN_SECRET) {
    return jwt.sign({}, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  } else {
    throw new Error('REFRESH_TOKEN_SECRET is not defined');
  }
};

export const verifyToken = (
  token: string,
  type: 'access' | 'refresh' | 'register'
) => {
  let secret;

  switch (type) {
    case 'access':
      secret = ACCESS_TOKEN_SECRET;
      break;
    case 'refresh':
      secret = REFRESH_TOKEN_SECRET;
      break;
    case 'register':
      secret = REGISTER_TOKEN_SECRET;
      break;
    default:
      throw new Error('Invalid token type');
  }

  if (secret) {
    try {
      const decoded = jwt.verify(token, secret);
      return decoded;
    } catch (error) {
      return null;
    }
  } else {
    throw new Error(`${type.toUpperCase()}_TOKEN_SECRET is not defined`);
  }
};
