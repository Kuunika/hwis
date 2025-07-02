#!/bin/bash

# Define the port



pm2 stop aetc 2>/dev/null


npm run build

echo "Preparing standalone output..."
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/

echo "Starting the Next.js standalone server with PM2 on port $PORT..."
PORT=3002 pm2 start node --name "aetc" -- .next/standalone/server.js --port $PORT

echo "Server started on port $PORT"
pm2 save
