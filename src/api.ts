// import axios, { AxiosError } from 'axios';
import { Employee, EmployeeFormData } from './types';

const API_URL = "https://67d7ece99d5e3a10152c999f.mockapi.io/employeedetails/email";

export const getEmployees = async (): Promise<Employee[]> => {
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: { 'content-type': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error(response.status === 404
        ? 'Employee data not found'
        : 'Failed to fetch employees. Please try again later.'
      );
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while fetching employees');
  }
};

export const createEmployee = async (employee: EmployeeFormData): Promise<Employee> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(employee)
    });

    if (!response.ok) {
      throw new Error(response.status === 400
        ? 'Invalid employee data provided'
        : 'Failed to create employee. Please try again later.'
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while creating employee');
  }
};

export const updateEmployee = async (id: string, employee: EmployeeFormData): Promise<Employee> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(employee)
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Employee not found');
      }
      if (response.status === 400) {
        throw new Error('Invalid employee data provided');
      }
      throw new Error('Failed to update employee. Please try again later.');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while updating employee');
  }
};

export const deleteEmployee = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Employee not found');
      }
      throw new Error('Failed to delete employee. Please try again later.');
    }

    await response.json(); // Consume the response body
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while deleting employee');
  }
};