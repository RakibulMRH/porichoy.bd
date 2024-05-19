'use client';

import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
`;

const Input = styled.input`
  padding: 8px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: #4caf50; /* Green color */
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const RemoveBonusPage = () => {
  const [employeeId, setEmployeeId] = useState('');

  const handleRemoveBonus = async () => {
    try {
      const response = await fetch(`http://localhost:3001/financials/employee/${employeeId}/remove-bonus`, {
        method: 'POST',
      });

      if (response.ok) {
        alert(`Bonus removed successfully for employee ID ${employeeId}`);
        setEmployeeId('');
      } else {
        alert('Failed to remove bonus');
      }
    } catch (error) {
      console.error('Error removing bonus:', error);
      alert('An error occurred while removing the bonus');
    }
  };

  return (
    <Container>
      <h1>Remove Bonus</h1>
      <Input
        type="text"
        placeholder="Enter employee ID"
        value={employeeId}
        onChange={(e) => setEmployeeId(e.target.value)}
      />
      <Button onClick={handleRemoveBonus}>Remove Bonus</Button>
      
    </Container>
  );
};

export default RemoveBonusPage;