import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  title:{ type: String, required: true, unique: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }
});

export const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);