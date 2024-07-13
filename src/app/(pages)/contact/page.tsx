'use client'
// src/app/pages/contact/page.tsx
import React from 'react';
import { Metadata } from 'next';
import { mergeOpenGraph } from '../../_utilities/mergeOpenGraph';
import { Gutter } from '../../_components/Gutter';
import ContactForm from './ContactForm';

import classes from './index.module.scss';

export default function ContactPage() {
  const metadata: Metadata = {
    title: 'Contact Us',
    description: 'Get in touch with us for any queries or feedback.',
    openGraph: mergeOpenGraph({
      title: 'Contact Us',
      url: '/contact',
    }),
  };

  // Handle form submission
  const handleSubmit = async (formData: any) => {
    try {
      // Example fetch logic, replace with your actual API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to submit form');
      }
      // Handle success, e.g., show success message or redirect
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error, e.g., show error message
    }
  };

  return (
    <div className={classes.contact}>
      <Gutter>
        <p className={classes.heading}>Contact Form</p>
        <ContactForm onSubmit={handleSubmit} />
      </Gutter>
    </div>
  );
}
