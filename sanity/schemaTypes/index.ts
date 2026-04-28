import { type SchemaTypeDefinition } from 'sanity'
import product from './product'
import category from './category'
import heroImages from './heroImages'
import { bannerType } from './banner'


export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product,category,heroImages,bannerType]
}
