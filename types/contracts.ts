// types/contracts.ts
export interface ContractConfig {
  id: string
  name: string
  description: string
  pdfPath: string
  signers: SignerConfig[]
  fields: FieldConfig[]
  workflow: WorkflowConfig
  dependencies?: string[]
  category: 'crew' | 'broker' | 'owner' | 'escrow'
}

export interface SignerConfig {
  role: string
  label: string
  required: boolean
  order: number
  email?: string
  name?: string
  recipientId: string
}

export interface FieldConfig {
  name: string
  label: string
  type: 'text' | 'email' | 'date' | 'select' | 'number' | 'textarea'
  required: boolean
  validation?: ValidationRule[]
  placeholder?: string
  options?: string[]
  group?: string
  docusignTab?: DocuSignTabConfig
}

export interface DocuSignTabConfig {
  tabType: 'text' | 'email' | 'date' | 'signature' | 'dateSigned'
  recipientId: string
  pageNumber: number
  xPosition: number
  yPosition: number
  width?: number
  height?: number
}

export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern'
  value?: any
  message: string
}

export interface WorkflowConfig {
  type: 'sequential' | 'parallel'
  autoSend: boolean
  reminderEnabled: boolean
  reminderDelay: number
  expirationDays: number
}

export interface ContractInstance {
  id: string
  contractId: string
  userId: string
  status: 'draft' | 'sent' | 'completed' | 'voided'
  envelopeId?: string
  formData: Record<string, any>
  signers: SignerInstance[]
  createdAt: string
  updatedAt: string
}

export interface SignerInstance {
  role: string
  email: string
  name: string
  recipientId: string
  status: 'pending' | 'sent' | 'delivered' | 'signed' | 'declined'
  signedAt?: string
}

