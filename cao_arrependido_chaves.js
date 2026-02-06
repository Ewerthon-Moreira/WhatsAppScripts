async function enviarScript(scriptText, delay = 1000, repetitions = 1) {
    const lines = scriptText.split('\n').map(line => line.trim()).filter(line => line);

    // Função interna para localizar a caixa de texto atualizada
    function buscarTextarea() {
        return document.querySelector('#main div[contenteditable="true"][data-tab="10"]') || 
               document.querySelector('#main div[contenteditable="true"]') ||
               document.querySelector('div[contenteditable="true"]');
    }

    const textarea = buscarTextarea();

    if (!textarea) {
        throw new Error("Não há uma conversa aberta ou o WhatsApp mudou a estrutura.");
    }

    const main = document.querySelector("#main");

    for (let i = 0; i < repetitions; i++) {
        console.log(`🚀 Executando repetição ${i + 1}/${repetitions}`);

        for (const line of lines) {
            console.log(`Enviando: ${line}`);
            
            textarea.focus();
            document.execCommand('insertText', false, line);
            
            // OBRIGATÓRIO: Evento 'input' para o WhatsApp habilitar o botão de enviar
            textarea.dispatchEvent(new Event('input', { bubbles: true }));

            // Pequena pausa para o botão aparecer/ser processado
            await new Promise(resolve => setTimeout(resolve, 200));

            const sendButton = main.querySelector(`[data-testid="send"]`) || 
                               main.querySelector(`[data-icon="send"]`) ||
                               main.querySelector('button:has(span[data-icon="send"])');

            if (sendButton) {
                sendButton.click();
            } else {
                // Fallback: Tenta dar Enter se o botão não for encontrado
                const enter = new KeyboardEvent('keydown', {
                    key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true
                });
                textarea.dispatchEvent(enter);
            }

            // Espera o delay entre as linhas
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    return repetitions * lines.length;
}

const script = `
Volta o cão arrependido
Com suas orelhas tão fartas
Com seu osso roído
E com o rabo entre as patas
`;

// Execução: 2000ms (2 seg) de delay, repetindo 44 vezes
enviarScript(script, 2000, 44)
    .then(e => console.log(`✅ Código finalizado, ${e} mensagens enviadas`))
    .catch(err => console.error("❌ Erro:", err.message));
