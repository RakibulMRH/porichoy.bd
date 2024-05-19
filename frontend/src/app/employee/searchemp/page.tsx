'use client';

import React, { useState } from 'react';
import styled from 'styled-components';

interface Employee {
  empId: number;
  name: string;
  sal: string;
  roleBlock: boolean;
  privId: number;
  privName: string;
  bonus: number;
  email: string;
  regDate: string;
  role: string;
  block: boolean;
  privilege: {
    privId: number;
    privName: string;
  };
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
`;

const SearchContainer = styled.div`
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

const SearchEmployeePage = () => {
  const [empId, setEmpId] = useState('');
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [error, setError] = useState('');

  const fetchEmployee = async (id: string) => {
    const response = await fetch(`http://localhost:3001/employee/search/${id}`, {
      cache: 'no-store',
    });
    const data: Employee = await response.json();
    return data;
  };

  const handleSearch = async () => {
    if (!empId) {
      setError('Please enter an employee ID.');
      setEmployee(null);
      return;
    }

    try {
      const employee = await fetchEmployee(empId);
      setEmployee(employee);
      setError('');
    } catch (error) {
      console.error('Error fetching employee data:', error);
      setEmployee(null);
      setError('An error occurred while fetching employee data.');
    }
  };

  return (
    <Container>
      <h1>Search Employee</h1>
      <SearchContainer>
        <Input
          type="text"
          value={empId}
          onChange={(e) => setEmpId(e.target.value)}
          placeholder="Enter employee ID"
        />
        <Button onClick={handleSearch}>Search</Button>
      </SearchContainer>
      {error && <p>{error}</p>}
      {employee && (
        <ResultBox>
          <h2>Employee Details</h2>
          <p>Employee ID: {employee.empId}</p>
          <p>Name: {employee.name}</p>
          <p>Salary: {employee.sal}</p>
          <p>Role: {employee.role}</p>
          <p>Block Status: {employee.block ? 'Blocked' : 'Active'}</p>
          <p>Privilege: {employee.privilege.privName}</p>
          <p>Bonus: {employee.bonus}</p>
          <p>Email: {employee.email}</p>
          <p>Registration Date: {new Date(employee.regDate).toLocaleString()}</p>
        </ResultBox>
      )}
      
    </Container>
  );
};

export default SearchEmployeePage;