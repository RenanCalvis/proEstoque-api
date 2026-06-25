import { z, ZodError } from 'zod';
const s = z.object({ email: z.string().email() });
try {
  s.parse({});
} catch(e: any) {
  console.log('Is ZodError:', e instanceof ZodError);
  console.log('Has errors:', !!e.errors);
  console.log('Has issues:', !!e.issues);
  console.log(JSON.stringify(e.issues));
}
