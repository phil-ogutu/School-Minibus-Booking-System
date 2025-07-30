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
                .header { background-color: #fbbf24; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
        .booking-details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 6px; border-left: 4px solid #fbbf24; }
        .detail-row { display: flex; justify-content: space-between; margin: 8px 0; }
        .label { font-weight: bold; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="color: white; margin: 0;">🚌 SkoolaBus</h1>
          <p style="color: white; margin: 5px 0;">Booking Confirmation</p>
        </div>
                <div class="content">
          <h2>Dear ${parent.username},</h2>
          <p>Your booking has been confirmed! Here are the details:</p>
          
          <div class="booking-details">
            <h3>Booking Information</h3>
            <div class="detail-row">
              <span class="label">Booking ID:</span>
              <span>#${booking.id}</span>
            </div>
            <div class="detail-row">
              <span class="label">Child Name:</span>
              <span>${booking.child_name}</span>
            </div>
            <div class="detail-row">
              <span class="label">Route:</span>
              <span>${route.start} → ${route.end}</span>
            </div>




