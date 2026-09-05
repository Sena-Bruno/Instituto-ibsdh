/**
 * A paleta do sistema de cor.
 *
 * A cor pertence ao EIXO de formação, não ao curso — ver `config/eixos.ts`
 * para o porquê. Quem navega aprende a cor do eixo e passa a se localizar
 * por ela: card da home, botão de matrícula, brilho de fundo da página,
 * barra do rail de compra.
 *
 * As classes ficam escritas por extenso, e não montadas por template, porque
 * o Tailwind varre o código em busca de nomes de classe literais: uma string
 * como `text-brand-${cor}` some do CSS final e a cor não aparece no site.
 *
 * São cinco cores de propósito. Acima de seis campos de cor o olho deixa de
 * distinguir com confiança, então a paleta é um limite deliberado: se os
 * eixos passarem disso, o certo é agrupar eixos, não inventar cor nova.
 */

export type NomeCor = 'blue' | 'purple' | 'accent' | 'emerald' | 'warm';

export interface Paleta {
  /** Texto na cor da formação */
  texto: string;
  /** Fundo sólido, para botão preenchido */
  fundo: string;
  /** Classe do botão pronto */
  botao: string;
  /** Borda do card */
  borda: string;
  /** Borda no hover do card */
  bordaHover: string;
  /** Gradiente do topo do card */
  capa: string;
  /** Fundo tênue, para caixas de destaque */
  tenue: string;
  /** Valor cru do brilho, para a variável --brilho */
  brilho: string;
}

export const paletas: Record<NomeCor, Paleta> = {
  blue: {
    texto: 'text-brand-blue',
    fundo: 'bg-brand-blue',
    botao: 'btn-blue',
    borda: 'border-brand-blue/25',
    bordaHover: 'hover:border-brand-blue/55',
    capa: 'from-brand-blue/45 to-brand-blue/5',
    tenue: 'bg-brand-blue/10',
    brilho: 'rgb(92 156 250 / 20%)',
  },
  purple: {
    texto: 'text-brand-purple',
    fundo: 'bg-brand-purple',
    botao: 'btn-purple',
    borda: 'border-brand-purple/25',
    bordaHover: 'hover:border-brand-purple/55',
    capa: 'from-brand-purple/45 to-brand-purple/5',
    tenue: 'bg-brand-purple/10',
    brilho: 'rgb(182 127 241 / 20%)',
  },
  accent: {
    texto: 'text-brand-accent',
    fundo: 'bg-brand-accent',
    botao: 'btn-primary',
    borda: 'border-brand-accent/35',
    bordaHover: 'hover:border-brand-accent/65',
    capa: 'from-brand-accent/50 to-brand-accent/5',
    tenue: 'bg-brand-accent/10',
    brilho: 'rgb(229 195 101 / 24%)',
  },
  emerald: {
    texto: 'text-brand-emerald',
    fundo: 'bg-brand-emerald',
    botao: 'btn-emerald',
    borda: 'border-brand-emerald/25',
    bordaHover: 'hover:border-brand-emerald/55',
    capa: 'from-brand-emerald/45 to-brand-emerald/5',
    tenue: 'bg-brand-emerald/10',
    brilho: 'rgb(57 212 161 / 20%)',
  },
  warm: {
    texto: 'text-brand-warm',
    fundo: 'bg-brand-warm',
    botao: 'btn-warm',
    borda: 'border-brand-warm/25',
    bordaHover: 'hover:border-brand-warm/55',
    capa: 'from-brand-warm/45 to-brand-warm/5',
    tenue: 'bg-brand-warm/10',
    brilho: 'rgb(249 129 77 / 20%)',
  },
};
