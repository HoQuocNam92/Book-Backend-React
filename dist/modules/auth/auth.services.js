import * as authRepo from "#/modules/auth/auth.repositories.js";
import { signUpSchema } from "./auth.schema.js";
export const SignUp = async (data) => {
  const parsed = signUpSchema.parse(data);
  return authRepo.createUser(parsed);
};
