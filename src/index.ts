import { createApp } from "./app.js";
import { InMemoryUserRepository } from "./repositories/user.js";
import { RedisCacheService } from "./services/redis-cache.js";
import { UserService } from "./services/user.js";

const userRepository = new InMemoryUserRepository();
const cacheService = new RedisCacheService();
const userService = new UserService(userRepository, cacheService);
const app = createApp(userService);

// Graceful shutdown
const shutdown = async () => {
  console.log("Shutting down gracefully...");
  await cacheService.disconnect();
  process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
