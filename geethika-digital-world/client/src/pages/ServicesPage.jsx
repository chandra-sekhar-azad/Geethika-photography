import { useState, useEffect } from 'react';
import { Calendar, MapPin, Phone, User, MessageSquare, CreditCard } from 'lucide-react';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    location: '',
    requirements: '',
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/services`);
      const data = await response.json();
      setServices(data.services || []);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = (service, pkg) => {
    setSelectedService(service);
    setSelectedPackage(pkg);
    setShowBookingForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const bookingDetails = {
      service: selectedService.name,
      package: selectedPackage.name,
      price: selectedPackage.price,
      ...formData,
    };

    console.log('Booking Details:', bookingDetails);

    const message = `New Service Booking!\n\nService: ${selectedService.name}\nPackage: ${selectedPackage.name}\nName: ${formData.name}\nPhone: ${formData.phone}\nDate: ${formData.date}\nLocation: ${formData.location}\nRequirements: ${formData.requirements}`;

    const whatsappUrl = `https://wa.me/919492686421?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    alert('Booking request sent! We will contact you shortly.');
    setShowBookingForm(false);
    setFormData({ name: '', phone: '', date: '', location: '', requirements: '' });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg-light)' }}>
      <div className="relative py-10 sm:py-14 md:py-18 border-b" style={{ backgroundColor: 'var(--color-bg-hero)', borderColor: 'rgba(168,213,213,0.4)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display font-semibold text-3xl sm:text-4xl md:text-5xl mb-3 tracking-wide" style={{ color: 'var(--color-text-dark)' }}>
            Our Services
          </h1>
          <p className="font-body text-sm sm:text-base md:text-lg" style={{ color: 'var(--color-text-mid)' }}>
            Professional photography, videography, and decoration services
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2" style={{ borderColor: 'var(--color-teal-400)' }}></div>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-body text-base sm:text-lg" style={{ color: 'var(--color-text-mid)' }}>No services available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-xl shadow-sm overflow-hidden border transition-all duration-300 group hover:-translate-y-1"
                style={{ borderColor: 'rgba(168,213,213,0.35)', boxShadow: '0 2px 12px rgba(26,43,53,0.06)' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 16px 40px rgba(61,138,138,0.14)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(26,43,53,0.06)'}
              >
                {service.image_url && (
                  <div className="h-48 overflow-hidden" style={{ backgroundColor: 'var(--color-teal-50)' }}>
                    <img
                      src={service.image_url}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                <div className="p-5">
                  <h2 className="font-display font-semibold text-xl mb-2 tracking-wide group-hover:opacity-70 transition-opacity" style={{ color: 'var(--color-text-dark)' }}>{service.name}</h2>
                  <p className="font-body text-sm mb-3 line-clamp-3" style={{ color: 'var(--color-text-mid)' }}>{service.description}</p>

                  {service.price_range && (
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 rounded font-body font-semibold text-sm border" style={{ backgroundColor: 'var(--color-teal-50)', color: 'var(--color-teal-500)', borderColor: 'rgba(91,163,163,0.25)' }}>
                        {service.price_range}
                      </span>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      const message = `Hi! I'm interested in ${service.name}. Can you provide more details?`;
                      const whatsappUrl = `https://wa.me/919492686421?text=${encodeURIComponent(message)}`;
                      window.open(whatsappUrl, '_blank');
                    }}
                    className="w-full py-3 px-4 font-body font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 uppercase tracking-widest text-sm text-white"
                    style={{ backgroundColor: 'var(--color-navy-800)' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-teal-500)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-navy-800)'}
                  >
                    <span>Book Now via WhatsApp</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showBookingForm && (
        <div className="fixed inset-0 bg-navy-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border shadow-2xl" style={{ borderColor: 'rgba(168,213,213,0.4)' }}>
            <div className="p-4 sm:p-6 md:p-8 border-b" style={{ backgroundColor: 'var(--color-bg-hero)', borderColor: 'rgba(168,213,213,0.4)' }}>
              <h2 className="font-display font-semibold text-xl sm:text-2xl mb-2 tracking-wide" style={{ color: 'var(--color-text-dark)' }}>
                Book {selectedService?.name}
              </h2>
              <p className="font-body text-xs sm:text-sm font-medium" style={{ color: 'var(--color-teal-500)' }}>
                Package: {selectedPackage?.name} - ₹{selectedPackage?.price}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div>
                <label className="flex items-center font-body text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2" style={{ color: 'var(--color-text-mid)' }}>
                  <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" style={{ color: 'var(--color-teal-500)' }} />
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base border rounded-lg focus:outline-none transition-colors"
                  style={{ backgroundColor: 'white', borderColor: 'rgba(168,213,213,0.5)', color: 'var(--color-text-dark)' }}
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="flex items-center font-body text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2" style={{ color: 'var(--color-text-mid)' }}>
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" style={{ color: 'var(--color-teal-500)' }} />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base border rounded-lg focus:outline-none transition-colors"
                  style={{ backgroundColor: 'white', borderColor: 'rgba(168,213,213,0.5)', color: 'var(--color-text-dark)' }}
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="flex items-center font-body text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2" style={{ color: 'var(--color-text-mid)' }}>
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" style={{ color: 'var(--color-teal-500)' }} />
                  Preferred Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base border rounded-lg focus:outline-none transition-colors"
                  style={{ backgroundColor: 'white', borderColor: 'rgba(168,213,213,0.5)', color: 'var(--color-text-dark)' }}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="flex items-center font-body text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2" style={{ color: 'var(--color-text-mid)' }}>
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" style={{ color: 'var(--color-teal-500)' }} />
                  Location *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base border rounded-lg focus:outline-none transition-colors"
                  style={{ backgroundColor: 'white', borderColor: 'rgba(168,213,213,0.5)', color: 'var(--color-text-dark)' }}
                  placeholder="Enter event location"
                />
              </div>

              <div>
                <label className="flex items-center font-body text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2" style={{ color: 'var(--color-text-mid)' }}>
                  <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" style={{ color: 'var(--color-teal-500)' }} />
                  Requirements
                </label>
                <textarea
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base border rounded-lg focus:outline-none transition-colors"
                  style={{ backgroundColor: 'white', borderColor: 'rgba(168,213,213,0.5)', color: 'var(--color-text-dark)' }}
                  rows="4"
                  placeholder="Tell us about your requirements..."
                />
              </div>

              <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-3 sm:p-4">
                <div className="flex items-start">
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="text-xs sm:text-sm">
                    <p className="font-semibold text-yellow-500 mb-1">
                      Advance Payment Required
                    </p>
                    <p className="text-yellow-400/80">
                      A 30% advance payment is required to confirm your booking.
                      You will be redirected to Razorpay for secure payment.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col xs:flex-row space-y-2 xs:space-y-0 xs:space-x-3 sm:space-x-4">
                <button
                  type="button"
                  onClick={() => setShowBookingForm(false)}
                  className="flex-1 px-4 py-2.5 sm:px-6 sm:py-3 border rounded-lg font-body font-semibold transition-colors text-sm sm:text-base"
                  style={{ borderColor: 'rgba(168,213,213,0.5)', color: 'var(--color-text-mid)' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-teal-50)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 font-body font-bold text-sm sm:text-base py-2.5 sm:py-3 rounded-lg transition-colors uppercase tracking-widest text-white"
                  style={{ backgroundColor: 'var(--color-navy-800)' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-teal-500)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-navy-800)'}
                >
                  Proceed to Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
