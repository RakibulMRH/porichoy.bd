'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface Payment {
  payId: number;
  pname: string;
  pamount: number;
  date: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
`;

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  max-width: 800px;
`;

const Th = styled.th`
  background-color: #f2f2f2;
  text-align: left;
  padding: 8px;
  border-bottom: 1px solid #ddd;
`;

const Td = styled.td`
  padding: 8px;
  border-bottom: 1px solid #ddd;
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: #4caf50; /* Green color */
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
`;

const TotalPayment = styled.p`
  font-size: 18px;
  font-weight: bold;
  margin-top: 20px;
`;

const TotalPaymentsPage = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalPayment, setTotalPayment] = useState<number | null>(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch('http://localhost:3001/financials/all-payments');
      const data = await response.json();
      setPayments(data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const getTotalPayment = async () => {
    try {
      const response = await fetch('http://localhost:3001/financials/total-payments');
      const data = await response.json();
      setTotalPayment(data);
    } catch (error) {
      console.error('Error fetching total payment:', error);
    }
  };

  return (
    <Container>
      <h1>Payments</h1>
      <Table>
        <thead>
          <tr>
            <Th>Payment ID</Th>
            <Th>Payment Name</Th>
            <Th>Payment Amount</Th>
            <Th>Date</Th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.payId}>
              <Td>{payment.payId}</Td>
              <Td>{payment.pname}</Td>
              <Td>{payment.pamount}</Td>
              <Td>{new Date(payment.date).toLocaleString()}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button onClick={getTotalPayment}>Total Payment</Button>
      {totalPayment !== null && <TotalPayment>Total Payment: {totalPayment}</TotalPayment>}
    
    </Container>
  );
};

export default TotalPaymentsPage;