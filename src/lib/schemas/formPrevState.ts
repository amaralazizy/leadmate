import { z } from "zod";

export function createFormPrevStateSchema<ItemType extends z.ZodTypeAny>(
  itemSchema: ItemType
) {
  return z.object({
    success: z.boolean(),
    errors: z.record(z.string(itemSchema), z.array(z.string())).optional(),
    inputs: itemSchema,
  });
}


