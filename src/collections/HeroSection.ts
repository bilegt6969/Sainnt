// src/collections/HeroSection.ts
import type { CollectionConfig } from 'payload'

export const HeroSection: CollectionConfig = {
  slug: 'hero-section',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'text',
    },
    {
      name: 'background',
      type: 'group',
      fields: [
        {
          name: 'type',
          type: 'radio',
          options: [
            { label: 'Image', value: 'image' },
            { label: 'Color', value: 'color' },
          ],
          defaultValue: 'image',
          required: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: false,
          admin: {
            condition: (data) => data?.background?.type === 'image',
          },
        },
        {
          name: 'color',
          type: 'text',
          required: false,
          admin: {
            condition: (data) => data?.background?.type === 'color',
            description: 'Use a valid CSS color value (e.g., #000000, rgba(0, 0, 0, 0.5))',
          },
        },
      ],
    },
    {
      name: 'textColor',
      type: 'text',
      required: true,
      defaultValue: '#FFFFFF',
      admin: {
        description: 'Use a valid CSS color value (e.g., #FFFFFF, rgba(255, 255, 255, 1))',
      },
    },
    {
      name: 'fontFamily',
      type: 'select',
      options: [
        { label: 'Arial', value: 'Arial, sans-serif' },
        { label: 'Roboto', value: "'Roboto', sans-serif" },
        { label: 'Open Sans', value: "'Open Sans', sans-serif" },
        { label: 'Times New Roman', value: "'Times New Roman', serif" },
        { label: 'PT Serif', value: 'PT Serif' }, // Add PT Serif
        { label: 'Custom', value: 'custom' },
      ],
      defaultValue: 'Arial, sans-serif',
      required: true,
    },
    {
      name: 'customFont',
      type: 'text',
      required: false,
      admin: {
        condition: (data) => data?.fontFamily === 'custom',
        description: 'Enter a custom font family (e.g., "Poppins, sans-serif")',
      },
    },
    {
      name: 'textPosition',
      type: 'select',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
      defaultValue: 'center',
      required: true,
    },
  ],
}
