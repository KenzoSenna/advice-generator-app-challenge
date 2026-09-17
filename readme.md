# Advice Generator App

Uma solução completa para o desafio de frontend do Frontend Mentor, desenvolvida para gerar conselhos aleatórios com base em uma API pública, mantendo a interface visual próxima ao mockup e priorizando experiência do usuário, performance e acessibilidade.

## Sumário

- [Visão geral](#visão-geral)
  - [Contexto do desafio](#contexto-do-desafio)
  - [Objetivo da solução](#objetivo-da-solução)
- [Requisitos atendidos](#requisitos-atendidos)
- [Tecnologias e ferramentas](#tecnologias-e-ferramentas)
- [Arquitetura e estrutura do projeto](#arquitetura-e-estrutura-do-projeto)
- [Como executar](#como-executar)
- [Detalhes de implementação](#detalhes-de-implementação)
  - [Consumo da Advice Slip API](#consumo-da-advice-slip-api)
  - [Lógica de atualização do conteúdo](#lógica-de-atualização-do-conteúdo)
  - [Acessibilidade e UX](#acessibilidade-e-ux)
  - [Robustez e tratamento de erro](#robustez-e-tratamento-de-erro)
- [Aprendizados e refinamentos](#aprendizados-e-refinamentos)
- [Resultados alcançados](#resultados-alcançados)
- [Autor](#autor)

## Visão geral

### Contexto do desafio

Este projeto foi desenvolvido a partir do desafio "Advice generator app" do Frontend Mentor. O objetivo principal era construir uma interface moderna e responsiva que consumisse a [Advice Slip API](https://api.adviceslip.com) e exibisse um conselho aleatório sempre que o usuário interagisse com o botão principal.

Além do aspecto visual, o desafio exigia atenção a detalhes fundamentais do desenvolvimento frontend, como:

- adaptação mobile-first e responsividade;
- implementação de hover e focus states;
- boa organização semântica em HTML;
- uso eficiente de CSS para manter estética próxima ao protótipo;
- integração dinâmica com API externa;
- acessibilidade para leitores de tela e navegação por teclado.

### Objetivo da solução

A proposta foi criar uma interface simples, elegante e funcional, mantendo a experiência do usuário fluida e intuitiva. A solução também busca demonstrar domínio prático de conceitos importantes como manipulação do DOM, consumo de API, validação de dados, feedback visual e acessibilidade em aplicações reais.

## Requisitos atendidos

A aplicação atende aos principais requisitos esperados pelo desafio:

- layout otimizado para mobile e desktop;
- cartão centralizado com visual próximo ao design reference;
- botão circular para geração de novo conselho;
- hover state para feedback visual;
- atualização dinâmica do conselho e do identificador;
- mensagem de carregamento durante a requisição;
- tratamento de erro em caso de falha de rede ou resposta inválida;
- suporte para leitura assistiva e navegação por teclado;
- prevenção de repetição de conselho em clique consecutivo.

## Tecnologias e ferramentas

- HTML5 semântico
- CSS3 com variáveis e design tokens
- JavaScript ES6+
- Bootstrap 5 para utilidades e base visual
- Fetch API para comunicação com a API externa
- DevTools e inspeção de elementos para ajustes visuais e de comportamento
- Acessibilidade web com foco visível e live regions

## Arquitetura e estrutura do projeto

```text
.
├── css/
│   └── style.css
├── design/
├── images/
├── js/
│   └── app.js
├── AGENTS.md
├── CLAUDE.md
├── index.html
├── README-template.md
├── README copy.md
├── style-guide.md
├── .gitignore
└── README.md (opcional, se renomeado após personalização)
```

### Principais arquivos

- `index.html`: estrutura HTML da página, incluindo card do conselho, botão e elementos acessíveis.
- `css/style.css`: estilos visuais, responsividade, animações sutis, hover e foco.
- `js/app.js`: lógica de consumo da API, atualização do DOM, controle de loading e tratamento de erro.
- `style-guide.md`: guia de paleta, tipografia e padrões visuais do desafio.
- `design/`: arquivos de referência do layout.
- `images/`: assets do projeto, como divider e favicon.

## Como executar

Como é uma aplicação estática, não é necessário instalar dependências externas.

### Opção 1: abrir diretamente no navegador

1. baixe ou clone o repositório;
2. navegue até a pasta do projeto;
3. abra o arquivo `index.html` em um navegador moderno.

### Opção 2: executar localmente com servidor

```bash
cd caminho/para/o/projeto
python -m http.server 8000
```

Em seguida, acesse:

```text
http://localhost:8000
```

## Detalhes de implementação

### Consumo da Advice Slip API

A integração com a API foi feita com o método `fetch`, configurando `cache: "no-store"` para garantir que a resposta mais recente seja sempre utilizada, evitando cache do navegador que poderia impedir a mudança de conselho ao clicar repetidamente.

Além disso, foi definido um timeout com `AbortController`, o que reduz o risco de requisições pendentes e melhora o comportamento em conexões instáveis.

### Lógica de atualização do conteúdo

A interface atualiza os elementos do card de forma encapsulada e segura, substituindo apenas o conteúdo necessário. A lógica também valida a estrutura da resposta da API antes de renderizar os dados, evitando erros caso o payload venha em um formato inesperado.

Foi também implementada uma verificação para garantir que o conselho gerado seja diferente do atual. Quando a API retorna o mesmo ID, uma nova tentativa é feita em sequência, melhorando a percepção de responsividade da ação do usuário.

### Acessibilidade e UX

A aplicação foi tratada com preocupação de UX e A11y, incluindo:

- `aria-live` para anunciar atualizações do conteúdo sem interromper o fluxo do usuário;
- `role="alert"` para mensagens de erro;
- `aria-disabled` no botão em vez de desabilitar completamente o elemento, preservando a navegabilidade e a experiência de teclado;
- foco visível em elementos interativos;
- suporte a estado de carregamento sem bloquear a interação indevidamente;
- fallback visual para situações em que o JavaScript não esteja disponível.

### Robustez e tratamento de erro

A implementação inclui mecanismos para lidar com cenários comuns de falha:

- resposta HTTP diferente de sucesso;
- tempo de resposta excedido;
- payload incompleto ou malformado;
- repetição do mesmo conselho;
- erro de rede ou indisponibilidade da API.

Essas validações ajudam a manter a aplicação estável e tornam a experiência mais confiável mesmo em condições adversas.

## Aprendizados e refinamentos

Durante o desenvolvimento, alguns pontos se destacaram como aprendizados importantes:

- aprofundamento em consumo de API com JavaScript nativo;
- exigência de validação de dados em fluxos dinâmicos;
- importância de manter feedback perceptível para o usuário em interações assíncronas;
- uso estratégico de atributos semânticos e ARIA para melhorar acessibilidade;
- aplicação de mobile-first e atenção aos detalhes visuais que fazem a diferença na percepção de qualidade.

Também foi possível reforçar a importância de:

- manter a UI previsível;
- evitar ações que parecem não responder;
- estruturar lógica em funções pequenas e reutilizáveis;
- planejar acessibilidade desde o início do projeto, e não como ajuste final.

## Resultados alcançados

O projeto conseguiu entregar uma solução funcional, elegante e alinhada ao protótipo do desafio, com boa experiência em diferentes tamanhos de tela e atenção especial a acessibilidade. A implementação demonstra uma base sólida para evolução em projetos mais complexos envolvendo consumo de APIs e interfaces dinâmicas.

## Autor

- Nome: Kenzo Senna
- GitHub: [KenzoSenna](https://github.com/KenzoSenna)
- Frontend Mentor: [@KenzoSenna](https://www.frontendmentor.io/profile/KenzoSenna)

## Status

Projeto concluído com foco em qualidade visual, responsividade, funcionalidade e acessibilidade, atendendo aos requisitos do desafio proposto pelo Frontend Mentor.
