// server/api/fairseas/user-contracts.get.ts
import type { ContractInstance } from '@/types/contracts'

export default defineEventHandler(async (event): Promise<ContractInstance[]> => {
  // In a real implementation, you would:
  // 1. Get the user ID from the Authorization header
  // 2. Query your database for user's contracts
  // 3. Return the actual contract instances
  
  // For now, return mock data for demonstration
  return [
    {
      id: 'contract_1',
      contractId: 'crew-participation',
      userId: 'user_123',
      status: 'sent',
      envelopeId: 'envelope_123',
      formData: {
        crewFullName: 'John Doe',
        crewEmail: 'john@example.com',
        crewTitle: 'Captain'
      },
      signers: [
        {
          role: 'CREW',
          email: 'john@example.com',
          name: 'John Doe',
          recipientId: '1',
          status: 'signed',
          signedAt: '2024-01-15T10:30:00Z'
        },
        {
          role: 'COMPANY',
          email: 'contracts@xplor.io',
          name: 'xplorVR Media Group',
          recipientId: '2',
          status: 'pending'
        }
      ],
      createdAt: '2024-01-15T09:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    }
  ]
})