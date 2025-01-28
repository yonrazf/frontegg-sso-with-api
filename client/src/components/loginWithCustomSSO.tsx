import useRequest from "../hooks/useRequest";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import FormInput from "./FormInput";

interface PreloginResponse {
  address: string;
  idpType: "saml" | "oidc";
}
const FE_BASE_URL = import.meta.env.VITE_FE_BASE_URL;

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});
type FormSchemaType = z.infer<typeof formSchema>;

export default function LoginWithCustomSSO() {
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors, isSubmitting },
  } = useForm<FormSchemaType>({ resolver: zodResolver(formSchema) });
  const { sendRequest, isLoading, requestErrors } = useRequest();

  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    try {
      if (formErrors.email) return;
      const { email } = data;

      await getPrelogin(email);
    } catch (error) {
      console.error(error);
    }
  };

  async function getPrelogin(email: string) {
    await sendRequest({
      url: `${FE_BASE_URL}/frontegg/identity/resources/auth/v2/user/sso/prelogin`,
      method: "POST",
      body: {
        email,
      },
      onSuccess: (data: PreloginResponse) => {
        window.location.href = data.address;
      },
    });
  }

  return (
    <>
      <h1 className="text-3xl">Log in with custom sso</h1>
      <form
        className="bg-white shadow-md rounded-lg px-8 pt-6 pb-10 mb-4 "
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mb-4">
          <FormInput
            validation={formSchema.shape.email}
            register={register}
            label="Email Address"
            name="email"
            type="text"
            placeholder="Email"
          />
          {formErrors.email && (
            <p className="text-red-500 text-xs italic">
              {formErrors.email.message}
            </p>
          )}
        </div>
        <button type="submit">Login with SSO</button>
      </form>
    </>
  );
}
