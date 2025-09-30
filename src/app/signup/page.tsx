"use client";
import { useAuth } from '@/lib/AuthContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { Field } from '@base-ui-components/react/field';
import { Form } from '@base-ui-components/react/form';

export default function SignupPage() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await signUp(email, password);

    if (error) {
      setErrors({ general: error.message });
      setLoading(false);
    } else {
      // Redirect to onboarding
      router.push("/onboarding");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-md shadow-xs border border-default">
        <h2 className="text-3xl garamond-text text-left">Create Account</h2>

        <Form
          className="flex w-full max-w-md flex-col gap-4"
          errors={errors}
          onClearErrors={() => setErrors({})}
          onSubmit={handleSignup}
        >
          <Field.Root name="email" className="flex flex-col items-start gap-1">
            <Field.Label className="text-sm font-medium text-gray-900">Email</Field.Label>
            <Field.Control
              type="email"
              required
              placeholder="Enter your email"
              className="h-10 w-full rounded-md border border-gray-200 pl-3.5 text-base text-gray-900 focus:outline-2 focus:-outline-offset-1 focus:outline-blue-800"
            />
            <Field.Error className="text-sm text-red-800" />
          </Field.Root>

          <Field.Root name="password" className="flex flex-col items-start gap-1">
            <Field.Label className="text-sm font-medium text-gray-900">Password</Field.Label>
            <Field.Control
              type="password"
              required
              minLength={6}
              placeholder="Enter your password"
              className="h-10 w-full rounded-md border border-gray-200 pl-3.5 text-base text-gray-900 focus:outline-2 focus:-outline-offset-1 focus:outline-blue-800"
            />
            <Field.Error className="text-sm text-red-800" />
          </Field.Root>

          {errors.general && (
            <div className="text-sm text-red-800">{errors.general}</div>
          )}

          <button
            disabled={loading}
            type="submit"
            className="flex h-12 items-center justify-center rounded-md border garamond-text border-gray-200 bg-blue-600 px-3.5 text-lg font-medium text-white select-none hover:bg-blue-700 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 active:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </Form>

        <p className="text-center text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  )
}

