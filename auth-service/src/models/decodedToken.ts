import { JwtPayload } from 'jsonwebtoken';

// Interface for decoded JWT payload
interface DecodedToken extends JwtPayload {
  id: string;
  username: string;
}