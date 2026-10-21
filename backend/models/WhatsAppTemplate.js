import mongoose from 'mongoose';

const whatsAppTemplateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Template name is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['promotional', 'transactional', 'notification', 'order', 'custom'],
      default: 'custom',
    },
    occasion: {
      type: String,
      trim: true,
      default: '',
    },
    subject: {
      type: String,
      trim: true,
      default: '',
    },
    message: {
      type: String,
      required: [true, 'Template message text is required'],
      trim: true,
    },
    variables: {
      type: [String],
      default: [],
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Map _id to id for frontend compatibility
whatsAppTemplateSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    return ret;
  },
});

const WhatsAppTemplate = mongoose.model('WhatsAppTemplate', whatsAppTemplateSchema);

export default WhatsAppTemplate;
