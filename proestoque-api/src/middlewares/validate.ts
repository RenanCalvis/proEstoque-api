import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((e) => ({
          path: e.path,
          message: e.message,
        }));
        console.warn(`[Validation Error] na rota ${req.url}:`, errors);
        return res.status(422).json({
          status: 'error',
          message: 'Erro de validação',
          errors,
        });
      }
      next(error);
    }
  };
};
