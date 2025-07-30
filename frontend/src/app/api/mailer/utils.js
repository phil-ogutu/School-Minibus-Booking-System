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
