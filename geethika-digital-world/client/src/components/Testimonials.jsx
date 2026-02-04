import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Priya & Rahul',
      role: 'Couple Photoshoot',
      image: '/images/image.png',
      rating: 5,
      text: 'Amazing experience! The personalized photo frame we ordered was absolutely stunning. Perfect Valentine gift!'
    },
    {
      name: 'Anjali Sharma',
      role: 'Customized Gift',
      image: '/images/image copy 3.png',
      rating: 5,
      text: 'The quality of customization is top-notch. My husband loved the personalized mug and t-shirt combo!'
    },
    {
      name: 'Vikram & Sneha',
      role: 'Wedding Photography',
      image: '/images/image copy 6.png',
      rating: 5,
      text: 'Geethika Digital World captured our special moments beautifully. Highly recommend their services!'
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-rose-50 via-pink-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="text-gray-600 text-lg">
            Love stories from our happy customers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 relative"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-valentine-pink/20" />
              
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-valentine-pink"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-gray-700 italic">
                "{testimonial.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
