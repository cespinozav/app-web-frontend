import React from 'react';
import { Button } from 'primereact/button';
import { useForm } from 'react-hook-form';
import useToast from 'hooks/useToast';
import { useMutation } from 'hooks/useRequest';
import { FormInput } from 'components/FormControls';

const DEFAULT_FIELDS = {
  description: '',
  user_created: ''
};

export default function TypeServiceForm({ defaultFields, onClose, service }) {
    console.log('Render TypeServiceForm', { defaultFields, service });
  const isEditing = Boolean(defaultFields && defaultFields.id);
  const { mutate, isLoading } = useMutation('roles', isEditing ? service.put : service.post);
  const toast = useToast();
  const {
    control,
    handleSubmit,
    reset,
    formState: { dirtyFields, errors }
  } = useForm({
    defaultValues: DEFAULT_FIELDS
  });
  const formRef = React.useRef(null);

  React.useEffect(() => {
    console.log('useEffect defaultFields:', defaultFields);
    reset({ ...DEFAULT_FIELDS, ...defaultFields });
  }, [defaultFields, reset]);

  const handleError = errors => {
    const messages = Object.values(errors)
      .slice(0, 4)
      .map(e => e.message);
    toast.error(messages);
  };

  const onSubmit = formData => {
      console.log('onSubmit', { formData, isEditing, dirtyFields });
    if (isEditing) {
      const dirtyList = Object.keys(dirtyFields);
      if (dirtyList.length === 0) {
        toast.error('Debe cambiar algún campo');
        return;
      }
    }
    let payload;
    if (isEditing) {
      payload = {
        id: defaultFields?.id,
        description: formData.description,
        state: 1
      };
    } else {
      payload = {
        description: formData.description,
        state: 1,
        user_created: defaultFields?.user_created || '72553586'
      };
    }
    mutate(
      payload,
      {
        onSuccess: () => {
          console.log('onSuccess');
          onClose();
          toast.success(isEditing ? 'Rol actualizado con éxito' : 'Rol creado con éxito');
        },
        onError: err => {
          console.error('onError', err);
          if (err?.result?.description && Array.isArray(err.result.description)) {
            toast.error(err.result.description[0]);
            return;
          }
          if (err?.status === 401 || (err?.message && String(err.message).includes('401'))) {
            window.location.href = '/login';
            return;
          }
          const strMessage = String(err);
          if (strMessage.includes('already exists')) {
            toast.error('El rol ya existe');
          } else {
            toast.error(err?.message || err);
          }
        }
      }
    );
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit, handleError)}>
      <div className="content">
        <div className="m-row">
          <label htmlFor="description">Descripción:</label>
          <FormInput
            control={control}
            name="description"
            rules={{
              required: 'Descripción requerida',
              maxLength: { value: 50, message: 'Máx 50 caracteres' }
            }}
            className="p-inputtext p-component"
          />
        </div>
      </div>
      <div className="footer" style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Button
          label={isEditing ? 'Editar rol' : 'Agregar rol'}
          type="submit"
          loading={isLoading}
          className="add"
          style={{ minWidth: 120 }}
        />
        <Button label="Cancelar" type="button" className="p-button-secondary" onClick={onClose} />
      </div>
    </form>
  );
}
