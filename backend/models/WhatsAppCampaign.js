import mongoose from 'mongoose';

const whatsAppCampaignSchema = new mongoose.Schema(
  {
    campaign_name: {
      type: String,
      required: true,
      trim: true,
    },
    template_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WhatsAppTemplate',
      default: null,
    },
    template_name: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      default: '',
    },
    target_audience: {
      type: String,
      enum: ['all', 'active', 'inactive', 'high_value', 'custom'],
      default: 'all',
    },
    scheduled_at: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'sending', 'completed', 'failed'],
      default: 'completed',
    },
    total_recipients: {
      type: Number,
      default: 0,
    },
    sent_count: {
      type: Number,
      default: 0,
    },
    failed_count: {
      type: Number,
      default: 0,
    },
    results: [
      {
        phone: String,
        success: Boolean,
        messageId: String,
        error: String,
      },
    ],
    created_by: {
      id: String,
      name: String,
      email: String,
    },
  },
  {
    timestamps: true,
  }
);

whatsAppCampaignSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    return ret;
  },
});

export default mongoose.model('WhatsAppCampaign', whatsAppCampaignSchema);
