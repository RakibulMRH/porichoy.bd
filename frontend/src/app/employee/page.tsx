// src/app/employee/page.tsx

import React from 'react';

interface Employee {
  empId: number;
  name: string;
  sal: string;
  role: string;
  block: null;
  privName: string;
  bonus: number;
  email: null;
  privileges: any[];
}

const EmployeePage = async () => {
  const fetchEmployees = async () => {
    const response = await fetch('http://localhost:3001/employee', {
      cache: 'no-store',
    });
    const employees: Employee[] = await response.json();
    return employees;
  };

  const employees = await fetchEmployees();

  return (
    <div>
      <h1>Employee List</h1>
      <table>
        <thead>
          <tr>
            <th style={{ padding: '8px 16px' }}>Employee ID</th>
            <th style={{ padding: '8px 16px' }}>Name</th>
            <th style={{ padding: '8px 16px' }}>Salary</th>
            <th style={{ padding: '8px 16px' }}>Role</th>
            <th style={{ padding: '8px 16px' }}>Block Status</th>
            <th style={{ padding: '8px 16px' }}>Privilege</th>
            <th style={{ padding: '8px 16px' }}>Bonus</th>
            <th style={{ padding: '8px 16px' }}>Email</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.empId}>
              <td style={{ padding: '8px 16px' }}>{employee.empId}</td>
              <td style={{ padding: '8px 16px' }}>{employee.name}</td>
              <td style={{ padding: '8px 16px' }}>{employee.sal}</td>
              <td style={{ padding: '8px 16px' }}>{employee.role}</td>
              <td style={{ padding: '8px 16px' }}>
                {employee.block ? 'Blocked' : 'Active'}
              </td>
              <td style={{ padding: '8px 16px' }}>{employee.privName}</td>
              <td style={{ padding: '8px 16px' }}>{employee.bonus}</td>
              <td style={{ padding: '8px 16px' }}>
                {employee.email || 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table> 
    </div>
  );
};

export default EmployeePage;