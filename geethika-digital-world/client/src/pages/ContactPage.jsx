import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';

const ContactPage = () => {
  const handleWhatsApp = () => {
    const message = 'Hi! I would like to know more about your services.';
    const whatsappUrl = `https://wa.me/917416111271?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCall = () => {
    window.location.href = 'tel:+917416111271';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="relative bg-gradient-to-r from-valentine-pink/30 to-valentine-red/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-valentine-red mb-4 italic">
            Contact Us
          </h1>
          <p className="text-lg text-gray-700">
            Get in touch with us for any queries or bookings
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-valentine-pink/20">
              <h2 className="text-2xl font-display font-bold mb-6 text-valentine-red italic">
                Contact Information
              </h2>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-valentine-red/10 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-valentine-red" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Address</h3>
                    <p className="text-gray-600 mb-2">
                      Geethika Digital World<br />
                      Hyderabad, Telangana<br />
                      India
                    </p>
                    <a
                      href="https://maps.app.goo.gl/xWe5mszQAzkjj3iQA"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-valentine-red hover:underline text-sm inline-flex items-center"
                    >
                      View on Google Maps →
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-valentine-red/10 p-3 rounded-lg">
                    <Phone className="w-6 h-6 text-valentine-red" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <p className="text-gray-600">+91 7416111271</p>
                    <button
                      onClick={handleCall}
                      className="text-valentine-red hover:underline text-sm mt-1"
                    >
                      Call Now
                    </button>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-valentine-red/10 p-3 rounded-lg">
                    <Mail className="w-6 h-6 text-valentine-red" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-gray-600">info@geethikadigitalworld.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-valentine-red/10 p-3 rounded-lg">
                    <Clock className="w-6 h-6 text-valentine-red" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Business Hours</h3>
                    <p className="text-gray-600">
                      Monday - Saturday: 10:00 AM - 8:00 PM<br />
                      Sunday: 11:00 AM - 6:00 PM
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleWhatsApp}
                className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all shadow-lg hover:shadow-xl"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chat on WhatsApp</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 border border-valentine-pink/20">
              <h2 className="text-2xl font-display font-bold mb-4 text-valentine-red italic">
                Valentine Special Offers
              </h2>
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-valentine-pink/20 to-valentine-red/10 p-5 rounded-xl border border-valentine-pink/30">
                  <p className="font-semibold text-valentine-red mb-1">
                    💝 Flat 20% OFF on all products
                  </p>
                  <p className="text-sm text-gray-600">
                    Valid till February 14th
                  </p>
                </div>
                <div className="bg-gradient-to-r from-valentine-pink/20 to-valentine-red/10 p-5 rounded-xl border border-valentine-pink/30">
                  <p className="font-semibold text-valentine-red mb-1">
                    📸 Free couple photoshoot with event booking
                  </p>
                  <p className="text-sm text-gray-600">
                    Limited slots available
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-valentine-pink/20">
            <div className="h-full min-h-[500px] relative">
              <iframe
                src="https://www.google.com/maps?q=17.4167,78.4833&hl=en&z=14&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Geethika Digital World Location - Hyderabad"
              />
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <a
                href="https://maps.app.goo.gl/xWe5mszQAzkjj3iQA"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 text-valentine-red hover:text-valentine-red/80 font-semibold transition-colors"
              >
                <MapPin className="w-5 h-5" />
                <span>Open in Google Maps</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
