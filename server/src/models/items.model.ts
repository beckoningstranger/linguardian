import Items from "./item.schema.js";

export async function getOneItemById(id: string) {
  try {
    const response = await Items.findOne({ _id: id });
    if (response) return response;
    throw new Error("Item not found");
  } catch (err) {
    console.error(`Error getting item with id ${id}: ${err}`);
  }
}
