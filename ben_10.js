async function enviarScript(scriptText, delay = 1000) {
    const lines = scriptText.split('\n').map(line => line.trim()).filter(line => line);

    // Tenta encontrar a caixa de texto de várias formas (fallback)
    function buscarCaixaTexto() {
        return document.querySelector('#main div[contenteditable="true"][data-tab="10"]') || 
               document.querySelector('#main div[contenteditable="true"]') ||
               document.querySelector('div[contenteditable="true"]');
    }

    const textarea = buscarCaixaTexto();

    if (!textarea) {
        throw new Error("Não foi possível encontrar a caixa de texto. Certifique-se de que a conversa está aberta e visível.");
    }

    const main = document.querySelector("#main");

    for (const line of lines) {
        console.log(`Enviando: ${line}`);
        
        // Foca e limpa qualquer resquício
        textarea.focus();
        
        // Insere o texto
        document.execCommand('insertText', false, line);
        
        // Dispara múltiplos eventos para garantir que o WhatsApp note a digitação
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        
        // Pequeno atraso para o botão de envio ser gerado na tela
        await new Promise(resolve => setTimeout(resolve, 300));

        // Tenta clicar no botão de enviar
        const sendButton = main.querySelector('[data-testid="send"]') || 
                           main.querySelector('[data-icon="send"]') || 
                           main.querySelector('button:has(span[data-icon="send"])') ||
                           document.querySelector('span[data-icon="send"]')?.parentElement;

        if (sendButton) {
            sendButton.click();
        } else {
            // Se o botão falhar, força o Enter
            const enterEvent = new KeyboardEvent('keydown', {
                key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true
            });
            textarea.dispatchEvent(enterEvent);
        }

        if (lines.indexOf(line) !== lines.length - 1) {
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    return lines.length;
}

const script = `
A história começou
Quando um relógio esquisito
Grudou no pulso dele vindo lá do infinito
Agora tem poderes e com eles faz bonito
É o Ben 10
(Ben 10, Ben 10, Ben 10)

Se acaso encontrá-lo, você vai se admirar
Diante de seus olhos ele vai se transformar
Em um ser alienígena
Que bota pra quebrar
É o Ben 10
(Ben 10)

Com seus poderes vai combater
Os inimigos e vai vencer
Ele não foge de medo ou dor
Moleque muito irado
Seja onde for
É o Ben 10
`;

// Execução com tratamento de erro
enviarScript(script, 1500)
    .then(e => console.log(`✅ Sucesso: ${e} mensagens enviadas.`))
    .catch(err => {
        console.error("❌ Erro fatal:");
        console.error(err.message);
    });
