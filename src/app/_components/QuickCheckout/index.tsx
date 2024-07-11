'use client'
import React, { useEffect, useRef, useState } from 'react'
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl'
import Link from 'next/link'

import { Product } from '../../../payload/payload-types'
import { fetchProd } from '../../_api/fetchProd'
import QuickCard from './QuickCard'

import classes from './index.module.scss'

const QuickCheckout = ({ NewProducts }: { NewProducts: Product[] }) => {
  const [productDetails, setProductDetails] = useState<Product[]>([])
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchProductDetails = async () => {
      const detailsPromises = NewProducts.map(async product => {
        try {
          const detail = await fetchProd<Product>(product.slug)
          return detail
        } catch (error) {
          console.error(`Error fetching detail for ${product.slug}:`, error)
          return null
        }
      })

      const details = await Promise.all(detailsPromises)
      const filteredDetails = details.filter(detail => detail !== null) as Product[]
      setProductDetails(filteredDetails)
    }

    if (NewProducts.length > 0) {
      fetchProductDetails()
    }
  }, [NewProducts])
  //////////////////////
  const scrollLeft = () => {
    if (listRef.current) {
      listRef.current.scrollBy({ left: -300, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (listRef.current) {
      listRef.current.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }
  //////////////////////

  return (
    <section className={classes.container}>
      <div>
        <h4>Quick Checkout</h4>
      </div>

      <div className={classes.carouselWrapper}>
        <button className={classes.arrow} onClick={scrollLeft}>
          <SlArrowLeft />
        </button>
        <div className={classes.gradientWrapper}>
          <div className={classes.list} ref={listRef}>
            {productDetails?.map(product => {
              return <QuickCard key={product.id} doc={product} />
            })}
          </div>
        </div>
        <button className={classes.arrow} onClick={scrollRight}>
          <SlArrowRight />
        </button>
      </div>
    </section>
  )
}

export default QuickCheckout
