// Coinbase Embedded Wallets Configuration
export const embeddedWalletsConfig = {
  appName: 'GizmoOnBase',
  appLogoUrl: '', // Add your logo URL
  authMethods: ['sms'], // Enable SMS authentication
  theme: 'light', // or 'dark'
}

// Coinbase CDP Project Configuration
export const cdpConfig = {
  projectId: process.env.NEXT_PUBLIC_COINBASE_PROJECT_ID,
  apiKey: process.env.COINBASE_API_KEY,
  privateKey: process.env.COINBASE_PRIVATE_KEY,
}

console.log('Embedded Wallets Config:', {
  appName: embeddedWalletsConfig.appName,
  authMethods: embeddedWalletsConfig.authMethods,
  projectIdPresent: !!cdpConfig.projectId,
  apiKeyPresent: !!cdpConfig.apiKey,
  privateKeyPresent: !!cdpConfig.privateKey,
})