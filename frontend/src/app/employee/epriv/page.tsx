'use client';

import React, { useState } from 'react';
import styled from 'styled-components';

interface Employee {
  empId: number;
  name: string;
  sal: string;
  role: string;
  block: boolean;
  privName: string | null;
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
  background-color: #28a745;
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
  max-width: 600px;
  width: 100%;
  text-align: left;
`;

const EmpPrivPage = () => {
  const [empId, setEmpId] = useState('');
  const [privId, setPrivId] = useState('');
  const [employee, setEmployee] = useState<Employee | null>(null);

  const handleAssignPrivilege = async () => {
    if (!empId || !privId) {
      alert('Please enter both employee ID and privilege ID.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/employee/${empId}/privilege/${privId}`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setEmployee(data);
      } else {
        alert('An error occurred while assigning the privilege.');
      }
    } catch (error) {
      console.error('Error assigning privilege:', error);
      alert('An error occurred while assigning the privilege.');
    }
  };

  return (
    <Container>
      <h1>Assign Privilege to Employee</h1>
      <InputContainer>
        <Input
          type="text"
          value={empId}
          onChange={(e) => setEmpId(e.target.value)}
          placeholder="Enter employee ID"
        />
        <Input
          type="text"
          value={privId}
          onChange={(e) => setPrivId(e.target.value)}
          placeholder="Enter privilege ID"
        />
        <Button onClick={handleAssignPrivilege}>Assign Privilege</Button>
      </InputContainer>
      {employee && (
        <ResultBox>
          <h2>Privilege Assigned</h2>
          <table>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Privilege ID</th>
                <th>Privilege Name</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{employee.empId}</td>
                <td>{privId}</td>
                <td>{employee.privName}</td>
              </tr>
            </tbody>
          </table>
        </ResultBox>
      )}
      
    </Container>
  );
};

export default EmpPrivPage;