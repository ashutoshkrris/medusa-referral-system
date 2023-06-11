import { medusaClient } from "@lib/config"
import { LOGIN_VIEW, useAccount } from "@lib/context/account-context"
import Button from "@modules/common/components/button"
import Input from "@modules/common/components/input"
import Spinner from "@modules/common/icons/spinner"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import { FieldValues, useForm } from "react-hook-form"

interface RegisterCredentials extends FieldValues {
  first_name: string
  last_name: string
  email: string
  password: string
  phone?: string
  referral_code?: string
}

const Register = () => {
  const { loginView, refetchCustomer } = useAccount()
  const [_, setCurrentView] = loginView
  const [authError, setAuthError] = useState<string | undefined>(undefined)
  const [referralError, setReferralError] = useState<string | undefined>(
    undefined
  )
  const router = useRouter()

  const handleError = (e: Error) => {
    setAuthError("An error occured. Please try again.")
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterCredentials>()

  const getReferrerCustomerId = async (referralCode: string) => {
    try {
      const response = await fetch(
        `http://localhost:9000/store/referral/${referralCode}`
      )

      if (!response.ok) {
        setReferralError("The referral code is invalid. Please check.")
        return null
      }
      const referral = await response.json()

      return referral.referrer_customer.id
    } catch (error) {
      setReferralError(
        "An error occurred while validating the referral code. Please try again."
      )
      return null
    }
  }

  const updateDiscounts = async (
    referredCustomerId: string,
    referrerCustomerId: string
  ) => {
    try {
      const response = await fetch(
        "http://localhost:9000/store/referral/discounts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ referredCustomerId, referrerCustomerId }),
        }
      )

      if (response.ok) {
        const responseData = await response.json()
        console.log(responseData) // Handle the response data as needed
      } else {
        const errorData = await response.json()
        console.error(errorData) // Handle the error response
      }
    } catch (error) {
      console.error("An error occurred while updating discounts", error) // Handle any other errors
    }
  }

  const onSubmit = handleSubmit(async (credentials) => {
    let referrerCustomerId: string = ""
    const { referral_code, ...registerCredentials } = credentials
    if (referral_code) {
      referrerCustomerId = await getReferrerCustomerId(referral_code)
      if (!referrerCustomerId) {
        return
      }
    }

    let referredCustomerId: string = ""

    await medusaClient.customers
      .create(registerCredentials)
      .then(({ customer }) => {
        referredCustomerId = customer.id
        refetchCustomer()
        router.push("/")
        updateDiscounts(referredCustomerId, referrerCustomerId)
      })
      .catch(handleError)
  })

  return (
    <div className="max-w-sm flex flex-col items-center mt-12">
      {isSubmitting && (
        <div className="z-10 fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center">
          <Spinner size={24} />
        </div>
      )}
      <h1 className="text-large-semi uppercase mb-6">Become a Acme Member</h1>
      <p className="text-center text-base-regular text-gray-700 mb-4">
        Create your Acme Member profile, and get access to an enhanced shopping
        experience.
      </p>
      <form className="w-full flex flex-col" onSubmit={onSubmit}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="First name"
            {...register("first_name", { required: "First name is required" })}
            autoComplete="given-name"
            errors={errors}
          />
          <Input
            label="Last name"
            {...register("last_name", { required: "Last name is required" })}
            autoComplete="family-name"
            errors={errors}
          />
          <Input
            label="Email"
            {...register("email", { required: "Email is required" })}
            autoComplete="email"
            errors={errors}
          />
          <Input
            label="Phone"
            {...register("phone")}
            autoComplete="tel"
            errors={errors}
          />
          <Input
            label="Password"
            {...register("password", {
              required: "Password is required",
            })}
            type="password"
            autoComplete="new-password"
            errors={errors}
          />
          <Input
            label="Have a referral code?"
            {...register("referral_code")}
            autoComplete="off"
            errors={errors}
          />
        </div>
        {authError && (
          <div>
            <span className="text-rose-500 w-full text-small-regular">
              These credentials do not match our records
            </span>
          </div>
        )}
        {referralError && (
          <div>
            <span className="text-rose-500 w-full text-small-regular">
              {referralError}
            </span>
          </div>
        )}
        <span className="text-center text-gray-700 text-small-regular mt-6">
          By creating an account, you agree to Acme&apos;s{" "}
          <Link href="/content/privacy-policy">
            <a className="underline">Privacy Policy</a>
          </Link>{" "}
          and{" "}
          <Link href="/content/terms-of-use">
            <a className="underline">Terms of Use</a>
          </Link>
          .
        </span>
        <Button className="mt-6">Join</Button>
      </form>
      <span className="text-center text-gray-700 text-small-regular mt-6">
        Already a member?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="underline"
        >
          Sign in
        </button>
        .
      </span>
    </div>
  )
}

export default Register
