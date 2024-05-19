'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface Payment {
  payId: number;
  pname: string;
  pamount: string;
  date: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: #4caf50; /* Green color */
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  max-width: 800px;
  margin-top: 20px;
  border: 1px solid #4caf50; /* Green border */
`;

const TableHead = styled.thead`
  background-color: #f0f0f0;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const TableHeader = styled.th`
  padding: 12px;
  text-align: left;
  border: 1px solid #4caf50; /* Green border */
`;

const TableData = styled.td`
  padding: 12px;
  border: 1px solid #4caf50; /* Green border */
`;

const ShowAllPayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);

  const fetchPayments = async () => {
    try {
      const response = await fetch('http://localhost:3001/financials/all-payments');
      const data = await response.json();
      setPayments(data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <Container>
      <h1>All Payments</h1>
      <Button onClick={fetchPayments}>Fetch Payments</Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Payment ID</TableHeader>
            <TableHeader>Payment Name</TableHeader>
            <TableHeader>Payment Amount</TableHeader>
            <TableHeader>Date</TableHeader>
          </TableRow>
        </TableHead>
        <tbody>
          {payments.map((payment) => (
            <TableRow key={payment.payId}>
              <TableData>{payment.payId}</TableData>
              <TableData>{payment.pname}</TableData>
              <TableData>{payment.pamount}</TableData>
              <TableData>{new Date(payment.date).toLocaleString()}</TableData>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ShowAllPayments;