export default {
  name: 'post',
  type: 'document',
  title: 'Blog Post',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title',
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: { source: 'title' },
    },
    {
      name: 'publishedAt',
      type: 'datetime',
      title: 'Published At',
    },
    {
      name: 'excerpt',
      type: 'text',
      title: 'Excerpt',
      description: 'Short summary shown on the blog listing page (also used for SEO meta description)',
    },
    {
      name: 'coverImage',
      type: 'image',
      title: 'Cover Image',
      options: { hotspot: true },
    },
    {
      name: 'body',
      type: 'array',
      title: 'Body Content',
      of: [
        { type: 'block' }, // rich text
        { type: 'image' }, // inline images
      ],
    },
    {
      name: 'tags',
      type: 'array',
      title: 'Tags',
      of: [{ type: 'string' }],
    },
  ],
}