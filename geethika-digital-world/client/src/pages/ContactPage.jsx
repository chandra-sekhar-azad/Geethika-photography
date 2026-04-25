import { useState } from 'react';
import { MapPin, Phone, Mail, Send, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = `New Inquiry from Contact Form!\n\nName: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject}\nMessage: ${formData.message}`;
    const whatsappUrl = `https://wa.me/919492686421?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="py-20">
        <div className="container-custom">
          <span className="text-[10px] font-body font-bold text-[var(--color-primary)] uppercase tracking-widest mb-4 block">Contact Us</span>
          <h1 className="text-6xl md:text-7xl font-display font-bold text-gray-900 mb-6 leading-tight">
            Let's start a <span className="italic font-serif font-medium text-[var(--color-primary)]">conversation.</span>
          </h1>
          <p className="text-gray-500 font-body text-lg leading-relaxed max-w-2xl">
            Whether you're looking for a bespoke digital gift or a professional studio session, our team is here to curate your memories with care.
          </p>
        </div>
      </div>

      <div className="container-custom pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Contact Form */}
          <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl shadow-purple-100/50 border border-purple-50/50">
            <h3 className="text-2xl font-display font-bold text-gray-900 mb-10">Send a message</h3>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-body font-bold text-gray-400 uppercase tracking-widest ml-4">Your Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 font-body text-sm text-gray-700 focus:ring-2 focus:ring-purple-100 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-body font-bold text-gray-400 uppercase tracking-widest ml-4">Email Address</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 font-body text-sm text-gray-700 focus:ring-2 focus:ring-purple-100 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-body font-bold text-gray-400 uppercase tracking-widest ml-4">Subject</label>
                <input
                  type="text"
                  placeholder="Inquiry about collections"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 font-body text-sm text-gray-700 focus:ring-2 focus:ring-purple-100 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-body font-bold text-gray-400 uppercase tracking-widest ml-4">Your Message</label>
                <textarea
                  placeholder="How can we help you today?"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 font-body text-sm text-gray-700 focus:ring-2 focus:ring-purple-100 h-40 resize-none transition-all"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-3 py-4 px-10 bg-[#8E447E] text-white rounded-2xl font-body font-bold text-sm hover:bg-[#7A3B6D] transition-all shadow-lg active:scale-95"
              >
                <span>Send Inquiry</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Details & Map Card */}
          <div className="space-y-12">
            <div className="bg-gray-50 rounded-[40px] p-8 md:p-12">
              <h3 className="text-2xl font-display font-bold text-gray-900 mb-10">Studio Details</h3>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                    <MapPin className="w-5 h-5 text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <h5 className="text-[10px] font-body font-bold text-gray-400 uppercase tracking-widest mb-1">Our Location</h5>
                    <p className="text-sm font-body text-gray-700 leading-relaxed">
                      Artisan Heights, 4th Floor<br />Linking Road, Bandra West<br />Mumbai, MH 400050
                    </p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                    <Phone className="w-5 h-5 text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <h5 className="text-[10px] font-body font-bold text-gray-400 uppercase tracking-widest mb-1">Phone Number</h5>
                    <p className="text-sm font-body text-gray-700">+91 22 2640 1234</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                    <Mail className="w-5 h-5 text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <h5 className="text-[10px] font-body font-bold text-gray-400 uppercase tracking-widest mb-1">Email</h5>
                    <p className="text-sm font-body text-gray-700">hello@geethika.digital</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-12 border-t border-gray-100">
                <h5 className="text-[10px] font-body font-bold text-gray-400 uppercase tracking-widest mb-6">Connect with us</h5>
                <div className="flex gap-4">
                  <a href="#" className="w-12 h-12 bg-gray-900 text-white rounded-xl flex items-center justify-center hover:bg-black transition-all">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-12 h-12 bg-gray-900 text-white rounded-xl flex items-center justify-center hover:bg-black transition-all">
                    <Facebook className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Studio Image Card */}
            <div className="relative aspect-video rounded-[40px] overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&h=600&fit=crop" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                alt="Studio" 
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <button className="bg-white text-gray-900 px-8 py-3 rounded-xl font-body font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition-colors shadow-xl">
                  Visit Our Studio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="container-custom pb-32">
        <div className="relative rounded-[50px] overflow-hidden shadow-2xl h-[500px]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.4522236484506!2d78.3813!3d17.4444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9158f201b205%3A0x11bbe7be77ad44!2sGeethika%20Digital%20World!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-body font-bold text-gray-900">Geethika Digital World</p>
              <p className="text-[10px] text-gray-400">Open until 8:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
