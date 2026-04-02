import LoginForm from "@/components/modules/login/LoginForm";

interface LoginParams {
  searchParams: Promise<{ redirect?: string }>;
}

const LoginPage = async ({ searchParams }: LoginParams) => {
  const params = await searchParams;
  const redirectPath = params.redirect;

  return (
    <main className="w-full">
      <LoginForm redirectPath={redirectPath} />
    </main>
  )
}

export default LoginPage