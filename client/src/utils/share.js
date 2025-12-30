import { SignJWT } from 'jose';

const secretKey = new TextEncoder().encode(process.env.REACT_APP_JWT_SECRET);

export const getShareLink = async (id) => {
  const token = await new SignJWT({ id })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .sign(secretKey);

  return `${process.env.REACT_APP_DOMAIN_URL}/share/${token}`;
};
