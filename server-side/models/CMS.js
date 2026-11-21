import mongoose from 'mongoose';

const cmsSchema = new mongoose.Schema(
  {
    banners: [
      {
        title: { type: String, required: true },
        subtitle: { type: String, default: '' },
        image: { type: String, required: true },
        link: { type: String, default: '/catalog' },
        buttonText: { type: String, default: 'Shop Now' },
        isActive: { type: Boolean, default: true }
      }
    ],
    testimonials: [
      {
        name: { type: String, required: true },
        company: { type: String, default: '' },
        avatar: { type: String, default: '' },
        rating: { type: Number, default: 5 },
        comment: { type: String, required: true }
      }
    ],
    faqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
        category: { type: String, default: 'General' }
      }
    ],
    announcementBar: {
      text: { type: String, default: '🎉 Get 15% OFF on Bulk Printing Orders! Code: COLORLEX15' },
      isActive: { type: Boolean, default: true },
      link: { type: String, default: '/catalog' }
    }
  },
  { timestamps: true }
);

export default mongoose.models.CMS || mongoose.model('CMS', cmsSchema);
