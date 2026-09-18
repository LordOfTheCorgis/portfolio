import { z } from "zod";

// shared between the form and the route handler so they can't drift
export const contactSchema = z.object({
  name: z.string().trim().min(2, "at least 2 characters").max(80, "keep it under 80"),
  email: z.string().trim().email("that's not an email"),
  message: z.string().trim().min(10, "say a bit more, 10+ characters").max(2000, "2000 max, send the rest in a follow-up"),
  // honeypot. real people never see it, bots fill everything
  company: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
