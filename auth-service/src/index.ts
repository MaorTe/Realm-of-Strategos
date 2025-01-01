// import express, { Request, Response } from 'express';
// import jwt, { JwtPayload } from 'jsonwebtoken';
// import bcrypt from 'bcrypt'; // For password hashing
// import axios from 'axios';

// import { config } from '@maorte/strategos-services-common-package/dist/config';
// import { User } from '@maorte/strategos-services-common-package/dist/models/userModel';  // Reuse the User model
// import { httpClient } from '@maorte/strategos-services-common-package/dist/utils/httpClient';  // Reuse Axios wrapper
// import { authMiddleware } from '@maorte/strategos-services-common-package/dist/middleware/authMiddleware';

// const app = express();
// app.use(express.json());
// app.use(authMiddleware);  // Reuse in both services

// const port = process.env.PORT || 3000;
// const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

// // Mock database (replace with actual DB integration)
// const users: User[] = [];



// // **1. User Registration**
// app.post('/auth/register', async (req: Request, res: Response):Promise<void> => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     res.status(400).json({ error: 'Username and password are required' });
//   }

//   // Check if the user already exists
//   const existingUser = users.find((user) => user.username === username);
//   if (existingUser) {
//     res.status(409).json({ error: 'User already exists' });
//   }

//   // Hash the password and save the user
//   const hashedPassword = await bcrypt.hash(password, 10);
//   const newUser: User = { id: `${Date.now()}`, username, email: '',createdAt: new Date()};
//     //password: hashedPassword };
//   users.push(newUser);

//   res.status(201).json({ message: 'User registered successfully', user: { id: newUser.id, username } });
// });

// // **2. User Login**
// app.post('/auth/login', async (req: Request, res: Response):Promise<void> => {
//   const { username, password } = req.body;

//   const user = users.find((user) => user.username === username);
//   if (!user) {
//     res.status(401).json({ error: 'Invalid credentials' });
//   }

//   const isPasswordValid = await bcrypt.compare(password, "user.password");
//   if (!isPasswordValid) {
//     res.status(401).json({ error: 'Invalid credentials' });
//   }

//   // Generate a JWT
//   const token = jwt.sign({ id: user?.id, username: user?.username }, SECRET_KEY, { expiresIn: '1h' });
//   res.json({ token });
// });


// // **3. Validate JWT Token**
// app.get('/auth/validate', (req: Request, res: Response):any => {
//   const { token } = req.body;

//   try {
//     const decoded = jwt.verify(token, SECRET_KEY) as DecodedToken;
//     res.json({ valid: true, user: decoded });
//   } catch (error) {
//     res.status(401).json({ valid: false, message: 'Invalid token' });
//   }
// });

// app.listen(port, () => {
//   console.log(`Auth Service is running at http://localhost:${port}`);
// });

import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocs } from './docs/swaggerConfig';
import authRoutes from './routes/authRoutes';

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Load routes with base path
app.use('/auth', authRoutes);

app.listen(port, () => {
  console.log(`Auth Service is running at http://localhost:${port}`);
});