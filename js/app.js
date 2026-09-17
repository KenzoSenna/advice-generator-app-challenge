/**
 * Advice generator app
 * Busca conselhos aleatórios na Advice Slip API e os exibe no card.
 */
(() => {
  "use strict";

  const API_URL = "https://api.adviceslip.com/advice";

  const elements = {
    button: document.querySelector("[data-advice-button]"),
    id: document.querySelector("[data-advice-id]"),
    quote: document.querySelector("[data-advice-quote]"),
    text: document.querySelector("[data-advice-text]"),
  };

  const requestAdvice = async () => {
    // A API envia Cache-Control com max-age; sem "no-store" o navegador
    // reaproveita a resposta anterior e o conselho não muda a cada clique.
    const response = await fetch(API_URL, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Advice Slip API responded with HTTP ${response.status}`);
    }

    const { slip } = await response.json();

    return { id: slip.id, text: slip.advice };
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
