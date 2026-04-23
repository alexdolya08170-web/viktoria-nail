import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Star, 
  Menu, 
  X, 
  Phone, 
  Mail, 
  MapPin,
  Loader2,
  Scissors,
  AlertCircle
} from 'lucide-react';

const InstagramIcon = ({ className, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const styles = {
  app: "font-sans text-stone-800 antialiased selection:bg-rose-200 selection:text-rose-900 min-h-screen flex flex-col",
  container: "container mx-auto px-4 md:px-12 lg:px-24 max-w-7xl",
  
  loadingContainer: "flex items-center justify-center min-h-screen bg-[#FFF5F7]",
  errorContainer: "flex flex-col items-center justify-center min-h-screen bg-[#FFF5F7] text-center p-6",
  errorBox: "bg-white p-8 rounded-2xl shadow-lg max-w-md",
  
  nav: "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/90 backdrop-blur-md shadow-sm py-4",
  navTransparent: "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent py-6",
  navContainer: "container mx-auto px-4 md:px-12 lg:px-24 max-w-7xl flex justify-between items-center relative",
  logo: "text-2xl font-serif font-bold text-stone-800 cursor-pointer md:static absolute left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto",
  navLinksDesktop: "hidden md:flex items-center gap-8",
  navLink: "text-stone-600 hover:text-rose-400 font-medium transition-colors cursor-pointer",
  
  heroSection: "relative min-h-screen flex items-center pt-20 overflow-hidden bg-[#FFF5F7]",
  heroGrid: "container mx-auto px-4 md:px-12 lg:px-24 max-w-7xl grid md:grid-cols-2 gap-16 lg:gap-24 items-center",
  heroTitle: "text-5xl md:text-6xl lg:text-7xl font-serif text-stone-800 leading-[1.1] mb-6",
  heroAccent: "text-rose-400 italic",
  heroDesc: "text-lg text-stone-600 mb-8 max-w-lg leading-relaxed",
  heroImageWrapper: "relative z-10 rounded-[2rem] overflow-hidden shadow-2xl shadow-rose-900/10 aspect-[4/5] max-w-md mx-auto",
  
  sectionTitleWrapper: "mb-16 text-center",
  sectionSubtitle: "block text-rose-400 font-semibold tracking-wider uppercase text-sm mb-3",
  sectionTitle: "text-3xl md:text-5xl font-serif text-stone-800 leading-tight",
  sectionLine: "h-1 w-24 bg-rose-200 mt-6 rounded-full mx-auto",
  
  servicesSection: "py-32 bg-[#FFF5F7]",
  servicesGrid: "grid md:grid-cols-3 gap-10",
  serviceCard: "bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-rose-50 group",
  serviceIconBox: "w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-400 mb-8 group-hover:bg-rose-400 group-hover:text-white transition-colors duration-300",
  
  portfolioSection: "py-32 bg-white",
  portfolioGrid: "grid grid-cols-2 md:grid-cols-2 gap-6 max-w-5xl mx-auto",
  portfolioItem: "aspect-square rounded-2xl overflow-hidden group relative cursor-pointer",
  portfolioImg: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-110",
  
  processSection: "py-32 bg-[#FFF5F7]",
  processGrid: "grid md:grid-cols-4 gap-12 relative",
  processStepNum: "w-14 h-14 rounded-full bg-rose-400 text-white flex items-center justify-center font-bold text-base mb-8 mx-auto md:mx-0 shadow-lg shadow-rose-400/20",
  
  contactSection: "py-32 bg-white",
  contactCard: "bg-white rounded-[3rem] shadow-xl overflow-hidden flex flex-col md:flex-row border border-rose-50",
  contactInfoSide: "md:w-5/12 bg-rose-400 p-16 text-white flex flex-col justify-between relative overflow-hidden",
  contactFormSide: "md:w-7/12 p-16",
  input: "w-full px-5 py-4 rounded-xl border border-stone-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 outline-none transition-all bg-stone-50 text-lg",
  
  footer: "bg-stone-900 text-stone-400 py-16 border-t border-stone-800 mt-auto",
  footerContainer: "container mx-auto px-4 md:px-12 lg:px-24 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-8"
};

const ContactSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Коротке ім\'я').required('Введіть ім\'я'),
  phone: Yup.string().matches(/^[0-9+\-\s()]+$/, 'Невірний телефон').required('Введіть телефон'),
  service: Yup.string().required('Оберіть послугу')
});

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const base = "inline-flex items-center justify-center px-8 py-4 rounded-full font-medium transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 text-base";
  const vars = {
    primary: "bg-rose-400 text-white hover:bg-rose-500 shadow-lg shadow-rose-400/20",
    outline: "border-2 border-rose-400 text-rose-400 hover:bg-rose-50"
  };
  return <motion.button whileTap={{ scale: 0.95 }} className={`${base} ${vars[variant]} ${className}`} {...props}>{children}</motion.button>;
};

