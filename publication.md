Publicando na Play Store com Expo (EAS Build)
O fluxo recomendado é via EAS (Expo Application Services). São 4 etapas:

1. Configure o EAS no projeto
bash
# Instala a CLI do EAS globalmente
npm install -g eas-cli
# Login na sua conta Expo (crie em expo.dev se não tiver)
eas login
# Inicializa o EAS no projeto (gera eas.json)
eas build:configure
2. Atualize o app.json
Já está configurado no projeto com os campos necessários, mas confirme:

json
{
  "expo": {
    "name": "Lista de Compras",
    "slug": "lista-compras",
    "version": "1.0.0",
    "android": {
      "package": "com.listadecompras.app",   // único na Play Store
      "versionCode": 1                         // incrementar a cada update
    }
  }
}
3. Gere o APK/AAB (Android App Bundle)
bash
# Build de produção (.aab) — formato exigido pela Play Store
eas build --platform android --profile production
O EAS compila na nuvem (sem precisar de Android Studio) e te envia o link para download do .aab.

Primeiro build: o EAS vai perguntar se quer criar um keystore novo → responda yes. Ele guarda automaticamente na nuvem.

4. Envie para a Play Store
Opção A — Manual (mais simples):

Acesse play.google.com/console
Crie o app → Produção → Nova versão
Faça upload do .aab gerado
Preencha descrição, screenshots, política de privacidade
Envie para revisão (~3–7 dias no primeiro envio)
Opção B — Automático com EAS Submit:

bash
eas submit --platform android
(precisa configurar credenciais da Google Play API)

Resumo do fluxo
eas build:configure
       ↓
eas build --platform android --profile production
       ↓
    Baixa o .aab
       ↓
  Upload na Play Console
       ↓
   Revisão do Google
       ↓
      🚀 Live!
Custos
Item	Valor
Conta Google Play (única)	$25
EAS Build — plano Free	Até 30 builds/mês grátis
EAS Submit	Grátis
Dica: antes de submeter
bash
# Verifique se há pacotes desatualizados
npx expo install --check
# Incremente o versionCode no app.json a cada nova versão
# android.versionCode: 1 → 2 → 3 ...
Para updates futuros, você pode usar EAS Update para publicar JS sem passar pela revisão da Play Store (apenas mudanças no código JS, não nativas).