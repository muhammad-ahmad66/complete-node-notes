import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51OIXZQSG0Tco2w5skNQHdmPgV1tOeQO26QUDjuaAiFyvfjukSmdTr1jEWURIISmVOAjC20JIxccP6QRj1YnMHcKP001k7DR7eO'
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get Checkout Session from API
    const session = await axios(
      // `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
      `/api/v1/bookings/checkout-session/${tourId}`
    );

    console.log(session);
    // console.log(session.data.session.id);
    // 2) Create Checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
