import { Resend } from 'resend';
const API_KEY = process.env.RESEND_API;

export const resend = new Resend(API_KEY);
