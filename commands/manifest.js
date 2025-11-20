const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getSteamAppDetails, validateAppId } = require('../utils/steamAPI');
const { generateSteamManifest, formatManifest, getManifestSummary } = require('../utils/manifestGenerator');
const { generateLuaScript, getLuaScriptSummary } = require('../utils/luaGenerator');
const axios = require('axios');

// Website URL - change this to your deployed website URL
const WEBSITE_URL = process.env.WEBSITE_URL || 'https://steam-manifest-generator-7400r641h.vercel.app';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('manifest')
    .setDescription('Generate a Steam app manifest and Lua script for a Steam app')
    .addIntegerOption(option =>
      option
        .setName('appid')
        .setDescription('The Steam App ID to generate files for')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(9999999)
    ),

  async execute(interaction) {
    const appId = interaction.options.getInteger('appid');

    // Validate App ID format
    if (!validateAppId(appId)) {
      const errorEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('❌ Invalid App ID')
        .setDescription('The provided App ID is not valid. Please enter a valid Steam App ID (1-9999999).')
        .addFields(
          { name: 'Example', value: '`/manifest appid:730` (Counter-Strike 2)' },
          { name: 'How to find App ID', value: 'You can find App IDs in Steam store URLs or on SteamDB' }
        )
        .setTimestamp()
        .setFooter({ text: 'Steam Manifest Generator Bot' });

      return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    // Defer the reply since this might take some time
    await interaction.deferReply();

    try {
      // Fetch Steam app data
      console.log(`Fetching Steam app details for App ID: ${appId}`);
      const appData = await getSteamAppDetails(appId);

      // Generate files via website API
      console.log(`Generating files via website API for ${appData.name}`);
      
      const websiteResponse = await axios.post(`${WEBSITE_URL}/api/generate`, {
        appId: appId,
        discordUserId: interaction.user.id,
        discordUsername: interaction.user.username
      });

      if (!websiteResponse.data.success) {
        throw new Error(websiteResponse.data.error || 'Website API failed');
      }

      const { accessKey, downloadUrl, steamtoolsFiles } = websiteResponse.data;

      // Create the main embed with download link
      const mainEmbed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle(`🎮 Files Generated for ${appData.name}`)
        .setURL(`https://store.steampowered.com/app/${appId}`)
        .setDescription(`Your Steam manifest and Lua script have been generated!`)
        .setThumbnail(appData.headerImage || null)
        .addFields(
          { name: '📋 App Information', value: `**App ID:** ${appId}\n**Developer:** ${appData.developer}\n**Publisher:** ${appData.publisher}\n**Release Date:** ${appData.releaseDate}\n**Genres:** ${appData.genres.join(', ') || 'N/A'}`, inline: false },
          { name: '🔗 Download Link', value: `Click the button below to download your files\n**Access expires in 24 hours**`, inline: false },
          { name: '🛠️ Steamtools Compatible', value: `✅ Steam manifest optimized for Steamtools\n✅ Lua script with Steamtools headers\n✅ Direct import ready`, inline: false }
        )
        .setTimestamp()
        .setFooter({ 
          text: 'Steam Manifest Generator Bot • Files hosted securely',
          iconURL: interaction.client.user.displayAvatarURL()
        });

      // Create action button for download
      const downloadButton = {
        type: 1,
        components: [{
          type: 2,
          style: 5, // Link button
          label: '📥 Download Files',
          url: `${WEBSITE_URL}${downloadUrl}`
        }, {
          type: 2,
          style: 5, // Link button
          label: '🛒 View on Steam',
          url: `https://store.steampowered.com/app/${appId}`
        }]
      };

      // Send the response with embed and download button
      await interaction.editReply({
        embeds: [mainEmbed],
        components: [downloadButton]
      });

      console.log(`Successfully generated files for App ID ${appId} (${appData.name}) - Access Key: ${accessKey}`);

    } catch (error) {
      console.error(`Error generating files for App ID ${appId}:`, error);

      const errorEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('❌ Generation Failed')
        .setDescription(`Failed to generate files for App ID **${appId}**`)
        .addFields(
          { name: 'Error Details', value: error.message || 'Unknown error occurred' },
          { name: 'Possible Causes', value: '• Website API is temporarily unavailable\n• App ID does not exist\n• Network connectivity issues' },
          { name: 'Troubleshooting', value: 'Try again in a few moments, or verify the App ID exists on Steam.' }
        )
        .setTimestamp()
        .setFooter({ text: 'Steam Manifest Generator Bot' });

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  }
};