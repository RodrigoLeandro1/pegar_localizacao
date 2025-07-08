// CÓDIGO PARA: netlify/functions/send-location.js
// Este código roda no servidor da Netlify.

exports.handler = async function(event, context) {
    // Pega a chave do IFTTT das variáveis de ambiente seguras da Netlify.
    const { IFTTT_KEY } = process.env;
    const eventName = 'localizacao_recebida'; // Garanta que este é o nome do evento no IFTTT.

    try {
        // Pega os dados (lat, lon, horario) enviados pelo script.js no navegador.
        const { lat, lon, horario } = JSON.parse(event.body);

        // Monta a URL final para o IFTTT.
        const iftttURL = `https://maker.ifttt.com/trigger/${eventName}/with/key/${IFTTT_KEY}?value1=${lat}&value2=${lon}&value3=${horario}`;
        
        // Faz a chamada para o IFTTT a partir do servidor seguro da Netlify.
        const response = await fetch(iftttURL);
        if (!response.ok) {
            throw new Error(`O IFTTT respondeu com erro: ${response.status}`);
        }

        console.log('Dados enviados com sucesso para o IFTTT.');

        // Retorna uma resposta de sucesso para o navegador.
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Localização enviada com sucesso!" })
        };

    } catch (error) {
        console.error("Erro na função Netlify:", error);
        // Retorna uma resposta de erro para o navegador.
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Erro ao processar a solicitação no servidor." })
        };
    }
};