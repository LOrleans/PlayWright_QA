import { test, expect } from '@playwright/test';

test.describe('API tests - Restful Booker', () => {
  test('Must create a new reservation with success (POST)', async({ request }) => {
    // Do the request POST with the body (payload)
    const response = await request.post('https://restful-booker.herokuapp.com/booking', {
      data: {
        firstname: 'Lucas',
        lastname: 'Orleans',
        totalprice: 150,
        depositpaid: true,
        bookingdates: {
          checkin: '2026-10-01',
          checkout: '2026-10-10'
        },
        additionalneeds: 'Breakfast'
      }
    });

    // Verification (Assertion):
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    // Extract json body to data validation
    const responseBody = await response.json();

    // Validate data 
    expect(responseBody).toHaveProperty('bookingid');
    expect(responseBody.booking.firstname).toBe('Lucas');
    expect(responseBody.booking.totalprice).toBe(150);
  })
})