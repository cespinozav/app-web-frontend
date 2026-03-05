import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.scss';
import ProductoService from 'services/Producto';
import { tipoMoneda } from 'utils/constants';
import CatalogoFilters from './Filters';

export default function Catalogo() {
  const [categoria, setCategoria] = useState('');
  const [precioMin, setPrecioMin] = useState();
  const [precioMax, setPrecioMax] = useState();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params = {
      page: 1,
      page_size: 40,
      cat: categoria,
    };
    ProductoService.get(params).then(res => {
      let filtered = res.results;
      if (precioMin != null) filtered = filtered.filter(p => Number(p.precio) >= precioMin);
      if (precioMax != null) filtered = filtered.filter(p => Number(p.precio) <= precioMax);
      setProductos(filtered);
    }).finally(() => setLoading(false));
  }, [categoria, precioMin, precioMax]);

  return (
    <div className="catalogo-container">
      <h1>Catálogo de Productos</h1>
      <CatalogoFilters
        categoria={categoria}
        setCategoria={setCategoria}
        precioMin={precioMin}
        setPrecioMin={setPrecioMin}
        precioMax={precioMax}
        setPrecioMax={setPrecioMax}
      />
      <CatalogoGrid productos={productos} loading={loading} />
    </div>
  );
}

// CatalogoGrid debe estar fuera del componente principal para usar hooks
export function CatalogoGrid({ productos, loading }) {
  const navigate = useNavigate();
  return (
    <div className="catalogo-grid">
      {loading && <div className="catalogo-loading">Cargando productos...</div>}
      {!loading && productos.length === 0 && <div className="catalogo-empty">No hay productos para mostrar.</div>}
      {!loading && productos.length > 0 && productos.map((prod, idx) => (
        <div
          className="catalogo-card"
          key={prod.id || idx}
          style={{ cursor: 'pointer' }}
          role="button"
          tabIndex={0}
          onClick={() => navigate(`/catalogo/${prod.id}`)}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              navigate(`/catalogo/${prod.id}`);
            }
          }}
        >
          <div className="catalogo-img-wrap">
            <img src={
              prod.imagen ||
              prod.imagen_url ||
              prod.imagenUrl ||
              [
                'https://bobandjims.com.au/cdn/shop/files/441425002_985048163161634_2672806040131070084_n.jpg?v=1717821428',
                'https://bobandjims.com.au/cdn/shop/files/438124893_787361706871460_4965367772019953874_n.jpg?v=1717818674',
                'https://bobandjims.com.au/cdn/shop/files/447770658_441924442102556_4712602939440016646_n_5311749c-47a3-46d3-b5fd-24cca75ee800.jpg?v=1718252000',
                'https://bobandjims.com.au/cdn/shop/files/441990047_505074051845649_6388789360983739883_n.jpg?v=1718250419',
                'https://bobandjims.com.au/cdn/shop/files/438124893_787361706871460_4965367772019953874_n.jpg?v=1717818674',
                'https://bobandjims.com.au/cdn/shop/files/447770658_441924442102556_4712602939440016646_n_5311749c-47a3-46d3-b5fd-24cca75ee800.jpg?v=1718252000',
                'https://bobandjims.com.au/cdn/shop/files/441990047_505074051845649_6388789360983739883_n.jpg?v=1718250419'
              ][idx % 7]
            } alt={prod.nombre} />
          </div>
          <div className="catalogo-info">
            <h2>{prod.nombre}</h2>
            <div className="catalogo-precio">
              {prod.stock !== false && prod.stock !== 0 ? (
                <span>{tipoMoneda} {Number(prod.precio).toFixed(2)}</span>
              ) : (
                <span className="agotado">Agotado</span>
              )}
            </div>
            <div className="catalogo-categoria">{prod.category_name || prod.categoria_nombre || '-'}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
