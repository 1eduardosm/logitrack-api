
import { z } from 'zod';

export const statusEntregaSchema = z.enum([
  'PENDENTE',
  'EM_TRANSITO',
  'ENTREGUE',
  'CANCELADA'
]);

export const criarEntregaSchema = z.object({
  descricao: z.string().trim().min(3).max(255),
  endereco_destino: z.string().trim().min(3).max(255),
  cep: z.string().trim().regex(/^\d{8}$/, 'CEP deve conter 8 dígitos').optional().nullable(),
  data_entrega: z.iso.date().optional().nullable(),
  status: statusEntregaSchema.default('PENDENTE'),
  motorista_id: z.number().int().positive(),
  veiculo_id: z.number().int().positive()
}).strict();

export const atualizarEntregaSchema = criarEntregaSchema;

export const entregaResponseSchema = criarEntregaSchema.extend({
  id: z.number().int().positive()
});

export const entregaParamsSchema = z.object({
  id: z.coerce.number().int().positive()
});

export const listarEntregasSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: statusEntregaSchema.optional(),
  motorista_id: z.coerce.number().int().positive().optional(),
  veiculo_id: z.coerce.number().int().positive().optional(),
  sortBy: z.enum(['id', 'data_entrega', 'status']).default('id'),
  order: z.enum(['asc', 'desc']).default('asc')
});

export type CriarEntregaDTO = z.infer<typeof criarEntregaSchema>;
export type AtualizarEntregaDTO = z.infer<typeof atualizarEntregaSchema>;
export type EntregaResponseDTO = z.infer<typeof entregaResponseSchema>;
export type ListarEntregasDTO = z.infer<typeof listarEntregasSchema>;
