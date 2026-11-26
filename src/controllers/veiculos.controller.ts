import { FastifyRequest, FastifyReply } from 'fastify';
import { VeiculosService } from '../services/veiculos.service';

import {
  criarVeiculoSchema,
  atualizarVeiculoSchema,
  veiculoParamsSchema,
  listarVeiculosSchema,
  CriarVeiculoDTO,
  AtualizarVeiculoDTO
} from '../dtos/veiculos.dto';

export class VeiculosController {
  constructor(
    private service = new VeiculosService()
  ) {}

  async getAll(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const filtros = listarVeiculosSchema.parse(request.query);

    const resultado = await this.service.getAll(filtros);

    return reply.code(200).send(resultado);
  }

  async getOne(
    request: FastifyRequest<{
      Params: { id: string }
    }>,
    reply: FastifyReply
  ) {
    const { id } = veiculoParamsSchema.parse(request.params);

    const veiculo = await this.service.getOne(id);

    return reply.code(200).send(veiculo);
  }

  async create(
    request: FastifyRequest<{
      Body: CriarVeiculoDTO
    }>,
    reply: FastifyReply
  ) {
    const dados = criarVeiculoSchema.parse(request.body);

    const veiculo = await this.service.create(dados);

    return reply.code(201).send(veiculo);
  }

  async update(
    request: FastifyRequest<{
      Params: { id: string };
      Body: AtualizarVeiculoDTO;
    }>,
    reply: FastifyReply
  ) {
    const { id } = veiculoParamsSchema.parse(request.params);

    const dados = atualizarVeiculoSchema.parse(request.body);

    const veiculo = await this.service.update(id, dados);

    return reply.code(200).send(veiculo);
  }

  async delete(
    request: FastifyRequest<{
      Params: { id: string }
    }>,
    reply: FastifyReply
  ) {
    const { id } = veiculoParamsSchema.parse(request.params);

    await this.service.delete(id);

    return reply.code(204).send();
  }
}