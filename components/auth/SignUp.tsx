"use client"

import React, { useState } from 'react'
import CardTag from '../global/CardTag'
import {AuthForm} from './AuthForm'
import Socials from './Socials'

const SignUp = () => {
    const [loading, setLoading] = useState(false)

  return (
    <CardTag
        title="Sign Up to your Account"
        description="Enter your details to create a new account"
        content={<AuthForm/>}
        footer={<Socials />}
    />
  )
}

export default SignUp