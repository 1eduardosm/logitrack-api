
import { FastifyReply, FastifyRequest } from 'fastify';
import { EntregasService } from '../services/entregas.service';
import {
  criarEntregaSchema,
  atualizarEntregaSchema,
  entregaParamsSchema,
  listarEntregasSchema
} from '../dtos/entregas.dto';

const service = new EntregasService();

export class EntregasController {
  async getAll(request: FastifyRequest, reply: FastifyReply) {
    const filtros = listarEntregasSchema.parse(request.query);
    return reply.send(await service.getAll(filtros));
  }

  async getOne(request: FastifyRequest, reply: FastifyReply) {
    const { id } = entregaParamsSchema.parse(request.params);
    return reply.send(await service.getOne(id));
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    const dados = criarEntregaSchema.parse(request.body);
    const entrega = await service.create(dados);
    return reply.status(201).send(entrega);
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = entregaParamsSchema.parse(request.params);
    const dados = atualizarEntregaSchema.parse(request.body);
    return reply.send(await service.update(id, dados));
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = entregaParamsSchema.parse(request.params);
    await service.delete(id);
    return reply.status(204).send();
  }
}
