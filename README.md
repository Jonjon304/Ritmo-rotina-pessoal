# Ritmo — rotina com XP

Aplicativo de rotina semanal feito com HTML, CSS e JavaScript. Os dados ficam no localStorage do navegador, sem servidor de aplicação e sem banco de dados externo.

## Arquivos

- `index.html`: estrutura da página e formulários.
- `style.css`: layout responsivo e temas claro/escuro.
- `app.js`: tarefas, repetição, conclusões, XP, recompensas e backup.

Os três arquivos precisam ficar na mesma pasta. Este pacote contém a versão enxuta do layout, com o seletor de arquivo oculto corrigido.

## Publicar no GitHub Pages

1. Crie um repositório público no GitHub, por exemplo `ritmo`. No GitHub Free, essa é a opção para usar o Pages.
2. Extraia o ZIP no seu computador.
3. No repositório, use **Add file > Upload files** e envie os arquivos extraídos. Não envie apenas o ZIP.
4. Deixe `index.html`, `style.css` e `app.js` diretamente na raiz do repositório, sem uma pasta intermediária. O README pode ficar junto.
5. Confirme o envio com **Commit changes** na branch `main`.
6. Abra **Settings > Pages**.
7. Em **Build and deployment > Source**, selecione **Deploy from a branch**.
8. Selecione a branch **main** e a pasta **/ (root)**. Clique em **Save**.
9. Aguarde a publicação e abra o endereço exibido pelo GitHub. Acompanhe o processo pela aba **Actions** se necessário.

O endereço normalmente terá o formato `https://SEU-USUARIO.github.io/ritmo/`. Use o endereço que o GitHub fornecer.

Não é necessário instalar Node.js, executar npm ou configurar um backend para publicar este projeto.

## Levar sua rotina atual para o novo endereço

Novas instalações começam sem tarefas ou recompensas. O pacote não contém as tarefas e os pontos que você cadastrou no seu navegador; os dados já salvos não são apagados pela atualização.

1. No site atual, abra **Configurações > Exportar backup**.
2. Guarde o arquivo JSON no computador ou envie-o ao dispositivo que você usará.
3. Abra o site já publicado no GitHub Pages.
4. Entre em **Configurações > Importar backup**, selecione o JSON e confira o resumo.
5. Confirme a importação. Ela substitui os dados presentes naquele navegador.

Não envie seu backup pessoal ao repositório. Importe-o dentro do aplicativo.

## Como os dados funcionam

- Cada tarefa concluída soma 20 XP, uma vez por ocorrência. Ela pode ser concluída no próprio dia ou no dia seguinte; depois disso, o prazo expira.
- O calendário mostra ontem, hoje e os próximos sete dias. Conclusões antigas e XP já conquistado permanecem salvos.
- Cada recompensa resgatada desconta 1.000 XP.
- Tarefas fixas se repetem diariamente; as demais se repetem semanalmente.
- A lista de cada dia usa o cadastro atual: editar ou excluir uma tarefa também pode alterar sua visualização em ontem. O XP já conquistado permanece.
- Evite alterar a rotina ao mesmo tempo em várias abas, pois alterações simultâneas podem se sobrescrever.
- O período é escolhido no cadastro e não depende do horário.
- Tema e dados permanecem no navegador após fechar a página.
- A hospedagem no GitHub Pages não sincroniza dados entre dispositivos. Use o backup para transferir.
- Limpar o armazenamento do navegador pode remover seus dados.
- A página publicada no Pages será pública. Os registros criados em uso ficam no navegador e não são enviados pelo código para o GitHub.
- As fontes visuais são carregadas do Google Fonts. Sem acesso a elas, o aplicativo usa a fonte padrão disponível.

## Testar no computador

Você pode usar a extensão Live Server do VS Code. Se já tiver Python 3 instalado, outra opção é abrir o terminal na pasta dos arquivos e executar:

```bash
python3 -m http.server 8000
```

Depois acesse `http://localhost:8000`. Encerre com `Ctrl+C`.

Prefira testar por HTTP, pois o comportamento de localStorage ao abrir diretamente um arquivo `file://` varia entre navegadores. O endereço local e o endereço publicado também têm armazenamentos separados.

Para executar os testes automatizados das regras de datas, dados e XP, instale o Node.js e rode `node --test tests/app.test.js`. O aplicativo não precisa do Node.js para funcionar.

## Documentação

- GitHub Pages: https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- Configurar publicação: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
