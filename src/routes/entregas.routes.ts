import type { FastifyInstance } from 'fastify';
import { EntregasController } from '../controllers/entregas.controller';

const controller = new EntregasController();

export async function entregasRoutes(app: FastifyInstance) {
  app.get('/entregas', controller.getAll.bind(controller));
  app.get('/entregas/:id', controller.getOne.bind(controller));
  app.post('/entregas', controller.create.bind(controller));
  app.put('/entregas/:id', controller.update.bind(controller));
  app.delete('/entregas/:id', controller.delete.bind(controller));
}
