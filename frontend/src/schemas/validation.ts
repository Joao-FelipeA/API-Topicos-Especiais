import { z } from "zod";
import { createClienteSchema, updateClienteSchema } from "./clienteSchema";
import { loginSchema } from "./loginSchema";
import { createServicoSchema, updateServicoSchema } from "./servicoSchema";

export const validateCreateCliente = (data: unknown) => {
  try {
    const validatedData = createClienteSchema.parse(data);
    return { success: true as const, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      for (const issue of error.issues) {
        const key = String(issue.path[0]);
        errors[key] = issue.message;
      }
      return { success: false as const, errors };
    }
    throw error;
  }
};

export const validateUpdateCliente = (data: unknown) => {
  try {
    const validatedData = updateClienteSchema.parse(data);
    return { success: true as const, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      for (const issue of error.issues) {
        const key = String(issue.path[0]);
        errors[key] = issue.message;
      }
      return { success: false as const, errors };
    }
    throw error;
  }
};

export const validateLogin = (data: unknown) => {
  try {
    const validatedData = loginSchema.parse(data);
    return { success: true as const, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      for (const issue of error.issues) {
        const key = String(issue.path[0]);
        errors[key] = issue.message;
      }
      return { success: false as const, errors };
    }
    throw error;
  }
};

export const validateCreateServico = (data: unknown) => {
  try {
    const validatedData = createServicoSchema.parse(data);
    return { success: true as const, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      for (const issue of error.issues) {
        const key = String(issue.path[0]);
        errors[key] = issue.message;
      }
      return { success: false as const, errors };
    }
    throw error;
  }
};

export const validateUpdateServico = (data: unknown) => {
  try {
    const validatedData = updateServicoSchema.parse(data);
    return { success: true as const, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      for (const issue of error.issues) {
        const key = String(issue.path[0]);
        errors[key] = issue.message;
      }
      return { success: false as const, errors };
    }
    throw error;
  }
};

export const validateField = (
  schema: z.ZodObject<any>,
  fieldName: string,
  value: any
): string => {
  try {
    const fieldSchema = schema.shape[fieldName];
    if (fieldSchema) {
      fieldSchema.parse(value);
    }
    return "";
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues[0]?.message || "Valor inválido";
    }
    return "";
  }
};