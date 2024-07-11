'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'

import { Product } from '../../../payload/payload-types'
import { NewProductCard } from './NewProductCard';
import { fetchProd } from '../../_api/fetchProd';

import classes from './index.module.scss'

const NewProducts = ({ NewProducts }: { NewProducts: Product[] }) => {
  const [productDetails, setProductDetails] = useState<Product[]>([])

  useEffect(() => {
    const fetchProductDetails = async () => {
      const detailsPromises = NewProducts.map(async (product) => {
        try {
          const detail = await fetchProd<Product>(product.slug)
          return detail
        } catch (error) {
          console.error(`Error fetching detail for ${product.slug}:`, error)
          return null
        }
      })

      const details = await Promise.all(detailsPromises)
      const filteredDetails = details.filter((detail) => detail !== null) as Product[]
      setProductDetails(filteredDetails)
    }

    if (NewProducts.length > 0) {
      fetchProductDetails()
    }
  }, [NewProducts])

  // Custom sorting logic
  const FirstProduct = productDetails.find(product =>
    product.title?.toLowerCase().includes('macbook') ||
    product.slug?.toLowerCase().includes('macbook')
  )

  const SecondProduct = productDetails.find(product =>
    product.title?.toLowerCase().includes('airpods') ||
    product.slug?.toLowerCase().includes('airpods')
  )

  const ThirdProduct = productDetails.find(product =>
    product.title?.toLowerCase().includes('iphone') ||
    product.slug?.toLowerCase().includes('iphone')
  )

  return (
    <section className={classes.container}>
      <div>
        <h5>See What's New</h5>
      </div>

      <div className={classes.grid}>
        {FirstProduct && (
          <div className={classes.fullRow}>
            <NewProductCard key={FirstProduct.slug} doc={FirstProduct} />
          </div>
        )}
        <div className={classes.twoColumns}>
          {SecondProduct && (
            <div className={classes.halfColumn}>
              <NewProductCard key={SecondProduct.slug} doc={SecondProduct} />
            </div>
          )}
          {ThirdProduct && (
            <div className={classes.halfColumn}>
              <NewProductCard key={ThirdProduct.slug} doc={ThirdProduct} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default NewProducts