// Utilidades para productos
export const formatearPrecio = (precio) => {
  if (!precio) return '$0';
  return `$${precio.toLocaleString('es-AR')}`;
};

export const obtenerPrecioProducto = (producto, cantidad = 1, unidad = 'g') => {
  if (producto.tipoVenta === 'unidad') {
    return producto.precioUnidad * cantidad;
  } else if (producto.tipoVenta === 'peso_variable') {
    const cantidadEnGramos = unidad === 'kg' ? cantidad * 1000 : cantidad;
    return producto.precioGramo * cantidadEnGramos;
  } else if (producto.tipoVenta === 'peso_fijo') {
    return producto.precioUnidad * cantidad;
  }
  return 0;
};

export const obtenerDescripcionVenta = (producto) => {
  if (!producto) return '';
  
  if (producto.tipoVenta === 'unidad') {
    return 'Por unidad';
  } else if (producto.tipoVenta === 'peso_variable') {
    return `Granel (${producto.ventaGranel?.pesoMinimo}g - ${producto.ventaGranel?.pesoMaximo}g)`;
  } else if (producto.tipoVenta === 'peso_fijo') {
    return `Paquete de ${producto.pesoEnvase?.cantidad}${producto.pesoEnvase?.unidad}`;
  }
  return '';
};

export const formatearStock = (producto) => {
  if (!producto?.stock) return 'Sin stock';
  
  const { cantidad, unidadStock } = producto.stock;
  return `${cantidad} ${unidadStock}`;
};

export const verificarStockDisponible = (producto, cantidadSolicitada = 1) => {
  if (!producto?.stock?.disponible) return false;
  if (producto.stock.cantidad === 0) return false;
  
  return producto.stock.cantidad >= cantidadSolicitada;
};

export const obtenerEstadoStock = (producto) => {
  if (!producto?.stock) return 'sin-stock';
  
  const { cantidad, stockMinimo, disponible } = producto.stock;
  
  if (!disponible || cantidad === 0) return 'sin-stock';
  if (cantidad <= stockMinimo) return 'stock-bajo';
  return 'disponible';
};

export const generarSlug = (nombre) => {
  return nombre
    .toLowerCase()
    .replace(/[áéíóú]/g, a => 'aeiou'['áéíóú'.indexOf(a)])
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};
