
import { FastifyReply, FastifyRequest } from 'fastify';
import { MotoristasService } from '../services/motoristas.service';
import {
  criarMotoristaSchema,
  atualizarMotoristaSchema,
  motoristaParamsSchema,
  listarMotoristasSchema
} from '../dtos/motoristas.dto';

const service = new MotoristasService();

export class MotoristasController {
  async getAll(request: FastifyRequest, reply: FastifyReply) {
    const filtros = listarMotoristasSchema.parse(request.query);
    return reply.send(await service.getAll(filtros));
  }

  async getOne(request: FastifyRequest, reply: FastifyReply) {
    const { id } = motoristaParamsSchema.parse(request.params);
    return reply.send(await service.getOne(id));
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    const dados = criarMotoristaSchema.parse(request.body);
    const motorista = await service.create(dados);
    return reply.status(201).send(motorista);
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = motoristaParamsSchema.parse(request.params);
    const dados = atualizarMotoristaSchema.parse(request.body);
    return reply.send(await service.update(id, dados));
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = motoristaParamsSchema.parse(request.params);
    await service.delete(id);
    return reply.status(204).send();
  }
}