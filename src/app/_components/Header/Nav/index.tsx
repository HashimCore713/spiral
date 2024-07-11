'use client'

import React from 'react'
import Link from 'next/link'

import { Category, Header as HeaderType } from '../../../../payload/payload-types'
import { useAuth } from '../../../_providers/Auth'
import { useFilter } from '../../../_providers/Filter'
import { Button } from '../../Button'
import { CartLink } from '../../CartLink'
import { Gutter } from '../../Gutter'
import { CMSLink } from '../../Link'

import classes from './index.module.scss'

interface HeaderNavProps {
  header: HeaderType
  categories: Category[] // Include categories as a prop
  menuOpen: boolean
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ header, categories, menuOpen }) => {
  const { user } = useAuth()
  const { setCategoryFilters } = useFilter()

  const navItems = [
    { label: 'Shop', link: '/products' },
    user && { label: 'Account', link: '/account' },
    { label: 'Cart', component: <CartLink /> },
    !user && {
      label: 'Login',
      component: (
        <Button
          el="link"
          href="/login"
          label="Login"
          appearance="primary"
          onClick={() => (window.location.href = '/login')}
        />
      ),
    },
  ].filter(Boolean)

  return (
    <nav
      className={[classes.nav, user === undefined && classes.hide, menuOpen && classes.showMenu]
        .filter(Boolean)
        .join(' ')}
    >
      {categories.map((category, i) => (
        <div key={i} className={classes.navItem}>
          <Link
            href="/products"
            onClick={() => setCategoryFilters([category.id])}
            className={classes.categoryLink}
          >
            {category.title}
          </Link>
          {navItems[i] && (
            <>
              {navItems[i].link ? (
                <Link href={navItems[i].link}>{navItems[i].label}</Link>
              ) : (
                navItems[i].component
              )}
            </>
          )}
        </div>
      ))}
      {categories.length < navItems.length &&
        navItems.slice(categories.length).map((navItem, i) => (
          <div key={`extra-${i}`} className={classes.navItem}>
            {navItem.link ? <Link href={navItem.link}>{navItem.label}</Link> : navItem.component}
          </div>
        ))}
    </nav>
  )
}
