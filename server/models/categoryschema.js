const mongoose = require('mongoose');
const { Schema,model , models} = mongoose;

const categorySchema = new mongoose.Schema({
  title:{ type: String, required: true, unique: true }
});

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
module.exports = { Category };