import { Brain } from 'lucide-react';

const SenaExplanation = () => {
  return (
    <section className="py-24 bg-brand-dark relative overflow-hidden border-y border-white/10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-accent/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-accent/10 border border-brand-accent/30 text-brand-accent text-sm font-bold tracking-widest uppercase mb-6">
            <Brain size={18} />
            <span>SENA</span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6">
            Sistema Evolutivo de Neuroaprendizagem Aplicada
          </h2>
        </div>

        <div className="space-y-6 text-lg text-brand-platinum/80 leading-relaxed">
          <p>
            O SENA é a plataforma de simulação clínica e desenvolvimento prático do IBSDH,
            criada para levar o aluno além da teoria e aproximá-lo da realidade do atendimento
            com mais profundidade, critério e inteligência pedagógica.
          </p>
          <p>
            Mais do que uma ferramenta complementar, o SENA funciona como um ambiente de treino
            estruturado, no qual o aluno é desafiado a aplicar o conteúdo estudado diante de
            pacientes virtuais com perfis psicológicos específicos, exigindo adaptação,
            raciocínio clínico, clareza técnica e postura ética.
          </p>
          <p>
            Cada resposta é analisada com base na estrutura oficial das aulas, permitindo uma
            avaliação muito mais coerente com o processo formativo. O sistema identifica pontos
            fortes, revela lacunas, orienta o que precisa ser revisado e acompanha a evolução do
            aluno ao longo da jornada. Assim, a aprendizagem deixa de ser apenas informativa e
            passa a ser ativa, aplicada e mensurável.
          </p>
          <p>
            Além do processo avaliativo, o SENA também atua como tutor inteligente de apoio
            pedagógico, esclarecendo dúvidas, reforçando fundamentos e ajudando o aluno a
            compreender melhor os conceitos e a aplicação prática das técnicas estudadas.
          </p>
          <p>
            O resultado é uma experiência de formação mais sólida, exigente e diferenciada, que
            fortalece a segurança do aluno, estimula autonomia e eleva o nível de preparo para a
            prática profissional.
          </p>
          <div className="mt-10 p-8 bg-brand-accent/10 border border-brand-accent/30 rounded-3xl text-center">
            <p className="text-2xl font-display font-bold text-white">
              O SENA não foi criado apenas para testar conhecimento.{' '}
              <br className="hidden md:block" />
              <span className="text-brand-accent">
                Foi criado para desenvolver competência.
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SenaExplanation;
