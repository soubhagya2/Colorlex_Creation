import mongoose from 'mongoose';

const proofSchema = new mongoose.Schema({
  proofUrl: { type: String, required: true },
  notes: { type: String, default: '' },
  version: { type: Number, default: 1 },
  uploadedBy: { type: String, default: 'Staff' },
  uploadedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['pending_review', 'approved', 'revision_requested'],
    default: 'pending_review'
  },
  customerFeedback: { type: String, default: '' }
});

const designRequestSchema = new mongoose.Schema(
  {
    requestNumber: { type: String, required: true, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    guestDetails: {
      name: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' }
    },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null },
    title: { type: String, required: true },
    description: { type: String, required: true },
    referenceFiles: [{ type: String }],
    specs: {
      size: { type: String, default: '' },
      material: { type: String, default: '' },
      finish: { type: String, default: '' },
      quantity: { type: Number, default: 100 }
    },
    proofs: [proofSchema],
    status: {
      type: String,
      enum: ['pending_proof', 'proof_uploaded', 'revision_requested', 'approved', 'rejected'],
      default: 'pending_proof'
    },
    staffAssigned: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
  },
  { timestamps: true }
);

export default mongoose.models.DesignRequest || mongoose.model('DesignRequest', designRequestSchema);
