const { SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { clientId, guildId, token } = require('./config.json');

const commands = [
  new SlashCommandBuilder()
    .setName('unsubscribe')
    .setDescription('Unsubscribe from The Confidence Bot'),
  new SlashCommandBuilder()
    .setName('subscribe')
    .setDescription('Subscribe to The Confidence Bot ! ')
    .addStringOption((option) =>
      option
        .setName('frequency')
        .setDescription(
          'Frequency at which you will receive messages from the bot. One time per : h, d, w, m'
        )
        .setRequired(true)
    ),
].map((command) => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

rest
  .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
