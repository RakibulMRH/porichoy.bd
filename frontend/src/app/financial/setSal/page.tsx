'use client'; // Mark this as a Client Component

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
  background-color: #90ee90; /* Light green color */
  color: #333; /* Change text color to a darker shade */
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #7cdc7c; /* Darker shade of light green on hover */
  }
`;

const SuccessMessage = styled.p`
  color: #28a745;
  margin-bottom: 16px;
  text-align: center;
`;

const ErrorMessage = styled.p`
  color: #dc3545;
  margin-bottom: 16px;
  text-align: center;
`;

const SetSal = () => {
  const router = useRouter();
  const [empid, setEmpid] = useState('');
  const [salary, setSalary] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3001/financials/employee/${empid}/salary/${salary}`, {
        method: 'POST',
      });

      if (response.ok) {
        setSuccess(true);
        setError('');
        setEmpid('');
        setSalary('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to set salary');
        setSuccess(false);
      }
    } catch (error: unknown) {
      console.error('Error setting salary:', error);
      setError(`An unexpected error occurred: ${(error as Error).message}`);
      setSuccess(false);
    }
  };

  return (
    <Container>
      <StyledForm onSubmit={handleSubmit}>
        <Heading>Set Salary</Heading>
        {success && <SuccessMessage>Salary set successfully!</SuccessMessage>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <FormGroup>
          <Label htmlFor="empid">Employee ID:</Label>
          <Input
            type="text"
            id="empid"
            name="empid"
            value={empid}
            onChange={(e) => setEmpid(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="salary">Salary:</Label>
          <Input
            type="number"
            id="salary"
            name="salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            required
          />
        </FormGroup>
        <Button type="submit">Set Salary</Button>
      </StyledForm>
     

    </Container>
  );
};

export default SetSal;