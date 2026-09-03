import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { CourseReviews } from '../components/CourseReviews';
import { 
  ArrowLeft,
  Target, 
  Briefcase,
  Users2,
  TrendingUp,
  Clock,
  MessageCircle,
  CheckCircle2
} from 'lucide-react';

const MasterCoach = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-brand-dark text-brand-platinum font-sans selection:bg-brand-accent selection:text-brand-dark" style={{ '--color-brand-accent': '#39D4A1' } as React.CSSProperties}>
      <Helmet>
        <title>Formação Master Coach | Instituto SENA</title>
        <meta name="description" content="Torne-se um Master Coach de excelência. Aprenda ferramentas poderosas de liderança, gestão e desenvolvimento humano para transformar vidas e negócios." />
        <meta name="keywords" content="curso de master coach online, Master Coach, Coaching, Liderança, Desenvolvimento Pessoal, Gestão, Instituto SENA" />
        <meta property="og:title" content="Formação Master Coach | Instituto SENA" />
        <meta property="og:description" content="Torne-se um Master Coach de excelência. Aprenda ferramentas poderosas de liderança e gestão." />
        <meta property="og:image" content="https://institutobrunosena.com.br/master-coach-capa.png" />
        <meta property="og:url" content="https://institutobrunosena.com.br/master-coach" />
        <meta property="og:type" content="course" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-dark/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white hover:text-brand-accent transition-colors">
            <ArrowLeft size={20} />
            <span className="font-medium">Voltar para Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <img referrerPolicy="no-referrer"  src="/logo-do-instituto.svg" alt="Instituto Bruno Sena" className="w-8 h-8 object-contain"  />
            <div className="flex flex-col">
              <span className="font-display font-bold text-sm leading-none tracking-tight text-white">INSTITUTO</span>
              <span className="font-display font-light text-[10px] tracking-[0.2em] text-brand-accent">BRUNO SENA</span>
            </div>
          </div>
        </div>
      </nav>

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
            <h3 className="text-2xl font-bold text-white mb-4">Entre para a Lista de Espera</h3>
            <p className="text-brand-platinum/70 mb-6 text-sm">
              Seja o primeiro a saber quando abrirmos as vagas e garanta <strong>desconto exclusivo</strong> de lançamento.
            </p>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                alert('Você foi adicionado à lista de espera com sucesso!');
                e.currentTarget.reset();
              }}
              className="flex flex-col gap-3"
            >
              <input 
                type="text" 
                placeholder="Seu nome" 
                required
                className="w-full bg-brand-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-brand-platinum/50 focus:outline-none focus:border-brand-accent transition-colors"
              />
              <input 
                type="email" 
                placeholder="Seu melhor e-mail" 
                required
                className="w-full bg-brand-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-brand-platinum/50 focus:outline-none focus:border-brand-accent transition-colors"
              />
              <button 
                type="submit"
                className="w-full bg-brand-accent text-brand-dark font-bold py-3 px-4 rounded-xl hover:scale-105 transition-all mt-2"
              >
                Quero notificação prioritária
              </button>
            </form>
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
              <img referrerPolicy="no-referrer"  src="/Certificado-IBSDH-coach.webp" alt="Certificado de Coach Profissional" className="w-full h-auto object-contain rounded-[32px] shadow-2xl relative z-10 border border-white/10" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* Course Reviews */}
      <section className="bg-brand-dark border-t border-white/5">
        <CourseReviews courseId="master-coach" />
      </section>

      {/* Footer */}
      <footer className="bg-brand-dark py-12 border-t border-white/10 text-center text-brand-platinum/60 text-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-8 text-xs md:text-sm">
            <a href="mailto:contato@institutobrunosena.com.br" className="hover:text-brand-accent transition-colors">contato@institutobrunosena.com.br</a>
            <a href="mailto:parcerias@institutobrunosena.com.br" className="hover:text-brand-accent transition-colors">parcerias@institutobrunosena.com.br</a>
            <a href="https://wa.me/5511987355750" target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent transition-colors">+55 (11) 98735-5750</a>
            <a href="https://www.instagram.com/brunosenaoficial/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent transition-colors">Instagram</a>
          </div>
          <p className="mb-4">© {new Date().getFullYear()} IBSDH. Todos os direitos reservados.</p>
          <p className="max-w-2xl mx-auto text-xs opacity-50">
            A Programação Neurolinguística (PNL), Coaching e a Hipnoterapia são abordagens educacionais e de desenvolvimento pessoal. Não substituem tratamento médico ou psiquiátrico.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MasterCoach;
