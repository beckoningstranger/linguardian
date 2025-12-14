import { Types } from "mongoose";
import { z } from "zod";

/* Even though we largely ignore ObjectIds because we query all
data with .lean(), we still need this to verify data we are about 
to _write_ to the database.
*/
export const objectIdSchema = z.custom<Types.ObjectId>(
  (value) => value instanceof Types.ObjectId,
  {
    message: "Invalid ObjectId",
  }
);

export const objectIdArraySchema = z.array(objectIdSchema);

export const unitItemWithObjectIdSchema = z.object({
  unitName: z.string(),
  item: objectIdSchema,
  importBatch: z.string().nullable().optional(),
});

export type ObjectId = z.infer<typeof objectIdSchema>;
export type ObjectIdArray = z.infer<typeof objectIdArraySchema>;
export type UnitItemWithObjectId = z.infer<typeof unitItemWithObjectIdSchema>;
