export default {
  routes: [
    {
      method: 'POST',
      path: '/clientes/validate-password',
      handler: 'cliente.validatePassword',
      config: {
        policies: [],
        auth: false,
      },
    },
    // NUEVA RUTA
    {
      method: 'POST',
      path: '/clientes/actualizar-despues-giro',
      handler: 'cliente.actualizarDespuesDeGiro',
      config: {
        policies: [],
        auth: false,
      },
    },
  ],
};