// Mock payment service for CreatorCash MVP
// In a real implementation, this would integrate with Stripe or another payment processor

interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export const processPayment = (
  amount: number,
  currency: string = 'USD',
  paymentMethod: string = 'card'
): Promise<PaymentResult> => {
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      // Mock success rate of 95%
      const isSuccessful = Math.random() < 0.95;
      
      if (isSuccessful) {
        resolve({
          success: true,
          transactionId: `txn_${Math.random().toString(36).substring(2, 15)}`
        });
      } else {
        resolve({
          success: false,
          error: 'Payment processing failed. Please try again.'
        });
      }
    }, 1500); // Simulate a 1.5 second processing time
  });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};
