import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Order } from '../../../../payload/payload-types'
import { Button } from '../../../_components/Button'
import { RenderParams } from '../../../_components/RenderParams'
import { formatDateTime } from '../../../_utilities/formatDateTime'
import { getMeUser } from '../../../_utilities/getMeUser'
import { mergeOpenGraph } from '../../../_utilities/mergeOpenGraph'

import classes from './index.module.scss'

export default async function Orders() {
  const { token } = await getMeUser({
    nullUserRedirect: `/login?error=${encodeURIComponent(
      'You must be logged in to view your orders.',
    )}&redirect=${encodeURIComponent('/orders')}`,
  })

  let orders: Order[] | null = null

  try {
    orders = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${token}`,
      },
      cache: 'no-store',
    })
      ?.then(async res => {
        if (!res.ok) notFound()
        const json = await res.json()
        if ('error' in json && json.error) notFound()
        if ('errors' in json && json.errors) notFound()
        return json
      })
      ?.then(json => json.docs)
  } catch (error) {
    console.error(error) // eslint-disable-line no-console
  }

  return (
    <div>
      <h5>My Orders</h5>
      {(!orders || !Array.isArray(orders) || orders?.length === 0) && (
        <p className={classes.noOrders}>You have no orders.</p>
      )}
      <RenderParams />
      {orders && orders.length > 0 && (
        <ul className={classes.orders}>
          {orders?.map(order => {
            const paymentMethodDisplay =
              order.paymentMethod === 'cod'
                ? 'Cash On Delivery'
                : order.paymentMethod === 'card'
                ? 'Card Payment'
                : order.paymentMethod

            const statusDisplay =
              order.status === 'delivered' ? (
                <span className={classes.delivered}>Delivered</span>
              ) : order.status === 'cancelled' ? (
                <span className={classes.cancelled}>Cancelled</span>
              ) : order.status === 'confirmed' ? (
                <span className={classes.confirmed}>Confirmed</span>
              ) : (
                <span className={classes.pending}>Pending</span>
              )

            return (
              <li key={order.id} className={classes.order}>
                <Link className={classes.item} href={`/account/orders/${order.id}`}>
                  <div className={classes.itemContent}>
                    <h6 className={classes.itemTitle}>{`Order ${order.id}`}</h6>
                    <div className={classes.itemMeta}>
                      <p>
                        {'Status: '}
                        {statusDisplay}
                      </p>
                      <p>
                        {'Total: '}
                        {new Intl.NumberFormat('en-PK', {
                          style: 'currency',
                          currency: 'PKR',
                        }).format(order.total)}
                      </p>
                      <p className={classes.orderDate}>{`Ordered On: ${formatDateTime(
                        order.createdAt,
                      )}`}</p>
                      <p>{`Payment Method: ${paymentMethodDisplay}`}</p>
                    </div>
                  </div>
                  <Button
                    appearance="default"
                    label="View Order"
                    className={classes.vieworder}
                    el="link"
                    href={`/account/orders/${order.id}`}
                  />
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Orders',
  description: 'Your orders.',
  openGraph: mergeOpenGraph({
    title: 'Orders',
    url: '/orders',
  }),
}
