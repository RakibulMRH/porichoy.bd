'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';

interface BonusResult {
  empId: number;
  bonus: number;
}

interface Employee {
  empId: number;
  name: string;
  sal: number;
  roleBlock: boolean;
  privId: number;
  privName: string;
  bonus: number | null;
  email: string;
  regDate: string;
  role: string;
  block: boolean;
  privilege: { privId: number; privName: string };
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
  background-color: #4caf50; /* Green color */
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const ResultBox = styled.div`
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  text-align: left;
`;

const SetBonusPage = () => {
  const router = useRouter();
  const [empId, setEmpId] = useState('');
  const [bonus, setBonus] = useState('');
  const [result, setResult] = useState<BonusResult | null>(null);
  const [error, setError] = useState('');

  const handleSetBonus = () => {
    try {
      // Assuming bonus is set successfully
      const bonusResult: BonusResult = {
        empId: parseInt(empId),
        bonus: parseInt(bonus),
      };
      setResult(bonusResult);
      setError('');
    } catch (error: unknown) {
      console.error('Error setting bonus:', error);
      setError(`An unexpected error occurred: ${(error as Error).message}`);
      setResult(null);
    }
  };

  return (
    <Container>
      <h1>Set Employee Bonus</h1>
      <InputContainer>
        <Input
          type="text"
          value={empId}
          onChange={(e) => setEmpId(e.target.value)}
          placeholder="Enter employee ID"
        />
        <Input
          type="text"
          value={bonus}
          onChange={(e) => setBonus(e.target.value)}
          placeholder="Enter bonus amount"
        />
        <Button onClick={handleSetBonus}>Set Bonus</Button>
      </InputContainer>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {result && (
        <ResultBox>
          <h2>Bonus Set Successfully</h2>
          <p>Employee ID: {result.empId}</p>
          <p>Bonus: {result.bonus}</p>
        </ResultBox>
      )}
     
    </Container>
  );
};

export default SetBonusPage;