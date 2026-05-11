import { z } from 'zod';

export const createLibraryMemberSchema =
  z.object({

    id: z.string(),

    name: z.string(),

    cardNo: z.string(),

    email: z.string().email(),

    mobile: z.string(),

    avatar: z.string().optional()

  });

export default {
  createLibraryMemberSchema
};