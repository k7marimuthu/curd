export interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  createdAt: string;
}

export interface EmployeeFormData {
  name: string;
  email: string;
  position: string;
  department: string;
}