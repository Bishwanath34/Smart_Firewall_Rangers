const createApp = require('./src/app');
const { PORT } = require('./src/config');

const app = createApp();

app.listen(PORT, () => {
  console.log(`AI-NGFW Gateway running at http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Admin panel: http://localhost:${PORT}/admin/logs`);
});