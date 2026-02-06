async function enviarScript(scriptText, delay = 1000, repetitions = 1) {
    const lines = scriptText.split('\n').map(line => line.trim()).filter(line => line);

    // Função para localizar a caixa de texto (essencial para o WhatsApp Web atual)
    function buscarCaixaTexto() {
        return document.querySelector('#main div[contenteditable="true"][data-tab="10"]') || 
               document.querySelector('#main div[contenteditable="true"]') ||
               document.querySelector('div[contenteditable="true"]');
    }

    const main = document.querySelector("#main");

    // Início do loop de repetições
    for (let i = 0; i < repetitions; i++) {
        console.log(`🚀 Iniciando repetição ${i + 1} de ${repetitions}`);

        for (const line of lines) {
            const textarea = buscarCaixaTexto();

            if (!textarea) {
                throw new Error("Não foi possível encontrar a caixa de texto. Certifique-se de que a conversa está aberta.");
            }

            console.log(`Enviando: ${line}`);
            
            textarea.focus();
            
            // Insere o texto da linha atual
            document.execCommand('insertText', false, line);
            
            // Notifica o React/WhatsApp que houve mudança no input
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            
            // Pequeno delay para o botão de envio ser renderizado
            await new Promise(resolve => setTimeout(resolve, 300));

            const sendButton = main.querySelector('[data-testid="send"]') || 
                               main.querySelector('[data-icon="send"]') || 
                               main.querySelector('button:has(span[data-icon="send"])') ||
                               document.querySelector('span[data-icon="send"]')?.parentElement;

            if (sendButton) {
                sendButton.click();
            } else {
                // Fallback: Tecla Enter
                const enterEvent = new KeyboardEvent('keydown', {
                    key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true
                });
                textarea.dispatchEvent(enterEvent);
            }

            // Delay entre cada linha do script
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        
        // Se houver mais repetições, você pode adicionar um delay extra entre elas aqui se quiser
    }

    return repetitions * lines.length;
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

// EXECUÇÃO: Ajuste o número final (ex: 10) para quantas vezes quer repetir o Ben 10 completo
enviarScript(script, 1500, 10)
    .then(e => console.log(`✅ Sucesso: ${e} mensagens enviadas no total.`))
    .catch(err => {
        console.error("❌ Erro fatal:");
        console.error(err.message);
    });
