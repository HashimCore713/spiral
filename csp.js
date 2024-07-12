const policies = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    'https://checkout.stripe.com',
    'https://js.stripe.com',
    'https://maps.googleapis.com',
  ],
  'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  'img-src': [
    "'self'",
    'data:',
    'blob',
    'blob:',
    'https://*.stripe.com',
    'https://spiral-gadgets.com',
    'https://spiral-a23b1de.payloadcms.app/ ',
    'https://spiral-gadgets.com/',
    'https://raw.githubusercontent.com',
  ],
  'font-src': ["'self'"],
  'frame-src': [
    "'self'",
    'https://checkout.stripe.com',
    'https://js.stripe.com',
    'https://hooks.stripe.com',
  ],
  'connect-src': [
    "'self'",
    'https://checkout.stripe.com',
    'https://api.stripe.com',
    'https://spiral-gadgets.com',
    'https://spiral-a23b1de.payloadcms.app',
    'https://maps.googleapis.com',
  ],
};

module.exports = Object.entries(policies)
  .map(([key, value]) => {
    if (Array.isArray(value)) {
      return `${key} ${value.join(' ')}`;
    }
    return '';
  })
  .join('; ');
