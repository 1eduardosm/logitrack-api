import Fastify from 'fastify';
import { pool } from './config/database';

export const app = Fastify({
  logger: true
});

app.get('/health/database', async (request, reply) => {
  try {
    await pool.query('SELECT 1');

    return {
      status: 'ok',
      message: 'PostgreSQL conectado com sucesso!'
    };
  } catch (error) {
    app.log.error(error);

    return reply.status(503).send({
      status: 'error',
      message: 'Banco de dados indisponível'
    });
  }
});