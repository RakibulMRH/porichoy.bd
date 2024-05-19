'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const StyledForm = styled.form`
  max-width: 500px;
  width: 100%;
  padding: 40px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Heading = styled.h1`
  text-align: center;
  margin-bottom: 24px;
  color: #333;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
  }
`;

const Button = styled.button`
  display: block;
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.p`
  color: #dc3545;
  margin-bottom: 16px;
  text-align: center;
`;

const EmployeeRegistrationPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    sal: '',
    role: '',
    privId: 0,
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'privId') {
      setFormData({
        ...formData,
        [name]: value ? parseInt(value, 10) : 0,
      });
    } else if (name === 'sal') {
      setFormData({
        ...formData,
        [name]: value || '0',
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/success');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to register employee');
      }
    } catch (error: unknown) {
      console.error('Error registering employee:', error);
      setError(`An unexpected error occurred: ${(error as Error).message}`);
    }
  };

  return (
    <Container>
      <StyledForm onSubmit={handleSubmit}>
        <Heading>Employee Registration</Heading>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <FormGroup>
          <Label htmlFor="name">Name:</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
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
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="phone">Phone:</Label>
          <Input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
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
            required
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
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="privId">Privilege ID:</Label>
          <Input
            type="number"
            id="privId"
            name="privId"
            value={formData.privId}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <Button type="submit">Register Employee</Button>
      </StyledForm>
      
    </Container>
  );
};

export default EmployeeRegistrationPage;