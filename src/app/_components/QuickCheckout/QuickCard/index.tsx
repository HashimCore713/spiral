'use client'

import React, { Fragment, useEffect, useState } from 'react'
import Link from 'next/link'

import { Product } from '../../../../payload/payload-types'
import { AddToCartButton } from '../../AddToCartButton'
import { BuyNowButton } from '../../BuyNowButton'
import { Media } from '../../Media'

import classes from './index.module.scss'

export const QuickCard: React.FC<{
  alignItems?: 'center'
  className?: string
  showCategories?: boolean
  hideImagesOnMobile?: boolean
  title?: string
  relationTo?: 'products'
  doc?: Product
}> = props => {
  const {
    showCategories,
    title: titleFromProps,
    doc,
    doc: { slug, title, categories, meta, price, stock } = {},
    className,
  } = props

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-PK') // Adjust 'en-US' to your desired locale if different
  }

  const { description, image: metaImage } = meta || {}
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ')
  const href = `/products/${slug}`
  const isOutOfStock = stock === 0

  // Check if the product has the specified category ID
  const hasTargetCategory = categories?.some(category => category.id === '6688020faa14c6d8d2247152')

  if (!hasTargetCategory) {
    return null // Don't render if the product does not have the target category
  }

  return (
    <div className={[classes.card, className].filter(Boolean).join(' ')}>
      <BuyNowButton
        product={doc}
        className={`${classes.BuyNowButton} ${isOutOfStock ? classes.disabled : ''}`}
        disabled={isOutOfStock} // Disable the button if out of stock
      />
      <Link
        href={href}
        className={[classes.card, classes.subClass, className].filter(Boolean).join(' ')}
      >
        <div className={classes.productDetailsDiv}>
          <p className={classes.imageTag}>Trending</p>
          {titleToUse && <p className={classes.imageHeading}>{titleToUse}</p>}
          {price && <p className={classes.price}>PKR {formatPrice(price)}</p>}
        </div>
        <div className={classes.mediaWrapper}>
          <div className={classes.collageCard}>
            {!metaImage && <div className={classes.placeholder}>No image</div>}
            {metaImage && typeof metaImage !== 'string' && (
              <Media imgClassName={classes.image} resource={metaImage} fill />
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}

export default QuickCard
