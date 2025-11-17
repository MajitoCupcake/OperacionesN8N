// ⚠️ PEGA AQUÍ TU URL DEL WEBHOOK DE N8N
const WEBHOOK_URL = "https://majos.app.n8n.cloud/webhook-test/calculadora"; 

async function enviarDatos(event) {
    event.preventDefault(); // Evita que la página se recargue sola

    // Elementos del DOM
    const inputTexto = document.getElementById('operacionInput').value;
    const btn = document.getElementById('btnEnviar');
    const loader = document.getElementById('loading');
    const alertBox = document.getElementById('resultadoAlert');

    // UI: Mostrar carga y bloquear botón
    btn.disabled = true;
    loader.classList.remove('d-none');
    alertBox.classList.add('d-none');

    try {
        // 1. Obtener la IP pública del cliente (API gratuita)
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        const userIp = ipData.ip;

        console.log("IP Detectada:", userIp);

        // 2. Preparar datos para n8n
        const datos = {
            operacion: inputTexto,
            ip: userIp
        };

        // 3. Enviar al Webhook de n8n
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        // 4. Manejar respuesta
        if (response.ok) {
            // Si configuraste n8n para responder con el resultado:
            const respuestaJson = await response.json();
            
            // Ajusta esto según lo que responda tu último nodo en n8n
            // Si tu último nodo responde { "mensaje": "Guardado OK" } o el resultado directo
            const textoResultado = JSON.stringify(respuestaJson); 

            alertBox.className = "alert alert-success mt-4 text-center fw-bold";
            alertBox.innerHTML = `✅ Éxito: ${textoResultado}`;
        } else {
            throw new Error("Error en la respuesta de n8n");
        }

    } catch (error) {
        console.error(error);
        alertBox.className = "alert alert-danger mt-4 text-center";
        alertBox.innerHTML = `❌ Error: No se pudo conectar con el Workflow.`;
    } finally {
        // UI: Restaurar estado
        btn.disabled = false;
        loader.classList.add('d-none');
        alertBox.classList.remove('d-none');
    }
}