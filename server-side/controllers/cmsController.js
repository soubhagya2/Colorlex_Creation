import CMS from '../models/CMS.js';

export const getCMSContent = async (req, res) => {
  try {
    let cms = await CMS.findOne();
    if (!cms) {
      cms = await CMS.create({
        banners: [
          {
            title: 'High-Impact Custom Business Cards',
            subtitle: 'Elevate your brand image with ultra-thick matte & spot UV finishes',
            image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
            link: '/catalog',
            buttonText: 'Order Cards Now'
          },
          {
            title: 'Vibrant Outdoor Vinyl Banners & Signage',
            subtitle: 'Weather-resistant heavy duty vinyl starting at competitive rates',
            image: 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&w=1200&q=80',
            link: '/catalog',
            buttonText: 'Explore Signage'
          }
        ],
        testimonials: [
          {
            name: 'Sarah Jenkins',
            company: 'Creative Studio CEO',
            rating: 5,
            comment: 'ColorLex produced our annual conference flyers and vinyl banners with incredible color accuracy!'
          },
          {
            name: 'Rajesh Sharma',
            company: 'Tech Pulse Marketing Lead',
            rating: 5,
            comment: 'Fast turnaround, great design proof approval process, and premium paper quality. 10/10 service.'
          }
        ],
        faqs: [
          {
            question: 'What design file formats do you accept for print?',
            answer: 'We accept vector PDF, AI (Adobe Illustrator), EPS, PSD, high-resolution PNG, and TIFF (300 DPI min).'
          },
          {
            question: 'How does the Design Proof Approval workflow work?',
            answer: 'Once you place your order or submit a request, our team uploads a digital proof to your dashboard for approval before printing starts.'
          }
        ]
      });
    }
    return res.json({ success: true, data: cms });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCMSContent = async (req, res) => {
  try {
    let cms = await CMS.findOne();
    if (!cms) {
      cms = new CMS(req.body);
    } else {
      Object.assign(cms, req.body);
    }
    await cms.save();
    return res.json({ success: true, message: 'CMS Content updated successfully', data: cms });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
