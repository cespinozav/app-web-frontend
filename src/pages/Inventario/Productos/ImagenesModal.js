import React, { useRef, useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import getS3Url from 'utils/s3';
import { ConfirmDialog } from 'primereact/confirmdialog';
import ImagenesProductoService from 'services/ImagenesProducto';

export default function ImagenesModal({ visible, onHide, producto, onUpdate }) {
  const [imagenes, setImagenes] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
    // Consultar imágenes al abrir el modal y cuando cambia el producto
    useEffect(() => {
      const fetchImages = async () => {
        if (visible && producto?.id) {
          try {
            const imgs = await ImagenesProductoService.list(producto.id);
            setImagenes(imgs);
            setSelectedIdx(0);
          } catch (e) {
            setImagenes([]);
            setSelectedIdx(0);
          }
        } else if (!visible) {
          setImagenes([]);
          setSelectedIdx(0);
        }
      };
      fetchImages();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible, producto?.id]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const fileUploadRef = useRef(null);
  const [editIndex, setEditIndex] = useState(null);

  const handleUpload = async ({ files }) => {
    if (!producto?.id) return;
    try {
      // Subir todas las imágenes
      await Promise.all(
        files.map(file =>
          ImagenesProductoService.create({ productId: producto.id, file })
        )
      );
      // Consultar la lista actualizada
      const nuevas = await ImagenesProductoService.list(producto.id);
      setImagenes(nuevas);
      if (onUpdate) onUpdate(nuevas);
    } catch (e) {
      if (window.toast) window.toast.error('Error al subir imagen');
    }
  };

  const handleDelete = async () => {
    if (!imageToDelete?.id) return;
    try {
      await ImagenesProductoService.delete(imageToDelete.id);
      const actualizadas = imagenes.filter(img => img.id !== imageToDelete.id);
      setImagenes(actualizadas);
      if (onUpdate) onUpdate(actualizadas);
    } catch (e) {
      if (window.toast) window.toast.error('Error al eliminar imagen');
    }
    setShowConfirm(false);
    setImageToDelete(null);
  };

  return (
    <Dialog header={`Imágenes de ${producto?.nombre || ''}`} visible={visible} style={{ width: 520 }} onHide={onHide} modal>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
        <input
          ref={fileUploadRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={async event => {
            const file = event.target.files[0];
            if (!file) return;
            await handleUpload({ files: [file] });
            // Limpiar selección para permitir subir la misma imagen si se desea
            if (fileUploadRef.current) fileUploadRef.current.value = '';
          }}
        />
        <button
          type="button"
          className="p-button p-component"
          style={{ padding: '8px 18px', fontSize: 16, borderRadius: 6, background: '#1976d2', color: '#fff', border: 'none', cursor: 'pointer' }}
          onClick={() => fileUploadRef.current && fileUploadRef.current.click()}
        >
          Subir imagen
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', gap: 24, minHeight: 320 }}>
        {/* Miniaturas verticales */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', justifyContent: 'flex-start', minWidth: 70 }}>
          {imagenes.length === 0 && <span style={{ color: '#888' }}>No hay imágenes</span>}
          {imagenes.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIdx(idx)}
              style={{
                border: selectedIdx === idx ? '2px solid #1976d2' : '1px solid #eee',
                borderRadius: 8,
                padding: 0,
                background: selectedIdx === idx ? '#f0f7ff' : '#fff',
                cursor: 'pointer',
                outline: 'none',
                boxShadow: selectedIdx === idx ? '0 0 0 2px #90caf9' : 'none',
                width: 64,
                height: 64,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 2
              }}
            >
              <img
                src={getS3Url(String(img.image_path || img.image || img.url || img || ''))}
                alt={`thumb-${idx}`}
                style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 6 }}
              />
            </button>
          ))}
        </div>
        {/* Imagen principal grande y acciones */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 320 }}>
          {imagenes[selectedIdx] && (
            <figure style={{ margin: 0, position: 'relative', width: 380, height: 380, background: '#fafbfc', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <img
                src={getS3Url(String(imagenes[selectedIdx].image_path || imagenes[selectedIdx].image || imagenes[selectedIdx].url || imagenes[selectedIdx] || ''))}
                alt={`img-main-${selectedIdx}`}
                style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 12 }}
              />
              {/* Botón eliminar */}
              <Button
                icon="pi pi-trash"
                className="p-button-danger p-button-rounded p-button-sm"
                style={{ position: 'absolute', top: 10, right: 10, zIndex: 2, padding: 6 }}
                onClick={() => { setShowConfirm(true); setImageToDelete(imagenes[selectedIdx]); }}
                tooltip="Eliminar"
              />
              {/* Botón actualizar */}
              <Button
                icon="pi pi-pencil"
                className="p-button-warning p-button-rounded p-button-sm"
                style={{ position: 'absolute', bottom: 10, right: 10, zIndex: 2, padding: 6 }}
                onClick={() => setEditIndex(selectedIdx)}
                tooltip="Actualizar imagen"
              />
              {editIndex === selectedIdx && (
                <div style={{ position: 'absolute', left: 10, bottom: 10, background: '#fff', border: '1px solid #eee', borderRadius: 6, padding: 8, zIndex: 10 }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async ev => {
                      const file = ev.target.files[0];
                      if (!file) return;
                      try {
                        const res = await ImagenesProductoService.update({
                          imageId: imagenes[selectedIdx].id,
                          productId: producto.id,
                          file
                        });
                        // Suponiendo que el backend retorna la nueva URL
                        const actualizadas = imagenes.map((im, i) => i === selectedIdx ? { ...im, url: res.url } : im);
                        setImagenes(actualizadas);
                        if (onUpdate) onUpdate(actualizadas);
                        setEditIndex(null);
                      } catch (err) {
                        if (window.toast) window.toast.error('Error al actualizar imagen');
                      }
                    }}
                    style={{ fontSize: 12 }}
                  />
                  <Button icon="pi pi-times" className="p-button-text p-button-sm" onClick={() => setEditIndex(null)} style={{ marginLeft: 4 }} />
                </div>
              )}
            </figure>
          )}
        </div>
      </div>
      <ConfirmDialog
        visible={showConfirm}
        onHide={() => setShowConfirm(false)}
        message="¿Seguro que deseas eliminar esta imagen?"
        header="Confirmar eliminación"
        icon="pi pi-exclamation-triangle"
        accept={handleDelete}
        reject={() => setShowConfirm(false)}
      />
    </Dialog>
  );
}
