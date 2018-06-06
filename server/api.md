# WebSocket Codes, and Corresponding Actions/Meanings

### Code 0

Hello. Hello is sent from the client when they connect. It is used to introduce the ID to the server. Format is [ID];

### Code 1

Welcome. Welcome is sent from the server to the client after it reveices Code 0. This contains everything the server wants the client to know about itselfs. Currently kinda redundant, it just confirms the server is up to start game. Format is [ID].

### Code 2

Reversed for Move

### Code 3

Reserved for Update

### Code 4

Reserved for myCord. Unused