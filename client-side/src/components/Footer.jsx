import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, CreditCard, MessageCircle, ExternalLink, Clock, ShieldCheck } from 'lucide-react';

/* Same horizontal margin as the Home page sections */
const WRAP = 'mx-3 sm:mx-6 lg:mx-8';

const QUICK_LINKS = [
  { to: '/', label: 'Home', title: 'ColorLex Creation - Home' },
  { to: '/catalog', label: 'Print Catalog & Frames', title: 'Browse Custom Photo Frames and Prints Catalog' },
  { to: '/services', label: 'Printing Services', title: 'Custom Digital Printing & Signage Services' },
  { to: '/custom-design', label: 'Custom Design Request', title: 'Request Custom Graphic Design & Custom Prints' },
  { to: '/about', label: 'About Us', title: 'About ColorLex Creation Studio' },
  { to: '/contact', label: 'Contact & Location', title: 'Contact ColorLex Support & Studio Location' },
];

const SUPPORT_LINKS = [
  { to: '/faq', label: 'Frequently Asked Questions', title: 'Frequently Asked Questions & Answers' },
  { to: '/shipping-policy', label: 'Shipping & Turnaround Times', title: 'Pan-India Shipping Policy & Delivery Turnaround' },
  { to: '/terms', label: 'Terms of Service', title: 'Terms of Service & Printing Guidelines' },
  { to: '/account', label: 'My Orders & Proofs', title: 'Track Customer Orders & Digital Proof Approvals' },
];

const GOOGLE_MAPS_URL =
  'https://www.google.com/maps/place/Colorlex+Creation/@21.5170829,86.7870326,17z';

const LOCAL_BUSINESS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://colorlex.com/#localbusiness',
  name: 'ColorLex Creation',
  url: 'https://colorlex.com',
  logo: 'https://colorlex.com/images/logo%20aa.png',
  image: 'https://colorlex.com/images/logo%20aa.png',
  description:
    'ColorLex Creation is a premier custom digital printing, luxury photo frames, acrylic prints, LED glow signs, and packaging studio located in Kuruda, Baleshwar, Odisha.',
  telephone: '+917735249873',
  email: 'colorlexcreation@gmail.com',
  priceRange: '₹₹',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Kantabania, Genguti, Kuruda',
    addressLocality: 'Baleshwar',
    addressRegion: 'Odisha',
    postalCode: '756056',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 21.5170829,
    longitude: 86.7870326,
  },
  hasMap: GOOGLE_MAPS_URL,
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '20:30',
    },
  ],
  sameAs: ['https://wa.me/917735249873'],
};

const linkClass = 'block py-0.5 leading-snug transition-colors hover:text-white';

