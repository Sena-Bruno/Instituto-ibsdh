/**
 * Gera as imagens DERIVADAS do site: os cartões de compartilhamento e as
 * variantes responsivas da imagem de maior renderização.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  POR QUE A CAPA DO CURSO NÃO SERVE COMO `og:image`                    │
 * │                                                                       │
 * │  As capas são pôsteres em retrato, 760×1085. O WhatsApp, o Facebook   │
 * │  e o LinkedIn recortam a imagem para a faixa 1,91:1 do cartão — e     │
 * │  recortam pelo CENTRO. Numa arte vertical dessas, o centro é a        │
 * │  ilustração: o recorte automático descarta exatamente a faixa de      │
 * │  baixo, que é onde está o nome da formação.                           │
 * │                                                                       │
 * │  O resultado eram quatro links de curso compartilhando uma tarja sem  │
 * │  título — no canal que o próprio site elege como principal, já que o  │
 * │  botão de WhatsApp é fixo em todas as páginas.                        │
 * │                                                                       │
 * │  Aqui o recorte é DECIDIDO, e não sofrido: a faixa é ancorada no      │
 * │  título, e o que sai do quadro é a margem de cima, que não carrega    │
 * │  informação nenhuma.                                                  │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * Não roda no build de propósito: o resultado é um arquivo versionado em
 * `public/`, revisado por quem olha antes de subir. Gerar arte a cada
 * deploy é o tipo de coisa que muda sozinha sem ninguém ver.
 *
 *   npm run imagens
 *
 * Requer Python com Pillow (`pip install pillow`). Se o enquadramento não
 * agradar, mexa em `ancora` — é a fração da altura da capa que vira o
 * centro vertical do cartão.
 */

import { execFileSync } from 'node:child_process';

/**
 * Uma capa e onde fica o título dentro dela.
 *
 * `ancora` é a fração da ALTURA da capa que deve virar o centro vertical
 * do cartão. 0,5 é o centro (o recorte que as plataformas fazem sozinhas,
 * e que perde o título); acima disso, o quadro desce em direção ao nome
 * da formação.
 */
const cartoes = [
  /* 0,74 é a faixa do nome da formação nos quatro pôsteres. O corte
     automático das plataformas usaria 0,5 e mostraria só a ilustração. */
  { de: 'capa-practitioner.webp', para: 'og-practitioner.jpg', ancora: 0.74 },
  { de: 'capa-master-pnl.webp', para: 'og-master-pnl.jpg', ancora: 0.74 },
  { de: 'capa-hipnoterapia.webp', para: 'og-hipnoterapia.jpg', ancora: 0.74 },
  { de: 'capa-coaching.webp', para: 'og-coaching.jpg', ancora: 0.74 },
  /*
    A foto do Bruno não sai por recorte, e não é questão de achar a
    âncora certa: a cabeça ocupa 45% da altura do retrato, e a faixa de
    1,91:1 tirada da largura inteira tem 39%. Não existe recorte que
    caiba o rosto todo — qualquer âncora corta testa ou queixo.

    Por isso ela é composta: o retrato inteiro, na altura cheia do
    cartão, sobre um fundo feito da própria foto desfocada. Ninguém é
    decapitado e o cartão não tem borda preta.
  */
  { de: 'brunosena.webp', para: 'og-sobre.jpg', modo: 'composto' },
];

