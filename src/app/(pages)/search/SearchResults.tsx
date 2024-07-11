// src/app/search/SearchResults.tsx

'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Product } from '../../../payload/payload-types'
import { SearchCard } from '../../_components/SearchCard'
import { fetchProd } from '../../_api/fetchProd'

import classes from './index.module.scss'

const SearchResults = ({ products }: { products: Product[] }) => {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')

  console.log('SearchParams:', searchParams) // Debugging log
  console.log('Search query:', query) // Debugging log

  const [productDetails, setProductDetails] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

  useEffect(() => {
    if (query) {
      const filtered = products.filter(product =>
        product.slug.toLowerCase().includes(query.toLowerCase())
      )
      setFilteredProducts(filtered)
      console.log('Filtered products:', filtered)
    } else {
      setFilteredProducts(products)
      console.log('No query, showing all products:', products)
    }
  }, [query, products])

  useEffect(() => {
    const fetchProductDetails = async () => {
      console.log('Starting to fetch product details')

      const detailsPromises = filteredProducts.map(async (product) => {
        try {
          const detail = await fetchProd<Product>(product.slug)
          console.log(`Fetched detail for ${product.slug}:`, detail)
          return detail
        } catch (error) {
          console.error(`Error fetching detail for ${product.slug}:`, error)
          return null
        }
      })

      const details = await Promise.all(detailsPromises)
      const filteredDetails = details.filter((detail) => detail !== null) as Product[]
      setProductDetails(filteredDetails)
      console.log('Fetched product details:', filteredDetails)
    }

    if (filteredProducts.length > 0) {
      fetchProductDetails()
      console.log('Fetching product details...')
    } else {
      console.log('No filtered products to fetch details for')
    }
  }, [filteredProducts])

  console.log('Product details to be rendered:', productDetails)

  return (
    <div className={classes.searchResults}>
      {productDetails.map((product) => (
        <SearchCard key={product.slug} doc={product} />
      ))}
    </div>
  )
}

export default SearchResults
