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
  background-color: #28a745; /* Green color */
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #1e7e34;
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

const CreatePayment = () => {
  const router = useRouter();
  const [pname, setPname] = useState('');
  const [pamount, setPamount] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/financials/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pname, pamount: parseFloat(pamount) }),
      });

      if (response.ok) {
        setSuccess(true);
        setError('');
        setPname('');
        setPamount('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create payment');
        setSuccess(false);
      }
    } catch (error: unknown) {
      console.error('Error creating payment:', error);
      setError(`An unexpected error occurred: ${(error as Error).message}`);
      setSuccess(false);
    }
  };

  return (
    <Container>
      <StyledForm onSubmit={handleSubmit}>
        <Heading>Create Payment</Heading>
        {success && <SuccessMessage>Payment created successfully!</SuccessMessage>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <FormGroup>
          <Label htmlFor="pname">Payment Name:</Label>
          <Input
            type="text"
            id="pname"
            name="pname"
            value={pname}
            onChange={(e) => setPname(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="pamount">Payment Amount:</Label>
          <Input
            type="number"
            id="pamount"
            name="pamount"
            value={pamount}
            onChange={(e) => setPamount(e.target.value)}
            required
          />
        </FormGroup>
        <Button type="submit">Create Payment</Button>
      </StyledForm>
    </Container>
  );
};

export default CreatePayment;