// Contract configurations
export const contractConfigs: Record<string, ContractConfig> = {
  'crew-participation': {
    id: 'crew-participation',
    name: 'Crew Participation Agreement',
    description: 'Agreement for crew to participate in FairSeas commission sharing',
    pdfPath: '/contracts/Crew_Participation_Agreement_ADGM.pdf',
    category: 'crew',
    signers: [
      {
        role: 'CREW',
        label: 'Crew Member',
        required: true,
        order: 1,
        recipientId: '1'
      },
      {
        role: 'COMPANY',
        label: 'xplorVR Media Group',
        required: true,
        order: 2,
        recipientId: '2',
        email: 'contracts@xplor.io',
        name: 'xplorVR Media Group'
      }
    ],
    fields: [
      {
        name: 'crewFullName',
        label: 'Full Name',
        type: 'text',
        required: true,
        group: 'personal',
        placeholder: 'Enter your full legal name'
      },
      {
        name: 'crewTitle',
        label: 'Position/Rank',
        type: 'select',
        required: true,
        group: 'personal',
        options: ['Captain', 'Chief Officer', 'Engineer', 'Chef', 'Stewardess', 'Deckhand', 'Other']
      },
      {
        name: 'crewEmail',
        label: 'Email Address',
        type: 'email',
        required: true,
        group: 'contact'
      }
    ],
    workflow: {
      type: 'sequential',
      autoSend: true,
      reminderEnabled: true,
      reminderDelay: 48,
      expirationDays: 30
    }
  },

  'crew-payout': {
    id: 'crew-payout',
    name: 'Crew Payout Letter of Direction',
    description: 'Banking and payout instructions for crew commission sharing',
    pdfPath: '/contracts/Crew_Payout_Letter_of_Direction_ADGM.pdf',
    category: 'crew',
    dependencies: ['crew-participation'],
    signers: [
      {
        role: 'CREW',
        label: 'Crew Member',
        required: true,
        order: 1,
        recipientId: '1'
      },
      {
        role: 'ESCROW_AGENT',
        label: 'Escrow Agent',
        required: true,
        order: 2,
        recipientId: '2'
      },
      {
        role: 'COMPANY',
        label: 'xplorVR Media Group',
        required: true,
        order: 3,
        recipientId: '3',
        email: 'contracts@xplor.io',
        name: 'xplorVR Media Group'
      }
    ],
    fields: [
      {
        name: 'crewFullName',
        label: 'Full Name',
        type: 'text',
        required: true,
        group: 'personal'
      },
      {
        name: 'nationality',
        label: 'Nationality',
        type: 'text',
        required: true,
        group: 'personal'
      },
      {
        name: 'passportNumber',
        label: 'Passport Number',
        type: 'text',
        required: true,
        group: 'personal'
      },
      {
        name: 'rank',
        label: 'Rank/Position',
        type: 'select',
        required: true,
        group: 'professional',
        options: ['Captain', 'Chief Officer', 'Engineer', 'Chef', 'Stewardess', 'Deckhand', 'Other']
      },
      {
        name: 'yachtName',
        label: 'Yacht Name',
        type: 'text',
        required: true,
        group: 'professional'
      },
      {
        name: 'payoutMethod',
        label: 'Payout Method',
        type: 'select',
        required: true,
        group: 'banking',
        options: ['Bank Transfer', 'Wise', 'PayPal']
      },
      {
        name: 'accountHolder',
        label: 'Account Holder Name',
        type: 'text',
        required: true,
        group: 'banking'
      },
      {
        name: 'iban',
        label: 'IBAN/Account Number',
        type: 'text',
        required: true,
        group: 'banking'
      },
      {
        name: 'bankName',
        label: 'Bank Name',
        type: 'text',
        required: true,
        group: 'banking'
      },
      {
        name: 'bankCountry',
        label: 'Bank Country',
        type: 'text',
        required: true,
        group: 'banking'
      },
      {
        name: 'swift',
        label: 'SWIFT/BIC Code',
        type: 'text',
        required: false,
        group: 'banking'
      },
      {
        name: 'alternativeEmail',
        label: 'Wise/PayPal Email (if applicable)',
        type: 'email',
        required: false,
        group: 'banking'
      },
      {
        name: 'taxForm',
        label: 'Tax Form Type',
        type: 'select',
        required: true,
        group: 'compliance',
        options: ['W-8BEN', 'W-9', 'Other']
      },
      {
        name: 'kycDocs',
        label: 'KYC Documents Status',
        type: 'select',
        required: true,
        group: 'compliance',
        options: ['Completed', 'In Progress', 'Required']
      }
    ],
    workflow: {
      type: 'sequential',
      autoSend: true,
      reminderEnabled: true,
      reminderDelay: 48,
      expirationDays: 30
    }
  },

  'escrow-instructions': {
    id: 'escrow-instructions',
    name: 'Escrow & Disbursement Instructions',
    description: 'Complete escrow and payment disbursement instructions for charter commissions',
    pdfPath: '/contracts/Escrow_and_Disbursement_Instructions_ADGM.pdf',
    category: 'escrow',
    signers: [
      {
        role: 'OWNER',
        label: 'Yacht Owner',
        required: true,
        order: 1,
        recipientId: '1'
      },
      {
        role: 'CHARTERER',
        label: 'Charterer',
        required: true,
        order: 2,
        recipientId: '2'
      },
      {
        role: 'CENTRAL_BROKER',
        label: 'Central Broker',
        required: true,
        order: 3,
        recipientId: '3'
      },
      {
        role: 'CO_BROKER',
        label: 'Co-Broker',
        required: false,
        order: 4,
        recipientId: '4'
      },
      {
        role: 'COMPANY',
        label: 'xplorVR Media Group',
        required: true,
        order: 5,
        recipientId: '5',
        email: 'contracts@xplor.io'
      },
      {
        role: 'ESCROW_AGENT',
        label: 'Escrow Agent',
        required: true,
        order: 6,
        recipientId: '6'
      }
    ],
    fields: [
      {
        name: 'escrowName',
        label: 'Escrow Agent Name',
        type: 'text',
        required: true,
        group: 'escrow'
      },
      {
        name: 'escrowAddress',
        label: 'Escrow Agent Address',
        type: 'textarea',
        required: true,
        group: 'escrow'
      },
      {
        name: 'escrowEmail',
        label: 'Escrow Agent Email',
        type: 'email',
        required: true,
        group: 'escrow'
      },
      {
        name: 'escrowAccount',
        label: 'Client Account (IBAN/SWIFT)',
        type: 'text',
        required: true,
        group: 'escrow'
      },
      {
        name: 'escrowReference',
        label: 'Reference/Charter ID',
        type: 'text',
        required: true,
        group: 'escrow'
      },
      {
        name: 'companyAccountDetails',
        label: 'Company Commission Account',
        type: 'text',
        required: true,
        group: 'accounts'
      },
      {
        name: 'centralBrokerAccount',
        label: 'Central Broker Account',
        type: 'text',
        required: true,
        group: 'accounts'
      },
      {
        name: 'coBrokerAccount',
        label: 'Co-Broker Account',
        type: 'text',
        required: false,
        group: 'accounts'
      }
    ],
    workflow: {
      type: 'sequential',
      autoSend: true,
      reminderEnabled: true,
      reminderDelay: 24,
      expirationDays: 14
    }
  },

  'fairseas-rider': {
    id: 'fairseas-rider',
    name: 'FairSeas Rider to MYBA',
    description: 'Commission-sharing rider attachment to MYBA Charter Agreement',
    pdfPath: '/contracts/FairSeas_Rider_to_MYBA_ADGM.pdf',
    category: 'broker',
    signers: [
      {
        role: 'OWNER',
        label: 'Yacht Owner',
        required: true,
        order: 1,
        recipientId: '1'
      },
      {
        role: 'CHARTERER',
        label: 'Charterer',
        required: true,
        order: 2,
        recipientId: '2'
      },
      {
        role: 'CENTRAL_BROKER',
        label: 'Central Broker',
        required: true,
        order: 3,
        recipientId: '3'
      },
      {
        role: 'CO_BROKER',
        label: 'Co-Broker',
        required: false,
        order: 4,
        recipientId: '4'
      },
      {
        role: 'COMPANY',
        label: 'xplorVR Media Group',
        required: true,
        order: 5,
        recipientId: '5',
        email: 'contracts@xplor.io'
      }
    ],
    fields: [
      {
        name: 'yachtName',
        label: 'Yacht Name',
        type: 'text',
        required: true,
        group: 'charter'
      },
      {
        name: 'agreementDate',
        label: 'Charter Agreement Date',
        type: 'date',
        required: true,
        group: 'charter'
      },
      {
        name: 'releaseTimeframe',
        label: 'Release Timeframe (Business Days)',
        type: 'number',
        required: true,
        group: 'terms',
        placeholder: 'e.g., 5'
      }
    ],
    workflow: {
      type: 'sequential',
      autoSend: true,
      reminderEnabled: true,
      reminderDelay: 24,
      expirationDays: 14
    }
  },

  'management-consent': {
    id: 'management-consent',
    name: 'Management Consent Side Letter',
    description: 'Manager consent for FairSeas participation and operational cooperation',
    pdfPath: '/contracts/Management_Consent_Side_Letter_ADGM.pdf',
    category: 'owner',
    signers: [
      {
        role: 'MANAGER',
        label: 'Yacht Manager',
        required: true,
        order: 1,
        recipientId: '1'
      },
      {
        role: 'OWNER',
        label: 'Yacht Owner',
        required: true,
        order: 2,
        recipientId: '2'
      },
      {
        role: 'COMPANY',
        label: 'xplorVR Media Group',
        required: true,
        order: 3,
        recipientId: '3',
        email: 'contracts@xplor.io'
      }
    ],
    fields: [
      {
        name: 'yachtName',
        label: 'Yacht Name',
        type: 'text',
        required: true,
        group: 'vessel'
      },
      {
        name: 'managementCompany',
        label: 'Management Company',
        type: 'text',
        required: true,
        group: 'management'
      }
    ],
    workflow: {
      type: 'sequential',
      autoSend: true,
      reminderEnabled: true,
      reminderDelay: 48,
      expirationDays: 21
    }
  },

  'schedule-cri': {
    id: 'schedule-cri',
    name: 'Schedule CRI+ Allocation Method',
    description: 'Documentation of crew allocation methodology and scoring system',
    pdfPath: '/contracts/Schedule_CRI_Plus_ADGM.pdf',
    category: 'crew',
    signers: [
      {
        role: 'COMPANY',
        label: 'xplorVR Media Group',
        required: true,
        order: 1,
        recipientId: '1',
        email: 'contracts@xplor.io'
      }
    ],
    fields: [
      {
        name: 'effectiveDate',
        label: 'Effective Date',
        type: 'date',
        required: true,
        group: 'terms'
      },
      {
        name: 'version',
        label: 'CRI+ Version',
        type: 'text',
        required: true,
        group: 'terms',
        placeholder: 'e.g., v2.1'
      }
    ],
    workflow: {
      type: 'sequential',
      autoSend: true,
      reminderEnabled: false,
      reminderDelay: 0,
      expirationDays: 7
    }
  }
}