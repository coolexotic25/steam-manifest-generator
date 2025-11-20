const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getSteamAppDetails, validateAppId } = require('../utils/steamAPI');
const { generateSteamManifest, formatManifest, getManifestSummary } = require('../utils/manifestGenerator');
const { generateLuaScript, getLuaScriptSummary } = require('../utils/luaGenerator');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Use a temporary file hosting service or create a simple solution
const WEBSITE_URL = process.env.WEBSITE_URL || 'https://steam-manifest-generator-7400r641h.vercel.app';

// Fallback: Create files locally and return them as Discord attachments
async function generateFilesLocally(appData, interaction) {
  try {
    // Generate files
    const manifest = generateSteamManifest(appData);
    const manifestJson = formatManifest(manifest);
    const luaScript = generateLuaScript(appData);

    // Create temporary directory if it doesn't exist
    const tempDir = path.join(__dirname, '../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Write files to temporary directory
    const manifestPath = path.join(tempDir, `${appData.appId}_manifest.json`);
    const luaPath = path.join(tempDir, `${appData.appId}_script.lua`);
    
    fs.writeFileSync(manifestPath, manifestJson);
    fs.writeFileSync(luaPath, luaScript);

    return {
      manifestPath,
      luaPath,
      manifestJson,
      luaScript
    };
  } catch (error) {
    console.error('Error generating files locally:', error);
    throw error;
  }
}

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

      let responseSent = false;

      // Try the website API first
      try {
        console.log(`Attempting to generate files via website API for ${appData.name}`);
        
        const websiteResponse = await axios.post(`${WEBSITE_URL}/api/simple-generate`, {
          appId: appId,
          discordUserId: interaction.user.id,
          discordUsername: interaction.user.username
        }, {
          timeout: 10000, // 10 second timeout
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Steam-Manifest-Generator-Bot/1.0'
          }
        });

        if (websiteResponse.data.success) {
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

          console.log(`Successfully generated files via website for App ID ${appId} (${appData.name}) - Access Key: ${accessKey}`);
          responseSent = true;
        }
      } catch (websiteError) {
        console.log(`Website API failed, falling back to local generation: ${websiteError.message}`);
      }

      // Fallback: Generate files locally and send as Discord attachments
      if (!responseSent) {
        console.log(`Generating files locally for ${appData.name}`);
        
        const { manifestJson, luaScript } = await generateFilesLocally(appData, interaction);

        // Create main embed with download information
        const mainEmbed = new EmbedBuilder()
          .setColor('#00FF00')
          .setTitle(`🎮 Files Generated for ${appData.name}`)
          .setURL(`https://store.steampowered.com/app/${appId}`)
          .setDescription(`Your Steam manifest and Lua script have been generated and attached below!`)
          .setThumbnail(appData.headerImage || null)
          .addFields(
            { name: '📋 App Information', value: `**App ID:** ${appId}\n**Developer:** ${appData.developer}\n**Publisher:** ${appData.publisher}\n**Release Date:** ${appData.releaseDate}\n**Genres:** ${appData.genres.join(', ') || 'N/A'}`, inline: false },
            { name: '📁 Generated Files', value: `✅ **${appData.appId}_manifest.json** - Steam manifest file\n✅ **${appData.appId}_script.lua** - Lua script file\n\nBoth files are Steamtools compatible and ready to use!\n\n**Download Options:**\n📎 Direct attachments (below)\n🔗 Copy & paste from Discord`, inline: false }
          )
          .setTimestamp()
          .setFooter({ 
            text: 'Steam Manifest Generator Bot • Files attached below',
            iconURL: interaction.client.user.displayAvatarURL()
          });

          // Create action buttons
          const actionButtons = {
            type: 1,
            components: [{
              type: 2,
              style: 5, // Link button
              label: '🛒 View on Steam',
              url: `https://store.steampowered.com/app/${appId}`
            }]
          };

        // Send the embed with file attachments
        const manifestBuffer = Buffer.from(manifestJson, 'utf8');
        const luaBuffer = Buffer.from(luaScript, 'utf8');

        await interaction.editReply({
          embeds: [mainEmbed],
          files: [
            {
              attachment: manifestBuffer,
              name: `${appData.appId}_manifest.json`
            },
            {
              attachment: luaBuffer,
              name: `${appData.appId}_script.lua`
            }
          ]
        });

        console.log(`Successfully generated files locally for App ID ${appId} (${appData.name})`);
      }

    } catch (error) {
      console.error(`Error generating files for App ID ${appId}:`, error);

      const errorEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('❌ Generation Failed')
        .setDescription(`Failed to generate files for App ID **${appId}**`)
        .addFields(
          { name: 'Error Details', value: error.message || 'Unknown error occurred' },
          { name: 'Possible Causes', value: '• Steam API is temporarily unavailable\n• App ID does not exist\n• Network connectivity issues' },
          { name: 'Troubleshooting', value: 'Try again in a few moments, or verify the App ID exists on Steam.' }
        )
        .setTimestamp()
        .setFooter({ text: 'Steam Manifest Generator Bot' });

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  }
};