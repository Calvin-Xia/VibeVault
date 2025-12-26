import { Link, LinkCollection, LinkTag, Tag, Collection } from '@vibevault/db'

export type LinkWithRelations = Link & {
  tags: (LinkTag & { tag: Tag })[]
  collections: (LinkCollection & { collection: Collection })[]
}
