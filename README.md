# Wavelength-Bot
A discord bot I created to let me and my friends play [Wavelength](https://www.wavelength.zone) remotely.

## Commands
| Command | Description | args |
| ------  | ----------- | ---- |
| help    | Lists commands or gets info on a specified command | [command name] |
| create  | Creates a game in a channel | |
| join | Joins a game, can specify which team | [team number] |
| list | Lists the players in a game and their team | |
| changeteam | Changes the user's team to the specified team or shuffles both teams | [team number] or [shuffle] |
| start | Sends the user a DM with instructions on how to start the next round | |
| move | Moves the dial a number of degrees. Positive moves clockwise, negative counterclockwise | [degrees] |
| reveal | The cluegiver can reveal the board and triggers the end of a round  | |
| endgame | Ends the game in the channel | |


## Config File
In order to set up will also need to create a config.json file in the main folder. This needs to contain 3 fields: "prefix", "token", and "BOT_OWNER"
Prefix is the prefix that you want to use for bot commands
Token is the bot token
BOT_OWNER I've set up as myself on my copy, it gives them the power to endgames at the moment
