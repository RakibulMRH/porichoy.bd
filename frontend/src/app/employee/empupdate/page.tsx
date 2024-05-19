'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';

const StyledForm = styled.form`
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: 4px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  margin-bottom: 16px;
`;

const EmpUpdatePage = () => {
  const router = useRouter();
  const [empId, setEmpId] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    sal: '',
    email: '',
    role: '',
    block: false,
  });
  const [error, setError] = useState('');

 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value, type } = e.target;
  const isCheckbox = e.target.type === 'checkbox';

  if (name === 'block') {
    setFormData({
      ...formData,
      [name]: (e.target as HTMLInputElement).checked,
    });
  } else {
    setFormData({
      ...formData,
      [name]: value || '', // Set an empty string if the value is falsy
    });
  }
};

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Remove fields with empty values from formData
    const updatedFormData = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => value !== '')
    );

    try {
      const response = await fetch(`http://localhost:3001/employee/${empId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      });

      if (response.ok) {
        const updatedEmployee = await response.json();
        console.log('Updated employee:', updatedEmployee);
        router.push('/success');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update employee');
      }
    } catch (error: unknown) {
      console.error('Error updating employee:', error);
      setError(`An unexpected error occurred: ${(error as Error).message}`);
    }
  };

  return (
    <div>
      <h1>Employee Update</h1>
      <FormGroup>
        <Label htmlFor="empId">Employee ID:</Label>
        <Input
          type="text"
          id="empId"
          value={empId}
          onChange={(e) => setEmpId(e.target.value)}
          required
        />
      </FormGroup>
      <StyledForm onSubmit={handleSubmit}>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <FormGroup>
          <Label htmlFor="name">Name:</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="sal">Salary:</Label>
          <Input
            type="text"
            id="sal"
            name="sal"
            value={formData.sal}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="email">Email:</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="role">Role:</Label>
          <Input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="block">Block:</Label>
          <Input
            type="checkbox"
            id="block"
            name="block"
            checked={formData.block}
            onChange={handleChange}
          />
        </FormGroup>
        <Button type="submit">Update Employee</Button>
      </StyledForm>
      
    </div>
    
  );
};

export default EmpUpdatePage;