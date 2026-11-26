
import { FastifyInstance } from 'fastify';
import { MotoristasController } from '../controllers/motoristas.controller';

const controller = new MotoristasController();

export async function motoristasRoutes(app: FastifyInstance) {
  app.get('/motoristas', controller.getAll);
  app.get('/motoristas/:id', controller.getOne);
  app.post('/motoristas', controller.create);
  app.put('/motoristas/:id', controller.update);
  app.delete('/motoristas/:id', controller.delete);
}
