import React from 'react';
import { Container } from '@mui/material';
import CollaborationSection from '@/components/public/CollaborationSection';

export default function ContactPage() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
      <CollaborationSection />
    </Container>
  );
}
