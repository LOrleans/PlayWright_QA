import { test, expect } from '@playwright/test';
import {
  bookingPayload,
  createBooking,
  deleteBooking,
  getBooking,
  getToken,
  login,
  updateBooking,
} from '../api/bookingClient';

test.describe('API Restful Booker: reservas', () => {
  test('Deve consultar uma reserva criada (GET)', async ({ request }) => {
    const id = await createBooking(request);

    const response = await getBooking(request, id);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.firstname).toBe(bookingPayload.firstname);
    expect(body.lastname).toBe(bookingPayload.lastname);
    expect(body.totalprice).toBe(bookingPayload.totalprice);
    expect(body.bookingdates).toEqual(bookingPayload.bookingdates);
  });

  test('Deve retornar 404 ao consultar uma reserva inexistente', async ({ request }) => {
    const response = await getBooking(request, 0);

    expect(response.status()).toBe(404);
  });

  test('Deve atualizar uma reserva com token válido (PUT)', async ({ request }) => {
    const id = await createBooking(request);
    const token = await getToken(request);

    const response = await updateBooking(request, id, { ...bookingPayload, firstname: 'Maria', totalprice: 200 }, token);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.firstname).toBe('Maria');
    expect(body.totalprice).toBe(200);
  });

  test('Não deve atualizar uma reserva sem token', async ({ request }) => {
    const id = await createBooking(request);

    const response = await updateBooking(request, id, { ...bookingPayload, firstname: 'Maria' });

    expect(response.status()).toBe(403);
  });

  test('Deve excluir uma reserva e não encontrá-la depois (DELETE)', async ({ request }) => {
    const id = await createBooking(request);
    const token = await getToken(request);

    const deleteResponse = await deleteBooking(request, id, token);
    expect(deleteResponse.status()).toBe(201);

    const getResponse = await getBooking(request, id);
    expect(getResponse.status()).toBe(404);
  });
});

test.describe('API Restful Booker: autenticação', () => {
  test('Deve gerar um token com credenciais válidas', async ({ request }) => {
    const response = await login(request);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.token).toBeTruthy();
  });

  test('Não deve gerar token com credenciais inválidas', async ({ request }) => {
    const response = await login(request, 'admin', 'senha_errada');

    // Esta API responde 200 com uma mensagem de erro no corpo, em vez de 401
    const body = await response.json();
    expect(body.token).toBeUndefined();
    expect(body.reason).toBe('Bad credentials');
  });
});