const SectionTitle = ({ subtitle, title }) => (
  <div className={styles.sectionTitleWrapper}>
    <span className={styles.sectionSubtitle}>{subtitle}</span>
    <h2 className={styles.sectionTitle}>{title}</h2>
    <div className={styles.sectionLine} />
  </div>
);

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/data.json');
        setData(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching ", err);
        setData({
          profile: { name: "Anna Nails", phone: "+380 99 123 4567", email: "hello@annanails.com", address: "Kyiv, Peremohy Ave 1", instagram: "https://instagram.com" },
          services: [
            { id: 1, title: "Манікюр", description: "Комбінований манікюр з ідеальним вирівнюванням.", price: "600 грн" },
            { id: 2, title: "Нарощування", description: "Моделювання нігтів гелем або акригелем будь-якої складності.", price: "900 грн" },
            { id: 3, title: "Дизайн", description: "Френч, стемпінг, ручний розпис та інкрустація.", price: "від 50 грн" }
          ],
          portfolio: [
            "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1519014816548-bf5fe059e98b?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&q=80&w=800"
          ],
          process: [
            { step: "Запис", desc: "Обираєте зручний час онлайн або по телефону." },
            { step: "Консультація", desc: "Обговорюємо форму, довжину та дизайн." },
            { step: "Процедура", desc: "Стерильні інструменти та якісні матеріали." },
            { step: "Результат", desc: "Ви насолоджуєтесь ідеальними нігтиками." }
          ]
        });
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e, href) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    const element = document.querySelector(href);
    if (element) {
      const headerOffset = 100; 
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 className="w-12 h-12 text-rose-400 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorBox}>
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Помилка</h2>
          <p className="text-stone-600 mb-4">{error || "Дані відсутні"}</p>
          <Button onClick={() => window.location.reload()}>Спробувати ще</Button>
        </div>
      </div>
    );
  }

  const { profile, services, portfolio, process } = data;

  return (
    <div className={styles.app}>
      <nav className={isScrolled ? styles.nav : styles.navTransparent}>
        <div className={styles.navContainer}>
          
          <button 
            className="md:hidden text-stone-800 p-2 z-50 relative order-first" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          <a href="#" className={styles.logo} onClick={(e) => scrollToSection(e, '#')}>{profile.name}</a>
          
          <div className={styles.navLinksDesktop}>
            {['Послуги', 'Портфоліо', 'Контакти'].map((item, idx) => {
              const href = idx === 0 ? '#services' : idx === 1 ? '#portfolio' : '#contact';
              return (
                <a key={item} href={href} className={styles.navLink} onClick={(e) => scrollToSection(e, href)}>
                  {item}
                </a>
              );
            })}
            <Button variant="primary" className="px-6 py-3 text-sm" onClick={(e) => scrollToSection(e, '#contact')}>
              Записатися
            </Button>
          </div>

          <div className="w-10 md:hidden"></div>
        </div>
        
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              exit={{ opacity: 0, height: 0 }} 
              className="md:hidden bg-white border-b shadow-lg absolute top-full left-0 right-0 overflow-hidden z-40"
            >
              <div className="flex flex-col p-6 gap-4 bg-white">
                {['Послуги', 'Портфоліо', 'Контакти'].map((item, idx) => {
                   const href = idx === 0 ? '#services' : idx === 1 ? '#portfolio' : '#contact';
                   return (
                    <a 
                      key={item} 
                      href={href} 
                      className="text-xl font-medium text-stone-700 py-2 border-b border-stone-100 last:border-0 active:text-rose-400"
                      onClick={(e) => scrollToSection(e, href)}
                    >
                      {item}
                    </a>
                   )
                })}
                <div className="pt-4">
                  <Button variant="primary" className="w-full justify-center" onClick={(e) => scrollToSection(e, '#contact')}>
                    Записатися онлайн
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main>
        <section id="hero" className={styles.heroSection}>
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-rose-50 to-transparent -z-10 rounded-bl-[100px]" />
          <div className={styles.heroGrid}>
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <h1 className={styles.heroTitle}>
                Естетика ваших <br/>
                <span className={styles.heroAccent}>нігтів</span>
              </h1>
              <p className={styles.heroDesc}>
                Створюю ідеальний манікюр, який підкреслює вашу індивідуальність.
              </p>
              <div className="flex flex-wrap gap-6">
                <Button onClick={(e) => scrollToSection(e, '#contact')}>Записатися онлайн</Button>
                <Button variant="outline" onClick={(e) => scrollToSection(e, '#portfolio')}>Мої роботи</Button>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="relative hidden md:block">
              <div className={styles.heroImageWrapper}>
                 <img src="https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&q=80&w=800" alt="Hero" className="w-full h-full object-cover" />
              </div>
            </motion.div>
          </div>
        </section>

        <section id="services" className={styles.servicesSection}>
          <div className={styles.container}>
            <SectionTitle subtitle="Прайс" title="Мої послуги" />
            <div className={styles.servicesGrid}>
              {services.map((service) => (
                <motion.div key={service.id} whileHover={{ y: -10 }} className={styles.serviceCard}>
                  <div className={styles.serviceIconBox}>
                    {service.id === 1 ? <Sparkles size={32} /> : service.id === 2 ? <Scissors size={32} /> : <Star size={32} />}
                  </div>
                  <h3 className="text-2xl font-bold text-stone-800 mb-4">{service.title}</h3>
                  <p className="text-stone-600 mb-8 leading-relaxed text-lg">{service.description}</p>
                  <div className="pt-8 border-t border-stone-100">
                    <span className="font-semibold text-stone-800 text-2xl">{service.price}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="portfolio" className={styles.portfolioSection}>
          <div className={styles.container}>
            <SectionTitle subtitle="Галерея" title="Портфоліо" />
            <div className={styles.portfolioGrid}>
              {portfolio.map((src, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className={styles.portfolioItem}>
                  <img src={src} alt={`Work ${index + 1}`} className={styles.portfolioImg} />
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-16">
              <Button variant="outline" onClick={() => window.open(profile.instagram, '_blank')}>
                Більше робіт в Instagram <InstagramIcon className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>

        <section id="process" className={styles.processSection}>
          <div className={styles.container}>
            <SectionTitle subtitle="Етапи" title="Як я працюю" />
            <div className={styles.processGrid}>
              <div className="hidden md:block absolute top-14 left-0 w-full h-0.5 bg-rose-100 -z-10" />
              {process.map((step, index) => (
                <div key={index} className="relative pt-4 md:pt-0 text-center md:text-left">
                  <div className={styles.processStepNum}>{index + 1}</div>
                  <h3 className="text-2xl font-bold text-stone-800 mb-4">{step.step}</h3>
                  <p className="text-stone-600 text-lg leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className={styles.contactSection}>
          <div className={styles.container}>
            <div className={styles.contactCard}>
              <div className={styles.contactInfoSide}>
                <div className="relative z-10">
                  <h3 className="text-4xl font-serif mb-8">Контакти</h3>
                  <p className="text-rose-100 mb-16 text-lg">Запишіться на процедуру зручним для вас способом.</p>
                  <div className="space-y-8">
                    <div className="flex items-center gap-6 text-lg"><Phone className="w-6 h-6" /><span>{profile.phone}</span></div>
                    <div className="flex items-center gap-6 text-lg"><Mail className="w-6 h-6" /><span>{profile.email}</span></div>
                    <div className="flex items-center gap-6 text-lg"><MapPin className="w-6 h-6" /><span>{profile.address}</span></div>
                  </div>
                </div>
                <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-rose-500 rounded-full opacity-50 blur-3xl" />
              </div>

              <div className={styles.contactFormSide}>
                <Formik
                  initialValues={{ name: '', phone: '', service: '' }}
                  validationSchema={ContactSchema}
                  onSubmit={(values, { setSubmitting, resetForm }) => {
                    setTimeout(() => {
                      alert(`Дякую, ${values.name}! Заявка прийнята.`);
                      resetForm();
                      setSubmitting(false);
                    }, 1500);
                  }}
                >
                  {({ errors, touched, isSubmitting }) => (
                    <Form className="space-y-8">
                      <div>
                        <label className="block text-base font-medium text-stone-700 mb-3">Ваше ім'я</label>
                        <Field name="name" className={`${styles.input} ${errors.name && touched.name ? 'border-red-500' : ''}`} placeholder="Анна" />
                        <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-2" />
                      </div>
                      <div>
                        <label className="block text-base font-medium text-stone-700 mb-3">Телефон</label>
                        <Field name="phone" className={`${styles.input} ${errors.phone && touched.phone ? 'border-red-500' : ''}`} placeholder="+380..." />
                        <ErrorMessage name="phone" component="div" className="text-red-500 text-sm mt-2" />
                      </div>
                      <div>
                        <label className="block text-base font-medium text-stone-700 mb-3">Послуга</label>
                        <Field as="select" name="service" className={`${styles.input} ${errors.service && touched.service ? 'border-red-500' : ''}`}>
                          <option value="">Оберіть послугу</option>
                          {services.map(s => <option key={s.id} value={s.title}>{s.title}</option>)}
                        </Field>
                        <ErrorMessage name="service" component="div" className="text-red-500 text-sm mt-2" />
                      </div>
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Надсилання...</> : 'Записатися'}
                      </Button>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className="text-3xl font-serif font-bold text-white">{profile.name}</div>
          <div className="text-base">Всі права захищено</div>
        </div>
      </footer>
    </div>
  );
}

