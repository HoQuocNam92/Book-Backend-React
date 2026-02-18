import { ZodError } from "zod";
export const errorMiddleware = (err, req, res, next) => {
  if (err instanceof ZodError) {
    console.error(
      "ZodError:",
      err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    );
    return res.status(400).json({ message: "Invalid data" });
  }
  if (err.message === "EMAIL_ALREADY_EXISTS") {
    console.error("BusinessError:", err.message);
    return res.status(409).json({ message: "Email already exists" });
  }
  console.error("UnhandledError:", err.message);
  return res.status(500).json({ message: "Internal server error" });
};
