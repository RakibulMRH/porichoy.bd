'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

interface Privilege {
  privId: number;
  privName: string;
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

const DeletePrivPage = () => {
  const [privId, setPrivId] = useState('');
  const [privileges, setPrivileges] = useState<Privilege[]>([]);

  useEffect(() => {
    const fetchPrivileges = async () => {
      try {
        const response = await axios.get('http://localhost:3001/privilege');
        setPrivileges(response.data);
      } catch (error) {
        console.error('Error fetching privileges:', error);
      }
    };

    fetchPrivileges();
  }, []);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/privilege/${privId}`);
      setPrivileges(privileges.filter((priv) => priv.privId !== Number(privId)));
    } catch (error) {
      console.error('Error deleting privilege:', error);
    }
  };

  return (
    <Container>
      <h1>Delete Privilege</h1>
      <InputContainer>
        <Input
          type="text"
          value={privId}
          onChange={(e) => setPrivId(e.target.value)}
          placeholder="Enter privilege ID"
        />
        <Button onClick={handleDelete}>Delete</Button>
      </InputContainer>
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
      
    </Container>
  );
};

export default DeletePrivPage;