import { Helmet } from '@dr.pogodin/react-helmet';
import {
  Award,
  Brain,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Heart,
  MonitorPlay,
  Play,
  ShieldCheck,
  Users2,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import CourseImage from '../components/CourseImage';
import { CourseReviews } from '../components/CourseReviews';
import SenaExplanation from '../components/SenaExplanation';
import { courses } from '../config/courses';

const PNLPractitioner = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div
      className="min-h-screen bg-brand-dark text-brand-platinum font-sans"
      style={{ '--color-brand-accent': '#5C9CFA' } as React.CSSProperties}
    >
      <Helmet>
        <link rel="canonical" href="https://institutobrunosena.com.br/pnl-practitioner" />
        <title>Formação PNL Practitioner | Instituto Bruno Sena</title>
        <meta
          name="description"
          content="Aprenda a reprogramar sua mente e a de outras pessoas com a Formação PNL Practitioner. Domine a comunicação inconsciente e técnicas de intervenção rápida."
        />
        <meta
          name="keywords"
          content="curso de PNL online, PNL practitioner certificado, Programação Neurolinguística, Reprogramação Mental"
        />
        <meta property="og:title" content="Formação PNL Practitioner | Instituto Bruno Sena" />
        <meta
          property="og:description"
          content="Aprenda a reprogramar sua mente e a de outras pessoas com a Formação PNL Practitioner."
        />
        <meta property="og:image" content="https://institutobrunosena.com.br/brunosena.webp" />
        <meta property="og:url" content="https://institutobrunosena.com.br/pnl-practitioner" />
        <meta property="og:type" content="course" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-accent/5 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-xs font-bold uppercase tracking-widest mb-6">
                <Award size={14} />
                <span>Formação e Capacitação</span>
              </div>
              <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Formação PNL <span className="text-brand-accent">Practitioner</span>
              </h1>
              <p className="text-lg md:text-xl text-brand-platinum/80 mb-8 leading-relaxed">
                Domine a linguagem da mente e reprograme padrões limitantes, em você ou em
                qualquer pessoa. Método estruturado, direto e aplicável. Do zero à competência
                em reprogramação mental.{' '}
                <strong className="text-white">
                  Com o SENA, seu parceiro de prática 24/7.
                </strong>{' '}
                Sem jargões incompreensíveis, sem promessas místicas. Apenas técnica que
                funciona.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <a href="#matricula" className="btn-blue w-full sm:w-auto">
                  Quero começar agora
                </a>
                <div className="text-brand-accent font-bold text-lg">
                  12x de R$ 24,75{' '}
                  <span className="text-sm font-normal text-brand-platinum">
                    ou R$ 297 à vista
                  </span>
                </div>
              </div>
              <p className="text-xs text-brand-platinum/60 mt-4 italic">
                * Turma com acompanhamento ativo. Vagas limitadas para garantir qualidade no
                suporte.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-brand-platinum text-sm">
                <span className="text-xl">🤖</span>
                <span>
                  <strong className="text-white">Powered by SENA</strong>. Pratique com IA
                  ilimitada incluída
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-video rounded-[32px] overflow-hidden border border-white/10 shadow-2xl relative group cursor-pointer">
                <CourseImage
                  src={undefined}
                  alt="Formação PNL Practitioner"
                  title="PNL Practitioner"
                  accentClassName="from-brand-blue/30 to-brand-dark"
                />
                <div className="absolute inset-0 bg-brand-dark/40 flex items-center justify-center group-hover:bg-brand-dark/20 transition-colors">
                  <div className="w-20 h-20 bg-brand-accent rounded-full flex items-center justify-center pl-2 shadow-[0_0_40px_rgba(92,156,250,0.5)] transform group-hover:scale-110 transition-transform">
                    <Play className="text-brand-dark" size={32} />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* O Que Você Terá */}
      <section className="py-24 bg-white/5 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Em 7 módulos, você sai apto a:
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              {
                icon: <Brain size={32} />,
                title: 'Ler padrões mentais',
                desc: 'Identificar sistemas representacionais (VAKOG) e estruturas de pensamento em minutos de conversa.',
              },
              {
                icon: <Heart size={32} />,
                title: 'Reprogramar estados emocionais',
                desc: 'Usar ancoragem para criar recursos instantâneos, eliminar gatilhos negativos e gerenciar emoções.',
              },
              {
                icon: <MonitorPlay size={32} />,
                title: 'Reformular crenças',
                desc: 'Desmontar crenças limitantes usando o Metamodelo e reestruturar a codificação interna via submodalidades.',
              },
              {
                icon: <Users2 size={32} />,
                title: 'Comunicar para influenciar',
                desc: 'Aplicar linguagem que programa e desprograma a mente, do diálogo cotidiano às intervenções terapêuticas.',
              },
              {
                icon: <Briefcase size={32} />,
                title: 'Estruturar intervenções',
                desc: 'Conduzir sessões completas de reprogramação mental, do início ao fim, com segurança metodológica e ética.',
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 bg-brand-dark border border-white/10 rounded-[32px] hover:border-brand-accent/30 transition-all group"
              >
                <div className="w-16 h-16 bg-brand-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <div className="text-brand-accent">{item.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-brand-platinum/80 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="bg-brand-accent/10 border border-brand-accent/20 rounded-[32px] p-8 md:p-12 text-center max-w-4xl mx-auto">
            <p className="text-lg text-brand-platinum leading-relaxed">
              <span className="text-2xl mr-2">💡</span>
              <strong className="text-white">E o mais importante:</strong> você não apenas
              "aprende" — você <strong className="text-brand-accent">pratica</strong>. O SENA,
              nosso agente de IA, simula situações reais para você treinar quantas vezes quiser,
              com feedback instantâneo, sem depender de ninguém.
            </p>
          </div>
        </div>
      </section>

      {/* Quem faz PNL tem uma vida melhor */}
      <section className="py-24 bg-brand-dark relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Este curso foi feito para você que:
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="p-10 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-[32px] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/10 blur-[50px] rounded-full group-hover:bg-brand-accent/20 transition-colors" />
              <Heart className="text-brand-accent mb-6" size={40} />
              <h3 className="text-2xl font-bold text-white mb-6">Uso Pessoal</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-brand-platinum/80">
                  <CheckCircle2 className="text-brand-accent shrink-0 mt-1" size={18} /> Quer
                  parar de sabotar seus próprios objetivos
                </li>
                <li className="flex items-start gap-3 text-brand-platinum/80">
                  <CheckCircle2 className="text-brand-accent shrink-0 mt-1" size={18} /> Deseja
                  melhorar relacionamentos e comunicação
                </li>
                <li className="flex items-start gap-3 text-brand-platinum/80">
                  <CheckCircle2 className="text-brand-accent shrink-0 mt-1" size={18} /> Busca
                  autoconhecimento profundo e prático
                </li>
                <li className="flex items-start gap-3 text-brand-platinum/80">
                  <CheckCircle2 className="text-brand-accent shrink-0 mt-1" size={18} /> Quer
                  ferramentas para gerenciar ansiedade e estresse
                </li>
              </ul>
            </div>

            <div className="p-10 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-[32px] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/10 blur-[50px] rounded-full group-hover:bg-brand-accent/20 transition-colors" />
              <Briefcase className="text-brand-accent mb-6" size={40} />
              <h3 className="text-2xl font-bold text-white mb-6">Uso Profissional</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-brand-platinum/80">
                  <CheckCircle2 className="text-brand-accent shrink-0 mt-1" size={18} /> É
                  terapeuta e quer adicionar PNL à sua caixa de ferramentas
                </li>
                <li className="flex items-start gap-3 text-brand-platinum/80">
                  <CheckCircle2 className="text-brand-accent shrink-0 mt-1" size={18} /> É coach
                  e precisa de resultados mais rápidos para clientes
                </li>
                <li className="flex items-start gap-3 text-brand-platinum/80">
                  <CheckCircle2 className="text-brand-accent shrink-0 mt-1" size={18} />{' '}
                  Trabalha com vendas, RH ou liderança
                </li>
                <li className="flex items-start gap-3 text-brand-platinum/80">
                  <CheckCircle2 className="text-brand-accent shrink-0 mt-1" size={18} /> Quer
                  construir uma carreira em desenvolvimento humano
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center mb-12">
            <p className="text-brand-accent font-bold text-xl max-w-2xl mx-auto">
              "Não importa seu objetivo. As ferramentas são as mesmas. O que muda é onde você
              aplica."
            </p>
          </div>
        </div>
      </section>

      <SenaExplanation />

      {/* Cronograma & Certificado */}
      <section className="py-24 bg-white/5 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Conteúdo programático, sem filler, só o que funciona
            </h2>
            <p className="text-brand-platinum text-lg">
              Cada módulo inclui{' '}
              <strong className="text-white">demonstrações em vídeo + prática com SENA</strong>{' '}
              conforme ementa oficial IBSDH.
            </p>
          </div>

          <div className="space-y-12 mb-20">
            {/* Módulo 1 */}
            <details
              className="bg-brand-dark border border-white/10 rounded-[32px] overflow-hidden group"
              open
            >
              <summary className="bg-white/5 p-6 border-b border-white/10 cursor-pointer flex justify-between items-center list-none [&::-webkit-details-marker]:hidden">
                <h3 className="text-xl font-bold text-brand-accent">
                  MÓDULO 1: ORIGENS E FUNDAMENTOS (14h)
                </h3>
                <ChevronDown className="text-brand-accent transition-transform group-open:rotate-180" />
              </summary>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b border-white/10 bg-black/20 text-brand-platinum/60 text-sm">
                      <th className="p-4 w-16 text-center">Aula</th>
                      <th className="p-4 w-1/4">Título Oficial</th>
                      <th className="p-4 w-2/5">Conteúdo</th>
                      <th className="p-4">Prática SENA</th>
                    </tr>
                  </thead>
                  <tbody className="text-brand-platinum text-sm">
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center font-mono text-brand-platinum/70">1</td>
                      <td className="p-4 font-medium text-white">A História da PNL</td>
                      <td className="p-4">
                        Bandler, Grinder, Satir, Perls e Erickson. Nascimento da modelagem
                      </td>
                      <td className="p-4 text-brand-accent">Quiz de fixação metodológica</td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center font-mono text-brand-platinum/70">2</td>
                      <td className="p-4 font-medium text-white">
                        Modelagem: O Coração da PNL
                      </td>
                      <td className="p-4">Diferença entre imitar e modelar excelência</td>
                      <td className="p-4 text-brand-accent">
                        Identificação de padrões em vídeos
                      </td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center font-mono text-brand-platinum/70">3</td>
                      <td className="p-4 font-medium text-white">
                        Mente Consciente vs. Inconsciente
                      </td>
                      <td className="p-4">Capacidades, limites, neuroplasticidade</td>
                      <td className="p-4 text-brand-accent">
                        Simulação de explicações diferentes
                      </td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center font-mono text-brand-platinum/70">4</td>
                      <td className="p-4 font-medium text-white">O Fator Crítico</td>
                      <td className="p-4">"Porteiro" da mente, mecanismos de resistência</td>
                      <td className="p-4 text-brand-accent">
                        Simulação de resistência do paciente
                      </td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center font-mono text-brand-platinum/70">5</td>
                      <td className="p-4 font-medium text-white">
                        Omissão, Distorção, Generalização
                      </td>
                      <td className="p-4">3 filtros da percepção humana</td>
                      <td className="p-4 text-brand-accent">
                        Identificação em pensamentos próprios
                      </td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center font-mono text-brand-platinum/70">6</td>
                      <td className="p-4 font-medium text-white">O Mapa Não é o Território</td>
                      <td className="p-4">Distinção clínica: realidade vs. percepção</td>
                      <td className="p-4 text-brand-accent">
                        Aplicação de pressupostos em situações
                      </td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center font-mono text-brand-platinum/70">7</td>
                      <td className="p-4 font-medium text-white">Os 13 Pressupostos da PNL</td>
                      <td className="p-4">Crenças operacionais da excelência (5 essenciais)</td>
                      <td className="p-4 text-brand-accent">Quiz + aplicação prática</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </details>

            {/* Módulo 2 */}
            <details className="bg-brand-dark border border-white/10 rounded-[32px] overflow-hidden group">
              <summary className="bg-white/5 p-6 border-b border-white/10 cursor-pointer flex justify-between items-center list-none [&::-webkit-details-marker]:hidden">
                <h3 className="text-xl font-bold text-brand-accent">
                  MÓDULO 2: SISTEMAS REPRESENTACIONAIS E ACUIDADE (14h)
                </h3>
                <ChevronDown className="text-brand-accent transition-transform group-open:rotate-180" />
              </summary>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b border-white/10 bg-black/20 text-brand-platinum/60 text-sm">
                      <th className="p-4 w-16 text-center">Aula</th>
                      <th className="p-4 w-1/4">Título Oficial</th>
                      <th className="p-4 w-2/5">Conteúdo</th>
                      <th className="p-4">Prática SENA</th>
                    </tr>
                  </thead>
                  <tbody className="text-brand-platinum text-sm">
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center font-mono text-brand-platinum/70">8</td>
                      <td className="p-4 font-medium text-white">VAKOG: Os 5 Canais</td>
                      <td className="p-4">
                        Visual, Auditivo, Cinestésico, Olfativo, Gustativo
                      </td>
                      <td className="p-4 text-brand-accent">
                        Teste de perfil representacional próprio
                      </td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center font-mono text-brand-platinum/70">9</td>
                      <td className="p-4 font-medium text-white">Pistas de Acesso Ocular</td>
                      <td className="p-4">
                        Mapa neurológico dos movimentos oculares de Bandler
                      </td>
                      <td className="p-4 text-brand-accent">Análise de vídeos com feedback</td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center font-mono text-brand-platinum/70">10</td>
                      <td className="p-4 font-medium text-white">Predicados e Linguagem</td>
                      <td className="p-4">Palavras que revelam sistemas preferidos</td>
                      <td className="p-4 text-brand-accent">
                        Caça a predicados em textos complexos
                      </td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center font-mono text-brand-platinum/70">11</td>
                      <td className="p-4 font-medium text-white">Rapport Básico</td>
                      <td className="p-4">Espelhamento físico e acompanhamento fisiológico</td>
                      <td className="p-4 text-brand-accent">
                        Avaliação de espelhamento (vídeo)
                      </td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center font-mono text-brand-platinum/70">12</td>
                      <td className="p-4 font-medium text-white">Rapport Avançado</td>
                      <td className="p-4">
                        Micro-sincronias, espelhamento cruzado, ritmo respiratório
                      </td>
                      <td className="p-4 text-brand-accent">
                        Simulação com 3 perfis (V, A, C)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </details>

            {/* Módulo 3 */}
            <details className="bg-brand-dark border border-white/10 rounded-[32px] overflow-hidden group">
              <summary className="bg-white/5 p-6 border-b border-white/10 cursor-pointer flex justify-between items-center list-none [&::-webkit-details-marker]:hidden">
                <h3 className="text-xl font-bold text-brand-accent">
                  MÓDULO 3: A ESTRUTURA DA LINGUAGEM (14h)
                </h3>
                <ChevronDown className="text-brand-accent transition-transform group-open:rotate-180" />
              </summary>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b border-white/10 bg-black/20 text-brand-platinum/60 text-sm">
                      <th className="p-4 w-16 text-center">Aula</th>
                      <th className="p-4 w-1/4">Título Oficial</th>
                      <th className="p-4 w-2/5">Conteúdo</th>
                      <th className="p-4">Prática SENA</th>
                    </tr>
                  </thead>
                  <tbody className="text-brand-platinum text-sm">
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center font-mono text-brand-platinum/70">13</td>
                      <td className="p-4 font-medium text-white">
                        Estrutura Superficial vs. Profunda
                      </td>
                      <td className="p-4">
                        O que foi dito vs. o que foi subconscientemente vivido
                      </td>
                      <td className="p-4 text-brand-accent">Análise clínica de frases</td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center font-mono text-brand-platinum/70">14</td>
                      <td className="p-4 font-medium text-white">
                        Metamodelo (Parte 1: Omissões)
                      </td>
                      <td className="p-4">
                        Nominalizações, verbos não especificados, comparativos
                      </td>
                      <td className="p-4 text-brand-accent">Desmonte de frases ambíguas</td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center font-mono text-brand-platinum/70">15</td>
                      <td className="p-4 font-medium text-white">
                        Metamodelo (Parte 2: Distorções)
                      </td>
                      <td className="p-4">
                        Leitura de mente, equivalência complexa, causa-efeito
                      </td>
                      <td className="p-4 text-brand-accent">Desmonte de crenças simuladas</td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center font-mono text-brand-platinum/70">16</td>
                      <td className="p-4 font-medium text-white">
                        Metamodelo (Parte 3: Generalizações)
                      </td>
                      <td className="p-4">Universalizações, modalidades operacionais</td>
                      <td className="p-4 text-brand-accent">Diálogo imersivo de 30 min</td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center font-mono text-brand-platinum/70">17</td>
                      <td className="p-4 font-medium text-white">Integração do Metamodelo</td>
                      <td className="p-4">
                        Fluência conversacional sem parecer interrogatório
                      </td>
                      <td className="p-4 text-brand-accent">Feedback instantâneo do SENA</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </details>

            {/* Módulo 4 */}
            <details className="bg-brand-dark border border-white/10 rounded-[32px] overflow-hidden group">
              <summary className="bg-white/5 p-6 border-b border-white/10 cursor-pointer flex justify-between items-center list-none [&::-webkit-details-marker]:hidden">
                <h3 className="text-xl font-bold text-brand-accent">
                  MÓDULO 4: ENGENHARIA EMOCIONAL (14h)
                </h3>
                <ChevronDown className="text-brand-accent transition-transform group-open:rotate-180" />
              </summary>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b border-white/10 bg-black/20 text-brand-platinum/60 text-sm">
                      <th className="p-4 w-16 text-center">Aula</th>
                      <th className="p-4 w-1/4">Título Oficial</th>
                      <th className="p-4 w-2/5">Conteúdo</th>
                      <th className="p-4">Prática SENA</th>
                    </tr>
                  </thead>
                  <tbody className="text-brand-platinum text-sm">
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center font-mono text-brand-platinum/70">18</td>
                      <td className="p-4 font-medium text-white">B.V.O. (Bem-Formulado)</td>
                      <td className="p-4">Sintaxe de metas que a neurologia aceita executar</td>
                      <td className="p-4 text-brand-accent">
                        Formulação de meta pessoal validada
                      </td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center font-mono text-brand-platinum/70">19</td>
                      <td className="p-4 font-medium text-white">Fisiologia e Estado</td>
                      <td className="p-4">
                        Postura do corpo cria e mantém emoções bioquímicas
                      </td>
                      <td className="p-4 text-brand-accent">Auto-regulação guiada</td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center font-mono text-brand-platinum/70">20</td>
                      <td className="p-4 font-medium text-white">Ancoragem Clássica</td>
                      <td className="p-4">
                        Estímulo-resposta, gatilhos físicos de alto recurso
                      </td>
                      <td className="p-4 text-brand-accent">
                        Auto-ancoragem guiada passo a passo
                      </td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center font-mono text-brand-platinum/70">21</td>
                      <td className="p-4 font-medium text-white">Colapso de Âncoras</td>
                      <td className="p-4">Destruição de gatilhos emocionais negativos</td>
                      <td className="p-4 text-brand-accent">
                        Resolução teórica de âncora negativa
                      </td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center font-mono text-brand-platinum/70">22</td>
                      <td className="p-4 font-medium text-white">Empilhamento e Cadeias</td>
                      <td className="p-4">Soma progressiva de recursos para estados de pico</td>
                      <td className="p-4 text-brand-accent">Criação de cadeia pessoal</td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center font-mono text-brand-platinum/70">23</td>
                      <td className="p-4 font-medium text-white">Círculo de Excelência</td>
                      <td className="p-4">Campo espacial de alto desempenho</td>
                      <td className="p-4 text-brand-accent">Prática gravada com feedback</td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center font-mono text-brand-platinum/70">24</td>
                      <td className="p-4 font-medium text-white">Posições Perceptivas</td>
                      <td className="p-4">1ª, 2ª, 3ª posição para resolução de conflitos</td>
                      <td className="p-4 text-brand-accent">Mudança de posição guiada</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </details>

            {/* Módulo 5 */}
            <details className="bg-brand-dark border border-white/10 rounded-[32px] overflow-hidden group">
              <summary className="bg-white/5 p-6 border-b border-white/10 cursor-pointer flex justify-between items-center list-none [&::-webkit-details-marker]:hidden">
                <h3 className="text-xl font-bold text-brand-accent">
                  MÓDULO 5: SUBMODALIDADES — O CÓDIGO INTERNO (16h)
                </h3>
                <ChevronDown className="text-brand-accent transition-transform group-open:rotate-180" />
              </summary>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b border-white/10 bg-black/20 text-brand-platinum/60 text-sm">
                      <th className="p-4 w-16 text-center">Aula</th>
                      <th className="p-4 w-1/4">Título Oficial</th>
                      <th className="p-4 w-2/5">Conteúdo</th>
                      <th className="p-4">Prática SENA</th>
                    </tr>
                  </thead>
                  <tbody className="text-brand-platinum text-sm">
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center font-mono text-brand-platinum/70">25</td>
                      <td className="p-4 font-medium text-white">O Que São Submodalidades</td>
                      <td className="p-4">
                        Qualidades sensoriais internas (brilho, volume, temperatura)
                      </td>
                      <td className="p-4 text-brand-accent">Mapeamento de memórias</td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center font-mono text-brand-platinum/70">26</td>
                      <td className="p-4 font-medium text-white">Descoberta e Mapeamento</td>
                      <td className="p-4">Como o cérebro codifica prazer vs. dor</td>
                      <td className="p-4 text-brand-accent">Exercício de análise</td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center font-mono text-brand-platinum/70">27</td>
                      <td className="p-4 font-medium text-white">Análise Contrastiva</td>
                      <td className="p-4">
                        Estrutura neurológica de duas experiências distintas
                      </td>
                      <td className="p-4 text-brand-accent">Análise contrastiva guiada</td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center font-mono text-brand-platinum/70">28</td>
                      <td className="p-4 font-medium text-white">Pattern Interrupt</td>
                      <td className="p-4">
                        Quebra e interrupção de padrões mentais automáticos
                      </td>
                      <td className="p-4 text-brand-accent">
                        Interrupção de padrão de ansiedade
                      </td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center font-mono text-brand-platinum/70">29</td>
                      <td className="p-4 font-medium text-white">Swish Pattern VISUAL</td>
                      <td className="p-4">
                        Substituição imediata de imagens para mudança de hábitos
                      </td>
                      <td className="p-4 text-brand-accent">Prática validada</td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center font-mono text-brand-platinum/70">30</td>
                      <td className="p-4 font-medium text-white">Swish Pattern AUDITIVO</td>
                      <td className="p-4">Adaptação para processamento sonoro</td>
                      <td className="p-4 text-brand-accent">Prática validada</td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center font-mono text-brand-platinum/70">31</td>
                      <td className="p-4 font-medium text-white">Swish Pattern CINESTÉSICO</td>
                      <td className="p-4">Adaptação para processamento corporal/emocional</td>
                      <td className="p-4 text-brand-accent">Prática validada</td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center font-mono text-brand-platinum/70">32</td>
                      <td className="p-4 font-medium text-white">Ponte ao Futuro</td>
                      <td className="p-4">
                        Teste ecológico e instalação de mudanças na linha do tempo
                      </td>
                      <td className="p-4 text-brand-accent">Visualização + teste</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </details>

            {/* Módulo 6 */}
            <details className="bg-brand-dark border border-white/10 rounded-[32px] overflow-hidden group">
              <summary className="bg-white/5 p-6 border-b border-white/10 cursor-pointer flex justify-between items-center list-none [&::-webkit-details-marker]:hidden">
                <h3 className="text-xl font-bold text-brand-accent">
                  MÓDULO 6: PROTOCOLOS TERAPÊUTICOS (16h)
                </h3>
                <ChevronDown className="text-brand-accent transition-transform group-open:rotate-180" />
              </summary>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b border-white/10 bg-black/20 text-brand-platinum/60 text-sm">
                      <th className="p-4 w-16 text-center">Aula</th>
                      <th className="p-4 w-1/4">Título Oficial</th>
                      <th className="p-4 w-2/5">Conteúdo</th>
                      <th className="p-4">Prática SENA</th>
                    </tr>
                  </thead>
                  <tbody className="text-brand-platinum text-sm">
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center font-mono text-brand-platinum/70">33</td>
                      <td className="p-4 font-medium text-white">
                        Níveis Neurológicos (Dilts)
                      </td>
                      <td className="p-4">
                        Alinhamento de Ambiente, Comportamento, Capacidade, Crença, Identidade,
                        Missão
                      </td>
                      <td className="p-4 text-brand-accent">Intervenção em desalinhamento</td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center font-mono text-brand-platinum/70">34</td>
                      <td className="p-4 font-medium text-white">Cura Rápida de Fobias</td>
                      <td className="p-4">
                        Protocolo de dissociação dupla (Visual-Cinestésico)
                      </td>
                      <td className="p-4 text-brand-accent">
                        Simulação (3 níveis de dificuldade)
                      </td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center font-mono text-brand-platinum/70">35</td>
                      <td className="p-4 font-medium text-white">
                        Segurança em Técnicas Fortes
                      </td>
                      <td className="p-4">
                        Contraindicações, limites éticos, momento de encaminhar
                      </td>
                      <td className="p-4 text-brand-accent font-bold">Quiz obrigatório 100%</td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center font-mono text-brand-platinum/70">36</td>
                      <td className="p-4 font-medium text-white">Integração de Partes</td>
                      <td className="p-4">
                        Resolução de autossabotagem e conflitos internos severos
                      </td>
                      <td className="p-4 text-brand-accent">Simulação de parte conflitante</td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center font-mono text-brand-platinum/70">37</td>
                      <td className="p-4 font-medium text-white">
                        Estratégia de Criatividade Disney
                      </td>
                      <td className="p-4">Fluxo Sonhador-Realista-Crítico</td>
                      <td className="p-4 text-brand-accent">Aplicação em projeto pessoal</td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center font-mono text-brand-platinum/70">38</td>
                      <td className="p-4 font-medium text-white">Combinação de Técnicas</td>
                      <td className="p-4">Decisão clínica: qual ferramenta usar</td>
                      <td className="p-4 text-brand-accent">Estudo de casos com SENA</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </details>

            {/* Módulo 7 */}
            <details className="bg-brand-dark border border-white/10 rounded-[32px] overflow-hidden group">
              <summary className="bg-white/5 p-6 border-b border-white/10 cursor-pointer flex justify-between items-center list-none [&::-webkit-details-marker]:hidden">
                <h3 className="text-xl font-bold text-brand-accent">
                  MÓDULO 7: DO ALUNO AO PROFISSIONAL DE ELITE (12h)
                </h3>
                <ChevronDown className="text-brand-accent transition-transform group-open:rotate-180" />
              </summary>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b border-white/10 bg-black/20 text-brand-platinum/60 text-sm">
                      <th className="p-4 w-16 text-center">Aula</th>
                      <th className="p-4 w-1/4">Título Oficial</th>
                      <th className="p-4 w-2/5">Conteúdo</th>
                      <th className="p-4">Prática SENA</th>
                    </tr>
                  </thead>
                  <tbody className="text-brand-platinum text-sm">
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center font-mono text-brand-platinum/70">39</td>
                      <td className="p-4 font-medium text-white">
                        Estrutura de Sessão Completa
                      </td>
                      <td className="p-4">
                        Abertura, investigação (anamnese), intervenção, fechamento
                      </td>
                      <td className="p-4 text-brand-accent">Script completo fornecido</td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center font-mono text-brand-platinum/70">40</td>
                      <td className="p-4 font-medium text-white">Anamnese com PNL</td>
                      <td className="p-4">Histórico clínico usando Metamodelo e Calibração</td>
                      <td className="p-4 text-brand-accent">
                        Simulação com 3 históricos médicos
                      </td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center font-mono text-brand-platinum/70">41</td>
                      <td className="p-4 font-medium text-white">Ética e Posicionamento</td>
                      <td className="p-4">O que a PNL é e o que não é à luz do mercado</td>
                      <td className="p-4 text-brand-accent">
                        Casos-teste de ética profissional
                      </td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center font-mono text-brand-platinum/70">42</td>
                      <td className="p-4 font-medium text-white">Do Gratuito ao Pago</td>
                      <td className="p-4">
                        Primeiras provas sociais, precificação inicial, contratos
                      </td>
                      <td className="p-4 text-brand-accent">Cálculo de precificação base</td>
                    </tr>
                    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center font-mono text-brand-platinum/70">43</td>
                      <td className="p-4 font-medium text-white">Atendimento Online</td>
                      <td className="p-4">Adaptações de segurança para PNL via vídeo</td>
                      <td className="p-4 text-brand-accent">Checklist técnico</td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center font-mono text-brand-platinum/70">44</td>
                      <td className="p-4 font-medium text-white">O Exame de Competência</td>
                      <td className="p-4">
                        Avaliação final da capacidade técnica do Reprogramador
                      </td>
                      <td className="p-4 text-brand-accent font-bold">
                        Avaliação SENA (nota mínima 7/10)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </details>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-brand-accent/20 to-transparent blur-2xl rounded-[40px] -z-10" />
              <div className="bg-brand-dark border border-brand-accent/30 rounded-[40px] p-8 md:p-12 text-center shadow-2xl">
                <Award className="text-brand-accent mx-auto mb-6" size={64} />
                <h3 className="text-2xl font-bold text-white mb-8">Bônus Inclusos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-8">
                  <div className="flex items-start gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <CheckCircle2 className="text-brand-accent shrink-0 mt-1" size={20} />
                    <p className="text-brand-platinum">
                      Apostila completa em PDF (conforme ementa oficial IBSDH)
                    </p>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <CheckCircle2 className="text-brand-accent shrink-0 mt-1" size={20} />
                    <p className="text-brand-platinum">
                      Biblioteca de demonstrações práticas das 44 aulas
                    </p>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-brand-accent/10 rounded-2xl border border-brand-accent/30">
                    <span className="text-xl shrink-0 mt-0.5">🤖</span>
                    <p className="text-white font-bold">
                      SENA: prática ilimitada 24/7 para todos os módulos
                    </p>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <CheckCircle2 className="text-brand-accent shrink-0 mt-1" size={20} />
                    <p className="text-brand-platinum">Grupo de suporte e networking</p>
                  </div>
                </div>
                <div className="p-8 bg-gradient-to-r from-brand-accent/10 to-transparent border border-brand-accent/20 rounded-[32px] text-left flex flex-col gap-8">
                  <div className="flex items-start gap-4">
                    <Award className="text-brand-accent shrink-0 mt-1" size={28} />
                    <div>
                      <h4 className="text-white font-bold text-xl mb-1">
                        Certificado de PNL Practitioner
                      </h4>
                      <p className="text-brand-platinum/80">
                        Emitido após aprovação no Exame 44 com SENA (nota mínima 7/10)
                      </p>
                    </div>
                  </div>
                  <div className="w-full">
                    <img
                      src="/Certificado-IBSDH-practitioner.webp"
                      alt="Certificado PNL Practitioner"
                      className="w-full h-auto object-contain rounded-2xl shadow-2xl border border-white/10"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transformação 360 */}
      <section className="py-24 bg-brand-dark relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Onde você pode aplicar
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 bg-white/5 border border-white/10 rounded-[32px]">
              <h3 className="text-xl font-bold text-brand-accent mb-6">Âmbito Pessoal</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-brand-platinum/80">
                  <ChevronRight className="text-brand-accent shrink-0 mt-1" size={16} />{' '}
                  Relacionamentos mais saudáveis
                </li>
                <li className="flex items-start gap-2 text-brand-platinum/80">
                  <ChevronRight className="text-brand-accent shrink-0 mt-1" size={16} /> Gestão
                  emocional efetiva
                </li>
                <li className="flex items-start gap-2 text-brand-platinum/80">
                  <ChevronRight className="text-brand-accent shrink-0 mt-1" size={16} />{' '}
                  Eliminação de hábitos indesejados
                </li>
                <li className="flex items-start gap-2 text-brand-platinum/80">
                  <ChevronRight className="text-brand-accent shrink-0 mt-1" size={16} /> Clareza
                  de objetivos e propósito
                </li>
              </ul>
            </div>

            <div className="p-8 bg-white/5 border border-white/10 rounded-[32px]">
              <h3 className="text-xl font-bold text-brand-accent mb-6">
                Profissional (Não-terapêutico)
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-brand-platinum/80">
                  <ChevronRight className="text-brand-accent shrink-0 mt-1" size={16} /> Vendas
                  e negociações
                </li>
                <li className="flex items-start gap-2 text-brand-platinum/80">
                  <ChevronRight className="text-brand-accent shrink-0 mt-1" size={16} />{' '}
                  Liderança e gestão de equipes
                </li>
                <li className="flex items-start gap-2 text-brand-platinum/80">
                  <ChevronRight className="text-brand-accent shrink-0 mt-1" size={16} /> RH e
                  desenvolvimento organizacional
                </li>
                <li className="flex items-start gap-2 text-brand-platinum/80">
                  <ChevronRight className="text-brand-accent shrink-0 mt-1" size={16} />{' '}
                  Comunicação persuasiva
                </li>
              </ul>
            </div>

            <div className="p-8 bg-white/5 border border-white/10 rounded-[32px]">
              <h3 className="text-xl font-bold text-brand-accent mb-6">Âmbito Terapêutico</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-brand-platinum/80">
                  <ChevronRight className="text-brand-accent shrink-0 mt-1" size={16} />{' '}
                  Atendimento clínico estruturado
                </li>
                <li className="flex items-start gap-2 text-brand-platinum/80">
                  <ChevronRight className="text-brand-accent shrink-0 mt-1" size={16} />{' '}
                  Coaching com resultados mensuráveis
                </li>
                <li className="flex items-start gap-2 text-brand-platinum/80">
                  <ChevronRight className="text-brand-accent shrink-0 mt-1" size={16} />{' '}
                  Consultoria em desenvolvimento humano
                </li>
                <li className="flex items-start gap-2 text-brand-platinum/80">
                  <ChevronRight className="text-brand-accent shrink-0 mt-1" size={16} />{' '}
                  Abertura de próprio negócio
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Garantia Incondicional */}
      <section className="py-20 bg-brand-accent/5 border-y border-brand-accent/10 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-accent/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="w-32 h-32 shrink-0 bg-gradient-to-br from-brand-accent to-[#B8860B] rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(92,156,250,0.4)]">
            <ShieldCheck size={64} className="text-brand-dark" />
          </div>
          <div className="text-center md:text-left">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Você não arrisca nada. Exceto continuar do jeito que está.
            </h2>
            <p className="text-brand-platinum text-lg leading-relaxed mb-4">
              Acesse o curso agora. Assista às primeiras aulas. Tente as técnicas.
            </p>
            <p className="text-brand-platinum text-lg leading-relaxed">
              Se em 7 dias você não sentir que isso é exatamente o que você precisava, seja para
              uso pessoal ou profissional, devolvemos 100% do seu investimento. Sem perguntas,
              sem burocracia. <strong className="text-white">O risco é todo nosso.</strong> A
              transformação pode ser sua.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-brand-dark relative">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-brand-platinum">
              Tudo o que você precisa saber antes de tomar a sua decisão.
            </p>
          </div>
          <div className="space-y-4">
            {[
              {
                q: 'Nunca estudei nada disso. Vou conseguir acompanhar?',
                a: 'Sim. O método foi desenvolvido para quem está começando do zero. Cada conceito é explicado desde a base, com exemplos do dia a dia. E o SENA nunca se cansa de explicar de novo, de outro jeito, até você entender.',
              },
              {
                q: 'Já sou terapeuta/coach. Este curso agrega?',
                a: 'Com certeza. Muitos alunos experientes relatam que nossa estrutura organizou conhecimentos que eles tinham de forma fragmentada. O diferencial é o SENA: finalmente um lugar para praticar sem arriscar clientes reais enquanto ainda não está fluente.',
              },
              {
                q: 'Quanto tempo tenho acesso?',
                a: 'Vitalício. E inclui atualizações que fizermos no futuro — inclusive melhorias no SENA.',
              },
              {
                q: 'O certificado vale para trabalhar?',
                a: 'Sim, para prática de PNL e coaching. O certificado é válido nacionalmente como comprovação de formação. Emitido apenas após aprovação no Exame 44 com SENA (nota mínima 7/10), atestando competência real, não apenas presença.',
              },
              {
                q: 'Preciso fazer prova?',
                a: 'Avaliação prática com SENA (Aula 44). Você conduz uma sessão simulada, recebe nota e feedback detalhado. Necessário para Certificado de Competência, mas não para acesso ao conteúdo.',
              },
              {
                q: 'Como funciona o SENA tecnicamente?',
                a: 'É um agente de IA integrado à área de membros. Você acessa por chat, escolhe o modo (paciente/instrutor/avaliador) e interage por texto, áudio ou vídeo. Funciona no celular e computador, sem instalar nada.',
              },
              {
                q: 'E se eu não gostar do SENA?',
                a: 'A garantia de 7 dias cobre todo o curso, incluindo a experiência com o SENA. Se não achar que agrega valor, devolvemos seu dinheiro.',
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all hover:border-brand-accent/30"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-bold text-white text-lg pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`text-brand-accent shrink-0 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 text-brand-platinum leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-24 bg-white/5 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Como Funciona
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-8 bg-brand-dark border border-white/10 rounded-[32px] text-center relative">
              <div className="w-12 h-12 bg-brand-accent text-brand-dark font-bold text-xl rounded-full flex items-center justify-center mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Escolha sua ferramenta</h3>
              <p className="text-brand-platinum/80">
                PNL, Hipnoterapia ou ambos. Comece pelo que faz mais sentido para seu objetivo
                atual.
              </p>
            </div>

            <div className="p-8 bg-brand-dark border border-white/10 rounded-[32px] text-center relative">
              <div className="w-12 h-12 bg-brand-accent text-brand-dark font-bold text-xl rounded-full flex items-center justify-center mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Aprenda no seu ritmo</h3>
              <p className="text-brand-platinum/80">
                44 aulas gravadas, acesso vitalício. Estude quando e onde quiser.
              </p>
            </div>

            <div className="p-8 bg-brand-accent/10 border border-brand-accent/30 rounded-[32px] text-center relative">
              <div className="w-12 h-12 bg-brand-accent text-brand-dark font-bold text-xl rounded-full flex items-center justify-center mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Pratique com o SENA</h3>
              <p className="text-brand-platinum/80">
                <strong className="text-white">Seu ambiente de simulação 24/7.</strong> Quiz,
                diálogos imersivos, avaliação de vídeos, simulação de pacientes, exame de
                competência, tudo integrado.
              </p>
            </div>

            <div className="p-8 bg-brand-dark border border-white/10 rounded-[32px] text-center relative">
              <div className="w-12 h-12 bg-brand-accent text-brand-dark font-bold text-xl rounded-full flex items-center justify-center mx-auto mb-6">
                4
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Aplique e transforme</h3>
              <p className="text-brand-platinum/80">
                Use para si, para outros, ou para construir uma nova carreira. Você decide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Compare Section */}
      <section className="py-24 bg-brand-dark relative">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Mesma qualidade de conteúdo. Sem a barreira de preço.
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-4 text-brand-platinum/60 font-medium w-1/3"></th>
                  <th className="p-4 text-white font-bold text-lg w-1/3">
                    Cursos Tradicionais
                  </th>
                  <th className="p-4 text-brand-accent font-bold text-xl w-1/3 bg-brand-accent/5 rounded-t-2xl border-x border-t border-brand-accent/20">
                    IBSDH
                  </th>
                </tr>
              </thead>
              <tbody className="text-brand-platinum">
                <tr className="border-b border-white/10">
                  <td className="p-4 font-bold text-white">Investimento</td>
                  <td className="p-4">R$ 2.000 - 5.000</td>
                  <td className="p-4 font-bold text-brand-accent bg-brand-accent/5 border-x border-brand-accent/20">
                    R$ 297
                  </td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-4 font-bold text-white">Formato</td>
                  <td className="p-4">Presencial, deslocamento</td>
                  <td className="p-4 bg-brand-accent/5 border-x border-brand-accent/20">
                    Online, seu ritmo
                  </td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-4 font-bold text-white">Foco</td>
                  <td className="p-4">Teoria e história</td>
                  <td className="p-4 bg-brand-accent/5 border-x border-brand-accent/20">
                    Prática e aplicação
                  </td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-4 font-bold text-white">Público</td>
                  <td className="p-4">Exclusivo, elitista</td>
                  <td className="p-4 bg-brand-accent/5 border-x border-brand-accent/20">
                    Acessível, universal
                  </td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-4 font-bold text-white">Prática</td>
                  <td className="p-4">"Faça com amigos" (se tiver)</td>
                  <td className="p-4 font-bold text-white bg-brand-accent/5 border-x border-brand-accent/20">
                    SENA: simulação 24/7 ilimitada
                  </td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-4 font-bold text-white">Feedback</td>
                  <td className="p-4">Esperar dias pelo professor</td>
                  <td className="p-4 font-bold text-white bg-brand-accent/5 border-x border-brand-accent/20">
                    Instantâneo e específico
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">Certificação</td>
                  <td className="p-4">Apenas presença</td>
                  <td className="p-4 font-bold text-white bg-brand-accent/5 rounded-b-2xl border-x border-b border-brand-accent/20">
                    Competência demonstrada com IA (nota 7/10)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text-center mt-12 mb-16">
            <p className="text-brand-accent font-bold text-xl max-w-2xl mx-auto italic">
              "Mesma profundidade de conteúdo. Tecnologia que ninguém mais tem. Preço que
              democratiza o acesso."
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href="#matricula"
              className="w-full sm:w-auto text-center px-8 py-4 rounded-full bg-brand-accent text-brand-dark font-bold hover:scale-105 transition-transform"
            >
              Quero começar pelo Practitioner
            </a>
            <Link
              to="/master-pnl"
              className="w-full sm:w-auto text-center px-8 py-4 rounded-full border border-white/20 text-white font-bold hover:bg-white/5 transition-colors"
            >
              Já tenho base — quero o Master
            </Link>
            <a
              href="https://wa.me/5511987355750"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto text-center px-8 py-4 rounded-full border border-brand-accent/30 text-brand-accent font-bold hover:bg-brand-accent/10 transition-colors"
            >
              Falar com equipe sobre qual é meu nível
            </a>
          </div>
        </div>
      </section>

      {/* Pricing / CTA */}
      <section id="matricula" className="py-24 bg-brand-dark relative overflow-hidden">
        <div className="absolute inset-0 textura-carbono opacity-5 mix-blend-overlay" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-accent/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-sm font-bold uppercase tracking-widest mb-8">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-accent"></span>
            </span>
            Vagas Abertas
          </div>

          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
            Investimento
          </h2>

          <div className="bg-white/5 border border-white/10 rounded-[40px] p-10 md:p-16 backdrop-blur-xl mt-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-accent via-[#F4C430] to-brand-accent" />

            <p className="text-brand-platinum text-lg mb-4 line-through">De R$ 997,00</p>
            <div className="flex justify-center items-baseline gap-2 mb-2">
              <span className="text-2xl text-brand-accent font-bold">Por 12x de</span>
              <span className="text-6xl md:text-8xl font-bold text-white tracking-tighter">
                24<span className="text-4xl md:text-6xl">,75</span>
              </span>
            </div>
            <p className="text-brand-platinum mb-8">ou R$ 297,00 à vista (economia de R$ 30)</p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10 text-left">
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-brand-platinum/80 text-sm">
                  <CheckCircle2 className="text-brand-accent" size={16} /> Acesso vitalício ao
                  curso completo (44 aulas)
                </li>
                <li className="flex items-center gap-2 text-brand-platinum/80 text-sm">
                  <CheckCircle2 className="text-brand-accent" size={16} /> Atualizações futuras
                  sem custo
                </li>
                <li className="flex items-center gap-2 text-white font-bold text-sm">
                  <span className="text-lg">🤖</span> SENA: prática ilimitada 24/7
                </li>
              </ul>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-brand-platinum/80 text-sm">
                  <CheckCircle2 className="text-brand-accent" size={16} /> Certificado de
                  Competência
                </li>
                <li className="flex items-center gap-2 text-brand-platinum/80 text-sm">
                  <CheckCircle2 className="text-brand-accent" size={16} /> Grupo de alunos
                </li>
                <li className="flex items-center gap-2 text-brand-platinum/80 text-sm">
                  <CheckCircle2 className="text-brand-accent" size={16} /> Suporte por 12 meses
                </li>
              </ul>
            </div>

            <a
              href={courses.pnlPractitioner.checkout}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-6 bg-gradient-to-r from-brand-accent to-[#B8860B] text-brand-dark rounded-2xl font-bold text-xl uppercase tracking-wider hover:shadow-[0_0_40px_rgba(92,156,250,0.4)] transition-all transform hover:scale-[1.02] active:scale-95"
            >
              Garantir Minha Vaga Agora
            </a>

            <div className="flex items-center justify-center gap-6 mt-8 text-brand-platinum/60 text-sm">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} /> Pagamento processado com criptografia
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} /> Garantia de 7 dias
              </div>
            </div>

            <div className="mt-8 p-4 bg-brand-accent/10 border border-brand-accent/20 rounded-xl text-left">
              <p className="text-sm text-brand-platinum leading-relaxed">
                <strong className="text-brand-accent">⚡ Capacidade limitada:</strong> O SENA
                processa interações de forma personalizada. Quando atingirmos o limite técnico
                da turma, pausamos novas matrículas até expansão.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Course Reviews */}
      <section className="bg-brand-dark border-t border-white/5">
        <CourseReviews courseId="pnl-practitioner" />
      </section>
    </div>
  );
};

export default PNLPractitioner;
