import { Helmet } from '@dr.pogodin/react-helmet';
import {
  Activity,
  ArrowRight,
  Award,
  Bot,
  Brain,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  Download,
  FileText,
  Globe,
  HelpCircle,
  Instagram,
  Laptop,
  Lock,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  User,
  Users2,
  Zap,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CourseImage from '../components/CourseImage';
import { site } from '../config/site';
import { cn } from '../lib/utils';

// --- Components ---

const Hero = () => {
  return (
    <section className="relative pt-40 pb-32 overflow-hidden min-h-screen flex items-center">
      {/* Background */}
      <div className="absolute inset-0 z-[-1] bg-brand-dark">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-brand-accent/10 blur-[120px] rounded-full opacity-50" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-brand-dark to-transparent" />
        <div className="absolute inset-0 grid-overlay opacity-50 z-0" />
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-start text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold tracking-[0.2em] text-brand-accent mb-8 uppercase">
            <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
            Instituto de Formação em Desenvolvimento Humano
          </div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-[80px] font-medium tracking-tighter mb-8 leading-[0.9] text-white">
            Domine as Ferramentas que <br />
            <span className="text-white/70 italic font-light">Reprogramam</span> Vidas.
          </h1>

          <p className="text-lg md:text-xl text-brand-platinum max-w-xl mb-12 leading-relaxed font-light">
            O Instituto Bruno Sena desmistifica a Hipnoterapia, PNL e Coaching. Método
            estruturado, linguagem simples, resultados reais. Seja você terapeuta, coach,
            empresário, estudante ou simplesmente alguém em busca de autodomínio.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
            <a href="#cursos" className="btn-primary w-full sm:w-auto">
              Quero dominar minha mente <ArrowRight size={16} />
            </a>
            <a href="#cursos" className="btn-outline w-full sm:w-auto">
              Ver cursos disponíveis
            </a>
          </div>
        </motion.div>

        <div className="relative h-[450px] sm:h-[500px] lg:h-[600px] w-full max-w-[500px] lg:max-w-none mx-auto mt-12 lg:mt-0 flex items-end justify-center">
          {/* Bruno Sena Portrait with Gradient and Glow */}
          <div className="absolute inset-0 bg-brand-accent/20 blur-[100px] rounded-full pointer-events-none" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="relative w-[85%] sm:w-[400px] h-[90%] z-20"
          >
            {/* Elemento LCP da home: carrega com prioridade alta e tem
                dimensões declaradas para não deslocar o layout. */}
            <img
              src="/brunosena.webp"
              alt="Bruno Sena, fundador do Instituto"
              width={900}
              height={1206}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover object-top drop-shadow-[0_0_30px_rgba(229,195,101,0.3)]"
              style={{
                WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
              }}
            />
          </motion.div>

          {/* Secondary Course Card */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute bottom-4 lg:bottom-20 left-0 w-[80%] sm:w-[300px] bg-brand-dark/80 backdrop-blur-xl border border-white/10 rounded-[24px] p-3 sm:p-4 shadow-2xl z-30"
          >
            <div className="flex gap-3 sm:gap-4 items-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center">
                <CourseImage
                  src={undefined}
                  alt="Hipnoterapia Clínica"
                  title="Hipnose"
                  className="rounded-2xl"
                  accentClassName="from-brand-purple/40 to-brand-purple/10"
                />
              </div>
              <div>
                <p className="text-[8px] sm:text-[10px] text-brand-accent font-bold uppercase tracking-wider mb-1">
                  Módulo Prático
                </p>
                <p className="text-xs sm:text-sm font-bold text-white leading-tight">
                  Hipnoterapia Clínica
                </p>
              </div>
            </div>
          </motion.div>

          {/* Certificate Badge */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-4 left-4 sm:top-0 sm:left-10 bg-gradient-to-br from-brand-accent to-[#B8860B] rounded-2xl p-3 sm:p-4 shadow-[0_0_30px_rgba(229,195,101,0.3)] z-40 flex items-center gap-2 sm:gap-3"
          >
            <Award className="text-brand-dark" size={24} />
            <div>
              <p className="text-brand-dark font-bold text-[10px] sm:text-xs uppercase tracking-wider">
                Válido para uso
              </p>
              <p className="text-brand-dark/80 text-[8px] sm:text-[10px] font-medium uppercase">
                Profissional ou Pessoal
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const TrustBadges = () => {
  const badges = [
    {
      value: '+2.500',
      label: 'Mentes Reprogramadas',
      desc: 'De estudantes a executivos, de terapeutas a donas de casa',
      icon: <Users2 size={24} />,
    },
    {
      value: 'Metodologia',
      label: 'Testada e Validada',
      desc: 'Estrutura que funciona tanto na clínica quanto na vida real',
      icon: <Brain size={24} />,
    },
    {
      value: 'Certificação',
      label: 'Reconhecida Nacionalmente',
      desc: 'Valida seu aprendizado, seja para carreira ou autoconhecimento',
      icon: <Award size={24} />,
    },
    {
      value: 'Acesso Vitalício',
      label: 'Evolução Contínua',
      desc: 'Aprenda no seu ritmo, revise quando quiser',
      icon: <Clock size={24} />,
    },
  ];

  return (
    <section className="py-20 bg-brand-dark relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {badges.map((badge, i) => (
            <div
              key={i}
              className="relative p-8 bg-white/5 border border-white/10 rounded-3xl hover:border-brand-accent/30 transition-all group"
            >
              <div className="text-brand-accent mb-4">{badge.icon}</div>
              <h3 className="text-3xl font-display font-bold mb-2 text-white">{badge.value}</h3>
              <p className="text-brand-accent font-bold text-sm uppercase tracking-wider mb-2">
                {badge.label}
              </p>
              <p className="text-brand-platinum/70 text-sm leading-relaxed">{badge.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Audiences = () => {
  return (
    <section className="py-20 bg-brand-surface border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-blue/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <p className="text-brand-blue font-bold text-xs uppercase tracking-widest mb-3">
            Duas Trilhas, O Mesmo Resultado
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6">
            Para quem é o Instituto Bruno Sena?
          </h2>
          <p className="text-brand-platinum max-w-2xl mx-auto text-lg">
            Nossas formações são desenhadas tanto para quem busca uma transformação de vida,
            quanto para quem deseja construir uma carreira altamente lucrativa e com propósito.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card: Desenvolvimento Pessoal */}
          <div className="bg-brand-dark border border-brand-accent/20 rounded-[32px] p-10 md:p-12 relative overflow-hidden group hover:border-brand-accent/40 transition-all shadow-[0_0_40px_rgba(229,195,101,0.05)]">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <User size={120} className="text-brand-accent" />
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-3 bg-brand-accent/10 border border-brand-accent/30 text-brand-accent px-4 py-2 rounded-full font-bold text-sm uppercase tracking-wider mb-8">
                <User size={18} />
                Para Você
              </div>
              <h3 className="text-3xl font-display font-bold text-white mb-4">
                Desenvolvimento
                <br />
                Pessoal
              </h3>
              <p className="text-brand-platinum/90 leading-relaxed mb-8">
                Quebre ciclos de autossabotagem, elimine crenças limitantes e assuma o controle
                da sua mente e das suas emoções. Uma jornada profunda de cura para construir a
                vida e os relacionamentos que você merece.
              </p>
              <ul className="space-y-4">
                {[
                  'Desbloqueie seu potencial oculto',
                  'Vença a ansiedade e a procrastinação',
                  'Melhore seus relacionamentos pessoais',
                  'Tenha mais foco, disciplina e inteligência emocional',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="text-brand-accent shrink-0 mt-1" size={20} />
                    <span className="text-white">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Card: Carreira Profissional */}
          <div className="bg-brand-dark border border-brand-blue/20 rounded-[32px] p-10 md:p-12 relative overflow-hidden group hover:border-brand-blue/40 transition-all shadow-[0_0_40px_rgba(92,156,250,0.05)]">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Briefcase size={120} className="text-brand-blue" />
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-3 bg-brand-blue/10 border border-brand-blue/30 text-brand-blue px-4 py-2 rounded-full font-bold text-sm uppercase tracking-wider mb-8">
                <Briefcase size={18} />
                Para Profissionais
              </div>
              <h3 className="text-3xl font-display font-bold text-white mb-4">
                Carreira &<br />
                Negócios
              </h3>
              <p className="text-brand-platinum/90 leading-relaxed mb-8">
                Construa uma carreira altamente lucrativa como Terapeuta ou Coach. Aprenda
                ferramentas avançadas de transformação humana para aplicar em seus pacientes,
                clientes ou equipe corporativa.
              </p>
              <ul className="space-y-4">
                {[
                  'Certificação reconhecida nacionalmente',
                  'Nova fonte de renda ajudando pessoas',
                  'Ferramentas para terapeutas e psicólogos',
                  'Comunicação persuasiva e liderança para líderes',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="text-brand-blue shrink-0 mt-1" size={20} />
                    <span className="text-white">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const SenaSimulator = () => {
  return (
    <section
      id="sena"
      className="py-24 bg-brand-dark relative overflow-hidden border-t border-brand-accent/10"
    >
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-accent/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-blue/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1">
            <div className="inline-flex items-center gap-3 bg-brand-accent/10 border border-brand-accent/30 text-brand-accent px-4 py-2 rounded-full font-bold text-sm uppercase tracking-wider mb-6">
              <Bot size={18} />
              Tecnologia Exclusiva
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              S.E.N.A. — Nosso Simulador{' '}
              <span className="text-brand-accent">Clínico com IA</span>
            </h2>
            <p className="text-brand-platinum text-lg leading-relaxed mb-8">
              O <strong>Sistema Evolutivo de Neuroaprendizagem Aplicada</strong> é o diferencial
              definitivo do Instituto. Você não vai apenas assistir aulas; você vai atender{' '}
              <strong>pacientes virtuais realistas</strong> e receber avaliação linha a linha
              por uma Inteligência Artificial treinada com a nossa metodologia.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              {[
                {
                  icon: <MessageSquare size={24} />,
                  title: 'Simulação Bidirecional',
                  desc: 'Atenda pacientes com voz ou texto em tempo real.',
                },
                {
                  icon: <Activity size={24} />,
                  title: '8 Perfis Clínicos',
                  desc: 'Lide com pacientes ansiosos, céticos, evitativos e mais.',
                },
                {
                  icon: <FileText size={24} />,
                  title: 'Prontuário Automático',
                  desc: 'IA gera o relatório de evolução após cada sessão.',
                },
                {
                  icon: <Trophy size={24} />,
                  title: 'Certificação Real',
                  desc: 'O certificado é emitido com base em competência, não presença.',
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="flex flex-col bg-brand-surface border border-white/5 p-6 rounded-2xl hover:border-brand-accent/30 transition-all"
                >
                  <div className="text-brand-accent mb-4 bg-brand-accent/10 w-12 h-12 flex items-center justify-center rounded-xl">
                    {feature.icon}
                  </div>
                  <h4 className="text-white font-bold mb-2">{feature.title}</h4>
                  <p className="text-brand-platinum/70 text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 relative w-full">
            <div className="relative aspect-[4/3] rounded-[32px] overflow-hidden border border-brand-accent/20 bg-brand-surface shadow-[0_0_50px_rgba(229,195,101,0.15)]">
              {/* Mockup da interface do método SENA */}
              <div className="absolute inset-0 p-6 flex flex-col">
                <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-accent/20 flex items-center justify-center">
                      <Bot size={20} className="text-brand-accent" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">Paciente Virtual</p>
                      <p className="text-brand-accent text-xs">Perfil: Cético</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-brand-emerald/50" />
                    <div className="w-3 h-3 rounded-full bg-brand-accent/50" />
                    <div className="w-3 h-3 rounded-full bg-brand-purple/50" />
                  </div>
                </div>

                <div className="flex-1 flex flex-col gap-4 overflow-hidden relative">
                  <div className="bg-white/5 border border-white/5 rounded-xl p-4 w-4/5 self-start">
                    <p className="text-brand-platinum/90 text-sm">
                      Sinceramente, não sei se isso vai funcionar. Já tentei de tudo e essas
                      técnicas parecem muito teóricas...
                    </p>
                  </div>
                  <div className="bg-brand-accent/10 border border-brand-accent/20 rounded-xl p-4 w-4/5 self-end">
                    <p className="text-white text-sm">
                      Entendo perfeitamente o seu ceticismo. Que tal testarmos algo prático
                      agora mesmo para que você possa tirar suas próprias conclusões?
                    </p>
                  </div>
                  <div className="absolute bottom-2 right-4 bg-brand-emerald/20 text-brand-emerald border border-brand-emerald/30 px-3 py-1 text-xs rounded-full font-bold flex items-center gap-1 backdrop-blur-md shadow-lg">
                    <CheckCircle2 size={12} /> Rapport Estabelecido
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 bg-brand-dark border border-brand-accent/30 p-5 rounded-2xl shadow-2xl backdrop-blur-md hidden md:block">
              <div className="flex items-center gap-3">
                <Laptop className="text-brand-accent" size={32} />
                <div>
                  <p className="text-white font-bold">+10.000</p>
                  <p className="text-brand-platinum/70 text-xs">Sessões Simuladas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Courses = () => {
  const courses = [
    {
      id: 'pnl',
      title: 'PNL Practitioner',
      subtitle: 'O básico que ninguém domina direito',
      desc: 'Para quem é: Quem quer entender como a mente funciona e como reprogramar padrões limitantes, em si mesmo ou nos outros.\n\nO que domina: Comunicação inconsciente, ancoragem emocional, reformulação de crenças, técnicas de intervenção rápida.',
      price: 'R$ 297,00',
      installments: '12x de R$ 29,82',
      icon: <Brain className="text-brand-blue" size={32} />,
      img: undefined,
      coverGradient: 'from-brand-blue/30 to-brand-dark',
      kiwify: 'https://pay.kiwify.com.br/DkL4e3J',
      link: '/pnl-practitioner',
      popular: true,
      colorText: 'text-brand-blue',
      colorBg: 'bg-brand-blue',
      colorBorderHover: 'hover:border-brand-blue/50',
    },
    {
      id: 'master',
      title: 'Master PNL',
      subtitle: 'Aprofundamento para quem quer excelência',
      desc: 'Para quem é: Quem já conhece PNL ou quer ir além das técnicas básicas. Para profissionais que cobram (ou querem cobrar) por resultados.\n\nO que domina: Modelagem avançada, intervenções complexas, estruturação de sessões profissionais, PNL aplicada a contextos específicos.',
      price: 'R$ 997,00',
      installments: '12x de R$ 100,10',
      icon: <Target className="text-brand-accent" size={32} />,
      img: undefined,
      coverGradient: 'from-brand-accent/30 to-brand-dark',
      kiwify: 'https://pay.kiwify.com.br/T8wW0tA',
      link: '/master-pnl',
      advanced: true,
      colorText: 'text-brand-accent',
      colorBg: 'bg-brand-accent',
      colorBorderHover: 'hover:border-brand-accent/50',
    },
    {
      id: 'hipno',
      title: 'Hipnoterapia Clínica',
      subtitle: 'Acesso direto ao inconsciente',
      desc: 'Para quem é: Terapeutas que querem adicionar hipnose à caixa de ferramentas. Pessoas que querem autodomínio profundo. Coaches que precisam de resultados rápidos.\n\nO que domina: Induções, profundização de transe, protocolos terapêuticos, regressão, hipnose ericksoniana, aplicações práticas.',
      price: 'R$ 397,00',
      installments: '12x de R$ 39,86',
      icon: <Sparkles className="text-brand-purple" size={32} />,
      img: undefined,
      coverGradient: 'from-brand-purple/30 to-brand-dark',
      kiwify: 'https://pay.kiwify.com.br/A5i1o7D',
      link: '/hipnoterapia',
      colorText: 'text-brand-purple',
      colorBg: 'bg-brand-purple',
      colorBorderHover: 'hover:border-brand-purple/50',
    },
    {
      id: 'master-coach',
      title: 'Master Coach',
      subtitle: 'Eleve seus atendimentos ao nível de excelência',
      desc: 'Para quem é: Coaches que desejam se destacar no mercado com ferramentas avançadas e resultados extraordinários.\n\nO que domina: Ferramentas sistêmicas, coaching executivo, liderança, estruturação de negócios de coaching.',
      price: 'Em breve',
      installments: 'Em breve',
      icon: <Target className="text-brand-emerald" size={32} />,
      img: undefined,
      coverGradient: 'from-brand-emerald/30 to-brand-dark',
      kiwify: '#',
      link: '/master-coach',
      comingSoon: true,
      colorText: 'text-brand-emerald',
      colorBg: 'bg-brand-emerald',
      colorBorderHover: 'hover:border-brand-emerald/50',
    },
  ];

  return (
    <section id="cursos" className="py-20 bg-brand-dark relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <p className="text-brand-accent font-bold text-xs uppercase tracking-widest mb-3">
              Nossas Formações
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
              Escolha sua ferramenta de transformação
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {courses.map((course, idx) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`group bg-white/5 border ${course.advanced ? 'border-brand-accent/40 shadow-[0_0_30px_rgba(229,195,101,0.1)]' : 'border-white/10'} rounded-[24px] overflow-hidden ${course.colorBorderHover} transition-all flex flex-col max-w-[380px] mx-auto w-full relative`}
            >
              {course.popular && (
                <div
                  className={`absolute top-0 right-0 ${course.colorBg} text-brand-dark text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-bl-xl z-20`}
                >
                  Mais Popular
                </div>
              )}
              {course.advanced && (
                <div className="absolute -inset-0.5 bg-gradient-to-br from-brand-accent/20 to-transparent rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              )}
              <div className="relative aspect-video overflow-hidden">
                <CourseImage
                  src={course.img}
                  alt={`Capa da formação ${course.title}`}
                  title={course.title}
                  accentClassName={course.coverGradient}
                  imgClassName="transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 p-2.5 bg-brand-dark/80 backdrop-blur-md rounded-xl border border-white/10">
                  {React.cloneElement(course.icon as React.ReactElement<{ size?: number }>, {
                    size: 24,
                  })}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                  <p
                    className={`${course.colorText} text-[10px] font-bold uppercase tracking-wider mb-2`}
                  >
                    {course.subtitle}
                  </p>
                  <h3 className="text-xl font-bold mb-3 text-white">{course.title}</h3>
                  <div className="text-brand-platinum text-xs leading-relaxed space-y-2">
                    {course.desc.split('\n\n').map((paragraph, i) => (
                      <p key={i}>
                        <strong className="text-white">{paragraph.split(': ')[0]}:</strong>{' '}
                        {paragraph.split(': ')[1]}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-white/10">
                  <div className="flex items-baseline gap-2 mb-1">
                    {course.comingSoon ? (
                      <span className={`text-2xl font-bold ${course.colorText}`}>Em Breve</span>
                    ) : (
                      <>
                        <span className="text-2xl font-bold text-white">
                          {course.installments}
                        </span>
                        <span className="text-[10px] text-brand-platinum">
                          ou {course.price} à vista
                        </span>
                      </>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {course.comingSoon ? (
                      <Link
                        to={course.link}
                        className="col-span-2 py-3 bg-white/5 border border-white/10 hover:border-white/20 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider text-brand-platinum"
                      >
                        Lista de Espera
                      </Link>
                    ) : (
                      <>
                        <a
                          href={course.kiwify}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-3 bg-brand-accent text-brand-dark rounded-xl font-bold transition-all flex items-center justify-center gap-2 hover:opacity-90 text-xs uppercase tracking-wider"
                        >
                          Matricular
                        </a>
                        {course.link ? (
                          <Link
                            to={course.link}
                            className="py-3 bg-white/5 border border-white/10 hover:border-white/20 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
                          >
                            Detalhes
                          </Link>
                        ) : (
                          <button
                            type="button"
                            className="py-3 bg-white/5 border border-white/10 hover:border-white/20 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
                          >
                            Detalhes
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 bg-brand-accent/10 border border-brand-accent/30 rounded-[32px] p-8 md:p-12 text-center max-w-4xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-brand-accent text-brand-dark text-xs font-bold px-4 py-2 rounded-bl-xl">
            OFERTA ESPECIAL
          </div>
          <Award className="text-brand-accent mx-auto mb-6" size={48} />
          <h3 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Trilogia IBSDH: A Jornada Completa
          </h3>
          <p className="text-brand-platinum/80 text-lg mb-8 max-w-2xl mx-auto">
            Practitioner + Master + Hipnoterapia. Domine todas as ferramentas de transformação e
            torne-se um Reprogramador de Elite com um desconto exclusivo.
          </p>
          <Link
            to="/jornada"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-accent text-brand-dark rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_30px_rgba(242,125,38,0.3)]"
          >
            Ver Pacote Trilogia
            <ArrowRight size={20} />
          </Link>
        </div>

        <div className="mt-12 bg-brand-accent/10 border border-brand-accent/20 rounded-2xl p-6 md:p-8 text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="text-brand-accent" size={24} />
            <h3 className="text-xl font-bold text-white">Dúvida de qual escolher?</h3>
          </div>
          <p className="text-brand-platinum leading-relaxed">
            Comece pelo <strong className="text-white">PNL Practitioner</strong>. É a base que
            torna todo o resto mais fácil. Muitos alunos fazem os três — e usam cada um para
            áreas diferentes da vida.
          </p>
        </div>
      </div>
    </section>
  );
};

const ComoFunciona = () => {
  const steps = [
    {
      title: 'Escolha sua ferramenta',
      desc: 'PNL, Hipnoterapia ou ambos. Comece pelo que faz mais sentido para seu objetivo atual.',
    },
    {
      title: 'Aprenda no seu ritmo',
      desc: 'Aulas gravadas, acesso vitalício. Estude quando e onde quiser.',
    },
    {
      title: 'Pratique com segurança',
      desc: 'Exercícios guiados, demonstrações reais, grupo de suporte para tirar dúvidas.',
    },
    {
      title: 'Aplique e transforme',
      desc: 'Use para si, para outros, ou para construir uma nova carreira. Você decide.',
    },
  ];

  return (
    <section className="py-20 bg-brand-surface relative overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 bg-brand-blue/5 blur-[100px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <p className="text-brand-blue font-bold text-xs uppercase tracking-widest mb-3">
            Como Funciona
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
            Sua jornada de transformação
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Connector Line for Desktop */}
          <div className="hidden md:block absolute top-16 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-brand-blue/30 to-transparent z-0" />

          {steps.map((step, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-brand-dark border-2 border-brand-blue/30 text-brand-blue flex items-center justify-center font-display text-2xl font-bold mb-6 group-hover:border-brand-blue group-hover:bg-brand-blue/10 transition-all shadow-[0_0_20px_rgba(92,156,250,0.1)]">
                {i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 -right-4 w-8 h-8 text-brand-blue/50">
                  <ArrowRight size={24} />
                </div>
              )}
              <h3 className="text-xl font-bold mb-3 text-white">{step.title}</h3>
              <p className="text-brand-platinum/80 text-sm leading-relaxed max-w-[250px]">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const WhyUs = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-brand-dark">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-accent/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <p className="text-brand-accent font-bold text-xs uppercase tracking-widest mb-3">
            Nosso Diferencial
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white">
            O que nos torna diferentes de qualquer curso de PNL ou Hipnose do mercado
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bento Box 1 */}
          <div className="md:col-span-2 bg-brand-surface border border-brand-muted/20 rounded-[32px] p-10 relative overflow-hidden group hover:border-brand-purple/40 transition-all">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/10 blur-[60px] rounded-full group-hover:bg-brand-purple/20 transition-colors" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-brand-purple/10 rounded-2xl flex items-center justify-center mb-6 border border-brand-purple/20">
                <Target className="text-brand-purple" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">1. Método A.P.L.I.C.A.R.</h3>
              <p className="text-brand-platinum/80 text-lg leading-relaxed mb-4 italic">
                Teoria sem prática é entretenimento. Prática sem método é acidente.
              </p>
              <p className="text-brand-platinum/80 text-lg leading-relaxed">
                Nosso sistema estrutura o aprendizado em 7 etapas progressivas. Você não apenas
                assiste , você <strong className="text-white">faz</strong>,{' '}
                <strong className="text-white">erra</strong>,{' '}
                <strong className="text-white">corrige</strong> e{' '}
                <strong className="text-white">domina</strong>. Desde a primeira aula.
              </p>
            </div>
          </div>

          {/* Bento Box 2 */}
          <div className="bg-brand-surface border border-brand-muted/20 rounded-[32px] p-10 relative overflow-hidden group hover:border-brand-blue/40 transition-all">
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-blue/10 blur-[50px] rounded-full group-hover:bg-brand-blue/20 transition-colors" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-brand-blue/10 rounded-2xl flex items-center justify-center mb-6 border border-brand-blue/20">
                <Globe className="text-brand-blue" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">2. Linguagem Universal</h3>
              <p className="text-brand-platinum/80 text-lg leading-relaxed mb-4 italic">
                Descomplicamos o que é complexo, sem perder a profundidade.
              </p>
              <p className="text-brand-platinum/80 text-lg leading-relaxed">
                Não importa se você nunca estudou psicologia ou se já atua na área. Nosso método
                traduz conceitos avançados em passos acionáveis.{' '}
                <strong className="text-white">
                  Terapeuta ou curioso, você entende e aplica.
                </strong>
              </p>
            </div>
          </div>

          {/* Bento Box 3 */}
          <div className="md:col-span-3 bg-brand-surface border border-brand-muted/20 rounded-[32px] p-10 relative overflow-hidden group hover:border-brand-accent/30 transition-all">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brand-accent/5 blur-[80px] rounded-full group-hover:bg-brand-accent/10 transition-colors" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1">
                <div className="w-14 h-14 bg-brand-accent/10 rounded-2xl flex items-center justify-center mb-6 border border-brand-accent/20">
                  <Award className="text-brand-accent" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">3. Certificação Oficial</h3>
                <p className="text-brand-platinum/80 text-lg leading-relaxed mb-4 italic">
                  Use para si. Use para outros. Ou os dois.
                </p>
                <p className="text-brand-platinum/80 text-lg leading-relaxed">
                  Cada formação entrega certificado válido para:
                </p>
                <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <li className="flex items-center gap-2 text-brand-platinum/80">
                    <CheckCircle2 className="text-brand-accent shrink-0" size={18} /> Prática
                    clínica profissional
                  </li>
                  <li className="flex items-center gap-2 text-brand-platinum/80">
                    <CheckCircle2 className="text-brand-accent shrink-0" size={18} />{' '}
                    Desenvolvimento pessoal e relacionamentos
                  </li>
                  <li className="flex items-center gap-2 text-brand-platinum/80">
                    <CheckCircle2 className="text-brand-accent shrink-0" size={18} /> Aplicação
                    em negócios, vendas e liderança
                  </li>
                  <li className="flex items-center gap-2 text-brand-platinum/80">
                    <CheckCircle2 className="text-brand-accent shrink-0" size={18} />{' '}
                    Autoconhecimento profundo
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const CertificatesSection = () => {
  return (
    <section className="py-24 bg-brand-dark border-t border-brand-muted/10 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-brand-accent/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-accent/10 text-brand-accent mb-6 border border-brand-accent/20">
            <Award size={32} />
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
            Veja seus Certificados
          </h2>
          <p className="text-xl text-brand-platinum/80 max-w-3xl mx-auto leading-relaxed">
            Nossas titulações são documentos oficiais, chancelados por instituições renomadas e
            que atestam a sua capacidade técnica e prática.
          </p>
        </div>

        <div className="flex flex-col gap-16 md:gap-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1 relative group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-accent/20 to-brand-blue/20 blur-[80px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative z-10 p-2 rounded-[36px] bg-gradient-to-br from-white/10 to-transparent border border-white/10 backdrop-blur-sm transition-transform duration-700 group-hover:scale-[1.02] group-hover:-rotate-1">
                <CourseImage
                  src={undefined}
                  alt="Certificado Internacional NLPEA"
                  title="Certificado Internacional NLPEA"
                  className="aspect-[4/3] rounded-[32px] shadow-2xl"
                  accentClassName="from-brand-blue/30 to-brand-dark"
                />
                <div className="absolute inset-0 rounded-[32px] ring-1 ring-inset ring-white/10 pointer-events-none" />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-block px-4 py-1.5 bg-brand-blue/10 border border-brand-blue/20 rounded-full text-brand-blue text-sm font-bold tracking-wider uppercase mb-6">
                Reconhecimento Global
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Certificação Internacional NLPEA
              </h3>
              <p className="text-brand-platinum/80 text-lg leading-relaxed mb-8">
                Reconhecimento vitalício emitido pela{' '}
                <strong className="text-white">
                  Neuro Linguistic Programming Excellence Assurance
                </strong>
                , com sede no Reino Unido. Seu passaporte global como profissional qualificado
                em PNL.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-4 text-brand-platinum bg-white/5 p-4 rounded-2xl border border-white/5">
                  <CheckCircle2 className="text-brand-blue shrink-0" size={24} />
                  <span className="font-medium">
                    Válido internacionalmente em qualquer país
                  </span>
                </li>
                <li className="flex items-center gap-4 text-brand-platinum bg-white/5 p-4 rounded-2xl border border-white/5">
                  <CheckCircle2 className="text-brand-blue shrink-0" size={24} />
                  <span className="font-medium">
                    Registro único e vitalício na instituição britânica
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <div className="inline-block px-4 py-1.5 bg-brand-accent/10 border border-brand-accent/20 rounded-full text-brand-accent text-sm font-bold tracking-wider uppercase mb-6">
                Selo de Excelência
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Certificação Oficial IBSDH
              </h3>
              <p className="text-brand-platinum/80 text-lg leading-relaxed mb-8">
                Certificado nacional com chancela do{' '}
                <strong className="text-white">
                  Instituto Bruno Sena de Desenvolvimento Humano
                </strong>
                . Emitido com rigor apenas após avaliação de performance prática e aprovação no
                exame.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-4 text-brand-platinum bg-white/5 p-4 rounded-2xl border border-white/5">
                  <CheckCircle2 className="text-brand-accent shrink-0" size={24} />
                  <span className="font-medium">
                    Atesta competência clínica, técnica e ética
                  </span>
                </li>
                <li className="flex items-center gap-4 text-brand-platinum bg-white/5 p-4 rounded-2xl border border-white/5">
                  <CheckCircle2 className="text-brand-accent shrink-0" size={24} />
                  <span className="font-medium">
                    Permite atuação profissional imediata no Brasil
                  </span>
                </li>
              </ul>
            </div>
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-tl from-brand-accent/20 to-brand-emerald/20 blur-[80px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative z-10 p-2 rounded-[36px] bg-gradient-to-bl from-white/10 to-transparent border border-white/10 backdrop-blur-sm transition-transform duration-700 group-hover:scale-[1.02] group-hover:rotate-1">
                <img
                  src="/Certificado-IBSDH.webp"
                  alt="Certificado IBSDH"
                  className="w-full h-auto object-contain rounded-[32px] shadow-2xl"
                  loading="lazy"
                />
                <div className="absolute inset-0 rounded-[32px] ring-1 ring-inset ring-white/10 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const SecuritySection = () => {
  return (
    <section className="py-16 bg-brand-dark border-y border-brand-emerald/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-brand-emerald/5 blur-[100px] rounded-full -z-10" />
      <div className="max-w-5xl mx-auto px-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-emerald/10 text-brand-emerald mb-6 border border-brand-emerald/20">
          <Lock size={32} />
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">
          Pagamento 100% Seguro
        </h2>
        <p className="text-brand-platinum max-w-2xl mx-auto mb-10 leading-relaxed">
          Seu investimento está protegido. Todos os pagamentos são processados pela{' '}
          <strong className="text-white">{site.paymentPlatform}</strong>, plataforma
          especializada em cursos online. Os dados do seu cartão são tratados no ambiente seguro
          dela — nós não os recebemos nem armazenamos.
        </p>

        {/* Formas de pagamento. Antes eram 6 imagens buscadas de
            cdn.simpleicons.org e do Wikimedia — hotlink de terceiros que
            podia sumir a qualquer momento e ainda adicionava 6 conexões
            externas ao carregamento. Agora é texto, servido pelo próprio site. */}
        <ul className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
          {[
            site.paymentPlatform,
            'Pix',
            'Visa',
            'Mastercard',
            'Elo',
            'American Express',
            'Boleto',
          ].map((meio) => (
            <li
              key={meio}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-brand-platinum"
            >
              {meio}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Ana Silva',
      role: 'Psicóloga Clínica',
      initial: 'AS',
      text: 'A formação em Master PNL transformou completamente a minha abordagem clínica. Hoje consigo acessar a raiz dos problemas dos meus pacientes de forma muito mais rápida e profunda.',
    },
    {
      id: 2,
      name: 'Carlos Mendes',
      role: 'Empresário',
      initial: 'CM',
      text: 'O curso me deu ferramentas práticas para liderar minha equipe com mais empatia e assertividade. Os resultados na empresa foram imediatos após aplicar as técnicas de ancoragem.',
    },
    {
      id: 3,
      name: 'Juliana Costa',
      role: 'Coach de Carreira',
      initial: 'JC',
      text: 'Fiz a formação em Hipnoterapia e foi um divisor de águas. A didática do Instituto Bruno Sena é excepcional, e o suporte pós-curso faz toda a diferença na nossa segurança profissional.',
    },
    {
      id: 4,
      name: 'Roberto Almeida',
      role: 'Terapeuta Holístico',
      initial: 'RA',
      text: 'A Jornada do Herói me ajudou a ressignificar traumas que eu nem sabia que estavam me travando. É uma experiência intensa e profundamente curadora.',
    },
    {
      id: 5,
      name: 'Mariana Souza',
      role: 'Professora',
      initial: 'MS',
      text: 'Sempre tive muito medo de falar em público. Com as técnicas de PNL Practitioner, consegui superar esse bloqueio e hoje dou palestras para centenas de pessoas com tranquilidade.',
    },
    {
      id: 6,
      name: 'Fernando Dias',
      role: 'Gestor Comercial',
      initial: 'FD',
      text: 'O método A.P.L.I.C.A.R mudou o jogo para mim. Não é só teoria vazia. Consegui dobrar os resultados do meu time de vendas usando as estratégias de comunicação e rapport avançado que aprendi aqui.',
    },
  ];

  return (
    <section
      id="depoimentos"
      className="py-24 bg-brand-surface relative overflow-hidden border-t border-brand-blue/10"
    >
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-blue/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <p className="text-brand-blue font-bold text-xs uppercase tracking-widest mb-3">
            Prova Social Universal
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6">
            O que acontece quando você aplica o método
          </h2>
          <p className="text-brand-platinum max-w-2xl mx-auto text-lg">
            Resultados reais de alunos que aplicaram as técnicas de PNL e Hipnoterapia em suas
            vidas e profissões.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-brand-surface border border-brand-muted/20 rounded-3xl p-8 hover:border-brand-blue/30 transition-all flex flex-col h-full shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:-translate-y-1"
            >
              <div className="flex gap-1 mb-6 text-brand-blue">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-brand-platinum/90 text-lg leading-relaxed flex-grow mb-8 italic">
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold font-display border border-brand-blue/20">
                  {testimonial.initial}
                </div>
                <div>
                  <h4 className="text-white font-bold">{testimonial.name}</h4>
                  <p className="text-brand-blue/80 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Ebooks = () => {
  const ebooks = [
    {
      title: 'O Despertar da Mente: Introdução à Reprogramação Mental',
      price: 'R$ 27',
      img: '/mockuppnl.webp',
    },
    {
      title: 'Hipnose no Dia a Dia: Técnicas que Você Pode Usar Hoje',
      price: 'R$ 27',
      img: '/mockuphip.webp',
    },
  ];

  return (
    <section
      id="ebooks"
      className="py-20 bg-brand-surface relative overflow-hidden border-t border-brand-purple/10"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-purple/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <p className="text-brand-purple font-bold text-xs uppercase tracking-widest mb-3">
            Entrada Acessível
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-white">
            Comece com um investimento mínimo
          </h2>
          <p className="text-brand-platinum text-base max-w-2xl mx-auto">
            Quer conhecer nossa didática antes de se comprometer com uma formação completa?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {ebooks.map((ebook, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-brand-dark border border-brand-purple/20 rounded-[24px] p-6 hover:border-brand-purple/40 transition-all flex flex-col sm:flex-row gap-6 items-center shadow-[0_4px_30px_rgba(0,0,0,0.2)]"
            >
              <div className="w-40 sm:w-48 h-auto shrink-0 flex items-center justify-center">
                <img
                  loading="lazy"
                  decoding="async"
                  src={ebook.img}
                  className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-2xl"
                  alt={ebook.title}
                />
              </div>
              <div className="flex flex-col flex-grow text-center sm:text-left">
                <h3 className="text-lg font-bold mb-4 leading-tight text-white">
                  {ebook.title}
                </h3>
                <p className="text-brand-purple font-bold text-2xl mb-6">{ebook.price}</p>
                <button
                  type="button"
                  className="w-full py-3 bg-brand-purple/10 text-brand-purple border border-brand-purple/20 hover:bg-brand-purple hover:text-white rounded-lg font-bold transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider mt-auto"
                >
                  <Download size={16} /> Baixar agora
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <div className="inline-block bg-brand-purple/10 border border-brand-purple/30 rounded-full px-8 py-4 shadow-[0_0_20px_rgba(182,127,241,0.1)]">
            <p className="text-white font-bold text-lg">
              Ou leve os dois por <span className="text-brand-purple">R$ 47</span> e economize
              R$ 10
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const Mentor = () => {
  return (
    <section id="sobre-mentor" className="py-24 bg-brand-dark relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Mobile Title (Visible only on mobile) */}
        <div className="block lg:hidden mb-10 text-center sm:text-left">
          <p className="text-brand-accent font-bold text-xs uppercase tracking-widest mb-4">
            O Seu Mentor
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight">
            "O método é o protagonista. Eu sou apenas o arquiteto."
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative order-1 lg:order-1"
          >
            <div className="rounded-[24px] overflow-hidden border border-white/10 shadow-2xl max-w-lg mx-auto lg:mx-0">
              <img
                loading="lazy"
                decoding="async"
                src="/brunosena.webp"
                className="w-full h-auto object-contain"
                alt="Bruno Sena"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-2 lg:order-2"
          >
            {/* Desktop Title (Visible only on desktop) */}
            <div className="hidden lg:block">
              <p className="text-brand-accent font-bold text-xs uppercase tracking-widest mb-4">
                O Seu Mentor
              </p>
              <h2 className="font-display text-4xl lg:text-5xl font-bold mb-6 text-white leading-tight">
                "O método é o protagonista. Eu sou apenas o arquiteto."
              </h2>
            </div>

            <div className="space-y-6 text-sm md:text-base text-brand-platinum leading-relaxed mb-10">
              <p>
                Não sou o terapeuta com 30 anos de clínica. Não sou um guru de palco lotado.
              </p>
              <p className="text-xl text-white font-bold">Sou obcecado por método.</p>
              <p>
                Passei os últimos anos desmontando as técnicas dos melhores profissionais em
                PNL, Hipnoterapia e Coaching do Brasil. Testei, falhei, refinei, sistematizei. O
                resultado é um método que funciona tanto para o terapeuta que quer cobrar R$500
                por sessão, quanto para a pessoa que simplesmente quer parar de sabotar a
                própria vida.
              </p>
              <p>
                Não vendo transformação mágica. Entrego{' '}
                <strong className="text-white">ferramentas reproduzíveis</strong>.
              </p>
              <div className="border-l-2 border-brand-accent pl-6 py-2 my-8">
                <p className="text-white/80 italic text-sm md:text-base">
                  "Se você quer charlatanismo, existem milhares de 'gurus' por aí. Se quer
                  estrutura que gera resultado, você está no lugar certo."
                </p>
              </div>

              <div className="mt-12 p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col sm:flex-row items-center gap-6">
                <div className="w-32 sm:w-40 shrink-0">
                  <CourseImage
                    src={undefined}
                    alt="NLPEA Lifetime Member"
                    title="NLPEA"
                    className="aspect-square rounded-2xl"
                    accentClassName="from-brand-blue/30 to-brand-dark"
                  />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg mb-2">Membro Oficial NLPEA</h4>
                  <p className="text-sm text-brand-platinum leading-relaxed">
                    Reconhecimento internacional pela{' '}
                    <strong className="text-white">
                      Neuro Linguistic Programming Excellence Assurance
                    </strong>{' '}
                    (NLPEA). Uma certificação vitalícia que atesta não apenas o conhecimento
                    teórico, mas a capacidade prática e ética na aplicação e ensino da
                    Programação Neurolinguística em nível global.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex justify-center lg:justify-start">
                <a
                  href="https://www.instagram.com/brunosenaoficial/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F56040] text-white font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
                >
                  <Instagram size={20} />
                  Siga-me no Instagram
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqs = [
    {
      q: 'Preciso ser da área da saúde ou ter formação prévia?',
      a: 'Não. Nossos alunos vão desde psicólogos até donos de pequenos negócios, de coaches a pessoas em transição de carreira. O método foi construído para ser acessível a qualquer pessoa com disposição para praticar.',
    },
    {
      q: 'Posso usar para atender outras pessoas profissionalmente?',
      a: 'Sim. Todos os cursos entregam certificado válido para prática profissional. Porém, verifique a legislação específica da sua região. Algumas práticas podem exigir regulamentação adicional dependendo do estado.',
    },
    {
      q: 'E se eu quiser usar só para mim, para autoconhecimento?',
      a: 'Perfeito. Muitos alunos fazem exatamente isso. As técnicas de reprogramação mental funcionam independentemente de quem está aplicando, em você ou em outros.',
    },
    {
      q: 'Os cursos são gravados ou ao vivo?',
      a: '100% gravados, com acesso vitalício. Você estuda no seu ritmo. Mas oferecemos encontros mensais ao vivo para tirar dúvidas — opcionais e gravados para quem não pode participar.',
    },
    {
      q: 'Tem garantia?',
      a: '7 dias de garantia incondicional. Acesse o conteúdo, teste o método. Se não fizer sentido para você, devolvemos 100%.',
    },
    {
      q: 'Qual a diferença entre PNL Practitioner e Master PNL?',
      a: 'O Practitioner é a base completa. Tudo que você precisa para usar PNL com competência. O Master aprofunda técnicas avançadas, modelagem estratégica e estruturação de sessões profissionais de alto nível. Comece pelo Practitioner.',
    },
  ];

  return (
    <section className="py-20 bg-white/5">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-brand-accent font-bold text-xs uppercase tracking-widest mb-3">
            Dúvidas Frequentes
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
            Perguntas Comuns
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-white/10 rounded-2xl overflow-hidden bg-white/5"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <span className="font-bold text-white">{faq.q}</span>
                <ChevronRight
                  className={cn(
                    'transition-transform text-brand-accent',
                    openIndex === i ? 'rotate-90' : '',
                  )}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-6 text-brand-platinum text-sm leading-relaxed"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const WhatsAppContact = () => {
  const message = encodeURIComponent(
    'Olá! Gostaria de saber mais sobre as formações do Instituto Bruno Sena e como posso garantir minha vaga.',
  );
  const whatsappUrl = `https://wa.me/5511987355750?text=${message}`;

  return (
    <section id="contato" className="py-20 bg-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <p className="text-brand-accent font-bold text-xs uppercase tracking-widest mb-3">
          Fale com Especialistas
        </p>
        <h2 className="font-display text-3xl md:text-5xl font-bold mb-6 text-white">
          Eleve o seu nível profissional
        </h2>
        <p className="text-base text-brand-platinum mb-10 max-w-2xl mx-auto leading-relaxed">
          Dúvidas sobre qual formação é a ideal para o seu momento? Nossa equipe está pronta
          para guiar seus próximos passos.
        </p>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-10 py-5 bg-[#25D366] text-white rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-[0_0_30px_rgba(37,211,102,0.3)]"
        >
          <HelpCircle size={24} /> Falar com Consultor no WhatsApp
        </a>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-accent/5 blur-[120px] rounded-full -z-10" />
    </section>
  );
};

// --- Main App ---

const Partners = () => {
  const partners = [
    { name: 'Segurança da Saúde', icon: <ShieldCheck size={24} /> },
    { name: 'Global Tech', icon: <Globe size={24} /> },
    { name: 'Institutos Financeiros', icon: <CreditCard size={24} /> },
    { name: 'Clínicas Integradas', icon: <Zap size={24} /> },
    { name: 'Segurança da Saúde', icon: <ShieldCheck size={24} /> },
    { name: 'Global Tech', icon: <Globe size={24} /> },
    { name: 'Institutos Financeiros', icon: <CreditCard size={24} /> },
    { name: 'Clínicas Integradas', icon: <Zap size={24} /> },
  ];

  return (
    <section className="py-20 bg-brand-dark border-b border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <p className="text-center text-brand-platinum/60 text-xs font-bold uppercase tracking-[0.3em]">
          Metodologia aplicada por profissionais em instituições como:
        </p>
      </div>

      <div className="relative flex overflow-x-hidden group">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-brand-dark to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-brand-dark to-transparent z-10" />

        <div className="flex space-x-16 animate-marquee whitespace-nowrap items-center opacity-60 group-hover:opacity-100 transition-opacity duration-500">
          {partners.map((partner, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                {React.cloneElement(
                  partner.icon as React.ReactElement<{ className?: string }>,
                  { className: 'text-brand-accent' },
                )}
              </div>
              <span className="font-display font-bold text-2xl tracking-tighter text-white">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CorporateSolutions = () => {
  return (
    <section
      id="in-company"
      className="py-24 bg-brand-dark border-t border-white/5 relative overflow-hidden"
    >
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-brand-emerald/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-3 bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald px-4 py-2 rounded-full font-bold text-sm uppercase tracking-wider mb-6">
              <Building2 size={18} />
              In Company
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Treinamentos Corporativos de{' '}
              <span className="text-brand-emerald">Alto Impacto</span>
            </h2>
            <p className="text-brand-platinum text-lg leading-relaxed mb-8">
              A mesma metodologia que transforma vidas, agora formatada para resolver os maiores
              desafios da sua empresa. Aumente o engajamento, desenvolva líderes excepcionais e
              crie uma cultura de alta performance focada em resultados e inteligência
              emocional.
            </p>

            <ul className="space-y-6 mb-10">
              {[
                {
                  title: 'Liderança Humanizada',
                  desc: 'Ferramentas de Coaching e PNL para gestão de equipes.',
                },
                {
                  title: 'Comunicação Assertiva',
                  desc: 'Resolução de conflitos e negociação avançada.',
                },
                {
                  title: 'Inteligência Emocional',
                  desc: 'Controle de estresse e aumento de produtividade sob pressão.',
                },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                    <CheckCircle2 className="text-brand-emerald" size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">{item.title}</h4>
                    <p className="text-brand-platinum/70">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            <a
              href="https://wa.me/5511987355750?text=Ol%C3%A1%21%20Gostaria%20de%20saber%20mais%20sobre%20os%20Treinamentos%20Corporativos%20(In%20Company)."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-brand-emerald/10 border border-brand-emerald/30 text-brand-emerald px-8 py-4 rounded-xl font-bold hover:bg-brand-emerald hover:text-brand-dark transition-all"
            >
              Solicitar Proposta para minha Empresa
              <ArrowRight size={20} />
            </a>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-[40px] overflow-hidden border border-white/10 relative">
              <CourseImage
                src={undefined}
                alt="Treinamento corporativo in company"
                title="Treinamentos In Company"
                accentClassName="from-brand-emerald/30 to-brand-dark"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent opacity-80" />
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-8 -left-8 bg-brand-surface border border-brand-emerald/20 p-6 rounded-3xl shadow-2xl backdrop-blur-md hidden md:block">
              <div className="flex items-center gap-4 mb-2">
                <div className="flex -space-x-3" aria-hidden="true">
                  {['A', 'M', 'R', 'S'].map((inicial) => (
                    <div
                      key={inicial}
                      className="w-10 h-10 rounded-full bg-brand-emerald/20 border-2 border-brand-surface flex items-center justify-center font-bold text-brand-emerald text-sm"
                    >
                      {inicial}
                    </div>
                  ))}
                </div>
                <div className="text-brand-emerald font-bold text-xl">+50</div>
              </div>
              <p className="text-white font-medium text-sm">Empresas Transformadas</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function App() {
  return (
    <div className="min-h-screen selection:bg-brand-accent selection:text-brand-dark">
      <Helmet>
        <link rel="canonical" href="https://institutobrunosena.com.br/" />
        <title>Instituto Bruno Sena | Formações em PNL, Hipnoterapia e Coaching</title>
        <meta
          name="description"
          content="Transforme sua vida e carreira com as melhores formações em PNL, Hipnoterapia e Master Coach. Aprenda com especialistas e alcance a excelência."
        />
        <meta
          name="keywords"
          content="instituto de PNL, curso de desenvolvimento humano, PNL, Hipnose, Coaching, Master Coach, Hipnoterapia"
        />
        <meta
          property="og:title"
          content="Instituto Bruno Sena | Formações em PNL, Hipnose e Coaching"
        />
        <meta
          property="og:description"
          content="Transforme sua vida e carreira com as melhores formações em PNL, Hipnoterapia e Master Coach."
        />
        <meta property="og:image" content="https://institutobrunosena.com.br/brunosena.webp" />
        <meta property="og:url" content="https://institutobrunosena.com.br" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <main>
        <Hero />
        <Partners />
        <TrustBadges />
        <Audiences />
        <WhyUs />
        <CertificatesSection />
        <ComoFunciona />
        <SenaSimulator />
        <Courses />
        <SecuritySection />
        <Testimonials />
        <CorporateSolutions />
        <Ebooks />
        <Mentor />
        <FAQ />
        <WhatsAppContact />
        <section className="py-24 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-brand-accent/5 blur-[100px] rounded-full -z-10" />
          <div className="max-w-5xl mx-auto bg-gradient-to-br from-brand-secondary/40 to-brand-accent/5 border border-white/10 rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
            <h2 className="font-display text-4xl md:text-6xl font-bold mb-6 text-white">
              Pronto para sua transformação?
            </h2>
            <p className="text-lg md:text-xl text-brand-platinum mb-10 max-w-2xl mx-auto">
              Comece hoje mesmo sua jornada no desenvolvimento humano com as melhores
              ferramentas do mercado.
            </p>
            <a
              href="#cursos"
              className="btn-primary inline-flex items-center gap-2 text-lg px-10 py-5"
            >
              Quero começar agora <ArrowRight size={20} />
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
