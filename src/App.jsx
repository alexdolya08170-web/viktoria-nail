import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Star, 
  Phone, 
  Mail, 
  MapPin,
  Loader2,
  Scissors,
  AlertCircle
} from 'lucide-react';

import styles from './App.module.css';

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

const ContactSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Коротке ім\'я').required('Введіть ім\'я'),
  phone: Yup.string().matches(/^[0-9+\-\s()]+$/, 'Невірний телефон').required('Введіть телефон'),
  service: Yup.string().required('Оберіть послугу')
});

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClass = styles.button;
  const variantClass = variant === 'primary' ? styles.buttonPrimary : styles.buttonOutline;
  
  return (
    <motion.button 
      whileTap={{ scale: 0.95 }} 
      className={`${baseClass} ${variantClass} ${className}`} 
      {...props}
    >
      {children}
    </motion.button>
  );
};

const CustomInput = ({ field, form, label, placeholder, type = "text", options = null }) => {
  const isError = form.errors[field.name] && form.touched[field.name];
  const inputClasses = `${styles.input} ${isError ? styles.inputError : ''}`;

  return (
    <div className={styles.formGroup}>
      <label className={styles.label}>{label}</label>
      
      {options ? (
        <select {...field} className={inputClasses}>
          <option value="">Оберіть послугу</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : (
        <input 
          {...field} 
          type={type} 
          className={inputClasses} 
          placeholder={placeholder} 
        />
      )}
      
      <ErrorMessage name={field.name} component="div" className={styles.errorMessage} />
    </div>
  );
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
        <Loader2 className="w-12 h-12 animate-spin" style={{ color: '#fb7185' }} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorBox}>
          <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{ color: '#ef4444' }} />
          <h2 className="text-xl font-bold mb-2">Помилка</h2>
          <p className="text-stone-600 mb-4" style={{ color: '#57534e' }}>{error || "Дані відсутні"}</p>
          <Button onClick={() => window.location.reload()}>Спробувати ще</Button>
        </div>
      </div>
    );
  }

  const { profile, services, portfolio, process } = data;

  const serviceOptions = services.map(s => ({
    value: s.title,
    label: s.title
  }));

  const Logo = () => (
    <div className={styles.logoWrapper}>
      <Sparkles className={styles.logoIcon} />
      <span>{profile.name}</span>
    </div>
  );

  return (
    <div className={styles.app}>
      <nav className={isScrolled ? `${styles.nav} ${styles.navScrolled}` : styles.nav}>
        <div className={styles.navContainer}>
          
          <a href="#" className={styles.logoLink} onClick={(e) => scrollToSection(e, '#')}>
            <Logo />
          </a>
          
          <div className={styles.navLinksDesktop}>
        
          {["Послуги", "Мої роботи"].map((item) => {
          
            const href = item === "Послуги" ? "#services" : "#portfolio";
            
            return (
              <a 
                key={item} 
                href={href} 
                className={styles.navLink} 
                onClick={(e) => scrollToSection(e, href)}
              >
                {item}
              </a>
            );
          })}

          <Button 
            variant="primary" 
            className="px-6 py-3 text-sm" 
            onClick={(e) => scrollToSection(e, '#contact')}
          >
            Записатися онлайн
          </Button>
        </div>

        </div>
      </nav>

      <main>
        <section id="hero" className={styles.heroSection}>
          <div className={styles.heroBgGradient} />
          <div className={styles.heroGrid}>
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <h1 className={`${styles.heroTitle} ${styles.fontSerif}`}>
                Естетика ваших <br/>
                <span className={styles.heroAccent}>нігтів</span>
              </h1>
              <p className={styles.heroDesc}>
                Створюю ідеальний манікюр, який підкреслює вашу індивідуальність.
              </p>
              <div className={styles.heroButtons}>
                <Button onClick={(e) => scrollToSection(e, '#contact')}>Записатися онлайн</Button>
                <Button variant="outline" onClick={(e) => scrollToSection(e, '#portfolio')}>Мої роботи</Button>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className={styles.heroImageWrapper}>
                 <img src="https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&q=80&w=800" alt="Hero" className={styles.heroImg} />
            </motion.div>
          </div>
        </section>

        <section id="services" className={`${styles.section} ${styles.sectionBgPink}`}>
          <div className={styles.container}>
            <SectionTitle subtitle="Ціни" title="Мої послуги" />
            <div className={styles.servicesGrid}>
              {services.map((service) => (
                <motion.div key={service.id} whileHover={{ y: -10 }} className={styles.serviceCard}>
                  <div className={styles.serviceIconBox}>
                    {service.id === 1 ? <Sparkles size={32} /> : service.id === 2 ? <Scissors size={32} /> : <Star size={32} />}
                  </div>
                  <h3 className={styles.serviceTitle}>{service.title}</h3>
                  <p className={styles.serviceDesc}>{service.description}</p>
                  <div className={styles.servicePriceBox}>
                    <span className={styles.servicePrice}>{service.price}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="portfolio" className={`${styles.section} ${styles.sectionBgWhite}`}>
          <div className={styles.container}>
            <SectionTitle subtitle="Галерея" title="Мої роботи" />
            <div className={styles.portfolioGrid}>
              {portfolio.map((src, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className={styles.portfolioItem}>
                  <img src={src} alt={`Work ${index + 1}`} className={styles.portfolioImg} />
                </motion.div>
              ))}
            </div>
            <div className={styles.portfolioMore}>
              <Button variant="outline" onClick={() => window.open(profile.instagram, '_blank')}>
                Більше робіт в Instagram 
              </Button>
            </div>
          </div>
        </section>

        <section id="process" className={`${styles.section} ${styles.sectionBgPink}`}>
          <div className={styles.container}>
            <SectionTitle subtitle="Етапи" title="Як я працюю" />
            <div className={styles.processGrid}>
              {process.map((step, index) => (
                <div key={index} className={styles.processStep}>
                  <div className={styles.stepHeader}>
                    <div className={styles.processStepNum}>{index + 1}</div>
                    
                    {index !== process.length - 1 && (
                      <div className={styles.processLineConnector} />
                    )}
                  </div>
                  
                  <h3 className={styles.processStepTitle}>{step.step}</h3>
                  <p className={styles.processStepDesc}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className={`${styles.section} ${styles.sectionBgWhite}`}>
          <div className={styles.container}>
            <div className={styles.contactCard}>
              <div className={styles.contactInfoSide}>
                <div className="relative z-10">
                  <h3 className={`${styles.contactTitle} ${styles.fontSerif}`}>Зв'язатися</h3>
                  <p className={styles.contactDesc}>Запишіться на процедуру зручним для вас способом.</p>
                  <div className={styles.contactDetails}>
                    <div className={styles.contactItem}><Phone className="w-6 h-6" /><span>{profile.phone}</span></div>
                    <div className={styles.contactItem}><Mail className="w-6 h-6" /><span>{profile.email}</span></div>
                    <div className={styles.contactItem}><MapPin className="w-6 h-6" /><span>{profile.address}</span></div>
                  </div>
                </div>
                <div className={styles.contactBlob} />
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
                  {(formikProps) => (
                    <Form className="space-y-8">
                      <CustomInput 
                        field={formikProps.getFieldProps('name')} 
                        form={formikProps}
                        label="Ваше ім'я" 
                        placeholder="Ольга" 
                      />
                      
                      <CustomInput 
                        field={formikProps.getFieldProps('phone')} 
                        form={formikProps}
                        label="Телефон" 
                        placeholder="+380..." 
                      />
                      
                      <CustomInput 
                        field={formikProps.getFieldProps('service')} 
                        form={formikProps}
                        label="Послуга" 
                        options={serviceOptions}
                      />

                      <Button type="submit" className={styles.submitButton} disabled={formikProps.isSubmitting}>
                        {formikProps.isSubmitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Надсилання...</> : 'Записатися'}
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
          <div className={styles.footerCopy}>
            © {new Date().getFullYear()} Всі права захищено
          </div>
        </div>
      </footer>
    </div>
  );
}