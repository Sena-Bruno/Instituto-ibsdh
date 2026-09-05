/**
 * O texto institucional sobre o SENA, usado nas páginas de formação.
 *
 * Era uma <section> própria, com orbe de blur de 120px atrás, badge em
 * pílula e um card dourado de fecho. Agora é um bloco de conteúdo que se
 * encaixa na seção numerada da página, sem trazer o próprio espaçamento
 * nem o próprio fundo — quem decide o peso é a página.
 *
 * Os cinco parágrafos são texto do instituto e ficam como estão.
 */
const SenaExplanation = () => {
  return (
    <div>
      <h3 className="max-w-2xl font-display text-[26px] leading-tight font-semibold tracking-tight text-brand-cream md:text-[30px]">
        Sistema Evolutivo de Neuroaprendizagem Aplicada
      </h3>

      <div className="mt-7 space-y-5 text-[15.5px] leading-relaxed">
        <p>
          O SENA é a plataforma de simulação clínica e desenvolvimento prático do IBSDH, criada
          para levar o aluno além da teoria e aproximá-lo da realidade do atendimento com mais
          profundidade, critério e inteligência pedagógica.
        </p>
        <p>
          Mais do que uma ferramenta complementar, o SENA funciona como um ambiente de treino
          estruturado, no qual o aluno é desafiado a aplicar o conteúdo estudado diante de
          pacientes virtuais com perfis psicológicos específicos, exigindo adaptação, raciocínio
          clínico, clareza técnica e postura ética.
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
      </div>

      <p className="mt-8 border-l-2 border-brand-accent pl-5 font-display text-xl leading-snug text-brand-cream">
        O SENA não foi criado apenas para testar conhecimento.{' '}
        <span className="text-brand-accent">Foi criado para desenvolver competência.</span>
      </p>
    </div>
  );
};

export default SenaExplanation;
