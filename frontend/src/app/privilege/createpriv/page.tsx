'use client';

import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

interface Privilege {
  privId: number;
  privName: string;
}

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
  background-color: #28a745;
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

const TableContainer = styled.div`
  margin-top: 20px;
`;

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
`;

const TableHead = styled.thead`
  background-color: #f8f9fa;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr``;

const TableHeader = styled.th`
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #dee2e6;
`;

const TableCell = styled.td`
  padding: 8px;
  border-bottom: 1px solid #dee2e6;
`;

const CreatePriv = () => {
  const [privName, setPrivName] = useState('');
  const [success, setSuccess] = useState(false);
  const [privileges, setPrivileges] = useState<Privilege[]>([]);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/privilege', { privName });
      setPrivileges([...privileges, response.data]);
      setSuccess(true);
      setPrivName('');
      setMessage('Privilege created successfully');
      setIsError(false);
    } catch (error) {
      console.error('Error creating privilege:', error);
      setMessage('Failed to create privilege');
      setIsError(true);
    }
  };

  return (
    <Container>
      <h1>Create Privilege</h1>
      <form onSubmit={handleSubmit}>
        <InputContainer>
          <Input
            type="text"
            value={privName}
            onChange={(e) => setPrivName(e.target.value)}
            placeholder="Enter privilege name"
          />
          <Button type="submit">Create</Button>
        </InputContainer>
      </form>
      {message && <MessageBox isError={isError}>{message}</MessageBox>}
      {success && (
        <TableContainer>
          <h2>Privileges</h2>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>ID</TableHeader>
                <TableHeader>Name</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {privileges.map((priv) => (
                <TableRow key={priv.privId}>
                  <TableCell>{priv.privId}</TableCell>
                  <TableCell>{priv.privName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default CreatePriv;