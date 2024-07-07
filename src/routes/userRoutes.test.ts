import request from 'supertest';
import express, { Application } from 'express';
import { Router } from 'express';
import userRoute from './userRoutes'; // Adjust the import path
import { register, login } from '../controllers/authController'; // Adjust the import path

jest.mock('../controllers/authController'); // Mock authController functions

const app: Application = express();
app.use(express.json());
app.use('/user', userRoute); // Mount the userRoute under /user path

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call register function for POST /user/register', async () => {
    const mockReq: any = {};
    const mockRes: any = {};

    // Mock behavior of register function
    (register as jest.Mock).mockImplementation(async (req, res) => {
      res.status(201).json({ message: 'User created' });
    });

    const res = await request(app).post('/user/register').send({ email: 'test@example.com', password: 'password123' });

    expect(register).toHaveBeenCalled();
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('User created');
  });

  it('should call login function for POST /user/login', async () => {
    const mockReq: any = {};
    const mockRes: any = {};

    // Mock behavior of login function
    (login as jest.Mock).mockImplementation(async (req, res) => {
      res.status(200).json({ token: 'mockedtoken' });
    });

    const res = await request(app).post('/user/login').send({ email: 'test@example.com', password: 'password123' });

    expect(login).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body.token).toBe('mockedtoken');
  });
});
