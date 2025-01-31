import express, { Router, RequestHandler } from "express";
import { z } from "zod";
import { errorHandler } from "./middleware/error.js";
import { UserService } from "./services/user.js";

// Define types for request parameters
interface UserParams {
  id: string;
}

interface CreateUserBody {
  name: string;
  email: string;
}

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export const createApp = (userService: UserService) => {
  const app = express();
  const router = Router();

  app.use(express.json());

  const getUserById: RequestHandler<UserParams> = async (req, res, next) => {
    try {
      const user = await userService.getUserById(req.params.id);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.json(user);
    } catch (err) {
      next(err);
    }
  };

  const createUser: RequestHandler<{}, {}, CreateUserBody> = async (
    req,
    res,
    next
  ) => {
    try {
      const userData = createUserSchema.parse(req.body);
      const user = await userService.createUser(userData);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  };

  router.get("/users/:id", getUserById);
  router.post("/users", createUser);

  app.use(router);
  app.use(errorHandler as express.ErrorRequestHandler);

  return app;
};
