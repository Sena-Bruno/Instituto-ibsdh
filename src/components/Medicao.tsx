import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { verPagina } from '../lib/medir';

/**
 * Conta uma página vista a cada troca de rota.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  POR QUE UM COMPONENTE, E NÃO UMA LINHA NO medir.ts                   │
 * │                                                                       │
 * │  O site navega sem recarregar. Para o gtag.js, que conta uma visita   │
 * │  por carregamento de documento, um visitante que percorre home →      │
 * │  formação → artigo é uma página só — e o relatório de "páginas mais   │
 * │  vistas" ficaria com a home inflada e o resto invisível.              │
 * │                                                                       │
 * │  Quem sabe que a rota mudou é o React Router, e ele só fala com quem  │
 * │  está dentro da árvore. Daí o componente que não desenha nada.        │
 * └───────────────────────────────────────────────────────────────────────┘
 */
export default function Medicao() {
  const { pathname, search } = useLocation();

  /*
    A primeira rota NÃO é enviada aqui: ela já foi contada pelo `config` do
    gtag.js, com a URL que o visitante abriu. Sem esta guarda toda entrada
    no site valeria duas páginas vistas — e número inflado é pior do que
    número nenhum, porque ninguém desconfia dele.
  */
  const primeira = useRef(true);

  useEffect(() => {
    if (primeira.current) {
      primeira.current = false;
      return;
    }

    /*
      ┌───────────────────────────────────────────────────────────────────┐
      │  POR QUE ESPERAR O TÍTULO EM VEZ DE LER E ENVIAR                  │
      │                                                                   │
      │  Quem escreve o <title> é o <Seo> da página de destino, e essa    │
      │  página ainda não montou quando a rota muda: ela entra por        │
      │  `lazy()`, então há um Suspense no meio. Ler `document.title`     │
      │  neste instante devolve o título da página ANTERIOR — e o         │
      │  relatório registraria cada navegação com o nome da página de     │
      │  onde a pessoa saiu.                                              │
      │                                                                   │
      │  Então o envio espera o título mudar, quadro a quadro, com teto.  │
      │  O teto existe para o caso de duas rotas com o mesmo título: sem  │
      │  ele, a página vista simplesmente nunca seria enviada.            │
      └───────────────────────────────────────────────────────────────────┘
    */
    const anterior = document.title;
    const caminho = `${pathname}${search}`;
    let quadros = 0;
    let pedido = 0;

    const tentar = () => {
      if (document.title !== anterior || quadros >= 60) {
        verPagina(caminho, document.title);
        return;
      }
      quadros += 1;
      pedido = requestAnimationFrame(tentar);
    };
    pedido = requestAnimationFrame(tentar);

    // Navegar de novo antes do título chegar cancela a espera: a rota que
    // ficou para trás não é mais a página em que o visitante está.
    return () => cancelAnimationFrame(pedido);
  }, [pathname, search]);

  return null;
}
