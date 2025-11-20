const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, ActivityType } = require('discord.js');
require('dotenv').config();

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Load commands
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
    console.log(`Loaded command: ${command.data.name}`);
  } else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
}

// Ready event
client.once(Events.ClientReady, c => {
  console.log(`✅ Ready! Logged in as ${c.user.tag}`);
  console.log(`🤖 Bot is serving ${c.guilds.cache.size} servers`);
  console.log(`👥 Serving ${c.users.cache.size} users`);
  
  // Set bot activity
  client.user.setActivity('Generating Steam manifests', { type: ActivityType.Playing });
  
  console.log('📝 Bot activity set to: "Generating Steam manifests"');
});

// Interaction (slash command) event
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    console.log(`Executing command: ${interaction.commandName} by ${interaction.user.tag} in ${interaction.guild?.name || 'DM'}`);
    await command.execute(interaction);
  } catch (error) {
    console.error(`Error executing ${interaction.commandName}:`, error);
    
    const errorMessage = {
      content: '❌ There was an error while executing this command!',
      ephemeral: true
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorMessage);
    } else {
      await interaction.reply(errorMessage);
    }
  }
});

// Guild join event
client.on(Events.GuildCreate, async guild => {
  console.log(`🎉 Joined new server: ${guild.name} (ID: ${guild.id})`);
  console.log(`📊 Server has ${guild.memberCount} members`);
  
  // You can add welcome messages here if desired
  // const channel = guild.systemChannel;
  // if (channel) {
  //   await channel.send('Thanks for adding Steam Manifest Generator Bot! Use `/manifest <appid>` to get started.');
  // }
});

// Guild leave event
client.on(Events.GuildDelete, async guild => {
  console.log(`👋 Left server: ${guild.name} (ID: ${guild.id})`);
});

// Error handling
client.on('error', error => {
  console.error('Discord client error:', error);
});

process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', error => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully...');
  client.destroy();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully...');
  client.destroy();
  process.exit(0);
});

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN).catch(error => {
  console.error('Failed to login to Discord:', error);
  process.exit(1);
});