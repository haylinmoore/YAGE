# WebSocket Codes, and Corresponding Actions/Meanings

### Code 0

Goodbye. This code is sent by the server when a user disconnects. Format is [ID]

### Code 1 

Welcome. Welcome is sent from the server to the client after it reveices Code 0. This contains everything the server wants the client to know about itselfs. Currently kinda redundant, it just confirms the server is up to start game. Format is [ID].

### Code 2

Keypress. Keypress is sent when the player presses any key. Format is [keyID (Int), State(Bol)]

### Code 3

Keypress Remote. KeypressR is sent from the server to all clients when a user presses a key. Format is [userID (Int), KeyID (Int), State (Bol)]

### Code 4

Update. Update is sent to update the position of the player to other players. Format [userID (Int), X-Cord (Int), Y-Cord (Int), X-Mom (Int), Y-Mom(Int)]

### Code 5

Reserved for myCord. Proposed But Not Used Yet