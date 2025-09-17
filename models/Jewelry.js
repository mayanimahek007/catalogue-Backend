import mongoose from 'mongoose';


const jewelrySchema = new mongoose.Schema({
  name: { type: String, required: false },
  categoryname: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  sku: { type: String },
  imageUrl: { type: String },
  videoUrl: { type: String },
  additionalImages: [{ type: String }] // For 4 additional photos
}, { timestamps: true });

export default mongoose.model('Jewelry', jewelrySchema);
