import { useEffect, useState } from 'react';
import { Pencil, Trash2, Plus, Loader2, XCircle } from 'lucide-react';
import { Employee, EmployeeFormData } from './types';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from './api';
import { EmployeeForm } from './components/EmployeeForm';

function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEmployees();
      setEmployees(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleCreate = async (data: EmployeeFormData) => {
    try {
      setError(null);
      await createEmployee(data);
      await fetchEmployees();
      setIsFormOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create employee');
    }
  };

  const handleUpdate = async (data: EmployeeFormData) => {
    if (!editingEmployee) return;
    try {
      setError(null);
      await updateEmployee(editingEmployee.id, data);
      await fetchEmployees();
      setEditingEmployee(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update employee');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    try {
      setError(null);
      await deleteEmployee(id);
      await fetchEmployees();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete employee');
    }
  };

  const ErrorMessage = ({ message }: { message: string }) => (
    <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4 flex items-center gap-2">
      <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
      <p className="text-red-700">{message}</p>
      <button
        onClick={() => setError(null)}
        className="ml-auto text-red-700 hover:text-red-900"
      >
        <XCircle className="h-4 w-4" />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Employees</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage your employee records with this CRUD interface
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </button>
          </div>
        </div>

        {error && <ErrorMessage message={error} />}

        {isFormOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Add New Employee</h2>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
              <EmployeeForm
                onSubmit={handleCreate}
                onCancel={() => setIsFormOpen(false)}
              />
            </div>
          </div>
        )}

        {editingEmployee && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Edit Employee</h2>
                <button
                  onClick={() => setEditingEmployee(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
              <EmployeeForm
                initialData={{
                  name: editingEmployee.name,
                  email: editingEmployee.email,
                  position: editingEmployee.position,
                  department: editingEmployee.department,
                  
                }}
                onSubmit={handleUpdate}
                onCancel={() => setEditingEmployee(null)}
              />
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                {loading ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  </div>
                ) : employees.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <p className="text-sm text-gray-500">No employees found</p>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Position</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Department</th>
                        <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {employees.map((employee) => (
                        <tr key={employee.id}>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{employee.name}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{employee.email}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{employee.position}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{employee.department}</td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <h3 className="text-lg font-semibold text-gray-700">Actions</h3>
                            <button
                              onClick={() => setEditingEmployee(employee)}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(employee.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;