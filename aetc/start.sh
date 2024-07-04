
pm2 stop aetc
npm install
npm run build
pm2 start ecosystem.config.js --env production