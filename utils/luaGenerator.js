/**
 * Generates a Lua script based on Steam app data
 * @param {Object} appData - Steam app data from the API
 * @returns {string} - Generated Lua script
 */
function generateLuaScript(appData) {
  const appName = appData.name.replace(/[^a-zA-Z0-9_]/g, '_');
  const appId = appData.appId;
  
  const luaScript = `--[[
    Steam App Lua Script Generator
    Generated for: ${appData.name}
    App ID: ${appId}
    Developer: ${appData.developer}
    Publisher: ${appData.publisher}
    Release Date: ${appData.releaseDate}
    Genres: ${appData.genres.join(', ') || 'N/A'}
    Generated on: ${new Date().toISOString()}
    
    This script provides basic game development functionality
    and utilities for Steam integration.
]]

-- Game configuration
local GameConfig = {
    name = "${appData.name}",
    appId = ${appId},
    version = "1.0.0",
    developer = "${appData.developer}",
    publisher = "${appData.publisher}",
    releaseDate = "${appData.releaseDate}",
    genres = {${appData.genres.map(genre => `"${genre}"`).join(', ')}},
    platforms = {
        windows = ${appData.platforms.windows},
        mac = ${appData.platforms.mac},
        linux = ${appData.platforms.linux}
    }
}

-- Steam integration module
local Steam = {}

function Steam.initialize()
    print("Initializing Steam for " .. GameConfig.name)
    print("App ID: " .. GameConfig.appId)
    
    -- Simulate Steam initialization
    if GameConfig.appId then
        print("✓ Steam API initialized successfully")
        return true
    else
        print("✗ Failed to initialize Steam API")
        return false
    end
end

function Steam.getAchievements()
    return {
        "first_launch",
        "complete_tutorial",
        "reach_level_10",
        "find_all_secrets",
        "speedrun_complete",
        "perfectionist",
        "explorer",
        "master_player"
    }
end

function Steam.unlockAchievement(achievementId)
    print("Unlocking achievement: " .. achievementId)
    -- Simulate achievement unlock
    return true
end

function Steam.getPlayerStats()
    return {
        playtime = 0,
        achievements_unlocked = 0,
        total_achievements = #Steam.getAchievements(),
        last_played = os.time()
    }
end

-- Game state management
local GameState = {
    currentLevel = 1,
    playerHealth = 100,
    playerScore = 0,
    isPaused = false,
    gameTime = 0,
    saveSlots = {}
}

function GameState.save(slot)
    if not slot then slot = 1 end
    
    GameState.saveSlots[slot] = {
        level = GameState.currentLevel,
        health = GameState.playerHealth,
        score = GameState.playerScore,
        gameTime = GameState.gameTime,
        timestamp = os.time()
    }
    
    print("Game saved to slot " .. slot)
    return true
end

function GameState.load(slot)
    if not slot then slot = 1 end
    
    local saveData = GameState.saveSlots[slot]
    if saveData then
        GameState.currentLevel = saveData.level
        GameState.playerHealth = saveData.health
        GameState.playerScore = saveData.score
        GameState.gameTime = saveData.gameTime
        
        print("Game loaded from slot " .. slot)
        return true
    else
        print("No save data found in slot " .. slot)
        return false
    end
end

function GameState.reset()
    GameState.currentLevel = 1
    GameState.playerHealth = 100
    GameState.playerScore = 0
    GameState.isPaused = false
    GameState.gameTime = 0
    
    print("Game state reset")
end

-- Player management
local Player = {}

function Player.new(name)
    local self = {}
    
    self.name = name or "Player"
    self.health = 100
    self.maxHealth = 100
    self.score = 0
    self.level = 1
    self.experience = 0
    self.achievements = {}
    
    function self:takeDamage(amount)
        self.health = math.max(0, self.health - amount)
        print(self.name .. " took " .. amount .. " damage. Health: " .. self.health)
        
        if self.health <= 0 then
            self:onDeath()
        end
    end
    
    function self:heal(amount)
        self.health = math.min(self.maxHealth, self.health + amount)
        print(self.name .. " healed for " .. amount .. ". Health: " .. self.health)
    end
    
    function self:addScore(points)
        self.score = self.score + points
        print(self.name .. " gained " .. points .. " points. Total: " .. self.score)
    end
    
    function self:addExperience(exp)
        self.experience = self.experience + exp
        print(self.name .. " gained " .. exp .. " experience. Total: " .. self.experience)
        
        -- Level up logic
        local expNeeded = self.level * 100
        if self.experience >= expNeeded then
            self.level = self.level + 1
            self.experience = self.experience - expNeeded
            self.maxHealth = self.maxHealth + 10
            self.health = self.maxHealth
            print(self.name .. " leveled up to " .. self.level .. "!")
        end
    end
    
    function self:onDeath()
        print(self.name .. " has died!")
        -- Handle death logic here
    end
    
    return self
end

-- Utility functions
local Utils = {}

function Utils.formatTime(seconds)
    local hours = math.floor(seconds / 3600)
    local minutes = math.floor((seconds % 3600) / 60)
    local secs = seconds % 60
    
    return string.format("%02d:%02d:%02d", hours, minutes, secs)
end

function Utils.generateId()
    return math.random(100000, 999999)
end

function Utils.distance(x1, y1, x2, y2)
    return math.sqrt((x2 - x1)^2 + (y2 - y1)^2)
end

function Utils.clamp(value, min, max)
    return math.min(math.max(value, min), max)
end

function Utils.lerp(a, b, t)
    return a + (b - a) * t
end

-- Event system
local EventManager = {}

EventManager.listeners = {}

function EventManager.on(eventName, callback)
    if not EventManager.listeners[eventName] then
        EventManager.listeners[eventName] = {}
    end
    
    table.insert(EventManager.listeners[eventName], callback)
end

function EventManager.emit(eventName, ...)
    if EventManager.listeners[eventName] then
        for _, callback in ipairs(EventManager.listeners[eventName]) do
            callback(...)
        end
    end
end

-- Game initialization
function Game.init()
    print("=== " .. GameConfig.name .. " ===")
    print("Version: " .. GameConfig.version)
    print("Developer: " .. GameConfig.developer)
    print("Publisher: " .. GameConfig.publisher)
    print("Release Date: " .. GameConfig.releaseDate)
    print("Genres: " .. table.concat(GameConfig.genres, ", "))
    print("")
    
    -- Initialize Steam
    if not Steam.initialize() then
        print("Warning: Steam initialization failed")
    end
    
    -- Set up event listeners
    EventManager.on("player_death", function(player)
        print("Game Over: " .. player.name .. " has died!")
    end)
    
    EventManager.on("achievement_unlocked", function(achievement)
        Steam.unlockAchievement(achievement)
        print("Achievement Unlocked: " .. achievement)
    end)
    
    EventManager.on("level_complete", function(level)
        print("Level " .. level .. " completed!")
        GameState.currentLevel = GameState.currentLevel + 1
    end)
    
    print("Game initialized successfully!")
end

-- Main game loop
function Game.update(deltaTime)
    if GameState.isPaused then
        return
    end
    
    GameState.gameTime = GameState.gameTime + deltaTime
    
    -- Update game logic here
    -- This is where you would put your main game logic
end

function Game.render()
    -- Render game here
    -- This is where you would put your rendering code
end

-- Example usage
function Game.runExample()
    print("\\n=== Example Usage ===")
    
    -- Create a player
    local player = Player.new("Hero")
    
    -- Simulate some gameplay
    player:addScore(100)
    player:addExperience(50)
    player:takeDamage(20)
    player:heal(10)
    
    -- Save the game
    GameState.save(1)
    
    -- Unlock an achievement
    EventManager.emit("achievement_unlocked", "first_launch")
    
    -- Complete a level
    EventManager.emit("level_complete", 1)
    
    -- Show player stats
    print("\\n=== Player Stats ===")
    print("Name: " .. player.name)
    print("Level: " .. player.level)
    print("Health: " .. player.health .. "/" .. player.maxHealth)
    print("Score: " .. player.score)
    print("Experience: " .. player.experience)
    print("Game Time: " .. Utils.formatTime(GameState.gameTime))
    
    -- Show Steam stats
    local steamStats = Steam.getPlayerStats()
    print("\\n=== Steam Stats ===")
    print("Playtime: " .. steamStats.playtime .. " minutes")
    print("Achievements: " .. steamStats.achievements_unlocked .. "/" .. steamStats.total_achievements)
end

-- Export modules
return {
    Game = Game,
    GameConfig = GameConfig,
    GameState = GameState,
    Player = Player,
    Steam = Steam,
    Utils = Utils,
    EventManager = EventManager
}

--[[
    Usage Example:
    
    local game = require("game_script")
    
    -- Initialize the game
    game.Game.init()
    
    -- Run example gameplay
    game.Game.runExample()
    
    -- You can also use individual modules:
    local player = game.Player.new("MyPlayer")
    player:addScore(500)
    
    local steamStats = game.Steam.getPlayerStats()
    print("Steam playtime: " .. steamStats.playtime)
]]`;

  return luaScript;
}

/**
 * Generates a summary of the Lua script for Discord embed
 * @param {string} script - The Lua script
 * @param {Object} appData - Steam app data
 * @returns {Object} - Summary object for embed
 */
function getLuaScriptSummary(script, appData) {
  const lineCount = script.split('\n').length;
  const characterCount = script.length;
  
  return {
    appName: appData.name,
    lineCount: lineCount,
    characterCount: characterCount,
    features: [
      'Steam Integration',
      'Game State Management',
      'Player System',
      'Achievement System',
      'Event Management',
      'Utility Functions',
      'Save/Load System'
    ]
  };
}

module.exports = {
  generateLuaScript,
  getLuaScriptSummary
};