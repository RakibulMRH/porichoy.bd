'use client';

import React, { useState } from 'react';
import styled from 'styled-components';

interface Employee {
  empId: number;
  name: string;
  sal: string;
  role: string;
  roleBlock: boolean; // Updated the property name to match the backend
  privName: any;
  bonus: number;
  email: any;
  privileges: any[];
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: #dc3545;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const ResultBox = styled.div`
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  text-align: left;
`;

const BlockEmpPage = () => {
  const [empId, setEmpId] = useState('');
  const [employee, setEmployee] = useState<Employee | null>(null);

  const handleBlockEmployee = async () => {
    if (!empId) {
      alert('Please enter an employee ID.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/employee/${empId}/block`, {
        method: 'PUT', // Using PUT method to update the employee
      });

      console.log('Response status:', response.status); // Log the response status

      if (response.ok) {
        const data = await response.json();
        console.log('Response data:', data); // Log the response data
        setEmployee(data);
      } else {
        console.error('Response status:', response.status); // Log the response status for error cases
        alert('An error occurred while blocking the employee.');
      }
    } catch (error) {
      console.error('Error blocking employee:', error);
      alert('An error occurred while blocking the employee.');
    }
  };

  return (
    <Container>
      <h1>Block Employee</h1>
      <InputContainer>
        <Input
          type="text"
          value={empId}
          onChange={(e) => setEmpId(e.target.value)}
          placeholder="Enter employee ID"
        />
        <Button onClick={handleBlockEmployee}>Block</Button>
      </InputContainer>
      {employee && (
        <ResultBox>
          <h2>Employee Blocked</h2>
          <table>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Role Block</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{employee.empId}</td>
                <td>{employee.roleBlock ? 'Yes' : 'No'}</td>
              </tr>
            </tbody>
          </table>
          
        </ResultBox>
      )}
      
    </Container>
  );
};

export default BlockEmpPage;