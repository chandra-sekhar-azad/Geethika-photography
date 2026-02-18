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
    <section className="py-8 xs:py-10 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 xs:mb-8 sm:mb-10 md:mb-12">
          <h2 className="section-title text-xl xs:text-2xl sm:text-3xl md:text-4xl text-white">What Our Customers Say</h2>
          <p className="text-gray-300 text-xs xs:text-sm sm:text-base md:text-lg px-2">
            Love stories from our happy customers
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-5 sm:gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-xl sm:rounded-2xl p-4 xs:p-5 sm:p-6 shadow-lg hover:shadow-xl hover:shadow-orange-primary/20 transition-all duration-300 relative border-2 border-gray-700 hover:border-orange-primary"
            >
              <Quote className="absolute top-3 right-3 xs:top-4 xs:right-4 w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 text-orange-primary/30" />

              <div className="flex items-center gap-2.5 xs:gap-3 sm:gap-4 mb-3 xs:mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-orange-primary/50 ring-2 ring-orange-primary/20"
                />
                <div>
                  <h4 className="font-semibold text-white text-sm xs:text-base">{testimonial.name}</h4>
                  <p className="text-xs xs:text-sm text-gray-400">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex gap-0.5 xs:gap-1 mb-2 xs:mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 xs:w-4 xs:h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-gray-300 italic text-xs xs:text-sm sm:text-base">
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
