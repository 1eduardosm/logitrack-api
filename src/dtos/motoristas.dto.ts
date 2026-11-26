import { z } from 'zod';

export const criarMotoristaSchema = z.object({
  nome: z.string().trim().min(3).max(100),
  cpf: z.string().regex(/^\d{11}$/, 'CPF deve conter 11 dígitos'),
  cnh: z.string().trim().min(1).max(20),
  telefone: z.string().trim().max(20).optional().nullable()
}).strict();

export const atualizarMotoristaSchema = criarMotoristaSchema;

export const motoristaResponseSchema = criarMotoristaSchema.extend({
  id: z.number().int().positive()
});

export const motoristaParamsSchema = z.object({
  id: z.coerce.number().int().positive()
});

export const listarMotoristasSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  nome: z.string().trim().optional(),
  sortBy: z.enum(['id', 'nome']).default('id'),
  order: z.enum(['asc', 'desc']).default('asc')
});

export type CriarMotoristaDTO = z.infer<typeof criarMotoristaSchema>;
export type AtualizarMotoristaDTO = z.infer<typeof atualizarMotoristaSchema>;
export type MotoristaResponseDTO = z.infer<typeof motoristaResponseSchema>;
export type ListarMotoristasDTO = z.infer<typeof listarMotoristasSchema>;