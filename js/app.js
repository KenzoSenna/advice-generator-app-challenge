/**
 * Advice generator app
 * Busca conselhos aleatórios na Advice Slip API e os exibe no card.
 */
(() => {
  "use strict";

  const API_URL = "https://api.adviceslip.com/advice";
  const REQUEST_TIMEOUT_MS = 8000;
  const MAX_ATTEMPTS = 3;
  const ERROR_MESSAGE =
    "Sorry, we couldn't load new advice. Please check your connection and try again.";

  const elements = {
    button: document.querySelector("[data-advice-button]"),
    error: document.querySelector("[data-advice-error]"),
    id: document.querySelector("[data-advice-id]"),
    quote: document.querySelector("[data-advice-quote]"),
    text: document.querySelector("[data-advice-text]"),
  };

  const state = {
    currentId: Number(elements.id.textContent),
    isLoading: false,
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
    elements.id.textContent = id;
    elements.text.textContent = text;
    elements.quote.cite = `${API_URL}/${id}`;
  };

  const handleGenerateClick = async () => {
    if (state.isLoading) {
      return;
    }

    state.isLoading = true;
    elements.error.textContent = "";

    try {
      const advice = await fetchDifferentAdvice(state.currentId);
      state.currentId = advice.id;
      renderAdvice(advice);
    } catch (error) {
      elements.error.textContent = ERROR_MESSAGE;
      console.error(error);
    } finally {
      state.isLoading = false;
    }
  };

  elements.button.addEventListener("click", handleGenerateClick);
})();
