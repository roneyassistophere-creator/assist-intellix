export type AutomationTool = {
  value: string
  label: string
  description: string
  popular?: boolean
}

export const automationTools: AutomationTool[] = [
  {
    value: 'workflow-automation',
    label: 'Workflow Automation',
    description: 'Connect your apps and automate multi-step business processes end-to-end.',
    popular: true,
  },
  {
    value: 'ai-chatbots',
    label: 'AI Chatbots',
    description: '24/7 conversational AI for support, FAQs, and lead capture.',
  },
  {
    value: 'crm-automation',
    label: 'CRM Automation',
    description: 'Automatically sync leads, deals, and follow-ups across your CRM.',
  },
  {
    value: 'custom-ai-agents',
    label: 'Custom AI Agents',
    description: 'Bespoke autonomous agents tailored to your workflows and data.',
  },
  {
    value: 'rpa',
    label: 'RPA (Process Automation)',
    description: 'Automate high-volume, rule-based back-office tasks with software bots.',
  },
  {
    value: 'email-marketing-automation',
    label: 'Email & Marketing Automation',
    description: 'Automate campaigns, drip sequences, and audience segmentation.',
  },
]
