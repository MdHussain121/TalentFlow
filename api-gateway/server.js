const fastify = require('fastify')({ 
  logger: true,
  bodyLimit: 52428800 // 50MB
});
const cors = require('@fastify/cors');
const helmet = require('@fastify/helmet');
const proxy = require('@fastify/http-proxy');

// Global Middlewares
fastify.register(cors, { origin: true });
fastify.register(helmet, { contentSecurityPolicy: false });

// Helper to strip problematic headers
fastify.addHook('onRequest', async (request, reply) => {
  if (request.headers.expect) {
    delete request.headers.expect;
  }
});

// Proxy to AI Engine (No Auth Required)
const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://localhost:8000';

fastify.register(proxy, {
  upstream: AI_ENGINE_URL,
  prefix: '/ai',
  rewritePrefix: '',
  replyOptions: {
    rewriteHeaders: (headers) => {
      // Ensure headers are clean
      return headers;
    }
  }
});

// Health Check
fastify.get('/health', async () => ({ status: 'Gateway Online', auth: 'Disabled' }));

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('🚀 TalentFlow API Gateway running on http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
