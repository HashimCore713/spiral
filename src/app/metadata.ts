// src/app/metadata.ts

import { Metadata } from 'next';
import { mergeOpenGraph } from './_utilities/mergeOpenGraph';

const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://payloadcms.com'),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
  openGraph: mergeOpenGraph(),
};

export default metadata;
