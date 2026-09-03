import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { Link } from 'react-router-dom';
import { CourseReviews } from '../components/CourseReviews';
import SenaExplanation from '../components/SenaExplanation';
import { 
  ArrowLeft,
  Brain, 
  CheckCircle2, 
  Award, 
  Users2, 
  MonitorPlay,
  Briefcase,
  Building2,
  Heart,
  ChevronRight,
  ChevronDown,
  Play,
  ShieldCheck,
  Zap,
  Star
} from 'lucide-react';
import { courses } from '../config/courses';

const MasterPNL = () => {

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-brand-dark text-brand-platinum font-sans selection:bg-brand-accent selection:text-brand-dark">
      <Helmet>
        <title>Formação Master PNL | Instituto SENA</title>
        <meta name="description" content="Aprofunde seus conhecimentos em PNL com a Formação Master PNL. Domine a modelagem avançada, intervenções complexas e estruturação de sessões profissionais." />
        <meta name="keywords" content="master PNL online, PNL avançado certificação, Master PNL, Programação Neurolinguística Avançada, Instituto SENA" />
        <meta property="og:title" content="Formação Master PNL | Instituto SENA" />
        <meta property="og:description" content="Aprofunde seus conhecimentos em PNL com a Formação Master PNL. Domine a modelagem avançada e intervenções complexas." />
        <meta property="og:image" content="https://institutobrunosena.com.br/capa-master-pnl.png" />
        <meta property="og:url" content="https://institutobrunosena.com.br/master-pnl" />
        <meta property="og:type" content="course" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>


      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-accent/20 rounded-full blur-[120px] -z-10 opacity-50" />
        
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-brand-accent/30 text-brand-accent text-sm font-medium mb-8">
            <Zap size={16} />
            <span>Master Level — Pré-requisito: PNL Practitioner</span>
          </div>
          
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
            Formação Master PNL
          </h1>
          
          <p className="text-xl md:text-2xl text-brand-platinum/90 mb-8 leading-relaxed font-light">
            Do competente ao referência. Estratégia, modelagem e excelência em casos complexos.
          </p>
          
          <p className="text-lg text-brand-platinum/70 mb-12 max-w-3xl mx-auto">
            Para quem já domina o básico e quer as técnicas que separam técnicos de estrategistas. <strong className="text-white">SENA Avançado:</strong> prática com casos de alta dificuldade, avaliação por decisão clínica, nota mínima 8/10 para certificação.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
            <div className="text-center sm:text-right">
              <div className="text-sm text-brand-platinum/60 line-through mb-1">De R$ 1.997</div>
              <div className="text-4xl font-bold text-white">
                12x R$ 87,50
              </div>
              <div className="text-sm text-brand-accent mt-1">ou R$ 997 à vista</div>
            </div>
            
            <a href="#checkout" className="group relative inline-flex items-center justify-center gap-3 bg-brand-accent text-brand-dark px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(242,125,38,0.4)]">
              Quero me tornar referência
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-sm text-brand-platinum/60">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Turmas restritas. SENA Avançado tem capacidade técnica limitada por aluno.
          </div>
        </div>
      </section>

      {/* O Problema */}
      <section className="py-24 bg-white/5 border-y border-white/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-8">
            Você já sabe aplicar PNL. Mas será que domina?
          </h2>
          <p className="text-xl text-brand-platinum/80 leading-relaxed mb-12">
            O Practitioner te deu o vocabulário. O Master te dá a fluência.
            Muitos param no básico e travam quando o cliente apresenta resistências complexas, crenças emaranhadas ou quando a técnica "de livro" não funciona.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="bg-brand-dark p-6 rounded-3xl border border-white/10">
              <div className="text-brand-accent mb-4"><Brain size={32} /></div>
              <h3 className="text-white font-bold mb-2">Casos Complexos</h3>
              <p className="text-brand-platinum/70 text-sm">Quando uma fobia esconde um ganho secundário profundo.</p>
            </div>
            <div className="bg-brand-dark p-6 rounded-3xl border border-white/10">
              <div className="text-brand-accent mb-4"><Users2 size={32} /></div>
              <h3 className="text-white font-bold mb-2">Resistência</h3>
              <p className="text-brand-platinum/70 text-sm">Quando o cliente diz "sim" mas a fisiologia grita "não".</p>
            </div>
            <div className="bg-brand-dark p-6 rounded-3xl border border-white/10">
              <div className="text-brand-accent mb-4"><Briefcase size={32} /></div>
              <h3 className="text-white font-bold mb-2">Estratégia</h3>
              <p className="text-brand-platinum/70 text-sm">Saber qual técnica usar, em qual ordem, e por quê.</p>
            </div>
          </div>
        </div>
      </section>

      <SenaExplanation />

      {/* O Que Você Vai Dominar */}
      <section className="py-24 bg-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">O arsenal de um Master</h2>
            <p className="text-brand-platinum text-lg">Técnicas avançadas validadas por simulação.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Modelagem Comportamental", desc: "Extrair a estratégia de excelência de qualquer pessoa e instalá-la em si mesmo ou em clientes." },
              { title: "Linguagem Hipnótica (Milton)", desc: "O uso avançado de padrões de linguagem para contornar o fator crítico com elegância." },
              { title: "Sleight of Mouth", desc: "24 padrões de linguagem para ressignificar crenças limitantes instantaneamente em conversas." },
              { title: "Metaprogramas", desc: "Identificar os filtros inconscientes que determinam como uma pessoa decide, compra e se motiva." },
              { title: "Linha do Tempo Avançada", desc: "Intervenções profundas no passado para liberar emoções negativas e criar um futuro compulsivo." },
              { title: "Valores e Critérios", desc: "Alinhar conflitos internos profundos que sabotam o sucesso pessoal e profissional." }
            ].map((item, i) => (
              <div key={i} className="bg-brand-dark p-8 rounded-[32px] border border-white/10 hover:border-brand-accent/50 transition-colors">
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-brand-platinum/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Para Quem É */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-8">Para quem é o Master?</h2>
          <div className="bg-brand-accent/10 border border-brand-accent/30 rounded-3xl p-8 mb-12 text-left">
            <div className="flex items-start gap-4">
              <ShieldCheck className="text-brand-accent shrink-0 mt-1" size={24} />
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Alerta de Pré-requisito</h3>
                <p className="text-brand-platinum/80">
                  Esta formação assume que você já domina VAKOG, Rapport, Ancoragem e Metamodelo. Se você não tem formação Practitioner (por nós ou outra instituição), o SENA Avançado bloqueará seu progresso nas primeiras aulas.
                </p>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
              <h3 className="text-2xl font-bold text-brand-accent mb-4">Terapeutas e Coaches</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2"><CheckCircle2 className="text-brand-accent shrink-0 mt-1" size={18} /> Lidar com clientes "difíceis" ou resistentes</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="text-brand-accent shrink-0 mt-1" size={18} /> Resultados mais rápidos em casos complexos</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="text-brand-accent shrink-0 mt-1" size={18} /> Aumentar o valor da sua hora/sessão</li>
              </ul>
            </div>
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
              <h3 className="text-2xl font-bold text-brand-accent mb-4">Líderes e Negociadores</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2"><CheckCircle2 className="text-brand-accent shrink-0 mt-1" size={18} /> Persuasão invisível e ética (Sleight of Mouth)</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="text-brand-accent shrink-0 mt-1" size={18} /> Modelar a excelência de top performers</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="text-brand-accent shrink-0 mt-1" size={18} /> Resolução de conflitos de valores em equipes</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Cronograma Estruturado */}
      <section className="py-24 bg-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">Ementa Master PNL (120h)</h2>
            <p className="text-brand-platinum text-lg">7 Módulos. 48 Aulas. Prática Avançada.</p>
          </div>

          <div className="space-y-6">
            {[
              {
                title: "MÓDULO 1: MODELAGEM COMPORTAMENTAL AVANÇADA",
                lessons: [
                  { id: 1, title: "A Essência da Modelagem", practice: "Análise de vídeo de expert" },
                  { id: 2, title: "Extração de Estratégias (TOTE)", practice: "Simulação de entrevista de modelagem" },
                  { id: 3, title: "Instalação de Estratégias", practice: "Auto-instalação guiada" },
                  { id: 4, title: "Modelagem de Crenças", practice: "Identificação de crenças de suporte" },
                  { id: 5, title: "Projeto de Modelagem", practice: "Apresentação de caso ao SENA" }
                ]
              },
              {
                title: "MÓDULO 2: METAPROGRAMAS E FILTROS INCONSCIENTES",
                lessons: [
                  { id: 6, title: "O que são Metaprogramas", practice: "Quiz de identificação" },
                  { id: 7, title: "Direção (Aproximação vs. Afastamento)", practice: "Ajuste de copy/discurso" },
                  { id: 8, title: "Referência (Interna vs. Externa)", practice: "Simulação de feedback" },
                  { id: 9, title: "Tamanho do Chunk (Global vs. Específico)", practice: "Tradução de comunicação" },
                  { id: 10, title: "Perfilamento Rápido", practice: "Análise de 5 perfis complexos" }
                ]
              },
              {
                title: "MÓDULO 3: VALORES E CRITÉRIOS",
                lessons: [
                  { id: 11, title: "Hierarquia de Valores", practice: "Eliciação de valores próprios" },
                  { id: 12, title: "Conflitos de Valores", practice: "Resolução de conflito simulado" },
                  { id: 13, title: "Mudança de Valores", practice: "Intervenção ecológica" },
                  { id: 14, title: "Alinhamento de Níveis Neurológicos", practice: "Prática de alinhamento completo" }
                ]
              },
              {
                title: "MÓDULO 4: SLEIGHT OF MOUTH (RESSIGNIFICAÇÃO AVANÇADA)",
                lessons: [
                  { id: 15, title: "A Estrutura da Crença", practice: "Desconstrução lógica" },
                  { id: 16, title: "Padrões de Intenção e Redefinição", practice: "Batalha de objeções com SENA" },
                  { id: 17, title: "Padrões de Consequência e Chunking", practice: "Batalha de objeções com SENA" },
                  { id: 18, title: "Padrões de Metáfora e Modelo de Mundo", practice: "Batalha de objeções com SENA" },
                  { id: 19, title: "Fluência em Sleight of Mouth", practice: "Simulação de venda/negociação" }
                ]
              },
              {
                title: "MÓDULO 5: LINGUAGEM HIPNÓTICA (MODELO MILTON)",
                lessons: [
                  { id: 20, title: "Transe e PNL", practice: "Identificação de estados de transe" },
                  { id: 21, title: "Padrões de Linguagem Indireta", practice: "Criação de roteiro hipnótico" },
                  { id: 22, title: "Comandos Ocultos e Marcação Analógica", practice: "Análise de discurso" },
                  { id: 23, title: "Metáforas Isomórficas", practice: "Criação de metáfora terapêutica" }
                ]
              },
              {
                title: "MÓDULO 6: INTERVENÇÕES AVANÇADAS",
                lessons: [
                  { id: 24, title: "Reenquadramento em 6 Passos", practice: "Simulação de caso clínico" },
                  { id: 25, title: "Cura Rápida de Fobia", practice: "Simulação de caso clínico" },
                  { id: 26, title: "Swish Avançado", practice: "Simulação de caso clínico" },
                  { id: 27, title: "Terapia da Linha do Tempo", practice: "Simulação de caso clínico" },
                  { id: 28, title: "Integração de Partes", practice: "Simulação de caso clínico" }
                ]
              },
              {
                title: "MÓDULO 7: EXCELÊNCIA E CERTIFICAÇÃO",
                lessons: [
                  { id: 29, title: "Design de Intervenção", practice: "Criação de protocolo exclusivo" },
                  { id: 30, title: "Ecologia Profunda", practice: "Análise de impactos sistêmicos" },
                  { id: 31, title: "O Exame Master", practice: "Avaliação SENA (nota mínima 8/10)" }
                ]
              }
            ].map((mod, idx) => (
              <details key={idx} className="bg-brand-dark border border-white/10 rounded-[32px] overflow-hidden group" open={idx === 0}>
                <summary className="bg-white/5 p-6 border-b border-white/10 cursor-pointer flex justify-between items-center list-none [&::-webkit-details-marker]:hidden">
                  <h3 className="text-xl font-bold text-brand-accent">{mod.title}</h3>
                  <ChevronDown className="text-brand-accent transition-transform group-open:rotate-180" />
                </summary>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="border-b border-white/10 bg-black/20 text-brand-platinum/60 text-sm">
                        <th className="p-4 w-16 text-center">Aula</th>
                        <th className="p-4 w-1/3">Título</th>
                        <th className="p-4">Prática SENA Avançado</th>
                      </tr>
                    </thead>
                    <tbody className="text-brand-platinum text-sm">
                      {mod.lessons.map((lesson, lIdx) => (
                        <tr key={lIdx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="p-4 text-center font-mono text-brand-platinum/40">{lesson.id}</td>
                          <td className="p-4 font-medium text-white">{lesson.title}</td>
                          <td className="p-4 text-brand-accent">{lesson.practice}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Certificação Master */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Award className="text-brand-accent mx-auto mb-6" size={64} />
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">A Certificação Master</h2>
          <p className="text-xl text-brand-platinum/80 mb-12">
            Não vendemos diplomas. Certificamos competência.
          </p>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10 opacity-70">
              <h3 className="text-xl font-bold text-white mb-2">Certificado de Conclusão</h3>
              <p className="text-brand-platinum/70 text-sm mb-4">Emitido automaticamente ao assistir todas as aulas.</p>
              <div className="text-xs font-mono text-brand-platinum/50">Valor de mercado: Baixo</div>
            </div>
            <div className="bg-brand-accent/10 p-8 rounded-3xl border border-brand-accent/30 relative overflow-hidden flex flex-col gap-8">
              <div className="flex-1">
                <div className="absolute top-0 right-0 bg-brand-accent text-brand-dark text-xs font-bold px-3 py-1 rounded-bl-lg md:relative md:rounded-lg md:mb-4 md:inline-block md:top-auto md:right-auto z-10 hidden md:block">
                  O QUE IMPORTA
                </div>
                <div className="absolute top-0 right-0 bg-brand-accent text-brand-dark text-xs font-bold px-3 py-1 rounded-bl-lg md:hidden z-10">
                  O QUE IMPORTA
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 relative z-10 mt-4 md:mt-0">Certificado de Competência Master</h3>
                <p className="text-brand-platinum/70 text-base mb-4 relative z-10">Emitido apenas após aprovação no SENA Avançado (nota mínima 8/10) e submissão de projeto de modelagem.</p>
                <div className="text-sm font-mono text-brand-accent relative z-10">Valor de mercado: Elite</div>
              </div>
              <div className="w-full relative z-10">
                <img src="/Certificado-IBSDH.webp" alt="Certificado Master PNL" className="w-full h-auto object-contain rounded-2xl shadow-2xl border border-white/10" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-24 bg-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-16 text-center">O que dizem os Masters</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-brand-dark p-8 rounded-3xl border border-white/10">
              <div className="flex text-brand-accent mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="text-brand-platinum/80 italic mb-6">"O módulo de Sleight of Mouth mudou minhas negociações. Consigo desarmar objeções de clientes high-ticket antes mesmo que eles percebam. O SENA me treinou para ser rápido."</p>
              <div className="font-bold text-white">Carlos M.</div>
              <div className="text-sm text-brand-platinum/60">Consultor de Vendas</div>
            </div>
            <div className="bg-brand-dark p-8 rounded-3xl border border-white/10">
              <div className="flex text-brand-accent mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="text-brand-platinum/80 italic mb-6">"Sou terapeuta há 10 anos. O Master me deu a estrutura para casos que antes me travavam. A avaliação do SENA é rigorosa, reprovei duas vezes, mas quando passei, sabia que estava pronta."</p>
              <div className="font-bold text-white">Ana P.</div>
              <div className="text-sm text-brand-platinum/60">Psicanalista e Master Practitioner</div>
            </div>
            <div className="bg-brand-dark p-8 rounded-3xl border border-white/10">
              <div className="flex text-brand-accent mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="text-brand-platinum/80 italic mb-6">"A modelagem comportamental é um superpoder. Usei as técnicas do módulo 1 para modelar o melhor gestor da minha empresa. Fui promovido em 6 meses."</p>
              <div className="font-bold text-white">Roberto F.</div>
              <div className="text-sm text-brand-platinum/60">Gerente de Projetos</div>
            </div>
          </div>
        </div>
      </section>

      {/* Garantia */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <ShieldCheck className="text-brand-accent mx-auto mb-6" size={64} />
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">Garantia de Evolução</h2>
          <p className="text-xl text-brand-platinum/80 mb-8">
            Você tem 7 dias para testar o Master e o SENA Avançado. Se achar que o nível de exigência não é para você, ou que o conteúdo não entrega o que promete, devolvemos 100% do seu investimento. Sem perguntas.
          </p>
        </div>
      </section>

      {/* Oferta e Checkout */}
      <section id="checkout" className="py-24 bg-brand-accent text-brand-dark">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
                O próximo nível da sua jornada.
              </h2>
              <p className="text-xl opacity-90 mb-8 font-medium">
                Acesso imediato a todas as aulas e ao SENA Avançado.
              </p>
              <ul className="space-y-4 mb-8 font-medium">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="shrink-0" />
                  Formação Master PNL Completa (120h)
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="shrink-0" />
                  Acesso ilimitado ao SENA Avançado
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="shrink-0" />
                  Certificação de Competência (mediante aprovação)
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="shrink-0" />
                  Apostilas e materiais de apoio
                </li>
              </ul>
            </div>
            <div className="bg-brand-dark text-white p-8 md:p-10 rounded-[40px] shadow-2xl">
              <div className="text-center mb-8">
                <div className="text-brand-platinum/60 line-through mb-2">De {courses.masterPnl.priceFrom}</div>
                <div className="text-5xl font-bold text-white mb-2">
                  12x {courses.masterPnl.installment}
                </div>
                <div className="text-brand-accent">ou {courses.masterPnl.price} à vista</div>
              </div>
              
              <a
                href={courses.masterPnl.checkout}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-brand-accent text-brand-dark py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform mb-4"
              >
                Garantir Minha Vaga
              </a>
              
              <div className="flex items-center justify-center gap-2 text-sm text-brand-platinum/60 mb-6">
                <ShieldCheck size={16} />
                Compra 100% Segura
              </div>

              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-sm text-brand-platinum/80 text-center">
                <strong className="text-brand-accent block mb-1">Atenção:</strong>
                O acesso ao SENA Avançado requer conhecimento prévio de PNL.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Master */}
      <section className="py-24 bg-brand-dark">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">Perguntas Frequentes</h2>
          </div>
          
          <div className="space-y-4">
            {[
              {
                q: "Preciso ter feito o Practitioner com vocês?",
                a: "Não obrigatoriamente. Se você tem formação Practitioner por outra instituição e domina os fundamentos (Rapport, VAKOG, Metamodelo, Ancoragem), você conseguirá acompanhar. O SENA Avançado testará esses conhecimentos na prática."
              },
              {
                q: "O que acontece se eu reprovar na avaliação do SENA Avançado?",
                a: "Você pode refazer a avaliação quantas vezes precisar. O objetivo não é te punir, mas garantir que você atinja a excelência. O SENA te dará feedback detalhado sobre onde você falhou para que possa estudar e tentar novamente."
              },
              {
                q: "O certificado é reconhecido pelo MEC?",
                a: "A PNL é classificada como curso livre de qualificação profissional. Nosso certificado atesta sua competência técnica através de avaliação rigorosa (SENA), o que tem alto valor no mercado privado, mas não é uma pós-graduação acadêmica."
              },
              {
                q: "O Master ensina hipnose clínica?",
                a: "Ensinamos a Linguagem Hipnótica (Modelo Milton) aplicada à conversação e mudança de crenças. Não é um curso de hipnose de palco ou hipnoterapia clássica, mas sim o uso da estrutura da hipnose na comunicação diária e terapêutica."
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

      {/* Comparativo Final */}
      <section className="py-24 bg-white/5 border-t border-white/10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">Qual o seu próximo passo?</h2>
            <p className="text-brand-platinum text-lg">Compare as formações e escolha seu nível de profundidade.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px] bg-brand-dark rounded-[32px] overflow-hidden border border-white/10">
              <thead>
                <tr className="border-b border-white/10 bg-black/20">
                  <th className="p-6 w-1/4"></th>
                  <th className="p-6 w-3/8 border-l border-white/10">
                    <div className="text-xl font-bold text-white mb-1">Practitioner</div>
                    <div className="text-sm text-brand-platinum/60 font-normal">O Fundamento</div>
                  </th>
                  <th className="p-6 w-3/8 border-l border-white/10 bg-brand-accent/5">
                    <div className="text-xl font-bold text-brand-accent mb-1">Master</div>
                    <div className="text-sm text-brand-platinum/60 font-normal">A Excelência</div>
                  </th>
                </tr>
              </thead>
              <tbody className="text-brand-platinum">
                <tr className="border-b border-white/5">
                  <td className="p-6 font-medium text-white">Foco Principal</td>
                  <td className="p-6 border-l border-white/10">Aprender o vocabulário, aplicar técnicas base, resolver questões pontuais.</td>
                  <td className="p-6 border-l border-white/10 bg-brand-accent/5">Fluência, estratégia, casos complexos, modelagem de excelência.</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-6 font-medium text-white">Ementa</td>
                  <td className="p-6 border-l border-white/10">VAKOG, Rapport, Metamodelo, Ancoragem, Cura de Fobia simples.</td>
                  <td className="p-6 border-l border-white/10 bg-brand-accent/5">Metaprogramas, Valores, Sleight of Mouth, Modelo Milton, Modelagem.</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-6 font-medium text-white">SENA (Simulador)</td>
                  <td className="p-6 border-l border-white/10">SENA Básico: Guia paciente, corrige erros de estrutura, foca no aprendizado.</td>
                  <td className="p-6 border-l border-white/10 bg-brand-accent/5">SENA Avançado: Cliente resistente, avalia estratégia, exige ecologia.</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-6 font-medium text-white">Certificação</td>
                  <td className="p-6 border-l border-white/10">Nota mínima 7/10.</td>
                  <td className="p-6 border-l border-white/10 bg-brand-accent/5">Nota mínima 8/10 + Projeto de Modelagem.</td>
                </tr>
                <tr>
                  <td className="p-6 font-medium text-white">Investimento</td>
                  <td className="p-6 border-l border-white/10">12x R$ 24,75</td>
                  <td className="p-6 border-l border-white/10 bg-brand-accent/5">12x R$ 87,50</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/pnl-practitioner" className="w-full sm:w-auto text-center px-8 py-4 rounded-full border border-white/20 text-white font-bold hover:bg-white/5 transition-colors">
              Quero começar pelo Practitioner
            </Link>
            <a href="#checkout" className="w-full sm:w-auto text-center px-8 py-4 rounded-full bg-brand-accent text-brand-dark font-bold hover:scale-105 transition-transform">
              Já tenho base — quero o Master
            </a>
            <a href="https://wa.me/5511987355750" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto text-center px-8 py-4 rounded-full border border-brand-accent/30 text-brand-accent font-bold hover:bg-brand-accent/10 transition-colors">
              Falar com equipe sobre qual é meu nível
            </a>
          </div>
        </div>
      </section>

      {/* Course Reviews */}
      <section className="bg-brand-dark border-t border-white/5">
        <CourseReviews courseId="master-pnl" />
      </section>

    </div>
  );
};

export default MasterPNL;
