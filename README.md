# Multiplayer Tic Tac Toe

**Multiplayer Tic Tac Toe** is an online version of the classic Tic Tac Toe game, allowing two players to compete in real-time. Built with modern technologies, the game offers a seamless experience for players, synchronizing game states instantly using real-time web sockets. Players can create a game, join an existing game, and enjoy a classic strategic challenge against friends or strangers from anywhere!

## Server (Backend)

The server is built using Node.js and the Express framework. It's primarily responsible for game management, maintaining game state, and handling real-time communication between players through Socket.io.

### Setup

1. Navigate to the `server` directory.
2. Install dependencies using the command:
```
npm install
```

### Running

Start the server using the command:
```
node index.js
```

The server will be listening on port `3001`.

## Client (Frontend)

The frontend is a React application, providing users with an intuitive interface to play the game. It communicates with the server in real-time, ensuring a responsive game experience.

### Setup

1. Navigate to the `client` directory.
2. Install dependencies with the command:
```
npm install
```

### Running

Start the development server using the command:
```
npm start
```

The client will be accessible at `http://localhost:3000`.
