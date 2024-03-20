FROM    node
ADD     server.js index.html commands.json / 
CMD     ["node", "server.js"]
