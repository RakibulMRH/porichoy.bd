'use client';

import React, { useState } from 'react';
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
  background-color: #28a745;
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

const UpdatePrivPage = () => {
  const [privId, setPrivId] = useState('');
  const [privName, setPrivName] = useState('');
  const [updatedPrivilege, setUpdatedPrivilege] = useState<Privilege | null>(null);

  const handleUpdate = async () => {
    try {
      const response = await axios.patch(`http://localhost:3001/privilege/${privId}`, {
        privId: Number(privId),
        privName,
      });
      setUpdatedPrivilege(response.data);
    } catch (error) {
      console.error('Error updating privilege:', error);
      setUpdatedPrivilege(null);
    }
  };

  return (
    <Container>
      <h1>Update Privilege</h1>
      <InputContainer>
        <Input
          type="text"
          value={privId}
          onChange={(e) => setPrivId(e.target.value)}
          placeholder="Enter privilege ID"
        />
        <Input
          type="text"
          value={privName}
          onChange={(e) => setPrivName(e.target.value)}
          placeholder="Enter new privilege name"
        />
        <Button onClick={handleUpdate}>Update</Button>
      </InputContainer>
      {updatedPrivilege && (
        <TableContainer>
          <h2>Updated Privilege</h2>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>ID</TableHeader>
                <TableHeader>Name</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{updatedPrivilege.privId}</TableCell>
                <TableCell>{updatedPrivilege.privName}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default UpdatePrivPage;