import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'
import { automationTools } from '@/heros/AutomationHero/tools'

export const AutomationRequests: CollectionConfig = {
  slug: 'automation-requests',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    group: 'Leads',
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'tool', 'status', 'createdAt'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'prompt',
      type: 'textarea',
      required: true,
    },
    {
      name: 'tool',
      type: 'select',
      required: true,
      options: automationTools.map((tool) => ({ label: tool.label, value: tool.value })),
    },
    {
      name: 'wantsPlan',
      type: 'checkbox',
      defaultValue: false,
      label: 'Requested an implementation plan',
    },
    {
      name: 'attachments',
      type: 'text',
      admin: {
        description: 'File names the visitor noted as context (not uploaded, informational only).',
      },
    },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'composer',
      options: [
        { label: 'Composer', value: 'composer' },
        { label: 'Audit form', value: 'audit-form' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Where the request was submitted from.',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Closed', value: 'closed' },
      ],
    },
  ],
}