function FooterColumn({ title, links }) {
  return (
    <nav className="min-w-0 space-y-2.5 sm:space-y-3" aria-label={title}>
      <h3 className="text-xs font-bold uppercase tracking-wider text-white sm:text-sm">{title}</h3>
      <ul className="space-y-1.5 sm:space-y-2">
        {links.map(({ to, label, title: linkTitle }) => (
          <li key={to}>
            <Link to={to} className={linkClass} title={linkTitle}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Footer() {
  return (
    <footer
      className="mt-6 overflow-hidden border-t border-slate-800/80 bg-slate-950 text-xs text-slate-400 sm:mt-8"
      role="contentinfo"
      aria-label="ColorLex Creation Footer"
      itemScope
      itemType="https://schema.org/LocalBusiness"
    >
      {/* Schema.org Structured Data for Search Engine Optimization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_SCHEMA) }}
      />
      <meta itemProp="name" content="ColorLex Creation" />
      <meta itemProp="url" content="https://colorlex.com" />
      <meta itemProp="priceRange" content="₹₹" />

      {/* Main columns */}
      <div className={`${WRAP} grid grid-cols-1 gap-6 py-8 sm:grid-cols-2 sm:gap-8 sm:py-12 lg:grid-cols-4`}>
        {/* Brand + contact */}
        <div className="space-y-3 sm:col-span-2 sm:space-y-4 lg:col-span-1">
          <Link
            to="/"
            className="inline-flex items-center"
            title="ColorLex Creation - Return to Home"
            aria-label="ColorLex Creation - Home"
          >
            <img
              src="/images/logo aa.png"
              alt="ColorLex Creation - Custom Digital Printing & Photo Framing in Baleshwar, Odisha"
              title="ColorLex Creation Studio"
              width="200"
              height="80"
              loading="lazy"
              decoding="async"
              itemProp="image"
              className="h-14 w-auto object-contain sm:h-20"
            />
          </Link>

          <p itemProp="description" className="max-w-md leading-relaxed text-slate-300">
            India's trusted custom digital printing &amp; framing studio in Baleshwar, Odisha. Specializing in
            luxury photo frames, acrylic prints, LED glow sign boards, laser cutting, corporate branding, and custom packaging.
          </p>

          {/* Localized Contact & Address Details */}
          <address
            className="not-italic space-y-2.5 pt-1 text-slate-300"
            itemProp="address"
            itemScope
            itemType="https://schema.org/PostalAddress"
          >
            {/* Physical Address */}
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              title="View ColorLex Creation Studio on Google Maps"
              aria-label="ColorLex Creation Address: Kantabania, Genguti, Kuruda, Baleshwar, Odisha 756056 (Open in Google Maps)"
              className="group flex items-start gap-2.5 transition-colors hover:text-white"
            >
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-purple-400 transition-transform group-hover:scale-110" aria-hidden="true" />
              <span className="leading-relaxed">
                <span itemProp="streetAddress">Kantabania, Genguti</span>,{' '}
                <span itemProp="addressLocality">Kuruda</span>,{' '}
                <span itemProp="addressLocality">Baleshwar</span>,{' '}
                <span itemProp="addressRegion">Odisha</span> –{' '}
                <span itemProp="postalCode">756056</span>, India
              </span>
            </a>

            {/* Direct Calling & WhatsApp Support */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-0.5">
              <a
                href="tel:+917735249873"
                itemProp="telephone"
                title="Call ColorLex Support: +91 77352 49873"
                aria-label="Call ColorLex Creation at +91 77352 49873"
                className="inline-flex items-center gap-2 py-0.5 transition-colors hover:text-white"
              >
                <Phone className="h-3.5 w-3.5 shrink-0 text-purple-400" aria-hidden="true" />
                <span>+91 77352 49873</span>
              </a>

              <a
                href="https://wa.me/917735249873?text=Hi%20ColorLex,%20I%20have%20an%20inquiry%20regarding%20printing%20services"
                target="_blank"
                rel="noopener noreferrer"
                title="Chat with ColorLex on WhatsApp"
                aria-label="Chat with ColorLex Creation on WhatsApp at +91 77352 49873"
                className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400 transition hover:border-emerald-500/60 hover:bg-emerald-500/20"
              >
                <MessageCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Email Support */}
            <a
              href="mailto:colorlexcreation@gmail.com"
              itemProp="email"
              title="Email ColorLex Customer Support"
              aria-label="Email ColorLex Support at colorlexcreation@gmail.com"
              className="inline-flex items-center gap-2 py-0.5 transition-colors hover:text-white"
            >
              <Mail className="h-3.5 w-3.5 shrink-0 text-purple-400" aria-hidden="true" />
              <span className="min-w-0 break-all">colorlexcreation@gmail.com</span>
            </a>

            {/* Operating Hours for Local SEO */}
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <Clock className="h-3.5 w-3.5 shrink-0 text-purple-400" aria-hidden="true" />
              <span>Mon – Sat: 9:00 AM – 8:30 PM (IST)</span>
            </div>
          </address>
        </div>

        {/* Links: shown before the map on mobile, after it from lg up */}
        <div className="grid grid-cols-2 gap-4 sm:col-span-2 sm:gap-8 lg:order-3 lg:col-span-2">
          <FooterColumn title="Quick Links" links={QUICK_LINKS} />
          <FooterColumn title="Customer Support" links={SUPPORT_LINKS} />
        </div>

        {/* Google Map & Studio Location */}
        <div className="space-y-2.5 sm:col-span-2 sm:space-y-3 lg:order-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white sm:text-sm">Find Our Studio</h3>
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-400 transition-colors hover:text-purple-300 hover:underline"
              title="Get directions to ColorLex Creation on Google Maps"
              aria-label="Get directions to ColorLex Creation studio on Google Maps"
            >
              <span>Get Directions</span>
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          </div>

          <div className="aspect-[16/10] w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-lg sm:aspect-video">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7423.521824712996!2d86.7870326!3d21.5170829!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1c5d240c1f65a9%3A0x60f465ff81c2918e!2sColorlex%20Creation!5e0!3m2!1sen!2sin!4v1790998354741!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Google Map location of Colorlex Creation in Kuruda, Baleshwar, Odisha"
              aria-label="Interactive Google Map showing Colorlex Creation studio location"
              className="h-full w-full"
            />
          </div>

          <p className="text-[11px] leading-relaxed text-slate-400">
            Kantabania, Genguti, Kuruda, Baleshwar, Odisha – 756056
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800/80 bg-slate-950/80">
        <div
          className={`${WRAP} flex flex-col items-center justify-between gap-3 py-4 text-center text-[11px] text-slate-500 sm:flex-row sm:gap-4 sm:py-5 sm:text-left sm:text-xs`}
        >
          <p>© {new Date().getFullYear()} ColorLex Creation. All rights reserved. </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400">
            <div className="flex items-center gap-1.5" title="Guaranteed high-quality print production">
              <ShieldCheck className="h-4 w-4 text-emerald-400" aria-hidden="true" />
              <span>100% Quality Guaranteed</span>
            </div>
            <div className="flex items-center gap-1.5" title="Secure online payments and GST invoicing">
              <CreditCard className="h-4 w-4 text-purple-400" aria-hidden="true" />
              <span>Secure Payments &amp; Invoicing</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}