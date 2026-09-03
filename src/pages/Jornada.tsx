import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { Link } from 'react-router-dom';
import { CourseReviews } from '../components/CourseReviews';
import { 
  ArrowLeft,
  Brain, 
  CheckCircle2, 
  Award, 
  Target,
  Sparkles,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  Star,
  ArrowRight
} from 'lucide-react';

const Jornada = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-brand-dark text-brand-platinum font-sans selection:bg-brand-accent selection:text-brand-dark" style={{ '--color-brand-accent': '#F9814D' } as React.CSSProperties}>
      <Helmet>
        <title>Jornada do Herói | Instituto SENA</title>
        <meta name="description" content="Descubra o seu propósito e transforme sua vida com a Jornada do Herói. Um treinamento imersivo de autoconhecimento e desenvolvimento pessoal." />
        <meta name="keywords" content="formação completa PNL hipnoterapia, trilogia desenvolvimento humano, Jornada do Herói, Autoconhecimento, Desenvolvimento Pessoal, Instituto SENA" />
        <meta property="og:title" content="Jornada do Herói | Instituto SENA" />
        <meta property="og:description" content="Descubra o seu propósito e transforme sua vida com a Jornada do Herói." />
        <meta property="og:image" content="https://institutobrunosena.com.br/mockuppnl.png" />
        <meta property="og:url" content="https://institutobrunosena.com.br/jornada" />
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
            <img src="/logo-do-instituto.svg" alt="Instituto Bruno Sena" className="w-8 h-8 object-contain"  />
            <div className="flex flex-col">
              <span className="font-display font-bold text-sm leading-none tracking-tight text-white">INSTITUTO</span>
              <span className="font-display font-light text-[10px] tracking-[0.2em] text-brand-accent">BRUNO SENA</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-accent/20 rounded-full blur-[120px] -z-10 opacity-50" />
        
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-brand-accent/30 text-brand-accent text-sm font-medium mb-8">
            <Award size={16} />
            <span>Escada de Valor IBSDH</span>
          </div>
          
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
            Escolha Seu Nível de Domínio
          </h1>
          
          <p className="text-xl md:text-2xl text-brand-platinum/90 mb-8 leading-relaxed font-light">
            Da base à maestria. Cada degrau constrói o próximo.
          </p>
          
          <p className="text-lg text-brand-platinum/70 mb-12 max-w-3xl mx-auto">
            Practitioner → Combo → Trilogia. SENA em todos. Certificação por competência. Acesso vitalício.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
            <a href="#niveis" className="group relative inline-flex items-center justify-center gap-3 bg-brand-accent text-brand-dark px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(242,125,38,0.4)]">
              Ver os Níveis
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* Os Níveis (Cards comparativos) */}
      <section id="niveis" className="py-24 bg-white/5 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-16 text-center">Os Níveis de Domínio</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* NÍVEL 1: PRACTITIONER */}
            <div className="bg-brand-dark p-8 rounded-[32px] border border-white/10 flex flex-col h-full relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-brand-dark border border-white/20 rounded-full flex items-center justify-center text-xl">🥉</div>
              <h3 className="text-xl font-bold text-white mb-2">Nível 1: Practitioner</h3>
              <p className="text-brand-platinum/60 text-sm mb-6">A Base</p>
              
              <div className="mb-6">
                <div className="text-3xl font-bold text-white mb-1">R$ 297</div>
                <div className="text-brand-platinum/60 text-sm">ou 12x R$ 25</div>
              </div>
              
              <div className="mb-6 flex-1">
                <p className="font-bold text-white mb-3 text-sm">O que inclui:</p>
                <ul className="space-y-2 text-sm text-brand-platinum/80 mb-6">
                  <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-brand-accent shrink-0 mt-0.5" /> 44 aulas de PNL fundamentos</li>
                  <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-brand-accent shrink-0 mt-0.5" /> SENA básico (5 perfis)</li>
                  <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-brand-accent shrink-0 mt-0.5" /> Certificado (nota 7/10)</li>
                </ul>
                
                <p className="text-sm text-brand-platinum/80 mb-4">
                  <strong className="text-white">Para quem:</strong> Nunca estudou PNL ou tem conhecimento fragmentado.
                </p>
                <p className="text-sm text-brand-platinum/80">
                  <strong className="text-white">Resultado:</strong> Competência em reprogramação mental. Sessões de R$100-250.
                </p>
              </div>
              
              <a href="https://pay.kiwify.com.br/DkL4e3J" target="_blank" rel="noopener noreferrer" className="w-full block text-center py-4 rounded-full border border-white/20 text-white font-bold hover:bg-white/5 transition-colors">
                Começar aqui
              </a>
            </div>

            {/* NÍVEL 2A: TERAPIA BREVE */}
            <div className="bg-brand-dark p-8 rounded-[32px] border border-white/10 flex flex-col h-full relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-brand-dark border border-white/20 rounded-full flex items-center justify-center text-xl">🥈</div>
              <h3 className="text-xl font-bold text-white mb-2">Nível 2A: Terapia Breve</h3>
              <p className="text-brand-platinum/60 text-sm mb-6">P+H</p>
              
              <div className="mb-6">
                <div className="text-brand-platinum/40 line-through text-sm mb-1">R$ 694</div>
                <div className="text-3xl font-bold text-white mb-1">R$ 597</div>
                <div className="text-brand-platinum/60 text-sm mb-2">ou 12x R$ 50</div>
                <div className="inline-block px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-bold">Economia de R$ 97</div>
              </div>
              
              <div className="mb-6 flex-1">
                <p className="font-bold text-white mb-3 text-sm">O que inclui:</p>
                <ul className="space-y-2 text-sm text-brand-platinum/80 mb-6">
                  <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-brand-accent shrink-0 mt-0.5" /> Tudo do Practitioner</li>
                  <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-brand-accent shrink-0 mt-0.5" /> Hipnoterapia Clínica completa</li>
                  <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-brand-accent shrink-0 mt-0.5" /> SENA + SENA Hipno</li>
                  <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-brand-accent shrink-0 mt-0.5" /> Dois certificados</li>
                </ul>
                
                <p className="text-sm text-brand-platinum/80 mb-4">
                  <strong className="text-white">Para quem:</strong> Quer atender rápido, resultado imediato, não precisa de modelagem estratégica.
                </p>
                <p className="text-sm text-brand-platinum/80">
                  <strong className="text-white">Resultado:</strong> Terapia breve eficaz. Sessões de R$150-350.
                </p>
              </div>
              
              <a href="https://pay.kiwify.com.br/A5i1o7D" target="_blank" rel="noopener noreferrer" className="w-full block text-center py-4 rounded-full border border-white/20 text-white font-bold hover:bg-white/5 transition-colors">
                Quero resultado rápido
              </a>
            </div>

            {/* NÍVEL 2B: PNL COMPLETO */}
            <div className="bg-brand-dark p-8 rounded-[32px] border border-brand-accent/50 shadow-[0_0_30px_rgba(242,125,38,0.15)] flex flex-col h-full relative transform md:-translate-y-4">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-brand-dark border border-brand-accent/50 rounded-full flex items-center justify-center text-xl">🥇</div>
              <div className="absolute -top-4 right-4 bg-brand-accent text-brand-dark text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Star size={12} fill="currentColor" /> POPULAR
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">Combo A: PNL Completo</h3>
              <p className="text-brand-platinum/60 text-sm mb-6">P+M</p>
              
              <div className="mb-6">
                <div className="text-brand-platinum/40 line-through text-sm mb-1">R$ 1.294</div>
                <div className="text-3xl font-bold text-brand-accent mb-1">R$ 1.097</div>
                <div className="text-brand-platinum/60 text-sm mb-2">ou 12x R$ 91</div>
                <div className="inline-block px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-bold">Economia de R$ 197</div>
              </div>
              
              <div className="mb-6 flex-1">
                <p className="font-bold text-white mb-3 text-sm">O que inclui:</p>
                <ul className="space-y-2 text-sm text-brand-platinum/80 mb-6">
                  <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-brand-accent shrink-0 mt-0.5" /> Tudo do Practitioner</li>
                  <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-brand-accent shrink-0 mt-0.5" /> Master PNL completo (48 aulas)</li>
                  <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-brand-accent shrink-0 mt-0.5" /> SENA básico + SENA Avançado</li>
                  <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-brand-accent shrink-0 mt-0.5" /> Dois certificados (7/10 e 8/10)</li>
                </ul>
                
                <p className="text-sm text-brand-platinum/80 mb-4">
                  <strong className="text-white">Para quem:</strong> Quer excelência em PNL, do técnico ao estrategista. Não quer hipnose agora.
                </p>
                <p className="text-sm text-brand-platinum/80">
                  <strong className="text-white">Resultado:</strong> Referência em PNL. Sessões de R$300-600+.
                </p>
              </div>
              
              <a href="https://pay.kiwify.com.br/T8wW0tA" target="_blank" rel="noopener noreferrer" className="w-full block text-center py-4 rounded-full bg-brand-accent text-brand-dark font-bold hover:scale-105 transition-transform">
                Quero dominar PNL
              </a>
            </div>

            {/* NÍVEL 3: TRILOGIA PREMIUM */}
            <div className="bg-gradient-to-b from-brand-dark to-brand-accent/10 p-8 rounded-[32px] border border-brand-accent/30 flex flex-col h-full relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-brand-dark border border-brand-accent/30 rounded-full flex items-center justify-center text-xl">💎</div>
              <h3 className="text-xl font-bold text-white mb-2">Trilogia Premium</h3>
              <p className="text-brand-platinum/60 text-sm mb-6">P+M+H</p>
              
              <div className="mb-6">
                <div className="text-brand-platinum/40 line-through text-sm mb-1">R$ 1.691</div>
                <div className="text-3xl font-bold text-white mb-1">R$ 1.353</div>
                <div className="text-brand-platinum/60 text-sm mb-2">ou 12x R$ 113</div>
                <div className="inline-block px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-bold">Economia de R$ 338 (20% off)</div>
              </div>
              
              <div className="mb-6 flex-1">
                <p className="font-bold text-white mb-3 text-sm">O que inclui:</p>
                <ul className="space-y-2 text-sm text-brand-platinum/80 mb-6">
                  <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-brand-accent shrink-0 mt-0.5" /> Tudo. Practitioner + Master + Hipnoterapia</li>
                  <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-brand-accent shrink-0 mt-0.5" /> 3 certificados</li>
                  <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-brand-accent shrink-0 mt-0.5" /> SENA básico + Avançado + Hipno</li>
                  <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-brand-accent shrink-0 mt-0.5" /> <strong className="text-white">Bônus:</strong> Mentoria 6m + E-book + Selo Elite</li>
                </ul>
                
                <p className="text-sm text-brand-platinum/80 mb-4">
                  <strong className="text-white">Para quem:</strong> Quer carreira séria, referência de mercado, domínio total da transformação mental.
                </p>
                <p className="text-sm text-brand-platinum/80">
                  <strong className="text-white">Resultado:</strong> Bilíngue da transformação. Sessões de R$400-800+. Formação de outros profissionais.
                </p>
              </div>
              
              <a href="https://pay.kiwify.com.br/9y9r0kY" target="_blank" rel="noopener noreferrer" className="w-full block text-center py-4 rounded-full border border-brand-accent text-brand-accent font-bold hover:bg-brand-accent/10 transition-colors">
                Quero a jornada completa
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Comparativo Visual */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">Comparativo Visual</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px] bg-brand-dark rounded-[32px] overflow-hidden border border-white/10">
              <thead>
                <tr className="border-b border-white/10 bg-black/20">
                  <th className="p-6 w-1/5"></th>
                  <th className="p-6 w-1/5 border-l border-white/10">
                    <div className="text-lg font-bold text-white mb-1">Practitioner</div>
                  </th>
                  <th className="p-6 w-1/5 border-l border-white/10">
                    <div className="text-lg font-bold text-white mb-1">Combo B (P+H)</div>
                  </th>
                  <th className="p-6 w-1/5 border-l border-white/10 bg-brand-accent/5">
                    <div className="text-lg font-bold text-brand-accent mb-1 flex items-center gap-2">Combo A (P+M) <Star size={14} fill="currentColor" /></div>
                  </th>
                  <th className="p-6 w-1/5 border-l border-white/10 bg-gradient-to-b from-brand-accent/10 to-transparent">
                    <div className="text-lg font-bold text-white mb-1">Trilogia</div>
                  </th>
                </tr>
              </thead>
              <tbody className="text-brand-platinum">
                <tr className="border-b border-white/5">
                  <td className="p-6 font-medium text-white">Preço</td>
                  <td className="p-6 border-l border-white/10 font-bold">R$ 297</td>
                  <td className="p-6 border-l border-white/10 font-bold">R$ 597</td>
                  <td className="p-6 border-l border-white/10 bg-brand-accent/5 font-bold text-brand-accent">R$ 1.097</td>
                  <td className="p-6 border-l border-white/10 bg-gradient-to-b from-brand-accent/5 to-transparent font-bold">R$ 1.353</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-6 font-medium text-white">Economia</td>
                  <td className="p-6 border-l border-white/10 text-brand-platinum/50">—</td>
                  <td className="p-6 border-l border-white/10 text-green-400 font-medium">R$ 97</td>
                  <td className="p-6 border-l border-white/10 bg-brand-accent/5 text-green-400 font-medium">R$ 197</td>
                  <td className="p-6 border-l border-white/10 bg-gradient-to-b from-brand-accent/5 to-transparent text-green-400 font-medium">R$ 338</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-6 font-medium text-white">Horas</td>
                  <td className="p-6 border-l border-white/10">100h</td>
                  <td className="p-6 border-l border-white/10">200h</td>
                  <td className="p-6 border-l border-white/10 bg-brand-accent/5">220h</td>
                  <td className="p-6 border-l border-white/10 bg-gradient-to-b from-brand-accent/5 to-transparent">320h</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-6 font-medium text-white">SENAs</td>
                  <td className="p-6 border-l border-white/10">1</td>
                  <td className="p-6 border-l border-white/10">2</td>
                  <td className="p-6 border-l border-white/10 bg-brand-accent/5">2</td>
                  <td className="p-6 border-l border-white/10 bg-gradient-to-b from-brand-accent/5 to-transparent">3</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-6 font-medium text-white">Certificados</td>
                  <td className="p-6 border-l border-white/10">1</td>
                  <td className="p-6 border-l border-white/10">2</td>
                  <td className="p-6 border-l border-white/10 bg-brand-accent/5">2</td>
                  <td className="p-6 border-l border-white/10 bg-gradient-to-b from-brand-accent/5 to-transparent">3</td>
                </tr>
                <tr>
                  <td className="p-6 font-medium text-white">Nível final</td>
                  <td className="p-6 border-l border-white/10">Competente</td>
                  <td className="p-6 border-l border-white/10">Terapeuta breve</td>
                  <td className="p-6 border-l border-white/10 bg-brand-accent/5 font-medium text-brand-accent">Estrategista PNL</td>
                  <td className="p-6 border-l border-white/10 bg-gradient-to-b from-brand-accent/5 to-transparent font-bold text-white">Referência de mercado</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Recomendação do Instituto */}
      <section className="py-24 bg-white/5 border-y border-white/10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">Recomendação do Instituto</h2>
            <p className="text-brand-platinum text-lg">Qual é o seu momento atual?</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-brand-dark p-8 rounded-3xl border border-white/10">
              <h3 className="text-xl font-bold text-white mb-2">Iniciante?</h3>
              <div className="flex items-center gap-2 text-brand-accent font-medium mb-4">
                <ArrowRight size={16} /> Practitioner (R$ 297)
              </div>
            </div>
            
            <div className="bg-brand-dark p-8 rounded-3xl border border-white/10">
              <h3 className="text-xl font-bold text-white mb-2">Já atende, quer resultado rápido?</h3>
              <div className="flex items-center gap-2 text-brand-accent font-medium mb-4">
                <ArrowRight size={16} /> Combo B Terapia Breve (R$ 597)
              </div>
            </div>
            
            <div className="bg-brand-dark p-8 rounded-3xl border border-brand-accent/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-brand-accent text-brand-dark text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1">
                <Star size={12} fill="currentColor" /> POPULAR
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Quer excelência em PNL, referência?</h3>
              <div className="flex items-center gap-2 text-brand-accent font-medium mb-4 flex-wrap">
                <ArrowRight size={16} /> Combo A PNL Completo (R$ 1.097)
              </div>
            </div>
            
            <div className="bg-brand-accent/10 p-8 rounded-3xl border border-brand-accent/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-brand-accent text-brand-dark text-xs font-bold px-3 py-1 rounded-bl-lg">
                ELITE
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Quer tudo, carreira máxima?</h3>
              <div className="flex items-center gap-2 text-brand-accent font-medium mb-4">
                <ArrowRight size={16} /> Trilogia Premium (R$ 1.353)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Garantia em todos os níveis */}
      <section className="py-24 bg-brand-accent text-brand-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 mix-blend-overlay" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <ShieldCheck className="mx-auto mb-6" size={64} />
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Garantia em Todos os Níveis
          </h2>
          <p className="text-xl opacity-90 mb-8 font-medium max-w-2xl mx-auto">
            7 dias de garantia incondicional em qualquer nível. Acesse, teste o SENA, decida se é para você. Risco zero.
          </p>
        </div>
      </section>

      {/* FAQ da Escada */}
      <section className="py-24 bg-brand-dark">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">Perguntas Frequentes</h2>
          </div>
          
          <div className="space-y-4">
            {[
              {
                q: "Posso começar pelo Master ou Hipnoterapia sem Practitioner?",
                a: "Avaliação SENA obrigatória. Se sua base de PNL for sólida, pode. Se não for, Practitioner sistematiza."
              },
              {
                q: "Se comprar Practitioner agora, posso upgradar depois?",
                a: "Sim. Você paga apenas a diferença do combo (menos o que já pagou). Ex: comprou P (R$ 297), quer P+M (R$ 1.097), paga R$ 800."
              },
              {
                q: "Combo A (P+M) não inclui hipnose. Perde algo?",
                a: "Não. É escolha estratégica. Master dá profundidade em PNL que Hipnoterapia não dá. Você pode fazer Hipno depois (upgrade)."
              },
              {
                q: "Trilogia vale a pena vs. combos separados?",
                a: "Se quer os três, sim. Economia de R$ 338 + bônus exclusivos. Se só quer PNL, Combo A é melhor. Se só quer terapia breve, Combo B é melhor."
              }
            ].map((faq, i) => (
              <div 
                key={i}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-colors hover:bg-white/10 cursor-pointer"
                onClick={() => toggleFaq(i)}
              >
                <div className="p-6 flex items-center justify-between">
                  <h3 className="font-bold text-white pr-8">{faq.q}</h3>
                  <ChevronDown 
                    className={`text-brand-accent transition-transform shrink-0 ${openFaq === i ? 'rotate-180' : ''}`} 
                    size={20} 
                  />
                </div>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-6 text-brand-platinum/80"
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

      {/* CTAs Finais */}
      <section className="py-24 bg-white/5 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">Qual o seu próximo passo?</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-brand-dark p-8 rounded-[32px] border border-white/10 text-center flex flex-col h-full">
              <h3 className="text-xl font-bold text-white mb-2">Practitioner</h3>
              <div className="text-2xl font-bold text-white mb-8">R$ 297</div>
              <div className="mt-auto">
                <a href="https://pay.kiwify.com.br/DkL4e3J" target="_blank" rel="noopener noreferrer" className="block w-full py-4 rounded-full border border-white/20 text-white font-bold hover:bg-white/5 transition-colors">
                  Começar minha jornada
                </a>
              </div>
            </div>

            <div className="bg-brand-dark p-8 rounded-[32px] border border-white/10 text-center flex flex-col h-full">
              <h3 className="text-xl font-bold text-white mb-2">Combo B (Terapia Breve)</h3>
              <div className="text-2xl font-bold text-white mb-8">R$ 597</div>
              <div className="mt-auto">
                <a href="https://pay.kiwify.com.br/A5i1o7D" target="_blank" rel="noopener noreferrer" className="block w-full py-4 rounded-full border border-white/20 text-white font-bold hover:bg-white/5 transition-colors">
                  Quero resultado rápido
                </a>
              </div>
            </div>

            <div className="bg-brand-dark p-8 rounded-[32px] border border-brand-accent/50 text-center flex flex-col h-full relative">
              <div className="absolute -top-3 right-1/2 translate-x-1/2 bg-brand-accent text-brand-dark text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 whitespace-nowrap">
                <Star size={12} fill="currentColor" /> POPULAR
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Combo A (PNL Completo)</h3>
              <div className="text-2xl font-bold text-brand-accent mb-8">R$ 1.097</div>
              <div className="mt-auto">
                <a href="https://pay.kiwify.com.br/T8wW0tA" target="_blank" rel="noopener noreferrer" className="block w-full py-4 rounded-full bg-brand-accent text-brand-dark font-bold hover:scale-105 transition-transform">
                  Quero excelência em PNL
                </a>
              </div>
            </div>

            <div className="bg-gradient-to-b from-brand-dark to-brand-accent/10 p-8 rounded-[32px] border border-brand-accent/30 text-center flex flex-col h-full">
              <h3 className="text-xl font-bold text-white mb-2">Trilogia Premium</h3>
              <div className="text-2xl font-bold text-white mb-8">R$ 1.353</div>
              <div className="mt-auto">
                <a href="https://pay.kiwify.com.br/9y9r0kY" target="_blank" rel="noopener noreferrer" className="block w-full py-4 rounded-full border border-brand-accent text-brand-accent font-bold hover:bg-brand-accent/10 transition-colors">
                  Quero dominar tudo
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Reviews */}
      <section className="bg-brand-dark border-t border-white/5">
        <CourseReviews courseId="jornada" />
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
            A Programação Neurolinguística (PNL) e a Hipnoterapia são abordagens educacionais e de desenvolvimento pessoal. Não substituem tratamento médico ou psiquiátrico.
          </p>
        </div>
      </footer>
    </div>
  );
};

// Missing ArrowDown icon component
const ArrowDown = ({ className, size }: { className?: string, size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <polyline points="19 12 12 19 5 12"></polyline>
  </svg>
);

export default Jornada;
