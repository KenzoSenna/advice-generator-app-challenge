/**
 * Advice generator app
 * Busca conselhos aleatórios na Advice Slip API e os exibe no card.
 */
(() => {
  "use strict";

  const API_URL = "https://api.adviceslip.com/advice";
  const REQUEST_TIMEOUT_MS = 8000;
  const MAX_ATTEMPTS = 3;
  const LOADING_MESSAGE_DELAY_MS = 1000;
  const LOADING_MESSAGE = "Loading new advice, please wait.";
  const ERROR_MESSAGE =
    "Sorry, we couldn't load new advice. Please check your connection and try again.";

  const elements = {
    button: document.querySelector("[data-advice-button]"),
    content: document.querySelector("[data-advice-content]"),
    error: document.querySelector("[data-advice-error]"),
    status: document.querySelector("[data-advice-status]"),
  };

  const state = {
    currentId: Number(elements.content.querySelector("[data-advice-id]").textContent),
    isLoading: false,
    loadingMessageTimer: 0,
  };

  const parseSlip = (payload) => {
    const slip = payload?.slip;
    const hasValidShape =
      Number.isInteger(slip?.id) &&
      typeof slip?.advice === "string" &&
      slip.advice.trim() !== "";

    if (!hasValidShape) {
      throw new TypeError("Unexpected response format from the Advice Slip API");
    }

    return { id: slip.id, text: slip.advice.trim() };
  };

  const requestAdvice = async () => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      // A API envia Cache-Control com max-age; sem "no-store" o navegador
      // reaproveita a resposta anterior e o conselho não muda a cada clique.
      const response = await fetch(API_URL, {
        cache: "no-store",
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Advice Slip API responded with HTTP ${response.status}`);
      }

      return parseSlip(await response.json());
    } finally {
      window.clearTimeout(timeoutId);
    }
  };

  const fetchDifferentAdvice = async (currentId) => {
    let advice = await requestAdvice();

    // O sorteio da API pode repetir o conselho exibido; nesse caso o card
    // não mudaria e o clique pareceria não ter funcionado.
    for (let attempt = 1; attempt < MAX_ATTEMPTS && advice.id === currentId; attempt += 1) {
      advice = await requestAdvice();
    }

    return advice;
  };

  const renderAdvice = ({ id, text }) => {
    // Monta o novo conteúdo fora do DOM e o troca em uma única mutação: a
    // região live atômica é anunciada uma vez, e não uma vez por nó alterado.
    const draft = elements.content.cloneNode(true);

    draft.querySelector("[data-advice-id]").textContent = id;
    draft.querySelector("[data-advice-text]").textContent = text;
    draft.querySelector("[data-advice-quote]").cite = `${API_URL}/${id}`;

    elements.content.replaceChildren(...draft.childNodes);
  };

  const setLoading = (isLoading) => {
    state.isLoading = isLoading;
    window.clearTimeout(state.loadingMessageTimer);
    elements.status.textContent = "";

    if (!isLoading) {
      elements.button.removeAttribute("aria-disabled");
      return;
    }

    // Ao contrário do atributo disabled, aria-disabled mantém o botão
    // focável: quem navega por teclado ou leitor de tela não perde a posição.
    elements.button.setAttribute("aria-disabled", "true");

    // Respostas rápidas dispensam aviso; só a espera perceptível é anunciada.
    state.loadingMessageTimer = window.setTimeout(() => {
      elements.status.textContent = LOADING_MESSAGE;
    }, LOADING_MESSAGE_DELAY_MS);
  };

  const handleGenerateClick = async () => {
    if (state.isLoading) {
      return;
    }

    setLoading(true);
    elements.error.textContent = "";

    try {
      const advice = await fetchDifferentAdvice(state.currentId);
      state.currentId = advice.id;
      renderAdvice(advice);
    } catch (error) {
      elements.error.textContent = ERROR_MESSAGE;
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  elements.button.addEventListener("click", handleGenerateClick);
})();
