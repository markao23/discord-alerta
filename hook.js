const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");

// 1. SERVIDOR WEB
const app = express();
app.get("/", (req, res) => res.send("Bot Monitor está Vivo!"));
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor Web rodando na porta ${port}`));

// 2. LÓGICA DO BOT
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildPresences, // Para ver o status (online/offline)
    GatewayIntentBits.GuildMembers, // Adicionado: Ajuda a identificar os membros
  ],
});

const ID_DO_BOT_PRINCIPAL = "1475934513313091615";
const ID_DO_CANAL_DE_AVISO = "1456704732159676478";

client.once("ready", () => {
  console.log(`✅ SUCESSO: Bot Monitor logado como ${client.user.tag}!`);
});

client.on("presenceUpdate", (oldPresence, newPresence) => {
  if (!newPresence || newPresence.userId !== ID_DO_BOT_PRINCIPAL) return;

  const canal = client.channels.cache.get(ID_DO_CANAL_DE_AVISO);
  if (!canal) return;

  const statusAntigo = oldPresence ? oldPresence.status : "offline";
  const statusNovo = newPresence.status;

  if (statusNovo === "offline" && statusAntigo !== "offline") {
    canal.send(`🚨 **ALERTA!** O bot principal ficou OFFLINE!`);
  } else if (statusNovo !== "offline" && statusAntigo === "offline") {
    canal.send(`✅ **UFA!** O bot principal voltou a ficar ONLINE!`);
  }
});

// 3. LOGIN COM CAPTURADOR DE ERRO
client.login(process.env.TOKEN).catch((err) => {
  console.error("❌ ERRO AO LOGAR NO DISCORD:");
  console.error(err); // Isso vai dizer no log do Render exatamente qual é o problema
});
