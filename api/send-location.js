// Este código roda no servidor da Vercel, não no navegador.

export default async function handler(request, response) {
  // Pega a chave do IFTTT das variáveis de ambiente seguras da Vercel
  const { IFTTT_KEY } = process.env;
  const eventName = 'localizacao_recebida';

  // Pega os dados enviados pelo script do navegador (estão em request.body)
  const { lat, lon, horario } = request.body;

  // Monta a URL final para o IFTTT
  const iftttURL = `https://maker.ifttt.com/trigger/${eventName}/with/key/${IFTTT_KEY}?value1=${lat}&value2=${lon}&value3=${horario}`;

  try {
    // Faz a chamada para o IFTTT a partir do servidor da Vercel
    await fetch(iftttURL);

    console.log('Successfully sent data to IFTTT.');

    // Retorna sucesso para o navegador
    response.status(200).json({ message: "Dados enviados com sucesso!" });

  } catch (error) {
    console.error("Error sending to IFTTT:", error);

    // Retorna erro para o navegador
    response.status(500).json({ message: "Falha ao enviar dados." });
  }
}