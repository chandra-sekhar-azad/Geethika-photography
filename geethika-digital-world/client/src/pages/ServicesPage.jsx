import { useState } from 'react';
import { Calendar, MapPin, Phone, User, MessageSquare, CreditCard } from 'lucide-react';
import { services } from '../data/services';

const ServicesPage = () => {
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
    
    const whatsappUrl = `https://wa.me/917416111271?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    alert('Booking request sent! We will contact you shortly.');
    setShowBookingForm(false);
    setFormData({ name: '', phone: '', date: '', location: '', requirements: '' });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="relative bg-gradient-to-r from-valentine-pink/30 to-valentine-red/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-valentine-red mb-4 italic">
            Our Services
          </h1>
          <p className="text-lg text-gray-700">
            Professional photography, videography, and decoration services
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-valentine-pink/20">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-64 lg:h-full object-cover"
                  />
                </div>

                <div className="lg:col-span-2 p-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-4xl">{service.icon}</span>
                    <h2 className="text-3xl font-display font-bold text-valentine-red italic">{service.name}</h2>
                  </div>
                  <p className="text-gray-600 mb-6">{service.description}</p>

                  <div className="space-y-4">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Available Packages</h3>
                    {service.packages.map((pkg, index) => (
                      <div
                        key={index}
                        className="border-2 border-valentine-pink/30 rounded-xl p-5 hover:border-valentine-red hover:shadow-lg transition-all bg-gradient-to-r from-white to-valentine-pink/5"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-bold text-lg">{pkg.name}</h4>
                            <p className="text-sm text-gray-600">{pkg.duration}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-valentine-red">
                              ₹{pkg.price}
                            </div>
                          </div>
                        </div>
                        <ul className="space-y-2 mb-4">
                          {pkg.features.map((feature, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start">
                              <span className="text-valentine-red mr-2">✓</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <button
                          onClick={() => handleBooking(service, pkg)}
                          className="w-full btn-romantic"
                        >
                          Book Now
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-valentine-pink/20">
            <div className="bg-gradient-to-r from-valentine-pink/30 to-valentine-red/20 p-8">
              <h2 className="text-2xl font-display font-bold mb-2 text-valentine-red italic">
                Book {selectedService?.name}
              </h2>
              <p className="text-sm text-gray-700">
                Package: {selectedPackage?.name} - ₹{selectedPackage?.price}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="flex items-center text-sm font-semibold mb-2">
                  <User className="w-4 h-4 mr-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-valentine-red focus:border-transparent"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-semibold mb-2">
                  <Phone className="w-4 h-4 mr-2" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-valentine-red focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-semibold mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  Preferred Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-valentine-red focus:border-transparent"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-semibold mb-2">
                  <MapPin className="w-4 h-4 mr-2" />
                  Location *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-valentine-red focus:border-transparent"
                  placeholder="Enter event location"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-semibold mb-2">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Requirements
                </label>
                <textarea
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-valentine-red focus:border-transparent"
                  rows="4"
                  placeholder="Tell us about your requirements..."
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <CreditCard className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                  <div className="text-sm">
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

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowBookingForm(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
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
