import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { email, z } from "zod";
import { usePathname, useRouter } from 'next/navigation';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/services/firebase";
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { title } from 'process';
import { Input } from '../ui/input';
import { saveUser } from '@/services/auth/saveUser';
;

const AuthForm = ({
    loading, setLoading
} : {
    loading: boolean
    setLoading: (loading: boolean) => void
}): React.ReactElement => {
  const pathname = usePathname();
  const router = useRouter();
  const isSignUp = pathname === "/sign-up";


  const formSchema = z
  .object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(8, {message: "Password must be at least 8 characters"}),
    confirmPassword: isSignUp 
    ? z.string().min(8, {message: "Password must be at least 8 characters"}) : z.string().optional(),
  })
  .superRefine((date, ctx) => {
    if (isSignUp && date.password !== date.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
})

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    setLoading(true);
    if (isSignUp) {
      // Sign Up Logic
      createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(async (userCredential) => {
        // Signed up 
        const user = userCredential.user;
        // user saved to db logic here
        if(!user.uid) {
          toast.error("Error: User email not found");
          setLoading(false);
          return;
        }

        const userSaved = await saveUser({
          email: user.email || "",
          id: user.uid,
          image: user.photoURL || "",
          name: user.displayName || "",
          checkoutId: null,
          isPro: false,
        })
        
        if(!userSaved.success){
          toast.error(`Error: ${userSaved.error}`);
        setLoading(false);
          return;
        }

        toast.success("Account Created Successfully!");
        setLoading(false);
      })
      .catch((error) => {
        // const errorCode = error.code;
        const errorMessage = "Failed to create account. Please try again.";
        setLoading(false);
        toast.error(`Error: ${errorMessage}`);
      })
      .finally(() => {
        setLoading(false);
        toast.success("Account Created Successfully!");
        router.push("/sign-in");
      });
    } else {
      // Sign In Logic
      signInWithEmailAndPassword(auth, data.email, data.password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log("User signed in", user);
          // not working without inmporting toaster in /layout.tsx
          toast.success("Sign In Successful!");
          setLoading(false);
          // router.push("/");
        })
        .catch((error) => {
          // const errorCode = error.code;
          const errorMessage = "Invalid email or password";
          setLoading(false);
          toast.error(`Error : ${errorMessage}`);
        })
    }
  }
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
       <FieldGroup className='gap-4'>
        <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-email">
                    Email Address
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-email"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your email address"
                    disabled={loading}
                    type='email'
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            /><Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-password">
                    Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your password"
                    disabled={loading}
                    type='password'
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {isSignUp && (
              <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-confirm-password">
                    Confirm Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-confirm-password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Confirm your password"
                    disabled={loading}
                    type='password'
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />)}
             <Button type="submit" disabled={loading} className='bg-purple-800 hover:bg-purple-950'>
              {isSignUp ? " Create Account" : "Login to your Account"}
            </Button>
       </FieldGroup>
    </form>
  )
}

export default AuthForm