'use client'

import React, { Fragment, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

import { Button } from '../../../_components/Button'
import { Message } from '../../../_components/Message'
import { useCart } from '../../../_providers/Cart'
import { useAuth } from '../../../_providers/Auth'

import classes from './index.module.scss'

export const OrderConfirmationPage: React.FC<{}> = () => {
  const searchParams = useSearchParams()
  const orderID = searchParams.get('order_id')
  const error = searchParams.get('error')

  const { clearCart } = useCart()
  const { user } = useAuth()

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div>
      {error ? (
        <Fragment>
          <Message error={error} />
          <p>
            {`Your payment was successful but there was an error processing your order. Please contact us to resolve this issue.`}
          </p>
          {user ? (
            <div className={classes.actions}>
              <Button href="/account" label="View account" appearance="primary" />
              <Button
                href={`${process.env.NEXT_PUBLIC_SERVER_URL}/orders`}
                label="View all orders"
                appearance="secondary"
              />
            </div>
          ) : (
            <p>
              Guest users: Please save your order ID <strong>{orderID}</strong> for future reference.
            </p>
          )}
        </Fragment>
      ) : (
        <Fragment>
          <h1>Thank you for your order!</h1>
          <p>
            {`Your order has been confirmed. You will receive an email confirmation shortly. Your order ID is ${orderID}.`}
          </p>
          {user ? (
            <div className={classes.actions}>
              <Button href={`/account/orders/${orderID}`} label="View order" appearance="primary" />
              <Button
                href={`${process.env.NEXT_PUBLIC_SERVER_URL}/account/orders`}
                label="View all orders"
                appearance="secondary"
              />
            </div>
          ) : (
            <p className={classes.guestordernote}>
              Guest users: Please save your order ID <strong>{orderID}</strong> for future reference.
            </p>
          )}
        </Fragment>
      )}
    </div>
  )
}
