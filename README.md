# Wavelength-Bot
A discord bot I created to let me and my friends play [Wavelength](https://www.wavelength.zone) remotely.

## Config File
In order to set up will also need to create a config.json file in the main folder. This needs to contain 3 fields: "prefix", "token", and "BOT_OWNER"
Prefix is the prefix that you want to use for bot commands

Token is the bot token

BOT_OWNER is your discord ID, it gives the chosen user the power to endgames without being the creator


## Commands
All commands should be prefixed by the prefix defined in the config file.
| Command | Description | args |
| ------  | ----------- | ---- |
| help    | Lists commands or gets info on a specified command | [command name] |
| create  | Creates a game in a channel | |
| endgame | Ends the game in a channel | |
| join | Joins a game, can specify which team | [team number] |
| leave | Leaves a game | |
| list | Lists the players in a game and what teams they are on. | |
| changeteam | Changes the user's team to the specified team or shuffles both teams | [team number] or [shuffle] |
| start | Sends the user a DM with instructions on how to start the next round | |
| move | Moves the dial a number of degrees. Positive moves clockwise, negative counterclockwise | [degrees] |
| lock | A player on the guessing team can lock in the answer. Triggers the end of a round  | |
| rules | Explains the rules of wavelength, each section of the game has its own number which can be found by calling rules with no arguments | [ruleNumber] |
| score | Displays the scores of the two teams. If the set option is included can be used to set the scores | "set [score1] [score2]" |
