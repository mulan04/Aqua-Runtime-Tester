FROM node
ADD server.js index.html /app/
ADD commands.json /app/config/
WORKDIR /app
CMD ["node", "server.js"]
