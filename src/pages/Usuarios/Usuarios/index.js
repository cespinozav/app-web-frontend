import React, { useState } from 'react';
import UsuariosService from 'services/Usuarios';
import { Dialog } from 'primereact/dialog';
import { useForm, Controller } from 'react-hook-form';
import useToast from 'hooks/useToast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Paginator } from 'primereact/paginator';
import { useQuery } from 'hooks/useRequest';
import { Skeleton } from 'primereact/skeleton';
import './style.scss';

const PAGE_SIZE = 10;


import CategoriaUsuarioService from 'services/CategoriaUsuario';


export default function Usuarios() {
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState('');
	const [categoria, setCategoria] = useState('');
	const { data: categoriasData } = useQuery(['categorias-usuario'], () => CategoriaUsuarioService.get({ page_size: 100 }));
	const categorias = categoriasData?.results || [];
	const { data, isFetching, refetch } = useQuery([
		'usuarios', page, search, categoria
	], () => UsuariosService.get({ page, page_size: PAGE_SIZE, search, categoria }));
	const usuarios = data?.results || [];
	const totalRecords = data?.count || 0;
	const [showAdd, setShowAdd] = useState(false);
	const [isMutating, setIsMutating] = useState(false);
	const [rowData, setRowData] = useState(null);
	const toast = useToast();

	// Lógica para guardar usuario (placeholder)
	const onSubmitFields = async (formData, resetForm) => {
		setIsMutating(true);
		try {
			if (rowData && rowData.id) {
				await UsuariosService.put({
					id: rowData.id,
					dni: formData.dni,
					apellidoPaterno: formData.apellidoPaterno,
					apellidoMaterno: formData.apellidoMaterno,
					nombres: formData.nombres,
					categoria: formData.categoria,
					correo: formData.correo
				});
				toast.success('Usuario actualizado con éxito');
			} else {
				await UsuariosService.post({
					dni: formData.dni,
					apellidoPaterno: formData.apellidoPaterno,
					apellidoMaterno: formData.apellidoMaterno,
					nombres: formData.nombres,
					categoria: formData.categoria,
					correo: formData.correo
				});
				toast.success('Usuario creado con éxito');
			}
			setShowAdd(false);
			setRowData(null);
			refetch();
			if (resetForm) resetForm();
		} catch (err) {
			toast.error('Error al guardar el usuario');
		} finally {
			setIsMutating(false);
		}
	};

	function UsuarioModalForm({ onClose, onSubmitFields, isMutating, defaultValues }) {
		const { control, handleSubmit, reset, formState: { errors } } = useForm({
			defaultValues: defaultValues || { nombres: '', dni: '', correo: '', apellidoPaterno: '', apellidoMaterno: '', categoria: '' }
		});
		React.useEffect(() => {
			if (defaultValues) {
				reset(defaultValues);
			} else {
				reset({ nombres: '', dni: '', correo: '', apellidoPaterno: '', apellidoMaterno: '', categoria: '' });
			}
		}, [defaultValues, reset]);
		const handleError = errors => {
			const messages = Object.values(errors)
				.slice(0, 4)
				.map(e => e.message);
			toast.error(messages);
		};
		const onSubmit = data => onSubmitFields(data, reset);
		return (
			<form onSubmit={handleSubmit(onSubmit, handleError)}>
				<div className="content">
					<div className="m-row">
						<label htmlFor="dni">DNI:</label>
						<Controller
							name="dni"
							control={control}
							rules={{ required: 'DNI requerido', maxLength: { value: 15, message: 'Máx 15 caracteres' } }}
							render={({ field }) => (
								<InputText {...field} autoComplete="off" className="p-inputtext p-component" />
							)}
						/>
						{errors.dni && <div className="error-message">{errors.dni.message}</div>}
					</div>
					<div className="m-row">
						<label htmlFor="correo">Correo:</label>
						<Controller
							name="correo"
							control={control}
							rules={{ required: 'Correo requerido', pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: 'Correo inválido' } }}
							render={({ field }) => (
								<InputText {...field} autoComplete="off" className="p-inputtext p-component" />
							)}
						/>
						{errors.correo && <div className="error-message">{errors.correo.message}</div>}
					</div>
					<div className="m-row">
						<label htmlFor="nombres">Nombres:</label>
						<Controller
							name="nombres"
							control={control}
							rules={{ required: 'Nombres requeridos', maxLength: { value: 50, message: 'Máx 50 caracteres' } }}
							render={({ field }) => (
								<InputText {...field} autoComplete="off" className="p-inputtext p-component" />
							)}
						/>
						{errors.nombres && <div className="error-message">{errors.nombres.message}</div>}
					</div>
					<div className="m-row">
						<label htmlFor="apellidoPaterno">Apellido Paterno:</label>
						<Controller
							name="apellidoPaterno"
							control={control}
							rules={{ required: 'Apellido paterno requerido', maxLength: { value: 50, message: 'Máx 50 caracteres' } }}
							render={({ field }) => (
								<InputText {...field} autoComplete="off" className="p-inputtext p-component" />
							)}
						/>
						{errors.apellidoPaterno && <div className="error-message">{errors.apellidoPaterno.message}</div>}
					</div>
					<div className="m-row">
						<label htmlFor="apellidoMaterno">Apellido Materno:</label>
						<Controller
							name="apellidoMaterno"
							control={control}
							rules={{ required: 'Apellido materno requerido', maxLength: { value: 50, message: 'Máx 50 caracteres' } }}
							render={({ field }) => (
								<InputText {...field} autoComplete="off" className="p-inputtext p-component" />
							)}
						/>
						{errors.apellidoMaterno && <div className="error-message">{errors.apellidoMaterno.message}</div>}
					</div>
					<div className="m-row">
						<label htmlFor="categoria">Categoría:</label>
						<Controller
							name="categoria"
							control={control}
							rules={{ required: 'Seleccione categoría' }}
							render={({ field }) => (
								<Dropdown {...field} options={categorias.map(c => ({ label: c.description, value: c.id }))} placeholder="Seleccione" style={{ minWidth: 160 }} />
							)}
						/>
						{errors.categoria && <div className="error-message">{errors.categoria.message}</div>}
					</div>
				</div>
				<div className="buttons">
					<Button
						loading={isMutating}
						disabled={isMutating}
						className="button p-button p-component"
						loadingIcon="pi pi-spin pi-spinner"
						iconPos="right"
						type="submit"
						label="Guardar"
					/>
				</div>
			</form>
		);
	}

	return (
		<div className="usuarios-listado">
			<div className="header-clientes">
				<h2>LISTADO DE USUARIOS</h2>
				<div className="acciones">
					<button
						className="add"
						onClick={() => setShowAdd(true)}
					>
						Agregar +
					</button>
				</div>
			</div>
			<div className="filtros-clientes">
				<div className="filtro-item" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
					<span className="p-input-icon-left">
						<i className="pi pi-search" />
						<InputText placeholder="Nombre usuario" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
					</span>
				</div>
				<div className="filtro-item" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
					<label style={{ minWidth: 60 }}>Categoría</label>
					<Dropdown value={categoria} options={[{ label: 'Todas', value: '' }, ...categorias.map(c => ({ label: c.description, value: c.id }))]} onChange={e => { setCategoria(e.value); setPage(1); }} placeholder="Categoría" style={{ minWidth: 160 }} />
				</div>
			</div>
			<div className="tabla-clientes">
				{isFetching ? (
					Array.from({ length: PAGE_SIZE }).map((_, i) => <Skeleton className="table" key={i} />)
				) : (
					<table className="p-datatable table">
						<thead>
							<tr>
								<th>ID</th>
								<th>DNI</th>
								<th>Correo</th>
								<th>Nombres</th>
								<th>Apellido Paterno</th>
								<th>Apellido Materno</th>
								<th>Categoría</th>
								<th>Usuario creado</th>
								<th>Fecha creada</th>
								<th>Acción</th>
							</tr>
						</thead>
						<tbody>
							{usuarios.length === 0 ? (
								<tr><td colSpan={9} style={{ textAlign: 'center' }}>No hay resultados</td></tr>
							) : (
								usuarios.map(usuario => (
									<tr key={usuario.id}>
										<td>{usuario.id}</td>
										<td>{usuario.dni}</td>
										<td>{usuario.correo}</td>
										<td>{usuario.nombres}</td>
										<td>{usuario.apellidoPaterno}</td>
										<td>{usuario.apellidoMaterno}</td>
										<td>{usuario.categoria?.description || '-'}</td>
										<td>{usuario.usuarioCreado}</td>
										<td>{usuario.fechaCreada || '-'}</td>
										<td>
											<div className="actions">
												<Button
													icon="pi pi-pencil"
													className="p-button p-component p-button-icon-only"
													style={{ background: 'transparent' }}
													onClick={() => { setRowData(usuario); setShowAdd(true); }}
													aria-label="Editar"
												/>
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				)}
			</div>
			<Dialog
				className="dialog usuarios-dialog maintenance"
				draggable={false}
				visible={showAdd}
				modal
				onHide={() => { setShowAdd(false); setRowData(null); }}
				header={<span style={{ fontWeight: 600, fontSize: '1.2rem' }}>{rowData ? 'Editar usuario' : 'Agregar usuario'}</span>}
				closable={true}
			>
				<UsuarioModalForm
					onClose={() => { setShowAdd(false); setRowData(null); }}
					onSubmitFields={onSubmitFields}
					isMutating={isMutating}
					defaultValues={rowData ? {
						dni: rowData.dni || '',
						correo: rowData.correo || '',
						nombres: rowData.nombres || '',
						apellidoPaterno: rowData.apellidoPaterno || '',
						apellidoMaterno: rowData.apellidoMaterno || '',
						categoria: rowData.categoria && rowData.categoria.id ? rowData.categoria.id : ''
					} : undefined}
				/>
			</Dialog>
			<div className="paginate">
				<Paginator
					first={(page - 1) * PAGE_SIZE}
					rows={PAGE_SIZE}
					onPageChange={e => setPage(Math.floor(e.first / PAGE_SIZE) + 1)}
					totalRecords={totalRecords}
				/>
			</div>
		</div>
	);
}