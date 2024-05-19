import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

export const api = axios.create({
  baseURL: API_BASE_URL,
});