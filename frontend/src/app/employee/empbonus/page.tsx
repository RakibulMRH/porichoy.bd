'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';

interface Employee {
  empId: number;
  name: string;
  sal: number;
  roleBlock: boolean;
  privId: number;
  privName: string;
  bonus: number | null;
  email: string;
  regDate: string;
  role: string;
  block: boolean;
  privilege: { privId: number; privName: string };
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
  background-color: #007bff;
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

const EmpBonusPage = () => {
  const router = useRouter();
  const [empId, setEmpId] = useState('');
  const [bonus, setBonus] = useState('');
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [error, setError] = useState('');

  const handleAddBonus = async () => {
    try {
      const response = await fetch(`http://localhost:3001/employee/${empId}/bonus/${bonus}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const updatedEmployee = await response.json();
        setEmployee(updatedEmployee);
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to add bonus');
        setEmployee(null);
      }
    } catch (error: unknown) {
      console.error('Error adding bonus:', error);
      setError(`An unexpected error occurred: ${(error as Error).message}`);
      setEmployee(null);
    }
  };

  return (
    <Container>
      <h1>Add Employee Bonus</h1>
      <InputContainer>
        <Input
          type="text"
          value={empId}
          onChange={(e) => setEmpId(e.target.value)}
          placeholder="Enter employee ID"
        />
        <Input
          type="text"
          value={bonus}
          onChange={(e) => setBonus(e.target.value)}
          placeholder="Enter bonus amount"
        />
        <Button onClick={handleAddBonus}>Add Bonus</Button>
      </InputContainer>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {employee && (
        <ResultBox>
          <h2>Employee Bonus Added</h2>
          <table>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Bonus</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{employee.empId}</td>
                <td>{employee.bonus}</td>
              </tr>
            </tbody>
          </table>
        </ResultBox>
      )}
      
    </Container>
  );
};

export default EmpBonusPage;