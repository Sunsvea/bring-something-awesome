# BSA (Bring something awesome)
# Backend User Service

- REST API for user management
- Redis caching with TTL
- Input validation with Zod
- Error handling
- Jest testing suite
- TypeScript

## Architecture Decisions

### 1. Dependency Injection
```typescript
export class UserService {
  constructor(
    private repository: UserRepository,
    private cache: CacheService
  ) {}
}
```
- **Why?** 
  - Loose coupling between components
  - Redis integration for caching
  - Testability through dependency injection
  - Clear separation of concerns

### 2. Interface Design
```typescript
export interface UserRepository {
  findById(id: string): Promise<User | null>;
  create(user: Omit<User, 'id' | 'createdAt'>): Promise<User>;
}

export interface CacheService {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSeconds?: number): Promise<void>;
  clear(): Promise<void>;
  disconnect(): Promise<void>;
}
```
- **Why?**
  - Clear contracts between components
  - Proper cleanup methods for tests

### 3. Redis Caching Strategy
```typescript
export class RedisCacheService implements CacheService {
  private client: Redis;

  constructor(redisUrl: string) {
    this.client = new Redis(redisUrl);
    this.client.on('connect', () => {
      console.log('Successfully connected to Redis');
    });
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }
}
```
- **Why?**
  - Production-ready caching solution
  - Built-in TTL support
  - Scalable performance
  - Event-based connection handling

### 4. Input Validation with Zod
```typescript
const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email()
});
```
- **Why?**
  - Type-safe validation
  - Clear validation rules
  - Automatic error messages
  - TypeScript integration

### 5. Error Handling Middleware
```typescript
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: "Validation Error"
    });
  } else {
    res.status(500).json({
      error: "Internal Server Error"
    });
  }
};
```
- **Why?**
  - Centralized error handling
  - Consistent error responses
  - Clean error logging
  - Type-specific error handling

## Testing Strategy

### 1. Jest Configuration
```javascript
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  }
};
```
- ES Modules support
- TypeScript integration
- Node.js environment

### 2. Unit Tests with Jest
```typescript
describe('UserService', () => {
  const mockRepository = {
    findById: jest.fn(),
    create: jest.fn()
  };
  const mockCache = {
    get: jest.fn(),
    set: jest.fn()
  };

  const fixedDate = "2025-01-31T10:12:14.337Z";
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
```
- Consistent date handling
- Clean test setup
- Proper mocking
- Isolated tests

### 3. Redis Integration Tests
```typescript
describe('RedisCacheService', () => {
  let cacheService: RedisCacheService;

  beforeAll(() => {
    cacheService = new RedisCacheService("redis://localhost:6379/1");
  });

  beforeEach(async () => {
    await cacheService.clear();
  });

  afterAll(async () => {
    await cacheService.disconnect();
  });
```
- Dedicated test database
- Proper cleanup
- Connection management
- TTL testing

## API Endpoints

### 1. Create User
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com"
  }'
```
Response:
```json
{
  "id": "abc123",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2024-01-31T10:12:14.337Z"
}
```

### 2. Get User
```bash
curl http://localhost:3000/users/abc123
```

## Setup and Configuration

### 1. Environment Setup
```bash
# Install dependencies
npm install

# Start Redis
docker run -d -p 6379:6379 redis

# Development
npm run dev

# Tests
npm test

# Production
npm run build
npm start
```

### 2. Redis Configuration
- Development: `redis://localhost:6379/0`
- Test: `redis://localhost:6379/1`
- Production: Configure via environment variable

## Future Improvements
1. Redis Cluster Support
   - High availability setup
   - Sharding for scalability
2. Advanced Caching Strategies
   - Write-through caching
   - Cache warming
3. Metrics & Monitoring
   - Redis performance metrics
   - Cache hit/miss rates
   - Response time tracking
4. Authentication/Authorization
   - JWT integration
   - Role-based access
5. API Documentation
   - OpenAPI/Swagger
   - Type-generated documentation
