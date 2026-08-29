const product = {
  name: 'product',
  type: 'document',
  title: 'Product',

  groups: [
    { name: 'main', title: 'Product', default: true },
    { name: 'specs', title: 'Gem specs' },
    { name: 'seo', title: 'SEO' },
  ],

  fields: [
    /* ---------------- Main ---------------- */
    {
      name: 'name',
      type: 'string',
      title: 'Name of Product',
      group: 'main',
      description:
        'Include carat, treatment and gem type. Example: 1.69ct Natural Blue Sapphire',
      validation: (Rule: any) => Rule.required().max(90),
    },
    {
      name: 'images',
      type: 'array',
      title: 'Product Images',
      group: 'main',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt text',
              description:
                'What the photo shows. Do not claim an origin that is not correct for this stone.',
            },
          ],
        },
      ],
      validation: (Rule: any) => Rule.required().min(1),
    },
    {
      name: 'description',
      type: 'text',
      rows: 6,
      title: 'Description of product',
      group: 'main',
      description:
        'Write prose, not a spec list. Specs belong in the Gem specs tab. Describe how the stone looks, what it suits, why it was selected.',
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Product Slug',
      group: 'main',
      options: {
        source: 'name',
        maxLength: 96,
        // Default slugify keeps dots, which produced
        // ".../buy-moonstone-...-5.24ct-madagascar-...". This strips them.
        slugify: (input: string) =>
          input
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/[\s_]+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
            .slice(0, 96),
      },
      // Required: a missing slug is what produced the /product/null link.
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'price',
      title: 'Price (USD)',
      type: 'number',
      group: 'main',
      validation: (Rule: any) => Rule.required().positive(),
    },
    {
      name: 'compareAtPrice',
      title: 'Original price (USD)',
      type: 'number',
      group: 'main',
      description:
        'ONLY fill this if the stone was genuinely offered at this higher price before. Leave empty otherwise. Inventing a struck-through price is a false reference price under NZ, AU, UK and EU consumer law.',
      validation: (Rule: any) =>
        Rule.positive().custom((value: number, context: any) => {
          if (value === undefined || value === null) return true;
          const price = context?.document?.price;
          if (typeof price === 'number' && value <= price) {
            return 'Original price must be higher than the current price.';
          }
          return true;
        }),
    },
    {
      name: 'available',
      title: 'Available',
      type: 'boolean',
      group: 'main',
      initialValue: true,
      description:
        'Uncheck when the stone is sold. Sets SoldOut in structured data and removes the page from the index while keeping the URL live.',
    },
    {
      name: 'category',
      title: 'Product Category',
      type: 'reference',
      group: 'main',
      to: [{ type: 'category' }],
      validation: (Rule: any) => Rule.required(),
    },

    /* ---------------- Gem specs ---------------- */
    {
      name: 'caratWeight',
      title: 'Carat weight',
      type: 'number',
      group: 'specs',
      validation: (Rule: any) => Rule.positive(),
    },
    {
      name: 'gemColour',
      title: 'Colour',
      type: 'string',
      group: 'specs',
      description: 'Example: Royal Blue',
    },
    {
      name: 'clarity',
      title: 'Clarity',
      type: 'string',
      group: 'specs',
      description: 'Example: Eye Clean',
    },
    {
      name: 'shapeCut',
      title: 'Shape and cut',
      type: 'string',
      group: 'specs',
      description: 'Example: Oval / Step',
    },
    {
      name: 'dimensions',
      title: 'Dimensions',
      type: 'string',
      group: 'specs',
      description: 'Example: 9 x 7 mm',
    },
    {
      name: 'treatment',
      title: 'Treatment',
      type: 'string',
      group: 'specs',
      options: {
        list: [
          { title: 'Unheated', value: 'Unheated' },
          { title: 'Heated', value: 'Heated' },
          { title: 'Other treatment', value: 'Other treatment' },
          { title: 'Not disclosed', value: 'Not disclosed' },
        ],
      },
      description:
        'Must match the product name. There is currently a stone named "unheated" in its slug and "heated" in its title.',
    },
    {
      name: 'originCountry',
      title: 'Origin country',
      type: 'string',
      group: 'specs',
      description:
        'The actual origin. Several stones are from Australia, Mozambique, Ethiopia and Madagascar, but alt text currently claims Sri Lanka for all of them.',
    },
    {
      name: 'certification',
      title: 'Certification',
      type: 'string',
      group: 'specs',
      description: 'Example: GRS, Bellerophon. Leave empty if uncertified.',
    },

    /* ---------------- SEO ---------------- */
    {
      name: 'seoTitle',
      title: 'SEO title',
      type: 'string',
      group: 'seo',
      description:
        'Optional. Leave empty to auto-generate as "{name} | Riyas Gems". Use this when the product name is awkward.',
      validation: (Rule: any) =>
        Rule.max(60).warning('Over 60 characters will be truncated in search results.'),
    },
    {
      name: 'seoDescription',
      title: 'SEO description',
      type: 'text',
      rows: 3,
      group: 'seo',
      description:
        'Optional. One sentence a buyer would click. Lead with colour and clarity, not a spec list.',
      validation: (Rule: any) =>
        Rule.max(155).warning('Over 155 characters will be truncated in search results.'),
    },
  ],

  preview: {
    select: {
      title: 'name',
      subtitle: 'category.name',
      media: 'images.0',
      available: 'available',
      slug: 'slug.current',
    },
    prepare(selection: any) {
      const { title, subtitle, media, available, slug } = selection;
      const flags: string[] = [];
      if (available === false) flags.push('SOLD');
      if (!slug) flags.push('NO SLUG');

      return {
        title: flags.length > 0 ? `[${flags.join(' / ')}] ${title}` : title,
        subtitle: subtitle || 'No category',
        media,
      };
    },
  },
};

export default product;