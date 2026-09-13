import { Building2, Clock, Instagram, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Secao, { Cabecalho, Revela } from '../components/Secao';
import Seo from '../components/Seo';
import {
  emailSubjects,
  mailtoLink,
  routes,
  site,
  whatsappLink,
  whatsappMessages,
} from '../config/site';
import { organizacao, paginaDeContato, trilhaDeNavegacao } from '../lib/schema';

/**
 * Onde falar com o instituto.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  POR QUE UMA PÁGINA, SE O WHATSAPP JÁ FLUTUA EM TODA TELA             │
 * │                                                                       │
 * │  Porque o botão flutuante serve a quem JÁ ESTÁ no site, e essa não é  │
 * │  a única forma de alguém procurar contato. "Instituto Bruno Sena      │
 * │  contato" é uma busca que existe, e não tinha onde cair: o rastreador │
 * │  encontrava um `mailto:` no rodapé e nenhuma página sobre o assunto.  │
 * │                                                                       │
 * │  Há um segundo motivo, menos óbvio: o flutuante oferece UM caminho, o │
 * │  WhatsApp. Quem prefere e-mail, quem escreve de dentro de uma empresa │
 * │  com WhatsApp bloqueado, e quem quer proposta corporativa não estavam │
 * │  atendidos — e são justamente os contatos de maior valor.             │
 * └───────────────────────────────────────────────────────────────────────┘
 */

const canais = [
  {
    icone: MessageCircle,
    titulo: 'WhatsApp',
    descricao: 'O caminho mais rápido para dúvida sobre formação, pagamento ou certificado.',
    rotulo: site.whatsapp.display,
    href: whatsappLink(whatsappMessages.general),
    externo: true,
    destaque: true,
  },
  {
    icone: Mail,
    titulo: 'E-mail',
    descricao:
      'Para pedidos que pedem registro escrito: nota fiscal, dados pessoais (LGPD), segunda via de certificado.',
    rotulo: site.email.contact,
    href: mailtoLink(site.email.contact),
    externo: false,
    destaque: false,
  },
  {
    icone: Building2,
    titulo: 'Treinamentos In Company',
    descricao:
      'Proposta para equipes, RH e instituições. Escopo, carga horária e formato são montados caso a caso.',
    rotulo: site.email.partnerships,
    href: mailtoLink(site.email.partnerships, emailSubjects.inCompany),
    externo: false,
    destaque: false,
  },
  {
    icone: Instagram,
    titulo: 'Instagram',
    descricao: 'O conteúdo do dia a dia, e a porta aberta para mensagem direta.',
    rotulo: site.social.instagramHandle,
    href: site.social.instagram,
    externo: true,
    destaque: false,
  },
];

export default function Contato() {
  return (
    <>
      <Seo
        rota={routes.contato}
        titulo={`Contato | ${site.name}`}
        descricao={`Fale com o ${site.name}: WhatsApp ${site.whatsapp.display}, ${site.email.contact}, e proposta para treinamentos In Company.`}
        dados={[
          organizacao(),
          paginaDeContato(),
          trilhaDeNavegacao([
            { nome: 'Início', rota: routes.home },
            { nome: 'Contato', rota: routes.contato },
          ]),
        ]}
      />

      <main>
        <Secao cor="accent" brilho brilhoEm="topo" className="pt-36">
          <Cabecalho sobretitulo="Contato" titulo="Fale com o instituto" como="h1" centralizado>
            Quatro caminhos, e cada um serve melhor a um tipo de pergunta. Escolha o que couber
            — respondemos por todos.
          </Cabecalho>

          <div className="mx-auto mt-10 grid max-w-4xl gap-5 md:grid-cols-2">
            {canais.map((canal) => {
              const Icone = canal.icone;
              return (
                <Revela key={canal.titulo}>
                  <a
                    href={canal.href}
                    {...(canal.externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="cartao flex h-full flex-col p-6 transition-colors hover:border-brand-accent/40"
                  >
                    <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-accent/10 text-brand-accent">
                      <Icone size={20} aria-hidden="true" />
                    </span>
                    <h2 className="mb-2 font-display text-[17px] font-bold text-brand-cream">
                      {canal.titulo}
                    </h2>
                    <p className="mb-4 text-[14.5px] leading-relaxed">{canal.descricao}</p>
                    <span
                      className={`mt-auto text-[14px] font-semibold ${
                        canal.destaque ? 'text-brand-accent' : 'text-brand-cream'
                      }`}
                    >
                      {canal.rotulo}
                    </span>
                  </a>
                </Revela>
              );
            })}
          </div>
        </Secao>

        <Secao elevada>
          <div className="mx-auto max-w-3xl">
            <div className="cartao flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:p-8">
              <Clock
                size={22}
                aria-hidden="true"
                className="shrink-0 text-brand-accent sm:mt-1"
              />
              <div>
                <h2 className="mb-2 font-display text-lg font-bold text-brand-cream">
                  Quando você recebe resposta
                </h2>
                <p className="text-[14.5px] leading-relaxed">
                  Mensagens no WhatsApp costumam ser respondidas no mesmo dia útil. E-mails, em
                  até dois dias úteis. Pedidos relativos a dados pessoais têm prazo próprio,
                  fixado pela LGPD: <strong className="text-brand-cream">até 15 dias</strong> —
                  o mesmo prazo declarado na{' '}
                  <Link
                    to={routes.privacidade}
                    className="text-brand-accent underline underline-offset-2"
                  >
                    política de privacidade
                  </Link>
                  .
                </p>
              </div>
            </div>

            {/*
              O aviso sobre o que o instituto NÃO atende. Existe porque a
              alternativa é pior: quem escreve procurando atendimento clínico
              de urgência e recebe uma resposta comercial dois dias depois foi
              mal atendido no momento em que mais precisava.
            */}
            <p className="mt-6 text-center text-[13.5px] leading-relaxed text-brand-quiet">
              O instituto forma profissionais e não presta atendimento clínico de urgência. Se
              você precisa de ajuda imediata, procure o CVV pelo <strong>188</strong> (ligação
              gratuita, 24 horas) ou um serviço de saúde da sua região.
            </p>
          </div>
        </Secao>
      </main>
    </>
  );
}
