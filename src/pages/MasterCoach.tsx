import React from 'react';
import { motion } from 'motion/react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { CourseReviews } from '../components/CourseReviews';
import WaitlistForm from '../components/WaitlistForm';
import { courses } from '../config/courses';
import { 
  Target, 
  Briefcase,
  Users2,
  TrendingUp,
  Clock,
  CheckCircle2
} from 'lucide-react';

const MasterCoach = () => {

  return (
    <div className="min-h-screen bg-brand-dark text-brand-platinum font-sans selection:bg-brand-accent selection:text-brand-dark" style={{ '--color-brand-accent': '#39D4A1' } as React.CSSProperties}>
      <Helmet>
        <link rel="canonical" href="https://institutobrunosena.com.br/master-coach" />
        <title>Formação Master Coach | Instituto Bruno Sena</title>
        <meta name="description" content="Torne-se um Master Coach de excelência. Aprenda ferramentas poderosas de liderança, gestão e desenvolvimento humano para transformar vidas e negócios." />
        <meta name="keywords" content="curso de master coach online, Master Coach, Coaching, Liderança, Desenvolvimento Pessoal, Gestão, Instituto Bruno Sena" />
        <meta property="og:title" content="Formação Master Coach | Instituto Bruno Sena" />
        <meta property="og:description" content="Torne-se um Master Coach de excelência. Aprenda ferramentas poderosas de liderança e gestão." />
        <meta property="og:image" content="https://institutobrunosena.com.br/og-image.png" />
        <meta property="og:url" content="https://institutobrunosena.com.br/master-coach" />
        <meta property="og:type" content="course" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>


      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 px-6 relative overflow-hidden min-h-screen flex flex-col justify-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-accent/20 rounded-full blur-[120px] -z-10 opacity-50" />
        
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-accent/10 border border-brand-accent/30 text-brand-accent text-sm font-medium mb-8"
          >
            <Clock size={16} />
            <span>Lançamento em Breve</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight"
          >
            Formação Master Coach
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-brand-platinum/90 mb-8 leading-relaxed font-light"
          >
            Eleve seus atendimentos ao nível de excelência. Ferramentas sistêmicas, liderança e estruturação de negócios.
          </motion.p>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-brand-platinum/70 mb-12 max-w-3xl mx-auto"
          >
            Estamos preparando a formação mais completa do mercado para coaches que desejam se destacar, lotar suas agendas e gerar resultados extraordinários para seus clientes.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-md mx-auto bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
          >
            <WaitlistForm courseId={courses.masterCoach.slug} />
          </motion.div>
        </div>
      </section>

      {/* O que esperar */}
      <section className="py-24 bg-white/5 border-y border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6">
              O que você vai dominar
            </h2>
            <p className="text-xl text-brand-platinum/80 max-w-2xl mx-auto">
              Uma prévia do arsenal de ferramentas que estará à sua disposição.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Target size={32} />,
                title: "Coaching Executivo",
                desc: "Ferramentas para atuar no mundo corporativo e desenvolver líderes."
              },
              {
                icon: <Users2 size={32} />,
                title: "Abordagem Sistêmica",
                desc: "Entenda as dinâmicas ocultas que travam o sucesso dos seus clientes."
              },
              {
                icon: <Briefcase size={32} />,
                title: "Negócio de Coaching",
                desc: "Como estruturar, precificar e vender seus processos de alto valor."
              },
              {
                icon: <TrendingUp size={32} />,
                title: "Resultados Acelerados",
                desc: "Técnicas de intervenção rápida para gerar mudanças profundas."
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-brand-dark p-8 rounded-3xl border border-white/10 hover:border-brand-accent/30 transition-colors"
              >
                <div className="text-brand-accent mb-6 bg-brand-accent/10 w-16 h-16 rounded-2xl flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-brand-platinum/70 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificação */}
      <section className="py-24 bg-brand-dark border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-accent/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="flex flex-col gap-12 items-center text-center">
            <div className="flex-1 max-w-4xl">
              <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6">A Mais Alta Titulação</h2>
              <p className="text-xl text-brand-platinum/90 mb-8 leading-relaxed">
                Nossa certificação de Coach Profissional é o atestado definitivo da sua capacidade de conduzir processos de transformação profunda com segurança, método e resultados comprovados.
              </p>
              <ul className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-8 mb-8 text-left">
                <li className="flex items-center gap-3 text-brand-platinum">
                  <CheckCircle2 className="text-brand-accent shrink-0" size={20} /> Certificado Válido Nacionalmente
                </li>
                <li className="flex items-center gap-3 text-brand-platinum">
                  <CheckCircle2 className="text-brand-accent shrink-0" size={20} /> Chancelado pelo IBSDH
                </li>
                <li className="flex items-center gap-3 text-brand-platinum">
                  <CheckCircle2 className="text-brand-accent shrink-0" size={20} /> Foco em Resultados Clínicos e Sistêmicos
                </li>
              </ul>
            </div>
            <div className="w-full max-w-5xl relative">
              <div className="absolute inset-0 bg-brand-accent/20 blur-[100px] rounded-full" />
              <img src="/Certificado-IBSDH-coach.webp" alt="Certificado de Coach Profissional" className="w-full h-auto object-contain rounded-[32px] shadow-2xl relative z-10 border border-white/10" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* Course Reviews */}
      <section className="bg-brand-dark border-t border-white/5">
        <CourseReviews courseId="master-coach" />
      </section>

    </div>
  );
};

export default MasterCoach;
