'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';

interface MessageBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  isError: boolean;
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

const MessageBox = styled.div<MessageBoxProps>`
  padding: 20px;
  background-color: ${(props) => (props.isError ? '#f8d7da' : '#d4edda')};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  text-align: center;
  color: ${(props) => (props.isError ? '#721c24' : '#155724')};
`;

const DeleteEmployeePage = () => {
  const router = useRouter();
  const [empId, setEmpId] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3001/employee/${empId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setMessage('Employee deleted successfully');
        setIsError(false);
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Failed to delete employee');
        setIsError(true);
      }
    } catch (error: unknown) {
      console.error('Error deleting employee:', error);
      setMessage(`An unexpected error occurred: ${(error as Error).message}`);
      setIsError(true);
    }
  };

  return (
    <Container>
      <h1>Delete Employee</h1>
      <InputContainer>
        <Input
          type="text"
          value={empId}
          onChange={(e) => setEmpId(e.target.value)}
          placeholder="Enter employee ID"
        />
        <Button onClick={handleDelete}>Delete</Button>
      </InputContainer>
      {message && <MessageBox isError={isError}>{message}</MessageBox>}
      
    </Container>
  );
};

export default DeleteEmployeePage;