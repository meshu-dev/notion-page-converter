export type BlogPage = {
  heading: string
  body: string
}

export type BlogStaticPathParams = {
  params: {
    slug: string
  }
}

export type TagStaticPathParams = {
  params: {
    tag: string
  }
}