import { Resend } from 'resend';
import 'dotenv/config';
const API_KEY = process.env.RESEND_API;

console.log(API_KEY)

export const resend = new Resend(API_KEY);
