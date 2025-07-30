// src/app/api/mailer/utils.js

/**
 * Send booking confirmation email
 * @param {Object} bookingData - Complete booking information
 * @returns {Promise<boolean>} - Success status
 */
export const sendBookingConfirmation = async (bookingData) => {
  try {
    // Use relative URL since this is calling the Next.js API route
    const response = await fetch('/api/mailer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bookingData,
        type: 'booking_confirmation'
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to send email');
    }

    const result = await response.json();
    console.log('Email sent successfully:', result);
    return true;
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
    return false;
  }
};

/**
 * Prepare booking data for email sending
 * @param {Object} booking - Booking object from API
 * @param {Object} parent - Parent/user object
 * @param {Object} bus - Bus object
 * @param {Object} route - Route object
 * @returns {Object} - Formatted booking data for email
 */
export const prepareBookingDataForEmail = (booking, parent, bus, route) => {
  return {
    booking: {
      id: booking.id,
      child_name: booking.child_name,
      pickup: booking.pickup,
      dropoff: booking.dropoff,
      price: booking.price,
      created_at: booking.created_at
    },
    parent: {
      username: parent.username,
      email: parent.email
    },
    bus: {
      plate: bus.plate,
      capacity: bus.capacity,
      departure: bus.departure
    },
    route: {
      start: route.start,
      end: route.end
    }
  };
};

/**
 * Validate email data before sending
 * @param {Object} bookingData - Booking data to validate
 * @returns {Object} - Validation result
 */
export const validateEmailData = (bookingData) => {
  const errors = [];

  if (!bookingData.parent?.email) {
    errors.push('Parent email is required');
  }

  if (!bookingData.booking?.child_name) {
    errors.push('Child name is required');
  }

  if (!bookingData.bus?.plate) {
    errors.push('Bus information is required');
  }

  if (!bookingData.route?.start || !bookingData.route?.end) {
    errors.push('Route information is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};