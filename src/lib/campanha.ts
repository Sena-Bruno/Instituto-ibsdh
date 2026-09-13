/**
 * De qual campanha o visitante veio — gravado junto com o lead.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  POR QUE ISTO NÃO É TRABALHO DO GA4                                   │
 * │                                                                       │
 * │  O GA4 também lê as etiquetas `utm_`, e melhor: cruza com sessão,     │
 * │  aparelho e primeira visita. Mas ele responde em AGREGADO — "o        │
 * │  anúncio A trouxe 40 sessões" — e nunca diz QUEM. É uma limitação de  │
 * │  projeto, não uma falta: relatório de analytics não identifica        │
 * │  pessoa.                                                              │
 * │                                                                       │
 * │  O que falta é a outra metade: a Maria, que entrou na lista de espera │
 * │  às 14h, veio do anúncio A ou do artigo sobre hipnose? Essa resposta  │
 * │  só existe se a etiqueta for gravada NO CADASTRO, e é o que este      │
 * │  arquivo faz. É a diferença entre saber que a campanha traz gente e   │
 * │  saber a quem ligar primeiro.                                        │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  PRIMEIRO TOQUE, E SÓ DENTRO DA ABA                                   │
 * │                                                                       │
 * │  A etiqueta é lida da URL de ENTRADA e guardada em `sessionStorage`.  │
 * │                                                                       │
 * │  Guardar é obrigatório porque quase ninguém preenche formulário na    │
 * │  página em que caiu: entra pelo anúncio num artigo, navega, e só      │
 * │  então se cadastra. Sem memória, a etiqueta morre na primeira         │
 * │  navegação e todo lead de campanha chega anônimo — que é exatamente   │
 * │  o estado que isto veio corrigir.                                     │
 * │                                                                       │
 * │  O primeiro valor vence: quem chegou pelo anúncio chegou pelo         │
 * │  anúncio, mesmo que depois passe por um link sem etiqueta.            │
 * │                                                                       │
 * │  `sessionStorage`, e não `localStorage`, por duas razões que andam    │
 * │  juntas: fechar a aba apaga (o dado não sobrevive semanas no aparelho │
 * │  de ninguém), e uma visita nova não é atribuída a uma campanha        │
 * │  antiga. A postura de privacidade aqui é deliberada — nada é gravado  │
 * │  em servidor nenhum enquanto a pessoa não preenche o formulário por   │
 * │  vontade própria, e o que se grava é a origem, nunca o comportamento. │
 * └───────────────────────────────────────────────────────────────────────┘
 */

/** Onde a etiqueta do primeiro toque fica guardada, dentro da aba. */
const CHAVE = 'ibsdh:campanha';

/**
 * O limite de `campanha` em firestore.rules. Repetido aqui porque o corte
 * tem de acontecer ANTES da gravação: um valor de 300 caracteres não passa
 * na validação, e o Firestore recusa o documento inteiro — o lead se
 * perderia por causa de uma etiqueta de campanha comprida.
 */
const LIMITE = 200;

/**
 * Um valor de `utm_`, limpo.
 *
 * Corta em 80 para que os três juntos caibam no limite com folga, e
 * descarta o que vier vazio. O `replace` tira o separador do próprio
 * formato: um `utm_source` contendo " / " partiria a string em quatro
 * pedaços e desalinharia a leitura de todas as colunas seguintes.
 */
function limpar(valor: string | null): string {
  return (valor ?? '')
    .trim()
    .replace(/\s*\/\s*/g, ' ')
    .slice(0, 80);
}

/**
 * Lê as etiquetas de uma query string e monta a forma legível.
 *
 * O formato é posicional — `origem / meio / campanha` — porque quem lê
 * isto é o Bruno, no CSV do /admin ou no aviso por e-mail, e
 * `instagram / cpc / setembro-hipnose` se entende de relance.
 * `utm_content` entra como quarta parte só quando existe: é o que
 * distingue uma arte de outra dentro da mesma campanha, e é a pergunta
 * real de quem está testando três criativos.
 *
 * As faltas viram `-` para que a posição de cada parte não mude. Sem o
 * espaço reservado, um anúncio sem `utm_medium` gravaria
 * `instagram / setembro` e a terceira coluna passaria a ser lida como a
 * segunda.
 *
 * Exportada para o teste: é a única parte com regra de verdade, e testá-la
 * pelo `sessionStorage` seria testar o navegador junto.
 */
export function montarCampanha(busca: string): string | undefined {
  const p = new URLSearchParams(busca);

  const origem = limpar(p.get('utm_source'));
  const meio = limpar(p.get('utm_medium'));
  const nome = limpar(p.get('utm_campaign'));
  const arte = limpar(p.get('utm_content'));

  // Sem nenhuma das três principais não há campanha: acesso direto, link
  // no Instagram sem etiqueta, resultado do Google. Devolver "- / - / -"
  // encheria a coluna de ruído com aparência de dado.
  if (!origem && !meio && !nome) return undefined;

  const partes = [origem || '-', meio || '-', nome || '-'];
  if (arte) partes.push(arte);

  return partes.join(' / ').slice(0, LIMITE);
}

/**
 * Guarda a etiqueta da URL de entrada, se houver e se ainda não houver uma.
 *
 * Chamada uma vez, no arranque. Não limpa a URL nem mexe no histórico: a
 * etiqueta na barra de endereço é inofensiva, e reescrever a URL na
 * primeira pintura é o tipo de mexida que quebra o botão "voltar" em
 * troca de nada.
 */
export function registrarCampanha(): void {
  if (typeof window === 'undefined') return;

  const atual = montarCampanha(window.location.search);
  if (!atual) return;

  try {
    // O primeiro toque vence: quem chegou pelo anúncio chegou pelo anúncio.
    if (sessionStorage.getItem(CHAVE)) return;
    sessionStorage.setItem(CHAVE, atual);
  } catch {
    /* Aba anônima, armazenamento bloqueado, cota estourada. A etiqueta é
       um enfeite do cadastro, nunca o cadastro: falhar aqui não pode
       impedir ninguém de se inscrever. */
  }
}

/**
 * A etiqueta desta visita, ou `undefined` para quem veio sem campanha.
 *
 * `undefined`, e nunca string vazia: o campo é opcional em
 * firestore.rules, e o SDK do Firestore recusa `undefined` dentro de um
 * documento. Quem grava usa `...(campanha ? { campanha } : {})`, e é assim
 * que o campo simplesmente não existe no documento de quem veio direto.
 */
export function campanhaDaVisita(): string | undefined {
  if (typeof window === 'undefined') return undefined;

  try {
    // Lê da URL também: quem cai direto no formulário com a etiqueta na
    // barra e preenche antes do arranque terminar continua atribuído.
    return sessionStorage.getItem(CHAVE) ?? montarCampanha(window.location.search);
  } catch {
    return montarCampanha(window.location.search);
  }
}
