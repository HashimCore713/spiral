'use client'

import React, { useCallback, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '../../../_components/Button';
import { Input } from '../../../_components/Input';
import { Message } from '../../../_components/Message';
import { useAuth } from '../../../_providers/Auth';

import classes from './index.module.scss';

type FormData = {
  email: string;
  password: string;
};

const LoginForm: React.FC = () => {
  const searchParams = useSearchParams();
  const allParams = searchParams.toString() ? `?${searchParams.toString()}` : '';
  const redirect = useRef(searchParams.get('redirect'));
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isLoading } } = useForm<FormData>();

  const onSubmit = useCallback(
    async (data: FormData) => {
      try {
        await login(data);
        // Fetch user state immediately after login
        const userRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`, {
          method: 'GET',
          credentials: 'include',
        });
  
        if (userRes.ok) {
          const { user } = await userRes.json();
          console.log('Current User:', user);
          if (user) {
            router.push('/account');
          } else {
            setError('User not found. Please log in again.');
          }
        } else {
          setError('Failed to fetch user information.');
        }
      } catch (_) {
        setError('There was an error with the credentials provided. Please try again.');
      }
    },
    [login, router],
  );
  

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
      <Message error={error} className={classes.message} />
      <Input
        name="email"
        label="Email Address"
        required
        register={register}
        error={errors.email}
        type="email"
      />
      <Input
        name="password"
        type="password"
        label="Password"
        required
        register={register}
        error={errors.password}
      />
      <Button
        type="submit"
        appearance="primary"
        label={isLoading ? 'Processing' : 'Login'}
        disabled={isLoading}
        className={classes.submit}
      />
      <div className={classes.links}>
        <Link href={`/create-account${allParams}`}>Create an account</Link>
        <br />
        <Link href={`/recover-password${allParams}`}>Recover your password</Link>
      </div>
    </form>
  );
};

export default LoginForm;
