import Fastify from 'fastify';
import { pool } from './config/database';
import { ZodError } from 'zod';
import { AppError } from './errors/app-error';
import { motoristasRoutes } from './routes/motoristas.routes';

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

app.register(motoristasRoutes);

app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      status: 'error',
      message: 'Dados inválidos',
      details: error.issues.map(issue => ({
        campo: issue.path.join('.'),
        mensagem: issue.message
      }))
    });
  }

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      status: 'error',
      message: error.message
    });
  }

  request.log.error(error);

  return reply.status(500).send({
    status: 'error',
    message: 'Erro interno do servidor'
  });
});