// CÓDIGO FINAL E CORRIGIDO PARA: netlify/functions/send-location.js

exports.handler = async function(event) {
    const { IFTTT_KEY } = process.env;
    const eventName = 'localizacao_recebida';

    try {
        const { lat, lon, horario } = JSON.parse(event.body);

        // --- MUDANÇA PRINCIPAL ---
        // Em vez de enviar os dados em um POST, vamos construir a URL com os parâmetros,
        // exatamente como fizemos no nosso teste bem-sucedido no navegador.
        const iftttURL = `https://maker.ifttt.com/trigger/${eventName}/with/key/${IFTTT_KEY}?value1=${lat}&value2=${lon}&value3=${horario}`;
        
        // Fazemos a chamada para a URL completa usando GET (o padrão do fetch sem 'method' é GET).
        const response = await fetch(iftttURL);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`O IFTTT respondeu com erro: ${response.status} - ${errorText}`);
        }
        
        const responseText = await response.text();
        console.log(`Dados enviados com sucesso para o IFTTT. Resposta do IFTTT: ${responseText}`);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Localização enviada com sucesso pelo método GET!" })
        };

    } catch (error) {
        console.error("Erro na função Netlify:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Erro ao processar a solicitação no servidor." })
        };
    }
};
