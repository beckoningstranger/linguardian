import { Schema } from "mongoose";

const itemsSchema = new Schema({
  item: {
    type: String,
    required: true,
  },
  lang: {},
});
