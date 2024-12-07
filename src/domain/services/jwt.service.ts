import jwt from "jsonwebtoken";

export class JWTService {
  private readonly secretKey: string;

  constructor() {
    this.secretKey = process.env.JWT_SECRET || "your-secret-key"; // Use environment variable in production
  }

  generateToken(payload: object): string {
    return jwt.sign(payload, this.secretKey);
  }

  verifyToken(token: string): any {
    return jwt.verify(token, this.secretKey);
  }

  decodeToken(token: string): any {
    return jwt.decode(token);
  }
}
