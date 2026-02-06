async function enviarScript(scriptText, delay = 1000, repetitions = 1) {
    const lines = scriptText.split('\n').map(line => line.trim()).filter(line => line);

    function buscarCaixaTexto() {
        return document.querySelector('#main div[contenteditable="true"][data-tab="10"]') || 
               document.querySelector('#main div[contenteditable="true"]') ||
               document.querySelector('div[contenteditable="true"]');
    }

    const main = document.querySelector("#main");

    for (let i = 0; i < repetitions; i++) {
        console.log(`Repetição ${i + 1} de ${repetitions}`);

        for (const line of lines) {
            const textarea = buscarCaixaTexto();
            if (!textarea) throw new Error("Não há uma conversa aberta");

            console.log(`Enviando: ${line.substring(0, 30)}...`);
            
            textarea.focus();
            document.execCommand('insertText', false, line);
            
            // CORREÇÃO: O evento 'input' é o que ativa o botão de enviar em 2026
            textarea.dispatchEvent(new Event('input', { bubbles: true }));

            await new Promise(resolve => setTimeout(resolve, 300));

            const sendButton = main.querySelector('[data-testid="send"]') || 
                               main.querySelector('[data-icon="send"]') ||
                               main.querySelector('button:has(span[data-icon="send"])');

            if (sendButton) {
                sendButton.click();
            } else {
                const enter = new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true });
                textarea.dispatchEvent(enter);
            }

            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    return repetitions * lines.length;
}

const script = `
Sei que você vai querer ser uma de nós!

Winx
Quando damos nossas mãos
Nos tornamos poderosas
Porque juntas somos invencíveis

Winx
É tão bom poder sorrir
E o mundo iluminar
Venha se juntar à nós voando

Sei que você vai querer ser uma de nós!

Com o nosso raio o céu incendeia
Dando início a uma aventura estelar
E numa nuvem a mente vagueia
Colore a minha vida, com tudo o que imagino
Vou voar bem alto

Winx
Quando damos nossas mãos
Nos tornamos poderosas
Porque juntas somos invencíveis

Winx
Novidade igual não há
Companheiras pra valer
Venha se juntar à nós voando

Winx
Fantásticas Winx
Elas podem voar
O raio mais poderoso, tem a marca das Winx!
`;

// O número 1 no final significa que ele vai ler o roteiro todo uma vez.
enviarScript(script, 1500, 1)
    .then(e => console.log(`✅ Shrek finalizado! ${e} mensagens enviadas.`))
    .catch(err => console.error("❌ Erro:", err.message));
