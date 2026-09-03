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
  Briefcase,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Activity,
  Eye
} from 'lucide-react';
import { courses } from '../config/courses';

const Hipnoterapia = () => {

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-brand-dark text-brand-platinum font-sans selection:bg-brand-accent selection:text-brand-dark" style={{ '--color-brand-accent': '#B67FF1' } as React.CSSProperties}>
      <Helmet>
        <title>Formação Hipnoterapia Clínica | Instituto SENA</title>
        <meta name="description" content="Aprenda Hipnoterapia Clínica e tenha acesso direto ao inconsciente. Domine induções, protocolos terapêuticos e hipnose ericksoniana com o Instituto SENA." />
        <meta name="keywords" content="curso de hipnoterapia clínica, formação em hipnose, Hipnoterapia Clínica, Hipnose, Transe, Regressão, Instituto SENA" />
        <meta property="og:title" content="Formação Hipnoterapia Clínica | Instituto SENA" />
        <meta property="og:description" content="Aprenda Hipnoterapia Clínica e tenha acesso direto ao inconsciente. Domine induções e protocolos terapêuticos." />
        <meta property="og:image" content="https://institutobrunosena.com.br/mockuphip.png" />
        <meta property="og:url" content="https://institutobrunosena.com.br/hipnoterapia" />
        <meta property="og:type" content="course" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>


      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-accent/20 rounded-full blur-[120px] -z-10 opacity-50" />
        
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium mb-8">
            <AlertTriangle size={16} />
            <span>Formação Responsável — 4 módulos de ética e limites. Não formamos amadores.</span>
          </div>
          
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
            Hipnoterapia Clínica
          </h1>
          
          <p className="text-xl md:text-2xl text-brand-platinum/90 mb-8 leading-relaxed font-light">
            Acesso ético ao inconsciente. Transformação profunda em minutos.
          </p>
          
          <p className="text-lg text-brand-platinum/70 mb-12 max-w-3xl mx-auto">
            Aprenda a induzir transe terapêutico com segurança absoluta. <strong className="text-white">SENA Hipno:</strong> o único ambiente onde você pratica induções reais, testa profundidade e recebe feedback — sem risco para pessoas.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
            <div className="text-center sm:text-right">
              <div className="text-sm text-brand-platinum/60 line-through mb-1">De R$ 1.497</div>
              <div className="text-4xl font-bold text-white">
                12x R$ 32,50
              </div>
              <div className="text-sm text-brand-accent mt-1">ou R$ 397 à vista</div>
            </div>
            
            <a href="#checkout" className="group relative inline-flex items-center justify-center gap-3 bg-brand-accent text-brand-dark px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(242,125,38,0.4)]">
              Quero dominar a hipnose terapêutica
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-sm text-brand-platinum/60">
            <ShieldCheck size={16} className="text-brand-accent" />
            Acesso condicional: PNL Practitioner IBSDH (ou avaliação de entrada)
          </div>
        </div>
      </section>

      {/* O Problema */}
      <section className="py-24 bg-white/5 border-y border-white/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-8">
            Você sabe que a mente tem poder. Mas não sabe acessar.
          </h2>
          <div className="text-xl text-brand-platinum/80 leading-relaxed mb-12 text-left space-y-6">
            <p>
              Seus clientes (ou você mesmo) repetem padrões que a mente consciente <strong className="text-white">já entendeu</strong>, mas continua fazendo.
            </p>
            <ul className="space-y-3 pl-6 border-l-2 border-brand-accent/30">
              <li>Sabem que fumar mata, mas acendem o cigarro</li>
              <li>Sabem que a fobia é irracional, mas suam e tremem</li>
              <li>Sabem que "deveriam" relaxar, mas o corpo não obedece</li>
            </ul>
            <p className="font-bold text-white text-2xl text-center py-6">
              O consciente sabe. O inconsciente não cooperou.
            </p>
            <p>
              A hipnoterapia é a ponte. Mas aprender hipnose sem <strong className="text-white">segurança</strong> é perigoso. Sem <strong className="text-white">prática real</strong> é teatro. Sem <strong className="text-white">ética</strong> é irresponsabilidade.
            </p>
          </div>
        </div>
      </section>

      <SenaExplanation />

      {/* O Que Você Vai Dominar */}
      <section className="py-24 bg-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">Em 7 módulos, você se torna capaz de:</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {[
              { title: "Induzir transe terapêutico", desc: "Do leve ao profundo, com segurança e controle" },
              { title: "Aplicar protocolos específicos", desc: "Ansiedade, fobias, hábitos, dor, insônia, performance" },
              { title: "Conduzir regressão terapêutica", desc: "Acessar e reprocessar memórias com ética absoluta" },
              { title: "Usar hipnose conversacional", desc: "Sugestão indireta em diálogo cotidiano (vendas, liderança)" },
              { title: "Ensinar auto-hipnose", desc: "Empoderar clientes para autonomia" },
              { title: "Estruturar sessão completa", desc: "Da anamnese à documentação, protegendo você e o cliente" }
            ].map((item, i) => (
              <div key={i} className="bg-brand-dark p-6 rounded-3xl border border-white/10 flex items-start gap-4">
                <CheckCircle2 className="text-brand-accent shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="text-white font-bold mb-1">{item.title}</h3>
                  <p className="text-brand-platinum/70 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-3xl p-8 max-w-4xl mx-auto text-center">
            <AlertTriangle className="text-red-400 mx-auto mb-4" size={32} />
            <h3 className="text-xl font-bold text-white mb-2">E o mais importante:</h3>
            <p className="text-brand-platinum/90">
              Você aprende <strong className="text-red-400">quando NÃO usar hipnose</strong>. Esquizofrenia, borderline severo, trauma complexo não processado — você saberá identificar e encaminhar.
            </p>
          </div>
        </div>
      </section>

      {/* Para Quem É */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-16 text-center">Este curso é para você que:</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white/5 p-8 rounded-[32px] border border-white/10">
              <div className="text-brand-accent mb-6"><Briefcase size={32} /></div>
              <h3 className="text-2xl font-bold text-white mb-6">Terapeutas e Coaches</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3"><CheckCircle2 className="text-brand-accent shrink-0 mt-1" size={20} /> <span className="text-brand-platinum/80">Adiciona ferramenta de acesso direto ao inconsciente</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="text-brand-accent shrink-0 mt-1" size={20} /> <span className="text-brand-platinum/80">Resolve em sessões o que levaria meses em abordagem puramente conversacional</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="text-brand-accent shrink-0 mt-1" size={20} /> <span className="text-brand-platinum/80">Quer resultados mensuráveis para justificar valor premium</span></li>
              </ul>
            </div>
            
            <div className="bg-white/5 p-8 rounded-[32px] border border-white/10">
              <div className="text-brand-accent mb-6"><Eye size={32} /></div>
              <h3 className="text-2xl font-bold text-white mb-6">Uso Pessoal e Desenvolvimento</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3"><CheckCircle2 className="text-brand-accent shrink-0 mt-1" size={20} /> <span className="text-brand-platinum/80">Busca autodomínio profundo (auto-hipnose, regulação emocional)</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="text-brand-accent shrink-0 mt-1" size={20} /> <span className="text-brand-platinum/80">Quer entender a própria mente em nível inconsciente</span></li>
                <li className="flex items-start gap-3"><CheckCircle2 className="text-brand-accent shrink-0 mt-1" size={20} /> <span className="text-brand-platinum/80">Deseja ferramenta para performance, foco, eliminação de hábitos</span></li>
              </ul>
            </div>
          </div>

          <div className="bg-brand-accent/10 border border-brand-accent/30 rounded-3xl p-8 text-center">
            <h3 className="text-xl font-bold text-white mb-2">⚠️ Importante:</h3>
            <p className="text-brand-platinum/80">
              Hipnoterapia exige base de comunicação e leitura de padrões. Por isso, <strong className="text-white">PNL Practitioner é pré-requisito</strong>. Se você não tem, <Link to="/pnl-practitioner" className="text-brand-accent hover:underline">comece por lá</Link>. Se tem de outra formação, faça avaliação de entrada com SENA.
            </p>
          </div>
        </div>
      </section>

      {/* Cronograma Estruturado */}
      <section className="py-24 bg-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">100 horas. 44 aulas. Ética em primeiro lugar.</h2>
            <p className="text-brand-platinum text-lg">Ementa Oficial IBSDH</p>
          </div>

          <div className="space-y-6">
            {[
              {
                title: "MÓDULO 1: FUNDAMENTOS DO TRANSE (14h)",
                lessons: [
                  { id: "1-6", title: "História, neurociência, mecanismos, mitos, estados de consciência", practice: "Quiz, discussão, identificação de mitos" },
                  { id: "7", title: "ÉTICA OBRIGATÓRIA — Limites legais e profissionais", practice: "Quiz 100% para liberar Módulo 2", isEthic: true }
                ]
              },
              {
                title: "MÓDULO 2: INDUÇÕES E PROFUNDIZAÇÃO (16h)",
                lessons: [
                  { id: "8", title: "Preparo do cliente e ambiente", practice: "Simulação: cliente ansioso" },
                  { id: "9", title: "Indução Elman (fixação visual)", practice: "Indução em SENA + feedback de sinais", isHighlight: true },
                  { id: "10", title: "Indução progressiva", practice: "Indução completa" },
                  { id: "11", title: "Induções rápidas", practice: "Simulação: quando usar" },
                  { id: "12", title: "Testes de profundidade", practice: "SENA em transe → você testa" },
                  { id: "13", title: "Deepeners", practice: "Aprofundar transe induzido" },
                  { id: "14", title: "Emergência segura", practice: "SENA como paciente → você emerge" },
                  { id: "15", title: "PRÁTICA INTEGRADA", practice: "Avaliação obrigatória: nota mínima 7/10", isHighlight: true }
                ]
              },
              {
                title: "MÓDULO 3: PROTOCOLOS TERAPÊUTICOS (18h)",
                desc: "Ansiedade, fobias, hábitos, dor, insônia, performance, procedimentos médicos",
                lessons: [
                  { id: "16-22", title: "7 protocolos específicos", practice: "Simulação de cada caso" },
                  { id: "23", title: "ÉTICA OBRIGATÓRIA — Quando NÃO usar hipnose", practice: "Quiz 100% + casos-teste", isEthic: true }
                ]
              },
              {
                title: "MÓDULO 4: REGRESSÃO E MEMÓRIA (14h)",
                lessons: [
                  { id: "24-26", title: "Teoria, técnica, reprocessamento", practice: "Regressão simulada" },
                  { id: "27", title: "Falsas memórias: identificação e prevenção", practice: "Caso de risco" },
                  { id: "28", title: "ÉTICA CRÍTICA — Regressão e trauma", practice: "Casos-teste: faço ou encaminho?", isEthic: true },
                  { id: "29", title: "Integração pós-regressão", practice: "SENA pós-regressão" }
                ]
              },
              {
                title: "MÓDULO 5: HIPNOSE CONVERSACIONAL (14h)",
                lessons: [
                  { id: "30-33", title: "Sugestão indireta, padrões Erickson, metáforas, aplicações", practice: "Criação e feedback" },
                  { id: "34", title: "ÉTICA — Influência e consentimento", practice: "Debate guiado", isEthic: true }
                ]
              },
              {
                title: "MÓDULO 6: AUTO-HIPNOSE E ENSINO (12h)",
                desc: "Auto-hipnose básica e avançada, grupos, gravações terapêuticas",
                lessons: []
              },
              {
                title: "MÓDULO 7: PROFISSIONALIZAÇÃO (12h)",
                lessons: [
                  { id: "39", title: "Sessão completa", practice: "Nota parcial" },
                  { id: "40", title: "Anamnese hipnótica", practice: "3 históricos simulados" },
                  { id: "41", title: "Documentação e proteção legal", practice: "Preenchimento para caso SENA" },
                  { id: "42", title: "Precificação e posicionamento", practice: "Questionamento do SENA" },
                  { id: "43", title: "Atendimento online", practice: "Indução via simulação de vídeo" },
                  { id: "44", title: "EXAME FINAL", practice: "SENA como cliente complexo → nota mínima 7/10", isHighlight: true }
                ]
              }
            ].map((mod, idx) => (
              <details key={idx} className="bg-brand-dark border border-white/10 rounded-[32px] overflow-hidden group" open={idx === 0}>
                <summary className="bg-white/5 p-6 border-b border-white/10 cursor-pointer flex justify-between items-center list-none [&::-webkit-details-marker]:hidden">
                  <div>
                    <h3 className="text-xl font-bold text-brand-accent">{mod.title}</h3>
                    {mod.desc && <p className="text-sm text-brand-platinum/60 mt-1">{mod.desc}</p>}
                  </div>
                  <ChevronDown className="text-brand-accent transition-transform group-open:rotate-180" />
                </summary>
                {mod.lessons.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                      <thead>
                        <tr className="border-b border-white/10 bg-black/20 text-brand-platinum/60 text-sm">
                          <th className="p-4 w-16 text-center">Aula</th>
                          <th className="p-4 w-1/2">Título</th>
                          <th className="p-4">Prática SENA</th>
                        </tr>
                      </thead>
                      <tbody className="text-brand-platinum text-sm">
                        {mod.lessons.map((lesson, lIdx) => (
                          <tr key={lIdx} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${lesson.isEthic ? 'bg-red-500/5' : ''}`}>
                            <td className="p-4 text-center font-mono text-brand-platinum/40">{lesson.id}</td>
                            <td className={`p-4 font-medium ${lesson.isEthic ? 'text-red-400' : lesson.isHighlight ? 'text-white font-bold' : 'text-white'}`}>{lesson.title}</td>
                            <td className={`p-4 ${lesson.isEthic ? 'text-red-400 font-bold' : lesson.isHighlight ? 'text-brand-accent font-bold' : 'text-brand-accent'}`}>{lesson.practice}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Certificação */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <Award className="text-brand-accent mx-auto mb-6" size={64} />
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">Dois níveis. Um significa competência real.</h2>
          
          <div className="overflow-x-auto mt-12">
            <table className="w-full text-left border-collapse min-w-[600px] bg-brand-dark rounded-[32px] overflow-hidden border border-white/10">
              <thead>
                <tr className="border-b border-white/10 bg-black/20">
                  <th className="p-6 w-1/4"></th>
                  <th className="p-6 w-3/8 border-l border-white/10">
                    <div className="text-xl font-bold text-white mb-1">Certificado de Conclusão</div>
                  </th>
                  <th className="p-6 w-3/8 border-l border-white/10 bg-brand-accent/5">
                    <div className="text-xl font-bold text-brand-accent mb-1">Certificado de Hipnoterapeuta Clínico</div>
                  </th>
                </tr>
              </thead>
              <tbody className="text-brand-platinum">
                <tr className="border-b border-white/5">
                  <td className="p-6 font-medium text-white">Como obter</td>
                  <td className="p-6 border-l border-white/10">44 aulas + quizzes éticos 100%</td>
                  <td className="p-6 border-l border-white/10 bg-brand-accent/5">Exame 44 (nota 7/10) + 2 casos documentados</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-6 font-medium text-white">Validação</td>
                  <td className="p-6 border-l border-white/10">Conhecimento teórico e ético</td>
                  <td className="p-6 border-l border-white/10 bg-brand-accent/5 font-bold text-white">Indução real, profundidade testada, segurança comprovada</td>
                </tr>
                <tr>
                  <td className="p-6 font-medium text-white">Alerta legal</td>
                  <td className="p-6 border-l border-white/10">—</td>
                  <td className="p-6 border-l border-white/10 bg-brand-accent/5 text-sm">Verifique legislação da sua região para prática clínica</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-16 flex justify-center">
            <div className="w-full max-w-5xl relative">
              <div className="absolute inset-0 bg-brand-accent/20 blur-[100px] rounded-full" />
              <img src="/Certificado-IBSDH-hipnoterapia.webp" alt="Certificado de Hipnoterapeuta Clínico" className="w-full h-auto object-contain rounded-[32px] shadow-2xl relative z-10 border border-white/10" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* Garantia */}
      <section className="py-24 bg-brand-dark">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <ShieldCheck className="text-brand-accent mx-auto mb-6" size={64} />
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-8">Garantia de Segurança</h2>
          <div className="bg-white/5 p-8 rounded-3xl border border-white/10 text-lg text-brand-platinum/80 leading-relaxed text-left space-y-4">
            <p>Acesse. Teste o SENA Hipno. Tente sua primeira indução.</p>
            <p>Se em 7 dias você não sentir que este é o <strong className="text-white">caminho mais seguro para dominar a hipnose</strong>, devolvemos 100%.</p>
            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl mt-6">
              <p className="text-red-400 text-sm">
                <strong>Mas saiba:</strong> este curso <strong className="text-white">não deixa você avançar sem ética</strong>. Quizzes 100% são obrigatórios. Sua segurança e a do futuro cliente dependem disso.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Oferta e Checkout */}
      <section id="checkout" className="py-24 bg-brand-accent text-brand-dark">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
                Domine o acesso ao inconsciente.
              </h2>
              <p className="text-xl opacity-90 mb-8 font-medium">
                Acesso imediato a todas as aulas e ao SENA Hipno.
              </p>
              <ul className="space-y-4 mb-8 font-medium">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="shrink-0" />
                  44 aulas, acesso vitalício
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="shrink-0" />
                  <strong>SENA Hipno: prática ilimitada</strong>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="shrink-0" />
                  Atualizações futuras
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="shrink-0" />
                  Certificado (após aprovação no Exame 44)
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="shrink-0" />
                  Comunidade de hipnoterapeutas
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="shrink-0" />
                  Suporte 12 meses
                </li>
              </ul>
            </div>
            <div className="bg-brand-dark text-white p-8 md:p-10 rounded-[40px] shadow-2xl">
              <div className="text-center mb-8">
                <div className="text-brand-platinum/60 line-through mb-2">De R$ 1.497,00</div>
                <div className="text-5xl font-bold text-white mb-2">
                  12x R$ 32,50
                </div>
                <div className="text-brand-accent">ou R$ 397 à vista</div>
              </div>
              
              <a
                href={courses.hipnoterapia.checkout}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-brand-accent text-brand-dark py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform mb-4"
              >
                Quero acessar o inconsciente com segurança
              </a>
              
              <div className="flex items-center justify-center gap-2 text-sm text-brand-platinum/60 mb-6">
                <ShieldCheck size={16} />
                Compra 100% Segura
              </div>

              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-sm text-brand-platinum/80 text-center">
                <strong className="text-brand-accent block mb-1">Pré-requisito:</strong>
                PNL Practitioner IBSDH (ou avaliação de entrada)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-brand-dark">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">Perguntas Frequentes</h2>
          </div>
          
          <div className="space-y-4">
            {[
              {
                q: "Posso fazer sem PNL Practitioner?",
                a: "Avaliação de entrada obrigatória. Hipnoterapia exige base de leitura de padrões e comunicação. Se não tem, comece pelo Practitioner."
              },
              {
                q: "Qual a diferença do SENA Hipno para o SENA comum?",
                a: "SENA Hipno simula estados de transe. Ele reporta sinais (peso nas pálpebras, respiração alterada, distanciamento temporal), resiste se indução for mal feita, e avalia profundidade. É específico para hipnose."
              },
              {
                q: "O certificado me permite atender?",
                a: "Atesta formação em hipnoterapia. Verifique legislação da sua região — alguns estados exigem vínculo a conselho profissional para atendimento terapêutico formal."
              },
              {
                q: "E se eu não atingir 7/10 no Exame 44?",
                a: "3 tentativas incluídas. SENA dá feedback detalhado entre tentativas."
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

      {/* Comparativo PNL vs Hipnoterapia */}
      <section className="py-24 bg-white/5 border-t border-white/10" id="comparativo">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">PNL vs. Hipnoterapia</h2>
            <p className="text-brand-platinum text-lg">Entenda a sinergia e as diferenças entre as abordagens.</p>
          </div>

          <div className="overflow-x-auto mb-16">
            <table className="w-full text-left border-collapse min-w-[800px] bg-brand-dark rounded-[32px] overflow-hidden border border-white/10">
              <thead>
                <tr className="border-b border-white/10 bg-black/20">
                  <th className="p-6 w-1/4"></th>
                  <th className="p-6 w-3/8 border-l border-white/10">
                    <div className="text-xl font-bold text-white mb-1">PNL (Practitioner/Master)</div>
                  </th>
                  <th className="p-6 w-3/8 border-l border-white/10 bg-brand-accent/5">
                    <div className="text-xl font-bold text-brand-accent mb-1">Hipnoterapia Clínica</div>
                  </th>
                </tr>
              </thead>
              <tbody className="text-brand-platinum">
                <tr className="border-b border-white/5">
                  <td className="p-6 font-medium text-white">Alvo</td>
                  <td className="p-6 border-l border-white/10">Estrutura do pensamento e comportamento</td>
                  <td className="p-6 border-l border-white/10 bg-brand-accent/5">Estados de consciência e acesso inconsciente</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-6 font-medium text-white">Metáfora</td>
                  <td className="p-6 border-l border-white/10">Reprogramar o software</td>
                  <td className="p-6 border-l border-white/10 bg-brand-accent/5">Acessar o modo de programação diretamente</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-6 font-medium text-white">Velocidade</td>
                  <td className="p-6 border-l border-white/10">Mudanças em semanas/sessões</td>
                  <td className="p-6 border-l border-white/10 bg-brand-accent/5">Mudanças em minutos (quando indicado)</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-6 font-medium text-white">Controle do cliente</td>
                  <td className="p-6 border-l border-white/10">Ativo, consciente, participativo</td>
                  <td className="p-6 border-l border-white/10 bg-brand-accent/5">Dissociado leve, acesso a recursos automáticos</td>
                </tr>
                <tr>
                  <td className="p-6 font-medium text-white">Profundidade</td>
                  <td className="p-6 border-l border-white/10">Crenças, estratégias, identidade</td>
                  <td className="p-6 border-l border-white/10 bg-brand-accent/5">Emoções, memórias, padrões automáticos profundos</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-brand-dark p-8 md:p-12 rounded-[40px] border border-white/10 text-center mb-16">
            <h3 className="text-2xl font-bold text-white mb-6">Sinergia: PNL + Hipnoterapia</h3>
            <p className="text-xl text-brand-accent italic mb-8">"A mágica não está em escolher um. Está em saber quando combinar."</p>
            
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <h4 className="font-bold text-white mb-4">Exemplo: Fobia de Avião</h4>
                <ul className="space-y-2 text-sm text-brand-platinum/80">
                  <li><strong className="text-white">PNL:</strong> Análise de crença ("aviões caem"), Swish Pattern para imagem positiva</li>
                  <li><strong className="text-white">Hipnoterapia:</strong> Desensibilização em transe, ancoragem de calma para o dia do voo</li>
                  <li className="text-brand-accent mt-2"><strong>Resultado:</strong> Mudança estrutural (PNL) + recurso emocional sob demanda (hipnose)</li>
                </ul>
              </div>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <h4 className="font-bold text-white mb-4">Exemplo: Insônia</h4>
                <ul className="space-y-2 text-sm text-brand-platinum/80">
                  <li><strong className="text-white">Hipnoterapia:</strong> Indução noturna, higiene do sono</li>
                  <li><strong className="text-white">PNL:</strong> Submodalidades da "cama como lugar de preocupação" → "cama como lugar de sono"</li>
                  <li className="text-brand-accent mt-2"><strong>Resultado:</strong> Transe para adormecer (hipnose) + reestruturação do estímulo (PNL)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xl text-brand-platinum/80 italic max-w-3xl mx-auto mb-8">
              "PNL é a língua que falo com a mente consciente. Hipnoterapia é a língua que falo com a mente inconsciente. Fluente em ambas, sou bilíngue da transformação."
            </p>
            <p className="font-bold text-white">— Bruno Sena</p>
          </div>

          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/pnl-practitioner" className="w-full sm:w-auto text-center px-8 py-4 rounded-full border border-white/20 text-white font-bold hover:bg-white/5 transition-colors">
              Quero PNL
            </Link>
            <a href="#checkout" className="w-full sm:w-auto text-center px-8 py-4 rounded-full bg-brand-accent text-brand-dark font-bold hover:scale-105 transition-transform">
              Quero Hipnoterapia
            </a>
            <Link to="/jornada" className="w-full sm:w-auto text-center px-8 py-4 rounded-full border border-brand-accent/30 text-brand-accent font-bold hover:bg-brand-accent/10 transition-colors">
              Quero os dois — pacote
            </Link>
          </div>
        </div>
      </section>

      {/* Course Reviews */}
      <section className="bg-brand-dark border-t border-white/5">
        <CourseReviews courseId="hipnoterapia" />
      </section>

    </div>
  );
};

export default Hipnoterapia;
