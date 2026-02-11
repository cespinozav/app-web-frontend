import RolesService from 'services/Roles';

const options = [
  {
    title: 'Rol',
    request: RolesService.get,
    schema: [
      { field: 'id', label: 'ID' },
      { field: 'description', label: 'Rol' },
      { field: 'user_created', label: 'Creador' },
      { field: 'date_created', label: 'Fecha de creación' }
    ],
    FormComponent: require('./TypeServiceForm').default,
    service: {
      id: 'roles',
      post: RolesService.post,
      put: RolesService.put,
      delete: RolesService.delete
    }
  }
];

export default options;
