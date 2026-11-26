import { APIRequestContext, APIResponse } from '@playwright/test';

export const BASE_URL = 'https://restful-booker.herokuapp.com';

export const bookingPayload = {
  firstname: 'Lucas',
  lastname: 'Orleans',
  totalprice: 150,
  depositpaid: true,
  bookingdates: {
    checkin: '2026-10-01',
    checkout: '2026-10-10',
  },
  additionalneeds: 'Breakfast',
};

const jsonHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

// Cria uma reserva e devolve o id. Cada teste cria a sua, para ser independente dos demais
export async function createBooking(request: APIRequestContext, data = bookingPayload): Promise<number> {
  const response = await request.post(`${BASE_URL}/booking`, { data, headers: jsonHeaders });
  const body = await response.json();
  return body.bookingid;
}

// Credenciais públicas de demonstração da documentação do Restful Booker
export async function login(request: APIRequestContext, username = 'admin', password = 'password123'): Promise<APIResponse> {
  return request.post(`${BASE_URL}/auth`, { data: { username, password }, headers: jsonHeaders });
}

export async function getToken(request: APIRequestContext): Promise<string> {
  const response = await login(request);
  const body = await response.json();
  return body.token;
}

export function getBooking(request: APIRequestContext, id: number): Promise<APIResponse> {
  return request.get(`${BASE_URL}/booking/${id}`, { headers: { Accept: 'application/json' } });
}

export function updateBooking(
  request: APIRequestContext,
  id: number,
  data: typeof bookingPayload,
  token?: string
): Promise<APIResponse> {
  return request.put(`${BASE_URL}/booking/${id}`, {
    data,
    headers: token ? { ...jsonHeaders, Cookie: `token=${token}` } : jsonHeaders,
  });
}

export function deleteBooking(request: APIRequestContext, id: number, token?: string): Promise<APIResponse> {
  return request.delete(`${BASE_URL}/booking/${id}`, {
    headers: token ? { ...jsonHeaders, Cookie: `token=${token}` } : jsonHeaders,
  });
}