const python = `
import sys, json
from PIL import Image, ImageEnhance, ImageFilter

LARGURA, ALTURA = 1200, 630

for c in json.loads(sys.argv[1]):
    im = Image.open('public/' + c['de']).convert('RGB')

    if c.get('modo') == 'composto':
        # Fundo: a própria foto cobrindo o cartão, desfocada e escurecida.
        # Sai da foto, e não de uma cor fixa, para o cartão continuar
        # certo no dia em que a foto mudar.
        e = max(LARGURA / im.width, ALTURA / im.height)
        fundo = im.resize((round(im.width * e), round(im.height * e)), Image.LANCZOS)
        x = (fundo.width - LARGURA) // 2
        y = (fundo.height - ALTURA) // 2
        fundo = fundo.crop((x, y, x + LARGURA, y + ALTURA))
        fundo = fundo.filter(ImageFilter.GaussianBlur(28))
        fundo = ImageEnhance.Brightness(fundo).enhance(0.38)

        # Frente: o retrato inteiro, na altura cheia, um pouco à esquerda
        # do centro — é onde o olho procura um rosto num cartão largo.
        e = ALTURA / im.height
        frente = im.resize((round(im.width * e), ALTURA), Image.LANCZOS)
        fundo.paste(frente, (round(LARGURA * 0.30) - frente.width // 2, 0))

        fundo.save('public/' + c['para'], 'JPEG', quality=88, optimize=True, progressive=True)
        print('  * %-26s -> %s (composto)' % (c['de'], c['para']))
        continue

    # Escala pela largura: a capa preenche o cartão de ponta a ponta.
    escala = LARGURA / im.width
    im = im.resize((LARGURA, round(im.height * escala)), Image.LANCZOS)

    # A faixa de 630px é centrada na âncora, presa dentro da imagem.
    centro = c['ancora'] * im.height
    topo = round(min(max(centro - ALTURA / 2, 0), im.height - ALTURA))
    # JPEG, e não PNG nem WebP.
    #
    # PNG guarda uma foto de 1200×630 em 200 kB a 1 MB, e o cartão é
    # baixado toda vez que alguém cola o link em qualquer lugar. WebP
    # ficaria menor ainda, mas o suporte a WebP em "og:image" varia entre
    # plataformas — e um cartão que não abre no LinkedIn é pior do que um
    # cartão de 40 kB. JPEG é o único formato que todas leem.
    im.crop((0, topo, LARGURA, topo + ALTURA)).save(
        'public/' + c['para'], 'JPEG', quality=88, optimize=True, progressive=True
    )
    print('  ✓ %-26s → %s' % (c['de'], c['para']))
`;

/**
 * As variantes de largura da imagem que determina o LCP.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  POR QUE UMA IMAGEM SÓ NÃO BASTA AQUI                                 │
 * │                                                                       │
 * │  O retrato do Bruno abre a home e a /sobre, e nas duas ele é a maior  │
 * │  coisa desenhada na primeira tela — é ele que o navegador reporta     │
 * │  como LCP, que é a métrica que o Google usa.                          │
 * │                                                                       │
 * │  São 143 kB a 900 px de largura, servidos igualmente para um monitor  │
 * │  de 2560 px e para um celular que vai mostrar a imagem com 340 px. No │
 * │  celular, quase três quartos desses bytes são jogados fora — e é      │
 * │  justamente no celular, em rede móvel, que o LCP aperta.              │
 * │                                                                       │
 * │  Só as LARGURAS entram aqui. A imagem original continua em `public/`  │
 * │  e continua sendo o maior degrau do `srcset`.                         │
 * └───────────────────────────────────────────────────────────────────────┘
 */
const variantes = [{ de: 'brunosena.webp', larguras: [600] }];

const pythonVariantes = `
import sys, json
from PIL import Image

for v in json.loads(sys.argv[1]):
    im = Image.open('public/' + v['de']).convert('RGB')
    raiz = v['de'].rsplit('.', 1)[0]
    for largura in v['larguras']:
        if largura >= im.width:
            continue
        altura = round(im.height * largura / im.width)
        saida = 'public/%s-%d.webp' % (raiz, largura)
        im.resize((largura, altura), Image.LANCZOS).save(
            saida, 'WEBP', quality=80, method=6
        )
        print('  * %-26s -> %s (%dx%d)' % (v['de'], saida.split('/')[-1], largura, altura))
`;

console.log('Cartões de compartilhamento (1200×630, JPEG):');
execFileSync('python3', ['-c', python, JSON.stringify(cartoes)], { stdio: 'inherit' });

console.log('\nVariantes responsivas da imagem de LCP:');
execFileSync('python3', ['-c', pythonVariantes, JSON.stringify(variantes)], {
  stdio: 'inherit',
});
