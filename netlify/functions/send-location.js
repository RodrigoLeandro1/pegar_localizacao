// netlify/functions/send-location.js
const https = require('https');

exports.handler = async function(event, context) {
    const { IFTTT_KEY } = process.env;
    const eventName = 'localizacao_recebida';

    function sendToIFTTT(url) {
        return new Promise((resolve, reject) => {
            https.get(url, (res) => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(res);
                } else {
                    reject(new Error(`Código de status: ${res.statusCode}`));
                }
            }).on('error', reject);
        });
    }

    try {
        const { lat, lon, horario } = JSON.parse(event.body);
        const iftttURL = `https://maker.ifttt.com/trigger/${eventName}/with/key/${IFTTT_KEY}?value1=${lat}&value2=${lon}&value3=${horario}`;

        await sendToIFTTT(iftttURL);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Localização enviada com sucesso!" })
        };

    } catch (error) {
        console.error("Erro na função Netlify:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Erro ao processar a solicitação no servidor." })
        };
    }
};
