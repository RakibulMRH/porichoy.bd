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

const Button = styled.button`
  padding: 8px 16px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
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

const PrivilegesPage = () => {
  const [privileges, setPrivileges] = useState<Privilege[]>([]);
  const [showTable, setShowTable] = useState(false);

  const fetchPrivileges = async () => {
    try {
      const response = await axios.get('http://localhost:3001/privilege');
      setPrivileges(response.data);
      setShowTable(true);
    } catch (error) {
      console.error('Error fetching privileges:', error);
    }
  };

  return (
    <Container>
      <h1>Privileges</h1>
      <Button onClick={fetchPrivileges}>Show Privileges</Button>
      {showTable && (
        <TableContainer>
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

export default PrivilegesPage;