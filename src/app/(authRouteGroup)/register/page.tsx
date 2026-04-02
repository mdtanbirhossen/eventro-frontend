import RegisterForm from "@/components/modules/register/RegisterForm";

interface RegisterParams {
  searchParams: Promise<{ redirect?: string }>;
}

const RegisterPage = async ({ searchParams }: RegisterParams) => {
  const params = await searchParams;
  const redirectPath = params.redirect;

  return (
    <main className="w-full">
      <RegisterForm redirectPath={redirectPath} />
    </main>
  );
};

export default RegisterPage;