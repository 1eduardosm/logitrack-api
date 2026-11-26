import { FastifyInstance } from 'fastify';
import { VeiculosController } from '../controllers/veiculos.controller';

import {
  CriarVeiculoDTO,
  AtualizarVeiculoDTO
} from '../dtos/veiculos.dto';

export async function veiculosRoutes(app: FastifyInstance) {
  const controller = new VeiculosController();

  app.get('/veiculos', (request, reply) =>
    controller.getAll(request, reply)
  );

  app.get<{ Params: { id: string } }>(
    '/veiculos/:id',
    (request, reply) =>
      controller.getOne(request, reply)
  );

  app.post<{ Body: CriarVeiculoDTO }>(
    '/veiculos',
    (request, reply) =>
      controller.create(request, reply)
  );

  app.put<{
    Params: { id: string };
    Body: AtualizarVeiculoDTO;
  }>(
    '/veiculos/:id',
    (request, reply) =>
      controller.update(request, reply)
  );

  app.delete<{ Params: { id: string } }>(
    '/veiculos/:id',
    (request, reply) =>
      controller.delete(request, reply)
  );
}