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
    <section className="py-8 xs:py-10 sm:py-12 md:py-16 lg:py-20" style={{ backgroundColor: 'var(--color-bg-hero)' }}>
      <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 xs:mb-8 sm:mb-10 md:mb-14">
          <h2 className="section-title text-xl xs:text-2xl sm:text-3xl md:text-4xl">
            What Our Customers Say
          </h2>
          <p className="font-body text-xs xs:text-sm sm:text-base md:text-lg px-2 mt-4" style={{ color: 'var(--color-text-mid)' }}>
            Love stories from our happy customers
          </p>
          {/* Teal accent line */}
          <div className="mt-4 flex justify-center">
            <div className="h-0.5 w-16 rounded" style={{ backgroundColor: 'var(--color-teal-400)' }}></div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-5 sm:gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-xl sm:rounded-2xl p-4 xs:p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 relative border"
              style={{ borderColor: 'rgba(168,213,213,0.35)', boxShadow: '0 2px 12px rgba(26,43,53,0.05)' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 16px 40px rgba(61,138,138,0.14)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(26,43,53,0.05)'}
            >
              <Quote className="absolute top-3 right-3 xs:top-4 xs:right-4 w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8"
                style={{ color: 'rgba(91,163,163,0.25)' }} />

              <div className="flex items-center gap-2.5 xs:gap-3 sm:gap-4 mb-3 xs:mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 rounded-full object-cover"
                  style={{ border: '2px solid var(--color-teal-300)', outline: '2px solid rgba(91,163,163,0.15)', outlineOffset: '2px' }}
                />
                <div>
                  <h4 className="font-display font-semibold text-sm xs:text-base" style={{ color: 'var(--color-text-dark)' }}>{testimonial.name}</h4>
                  <p className="font-body text-xs xs:text-sm" style={{ color: 'var(--color-text-mid)' }}>{testimonial.role}</p>
                </div>
              </div>

              <div className="flex gap-0.5 xs:gap-1 mb-2 xs:mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 xs:w-4 xs:h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="font-body italic text-xs xs:text-sm sm:text-base" style={{ color: 'var(--color-text-mid)' }}>
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
