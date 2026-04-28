import { defineType, defineField } from "sanity";

export const bannerType = defineType({
  name: 'banner',
  type: 'document',
  title: 'Promotional Banner',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Banner Title',
      description: 'Main heading for the banner'
    }),
    defineField({
      name: 'subtitle',
      type: 'string', 
      title: 'Subtitle/Tagline',
      description: 'Secondary text above the main title'
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Description',
      description: 'Detailed description text'
    }),
    defineField({
      name: 'backgroundImage',
      type: 'image',
      title: 'Background Image',
      options: {
        hotspot: true
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'productImage',
      type: 'image', 
      title: 'Product/Featured Image',
      description: 'Main product or person image',
      options: {
        hotspot: true
      }
    }),
    defineField({
      name: 'decorativeImage',
      type: 'image',
      title: 'Decorative Element',
      description: 'Additional decorative image (like medallion/jewelry)',
      options: {
        hotspot: true
      }
    }),
    defineField({
      name: 'buttonText',
      type: 'string',
      title: 'Button Text',
      initialValue: 'Explore Collection'
    }),
    defineField({
      name: 'buttonLink',
      type: 'string',
      title: 'Button Link',
      description: 'Where the button should link to'
    }),
    defineField({
      name: 'backgroundColor',
      type: 'string',
      title: 'Background Color',
      description: 'CSS color or class name',
      initialValue: 'bg-emerald-800'
    }),
    defineField({
      name: 'textColor',
      type: 'string', 
      title: 'Text Color',
      description: 'CSS color or class name',
      initialValue: 'text-white'
    }),
    defineField({
      name: 'isActive',
      type: 'boolean',
      title: 'Active Banner',
      description: 'Show this banner on the website',
      initialValue: true
    }),
    defineField({
      name: 'displayOrder',
      type: 'number',
      title: 'Display Order',
      description: 'Order of appearance (lower numbers appear first)',
      initialValue: 1
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      media: 'backgroundImage',
      active: 'isActive'
    },
    prepare(selection) {
      const { title, subtitle, media, active } = selection;
      return {
        title: title || 'Untitled Banner',
        subtitle: `${subtitle || 'No subtitle'} ${active ? '(Active)' : '(Inactive)'}`,
        media
      };
    }
  }
});
