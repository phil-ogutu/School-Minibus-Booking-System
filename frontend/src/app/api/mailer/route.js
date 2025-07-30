// src/app/api/mailer/route.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Email configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};
// Email templates
const createBookingConfirmationEmail = (bookingData) => {
  const { parent, bus, route, booking } = bookingData;

  return {
    subject: `Booking Confirmation - ${booking.child_name}'s School Transport`,
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }

