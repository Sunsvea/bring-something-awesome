import { createApp } from "./app.js";
import { InMemoryUserRepository } from "./repositories/user.js";
import { InMemoryCacheService } from "./services/cache.js";
import { UserService } from "./services/user.js";

const userRepository = new InMemoryUserRepository();
const cacheService = new InMemoryCacheService();
const userService = new UserService(userRepository, cacheService);
const app = createApp(userService);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
