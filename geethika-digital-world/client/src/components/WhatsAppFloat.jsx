import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppFloat = () => {
  const phoneNumber = '917416111271'; // Replace with actual WhatsApp number
  const message = 'Hi! I am interested in your products/services.';

  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110 z-50 group"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="w-6 h-6" />
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
        Chat with us!
      </span>
    </button>
  );
};

export default WhatsAppFloat;
