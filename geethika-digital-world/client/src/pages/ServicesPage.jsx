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
    <div className="min-h-screen bg-background">
      <div className="relative bg-gradient-to-r from-valentine-pink/30 to-valentine-red/20 py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-valentine-red mb-2 sm:mb-4 italic">
            Our Services
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-700">
            Professional photography, videography, and decoration services
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-valentine-red"></div>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-base sm:text-lg">No services available at the moment.</p>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8 md:space-y-12">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-valentine-pink/20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                  {service.image_url && (
                    <div className="lg:col-span-1">
                      <img
                        src={service.image_url}
                        alt={service.name}
                        className="w-full h-48 sm:h-56 md:h-64 lg:h-full object-cover"
                      />
                    </div>
                  )}

                  <div className={`${service.image_url ? 'lg:col-span-2' : 'lg:col-span-3'} p-4 sm:p-6 md:p-8`}>
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                      <h2 className="text-2xl sm:text-3xl font-display font-bold text-valentine-red italic">{service.name}</h2>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">{service.description}</p>

                    {service.price_range && (
                      <div className="mb-4 sm:mb-6">
                        <span className="inline-block bg-valentine-pink/20 text-valentine-red px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-semibold text-xs sm:text-sm md:text-base">
                          {service.price_range}
                        </span>
                      </div>
                    )}

                    <div className="space-y-3 sm:space-y-4">
                      <button
                        onClick={() => {
                          const message = `Hi! I'm interested in ${service.name}. Can you provide more details?`;
                          const whatsappUrl = `https://wa.me/919492686421?text=${encodeURIComponent(message)}`;
                          window.open(whatsappUrl, '_blank');
                        }}
                        className="btn-romantic text-sm sm:text-base w-full sm:w-auto"
                      >
                        Book Now via WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-valentine-pink/20">
            <div className="bg-gradient-to-r from-valentine-pink/30 to-valentine-red/20 p-4 sm:p-6 md:p-8">
              <h2 className="text-xl sm:text-2xl font-display font-bold mb-2 text-valentine-red italic">
                Book {selectedService?.name}
              </h2>
              <p className="text-xs sm:text-sm text-gray-700">
                Package: {selectedPackage?.name} - ₹{selectedPackage?.price}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div>
                <label className="flex items-center text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-valentine-red focus:border-transparent"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="flex items-center text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2">
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-valentine-red focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="flex items-center text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  Preferred Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-valentine-red focus:border-transparent"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="flex items-center text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  Location *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-valentine-red focus:border-transparent"
                  placeholder="Enter event location"
                />
              </div>

              <div>
                <label className="flex items-center text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2">
                  <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  Requirements
                </label>
                <textarea
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-valentine-red focus:border-transparent"
                  rows="4"
                  placeholder="Tell us about your requirements..."
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-start">
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="text-xs sm:text-sm">
                    <p className="font-semibold text-yellow-800 mb-1">
                      Advance Payment Required
                    </p>
                    <p className="text-yellow-700">
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
                  className="flex-1 px-4 py-2.5 sm:px-6 sm:py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary text-sm sm:text-base py-2.5 sm:py-3"
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
