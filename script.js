const WEBHOOK_URL = "https://majos.app.n8n.cloud/webhook/calculadora"; 

async function enviarDatos(event) {
    event.preventDefault();

    const inputTexto = document.getElementById('operacionInput').value;
    const btn = document.getElementById('btnEnviar');
    const loader = document.getElementById('loading');
    const resultCard = document.getElementById('resultadoCard');

    // UI: Mostrar carga
    btn.disabled = true;
    loader.classList.remove('d-none');
    resultCard.classList.add('d-none');

    try {
        // 1. Obtener IP
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();

        // 2. Enviar a n8n
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                operacion: inputTexto,
                ip: ipData.ip
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Respuesta del Servidor:", data);

            // 3. Mostrar los datos en el HTML
            // Nota: Ajustamos esto según lo que devuelve tu Python
            document.getElementById('txtOperacion').innerText = data.operacion_guardada || inputTexto;
            document.getElementById('txtResultado').innerText = data.resultado_final || "Calculado";
            document.getElementById('txtIP').innerText = data.ip_cliente || ipData.ip;

            // Mostrar tarjeta
            resultCard.classList.remove('d-none');
        } else {
            alert("Error en n8n o AWS");
        }

    } catch (error) {
        console.error(error);
        alert("No se pudo conectar.");
    } finally {
        btn.disabled = false;
        loader.classList.add('d-none');
    }
}