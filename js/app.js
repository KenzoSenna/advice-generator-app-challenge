/**
 * Advice generator app
 * Busca conselhos aleatórios na Advice Slip API e os exibe no card.
 */
(() => {
  "use strict";

  const API_URL = "https://api.adviceslip.com/advice";
  const REQUEST_TIMEOUT_MS = 8000;

  const elements = {
    button: document.querySelector("[data-advice-button]"),
    id: document.querySelector("[data-advice-id]"),
    quote: document.querySelector("[data-advice-quote]"),
    text: document.querySelector("[data-advice-text]"),
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

  const renderAdvice = ({ id, text }) => {
    elements.id.textContent = id;
    elements.text.textContent = text;
    elements.quote.cite = `${API_URL}/${id}`;
  };

  const handleGenerateClick = async () => {
    const advice = await requestAdvice();
    renderAdvice(advice);
  };

  elements.button.addEventListener("click", handleGenerateClick);
})();
