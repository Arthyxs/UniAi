# Guia de Instalação e Configuração do Uni Assistant no Windows

Este guia detalha os passos para configurar e rodar o assistente pessoal Uni em modo kiosk 24/7 no Windows.

## 1. Requisitos

Antes de começar, garanta que você tenha os seguintes softwares instalados:

*   **Node.js:** Essencial para rodar o projeto e suas dependências. Baixe em [nodejs.org](https://nodejs.org/).
*   **Git:** Para clonar o repositório do projeto. Baixe em [git-scm.com](https://git-scm.com/).
*   **Um editor de código:** Como o VS Code ([code.visualstudio.com](https://code.visualstudio.com/)).

## 2. Instalação do Projeto

1.  **Clonar o Repositório:** Abra um terminal (PowerShell ou CMD) e clone o código-fonte.
    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd <NOME_DA_PASTA_DO_PROJETO>
    ```

2.  **Instalar Dependências:** Instale todas as dependências do projeto, incluindo Electron.
    ```bash
    npm install
    ```

## 3. Configuração das APIs

Para que os widgets de Clima e Notícias funcionem, você precisa obter chaves de API (API Keys) gratuitas dos seguintes serviços:

*   **OpenWeatherMap (Clima):**
    1.  Crie uma conta em [openweathermap.org](https://openweathermap.org/).
    2.  Navegue até a seção "API keys" no seu painel.
    3.  Copie a sua chave de API padrão.

*   **NewsAPI (Notícias):**
    1.  Crie uma conta em [newsapi.org](https://newsapi.org/).
    2.  Clique em "Get API Key" e copie a chave fornecida.

Após obter as chaves, inicie o aplicativo pela primeira vez e use o menu de configurações para inseri-las.

## 4. NirCmd (Controle do Monitor)

O Uni usa um pequeno utilitário de linha de comando chamado **NirCmd** para desligar o monitor quando entra em modo de espera profundo.

1.  **Baixe o NirCmd:** Faça o download no site oficial: [www.nirsoft.net/utils/nircmd.html](https://www.nirsoft.net/utils/nircmd.html).
2.  **Instale:** Descompacte o arquivo e copie `nircmd.exe` para a pasta `C:\Windows\System32`. Isso tornará o comando acessível de qualquer lugar do sistema. **Pode ser necessário permissão de administrador.**

## 5. Build do Aplicativo para Produção

Para criar um executável `.exe` independente que você possa instalar e configurar para iniciar com o Windows, siga estes passos.

1.  **Instale o Electron Builder:**
    ```bash
    npm install --save-dev electron-builder
    ```

2.  **Configure o `package.json`:** Adicione as seguintes seções ao seu arquivo `package.json`:
    ```json
    "main": "main.js",
    "scripts": {
      "start": "electron .",
      "dist": "electron-builder"
    },
    "build": {
      "appId": "com.uni.assistant",
      "productName": "Uni Assistant",
      "files": [
        "**/*",
        "!**/*.ts",
        "!*.code-workspace",
        "!LICENSE.md",
        "!package.json",
        "!package-lock.json",
        "!src/",
        "!e2e/",
        "!hooks/",
        "!.angular-cli.json",
        "!.editorconfig",
        "!.gitignore"
      ],
      "win": {
        "target": "nsis"
      }
    }
    ```
    *Nota: A configuração `files` é um exemplo. Ajuste conforme a estrutura do seu projeto para incluir todos os arquivos necessários (HTML, CSS, JS, `main.js`, `preload.js`, etc.) e excluir os de desenvolvimento.*

3.  **Execute o Build:**
    ```bash
    npm run dist
    ```
    Ao final, você encontrará o instalador do seu aplicativo na pasta `dist`.

## 6. Configurando o Auto-Start (Modo Kiosk 24/7)

Para que o Uni inicie automaticamente com o Windows em tela cheia:

1.  **Instale o Aplicativo:** Execute o instalador gerado no passo anterior.

2.  **Abra a Pasta de Inicialização:**
    *   Pressione `Win + R` para abrir a caixa "Executar".
    *   Digite `shell:startup` и pressione Enter.
    *   Uma pasta do Windows Explorer será aberta.

3.  **Crie um Atalho:**
    *   Encontre o atalho para o "Uni Assistant" no seu Menu Iniciar ou na Área de Trabalho.
    *   Copie e cole este atalho na pasta `startup` que você abriu.

Agora, toda vez que o Windows iniciar, o Uni Assistant será executado automaticamente em modo kiosk.

## 7. Uso

*   **Primeiro Uso:** Use o mouse para clicar no ícone de engrenagem no canto inferior direito e insira suas chaves de API e a cidade para o clima. Salve e o app será reiniciado.
*   **Uso Normal:** O sistema é 100% controlado por voz. Diga **"Uni"** para ativá-lo e, em seguida, dê seu comando.
*   **Ociosidade:**
    *   Após 15 minutos, a tela mostrará apenas o relógio.
    *   Após 1 hora, a tela será desligada (graças ao NirCmd).
    *   Dizer "Uni" ou mover o mouse/teclar acordará o sistema a qualquer momento.
