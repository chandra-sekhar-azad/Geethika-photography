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
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="relative bg-black/50 py-8 sm:py-12 md:py-16 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-2 sm:mb-4 uppercase tracking-wide">
            Our Services
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-400">
            Professional photography, videography, and decoration services
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-orange-primary"></div>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-base sm:text-lg">No services available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-800 hover:border-orange-primary/50 hover:shadow-orange-primary/10 transition-all duration-300 group">
                {service.image_url && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={service.image_url}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}

                <div className="p-5">
                  <h2 className="text-xl font-display font-bold text-white mb-2 uppercase tracking-wide group-hover:text-orange-primary transition-colors">{service.name}</h2>
                  <p className="text-sm text-gray-400 mb-3 line-clamp-3">{service.description}</p>

                  {service.price_range && (
                    <div className="mb-3">
                      <span className="inline-block bg-orange-primary/10 text-orange-primary px-3 py-1 rounded-full font-semibold text-sm border border-orange-primary/20">
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
                    className="w-full py-3 px-4 bg-orange-primary text-black font-semibold rounded-lg hover:bg-orange-hover transition-colors flex items-center justify-center gap-2 uppercase tracking-wide text-sm"
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl sm:rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl">
            <div className="bg-gray-800 p-4 sm:p-6 md:p-8 border-b border-gray-700">
              <h2 className="text-xl sm:text-2xl font-display font-bold mb-2 text-white uppercase tracking-wide">
                Book {selectedService?.name}
              </h2>
              <p className="text-xs sm:text-sm text-orange-primary font-medium">
                Package: {selectedPackage?.name} - ₹{selectedPackage?.price}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div>
                <label className="flex items-center text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-gray-300">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-orange-primary" />
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-primary focus:border-transparent text-white placeholder-gray-500"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="flex items-center text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-gray-300">
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-orange-primary" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-primary focus:border-transparent text-white placeholder-gray-500"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="flex items-center text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-gray-300">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-orange-primary" />
                  Preferred Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-primary focus:border-transparent text-white placeholder-gray-500 [color-scheme:dark]"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="flex items-center text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-gray-300">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-orange-primary" />
                  Location *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-primary focus:border-transparent text-white placeholder-gray-500"
                  placeholder="Enter event location"
                />
              </div>

              <div>
                <label className="flex items-center text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-gray-300">
                  <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-orange-primary" />
                  Requirements
                </label>
                <textarea
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-primary focus:border-transparent text-white placeholder-gray-500"
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
                  className="flex-1 px-4 py-2.5 sm:px-6 sm:py-3 border border-gray-600 rounded-lg font-semibold text-gray-300 hover:bg-gray-800 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-orange-primary text-black font-bold text-sm sm:text-base py-2.5 sm:py-3 rounded-lg hover:bg-orange-hover transition-colors uppercase tracking-wide"
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
