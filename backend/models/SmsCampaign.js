import mongoose from 'mongoose';

const smsCampaignSchema = new mongoose.Schema(
  {
    campaign_name: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    target_audience: {
      type: String,
      enum: ['all', 'active', 'inactive', 'high_value'],
      default: 'all',
    },
    status: {
      type: String,
      enum: ['sending', 'completed', 'failed'],
      default: 'sending',
    },
    total_recipients: { type: Number, default: 0 },
    sent_count: { type: Number, default: 0 },
    failed_count: { type: Number, default: 0 },
    results: {
      type: [
        {
          phone: { type: String, default: '' },
          success: { type: Boolean, default: false },
        },
      ],
      default: [],
    },
    failure_details: {
      type: [
        {
          phone: { type: String, default: '' },
          error: { type: mongoose.Schema.Types.Mixed, default: null },
        },
      ],
      default: [],
    },
    created_by: {
      id: { type: String, default: '' },
      name: { type: String, default: '' },
      email: { type: String, default: '' },
      role: { type: String, default: 'admin' },
    },
    sent_at: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model('SmsCampaign', smsCampaignSchema);