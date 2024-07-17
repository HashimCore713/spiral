import React from 'react'
import { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

import { Category, Page, Product } from '../../../payload/payload-types'
import { staticHome } from '../../../payload/seed/home-static'
import { fetchDoc } from '../../_api/fetchDoc'
import { fetchDocs } from '../../_api/fetchDocs'
import { fetchNewProducts } from '../../_api/fetchNewProducts'
import { fetchQuickCheckoutProducts } from '../../_api/fetchQuickCheckoutProducts'
import { Blocks } from '../../_components/Blocks'
import { Gutter } from '../../_components/Gutter'
import { Hero } from '../../_components/Hero'
import { HR } from '../../_components/HR'
import { generateMeta } from '../../_utilities/generateMeta'
import ShopInfo from '../../_components/ShopInfo'
import Categories from '../../_components/Categories'
import NewProducts from '../../_components/NewProducts'
import QuickCheckout from '../../_components/QuickCheckout'

import classes from './index.module.scss'

export default async function Page({ params: { slug = 'home' } }) {
  const { isEnabled: isDraftMode } = draftMode()

  let page: Page | null = null
  let categories: Category[] | null = null

  try {
    page = await fetchDoc<Page>({
      collection: 'pages',
      slug,
      draft: isDraftMode,
    })

    categories = await fetchDocs<Category>('categories')
  } catch (error) {
    console.error(error)
    // Handle error appropriately, such as logging or displaying a fallback message
  }
  ///////////////////////////////
  let products: Product[] | null = null

  try {
    products = await fetchNewProducts(); // Fetch all new products
  } catch (error) {
    console.error(error)
    // Handle error appropriately, such as logging or displaying a fallback message
  }
  /////////////////////////////
  ///////////////////////////////
  let quickproducts: Product[] | null = null

  try {
    quickproducts = await fetchQuickCheckoutProducts(); // Fetch products with specific category
  } catch (error) {
    console.error(error)
    // Handle error appropriately, such as logging or displaying a fallback message
  }
  /////////////////////////////

  // if no `home` page exists, render a static one using dummy content
  // you should delete this code once you have a home page in the CMS
  // this is really only useful for those who are demoing this template
  if (!page && slug === 'home') {
    page = staticHome
  }

  if (!page) {
    return notFound()
  }

  const { hero, layout } = page

  return (
    <React.Fragment>
      {slug === 'home' ? (
        <section>
          <Hero {...hero} />
          <Gutter className={classes.home}>
            <Categories categories={categories} />
            <HR />
            <NewProducts newProducts={products} /> {/* Updated prop name to match component */}
            <HR />
            <ShopInfo
              imageUrl="https://spiral-gadgets.com/media/location.png"
              location="Hilal Rd, F-11 Markaz F 11 Markaz F-11, Islamabad, Islamabad Capital Territory 44000, Pakistan"
              mapsLink="https://maps.app.goo.gl/6yjsYK5F33bwqRpw8"
            />
            <HR />
            <QuickCheckout quickCheckoutProducts={quickproducts} />
            <HR />
          </Gutter>
        </section>
      ) : (
        <>
          <Hero {...hero} />
          <Blocks
            blocks={layout}
            disableTopPadding={!hero || hero?.type === 'none' || hero?.type === 'lowImpact'}
          />
        </>
      )}
    </React.Fragment>
  )
}

export async function generateStaticParams() {
  try {
    const pages = await fetchDocs<Page>('pages')
    return pages?.map(({ slug }) => slug)
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function generateMetadata({ params: { slug = 'home' } }): Promise<Metadata> {
  const { isEnabled: isDraftMode } = draftMode()

  let page: Page | null = null

  try {
    page = await fetchDoc<Page>({
      collection: 'pages',
      slug,
      draft: isDraftMode,
    })
  } catch (error) {
    console.error(error)
    // Handle error appropriately, such as logging or displaying a fallback message
  }

  if (!page && slug === 'home') {
    page = staticHome
  }

  return generateMeta({ doc: page })
}
