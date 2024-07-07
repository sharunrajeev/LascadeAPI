import request from 'supertest';
import express, { Application } from 'express';
import routes from './csvRoutes';
import authMiddleware from '../middlewares/authMiddleware';
import uploadCSV from '../controllers/csvController';

jest.mock('../middlewares/authMiddleware');
jest.mock('../controllers/csvController');

const app: Application = express();
app.use(express.json());
app.use('/', routes);

describe('Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call authMiddleware and uploadCSV for POST /upload', async () => {
    const mockReq: any = {};
    const mockRes: any = {};
    const mockNext = jest.fn();

    // Mock behavior of authMiddleware
    (authMiddleware as jest.Mock).mockImplementation((req, res, next) => {
      req.user = 'testUser'; // Mocking req.user for test purposes
      next();
    });

    // Mock behavior of uploadCSV
    (uploadCSV as jest.Mock).mockImplementation((req, res) => {
      res.status(202).json({ message: 'CSV uploaded' });
    });

    const res = await request(app).post('/upload').send({});

    expect(authMiddleware).toHaveBeenCalled();
    expect(uploadCSV).toHaveBeenCalled();
    expect(res.status).toBe(202);
    expect(res.body.message).toBe('CSV uploaded');
  });
});
