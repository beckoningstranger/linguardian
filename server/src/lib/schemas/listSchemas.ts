import { z } from "zod";

import { listSchema } from "@/lib/contracts/lists";

export const createNewListApiSchema = listSchema
  .pick({
    name: true,
    description: true,
    private: true,
    language: true,
    difficulty: true,
    authors: true,
  })
  .extend({
    csvfile: z
      .custom<Express.Multer.File>()
      .refine(
        (file) => !file || file.mimetype === "text/csv",
        "Please upload a valid CSV file"
      )
      .optional(),
  });

export type CreateNewListData = z.infer<typeof createNewListApiSchema>;
