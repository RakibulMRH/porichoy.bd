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

const PrivilegeInfo = styled.div`
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  text-align: center;
`;

const PrivilegeDetailsPage = () => {
  const [privId, setPrivId] = useState('');
  const [privilege, setPrivilege] = useState<Privilege | null>(null);

  const fetchPrivilege = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/privilege/${privId}`);
      setPrivilege(response.data);
    } catch (error) {
      console.error('Error fetching privilege:', error);
      setPrivilege(null);
    }
  };

  return (
    <Container>
      <h1>Privilege Details</h1>
      <InputContainer>
        <Input
          type="text"
          value={privId}
          onChange={(e) => setPrivId(e.target.value)}
          placeholder="Enter privilege ID"
        />
        <Button onClick={fetchPrivilege}>Get Details</Button>
      </InputContainer>
      {privilege && (
        <PrivilegeInfo>
          <h2>Privilege Information</h2>
          <p>ID: {privilege.privId}</p>
          <p>Name: {privilege.privName}</p>
        </PrivilegeInfo>
      )}
    </Container>
  );
};

export default PrivilegeDetailsPage;