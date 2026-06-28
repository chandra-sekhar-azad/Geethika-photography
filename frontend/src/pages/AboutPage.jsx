import { ArrowRight, Camera, Scissors, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative min-h-[60vh] bg-gray-50 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1920&h=1080&fit=crop" 
            className="w-full h-full object-cover object-[center_20%] opacity-80" 
            alt="Studio Background" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent" />
        </div>
        
        <div className="container-custom relative flex flex-col justify-center pt-24 pb-16 md:pt-32 md:pb-20 min-h-[60vh]">
          <span className="bg-[#FCE4EC] text-[#9D4E8D] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4 md:mb-6 inline-block w-fit">
            Our Legacy
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-bold text-gray-900 mb-4 md:mb-8 leading-[1.1]">
            The Story<br />
            Behind Your<br />
            <span className="italic font-serif font-medium text-[var(--color-primary)]">Smiles</span>
          </h1>
          <p className="text-gray-600 font-body text-base md:text-xl leading-relaxed max-w-xl mb-8 md:mb-12">
            At Geethika Digital World, we don't just capture moments; we curate memories that breathe life into your personal history through the lens of craftsmanship.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/contact" className="btn-primary px-8 py-3 md:px-10 md:py-4">Book a Shoot</Link>
            <button className="text-sm font-body font-bold text-gray-900 flex items-center gap-2 px-4 md:px-8 hover:gap-4 transition-all group">
              <span>Our Process</span>
              <ArrowRight className="w-4 h-4 text-[var(--color-primary)]" />
            </button>
          </div>
        </div>
      </div>

      {/* Narrative Section */}
      <div className="py-12 md:py-16">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">

            {/* Image + floating quote */}
            <div className="relative w-full max-w-sm mx-auto lg:mx-0 lg:flex-[0.4] pb-20 pr-4 sm:pr-10">
              <div className="relative rounded-[30px] overflow-hidden aspect-[4/5] shadow-2xl">
                <img 
                  src="logo.png" 
                  className="w-full h-full object-cover" 
                  alt="Artisan at work" 
                />
              </div>
              {/* Floating Quote */}
              <div className="absolute -bottom-8 right-0 sm:-bottom-10 sm:-right-6 bg-white p-5 sm:p-8 rounded-2xl shadow-2xl max-w-[200px] sm:max-w-xs border border-purple-50">
                <h4 className="text-xl sm:text-2xl font-display font-bold text-[#9D4E8D] mb-1 italic">"Art is feeling."</h4>
                <p className="text-[9px] sm:text-[10px] text-gray-400 font-body font-bold tracking-widest uppercase">— Geethika Studio</p>
              </div>
            </div>

            {/* Text content */}
            <div className="flex-1 space-y-8">
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6 leading-tight">
                  Elevating Every<br />Detail with<br />
                  <span className="italic font-serif font-medium text-[var(--color-primary)]">Sentiment</span>
                </h2>
                <p className="text-gray-500 font-body text-base md:text-lg leading-relaxed mb-6">
                  Founded on the belief that every person has a masterpiece hidden in their everyday life, Geethika Digital World emerged as a sanctuary for visual storytelling. We reject the clinical approach of mass-market studios.
                </p>
                <p className="text-gray-500 font-body text-base md:text-lg leading-relaxed mb-6">
                  Our philosophy is rooted in The Sentimental Curator—an approach where we act as both artist and archivist. We blend modern high-end editorial techniques with the timeless warmth of personal connection.
                </p>
                <p className="text-gray-500 font-body text-base md:text-lg leading-relaxed">
                  Whether it's the subtle glimmer in an eye during a portrait or the tactile texture of a custom-designed album, we ensure that the craftsmanship behind the lens matches the emotional depth of the subject.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Offerings Section */}
      <div className="py-12 md:py-16 bg-gray-50/50">
        <div className="container-custom">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4 md:mb-6">Studio Offerings</h2>
            <p className="text-gray-400 font-body text-base md:text-lg">Crafted experiences for your most precious milestones.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
            {/* Offering 1 */}
            <div className="bg-white rounded-[30px] md:rounded-[40px] p-7 md:p-10 shadow-xl shadow-purple-100/20 group hover:-translate-y-2 transition-all duration-500 border border-transparent hover:border-purple-100">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-900 rounded-[24px] md:rounded-[30px] flex items-center justify-center mb-8 md:mb-10 group-hover:bg-[#8E447E] transition-colors overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=200&h=200&fit=crop" className="w-full h-full object-cover opacity-50 absolute" />
                <Camera className="w-7 h-7 md:w-8 md:h-8 text-white relative z-10" />
              </div>
              <span className="text-[10px] font-body font-bold text-[#8E447E] uppercase tracking-widest mb-3 block">Capture</span>
              <h3 className="text-xl md:text-2xl font-display font-bold text-gray-900 mb-4 md:mb-6">Professional Photoshoots</h3>
              <p className="text-gray-400 font-body text-sm leading-relaxed mb-8 md:mb-10">
                From intimate family portraits to editorial fashion sessions, we provide a comfortable, high-end environment designed to let your personality shine.
              </p>
              <Link to="/contact" className="inline-flex items-center gap-2 text-[10px] font-body font-bold text-gray-900 uppercase tracking-widest hover:gap-4 transition-all">
                <span>Learn More</span>
                <ArrowRight className="w-3 h-3 text-[var(--color-primary)]" />
              </Link>
            </div>

            {/* Offering 2 */}
            <div className="bg-white rounded-[30px] md:rounded-[40px] p-7 md:p-10 shadow-xl shadow-purple-100/20 group hover:-translate-y-2 transition-all duration-500 border border-transparent hover:border-purple-100">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-900 rounded-[24px] md:rounded-[30px] flex items-center justify-center mb-8 md:mb-10 group-hover:bg-[#8E447E] transition-colors overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1493121590231-20e4fbc07b27?w=200&h=200&fit=crop" className="w-full h-full object-cover opacity-50 absolute" />
                <Scissors className="w-7 h-7 md:w-8 md:h-8 text-white relative z-10" />
              </div>
              <span className="text-[10px] font-body font-bold text-[#8E447E] uppercase tracking-widest mb-3 block">Perfect</span>
              <h3 className="text-xl md:text-2xl font-display font-bold text-gray-900 mb-4 md:mb-6">Expert Photo Editing</h3>
              <p className="text-gray-400 font-body text-sm leading-relaxed mb-8 md:mb-10">
                Our post-production suite focuses on natural enhancement. We meticulously refine colors and textures to create a signature timeless look.
              </p>
              <Link to="/contact" className="inline-flex items-center gap-2 text-[10px] font-body font-bold text-gray-900 uppercase tracking-widest hover:gap-4 transition-all">
                <span>Learn More</span>
                <ArrowRight className="w-3 h-3 text-[var(--color-primary)]" />
              </Link>
            </div>

            {/* Offering 3 */}
            <div className="bg-white rounded-[30px] md:rounded-[40px] p-7 md:p-10 shadow-xl shadow-purple-100/20 group hover:-translate-y-2 transition-all duration-500 border border-transparent hover:border-purple-100 sm:col-span-2 md:col-span-1">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-900 rounded-[24px] md:rounded-[30px] flex items-center justify-center mb-8 md:mb-10 group-hover:bg-[#8E447E] transition-colors overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop" className="w-full h-full object-cover opacity-50 absolute" />
                <BookOpen className="w-7 h-7 md:w-8 md:h-8 text-white relative z-10" />
              </div>
              <span className="text-[10px] font-body font-bold text-[#8E447E] uppercase tracking-widest mb-3 block">Cherish</span>
              <h3 className="text-xl md:text-2xl font-display font-bold text-gray-900 mb-4 md:mb-6">Premium Album Design</h3>
              <p className="text-gray-400 font-body text-sm leading-relaxed mb-8 md:mb-10">
                Heirloom-quality albums crafted with fine linens and Italian papers. Every layout is uniquely designed to tell your specific story.
              </p>
              <Link to="/contact" className="inline-flex items-center gap-2 text-[10px] font-body font-bold text-gray-900 uppercase tracking-widest hover:gap-4 transition-all">
                <span>Learn More</span>
                <ArrowRight className="w-3 h-3 text-[var(--color-primary)]" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-12 md:py-16">
        <div className="container-custom">
          <div className="bg-[#A15891] rounded-[28px] p-6 md:p-10 flex flex-col sm:flex-row items-start gap-6 overflow-hidden relative w-full max-w-xl mx-auto">
            <div className="absolute top-0 right-0 w-1/4 h-full opacity-10 bg-white rotate-12 translate-x-4" />
            <div className="relative z-10 flex-1">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3 leading-snug">
                Ready to<br />Capture Your<br />Next Chapter?
              </h2>
              <p className="text-white/80 font-body text-sm mb-6 max-w-[260px]">
                Let's create something extraordinary together. Our booking sessions fill up fast—reserve your date with us today.
              </p>
              <Link to="/contact" className="bg-[#F7D060] text-gray-900 px-5 py-2 rounded-2xl font-body font-bold text-sm uppercase tracking-widest hover:bg-[#EAB308] transition-all shadow-2xl active:scale-95 inline-block">
                Book a Shoot
              </Link>
            </div>
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-[20px] overflow-hidden shadow-2xl rotate-3 flex-shrink-0 self-end sm:self-center group">
              <img 
                src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=800&fit=crop" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                alt="Camera gear" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
