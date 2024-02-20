"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const itemsSchema = new mongoose_1.Schema({
    item: {
        type: String,
        required: true,
    },
    lang: {},
});
