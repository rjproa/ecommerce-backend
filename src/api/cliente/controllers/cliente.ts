/**
 * cliente controller
 */

import { factories } from '@strapi/strapi';
import bcrypt from 'bcryptjs';

export default factories.createCoreController('api::cliente.cliente', ({ strapi }) => ({
  async validatePassword(ctx) {
    const { documentId, password } = ctx.request.body;

    try {
      // Buscar el cliente por documentId
      const cliente = await strapi.db.query('api::cliente.cliente').findOne({
        where: { documentId },
        select: ['id', 'password', 'documentId', 'nombre'],
      });

      if (!cliente) {
        return ctx.badRequest('Cliente no encontrado');
      }

      // Comparar password usando bcrypt
      const validPassword = await bcrypt.compare(password, cliente.password);

      if (validPassword) {
        return ctx.send({
          valid: true,
          message: 'Contraseña correcta'
        });
      } else {
        return ctx.send({
          valid: false,
          message: 'Contraseña incorrecta'
        });
      }
    } catch (error) {
      console.error('Error validando password:', error);
      return ctx.badRequest('Error al validar contraseña');
    }
  },

  // NUEVO: Actualizar cliente después de girar ruleta
  async actualizarDespuesDeGiro(ctx) {
    const { documentId, puntosGanados } = ctx.request.body;

    try {
      // Buscar el cliente
      const cliente = await strapi.db.query('api::cliente.cliente').findOne({
        where: { documentId },
      });

      if (!cliente) {
        return ctx.badRequest('Cliente no encontrado');
      }

      // Actualizar cliente: deshabilitar y sumar puntos
      const clienteActualizado = await strapi.db.query('api::cliente.cliente').update({
        where: { documentId },
        data: {
          habilitado: false,
          puntos: cliente.puntos + puntosGanados,
        },
      });

      return ctx.send({
        success: true,
        message: 'Cliente actualizado correctamente',
        cliente: {
          documentId: clienteActualizado.documentId,
          nombre: clienteActualizado.nombre,
          habilitado: clienteActualizado.habilitado,
          puntos: clienteActualizado.puntos,
          codigo: clienteActualizado.codigo,
        }
      });
    } catch (error) {
      console.error('Error actualizando cliente:', error);
      return ctx.badRequest('Error al actualizar cliente');
    }
  },
}));