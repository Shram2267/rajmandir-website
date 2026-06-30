import { login } from "./actions";
import Logo from "@/components/Logo";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const resolvedSearchParams = await searchParams;

  return (
    <div className="min-h-screen bg-sand flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <Logo />
        <h2 className="mt-6 text-center text-[28px] font-extrabold text-ink">
          Admin Portal
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-[0_8px_30px_rgb(0,0,0,0.08)] sm:rounded-2xl sm:px-10 border border-line">
          <form className="space-y-6" action={login}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold text-ink"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-line rounded-xl shadow-sm placeholder-stone-400 focus:outline-none focus:ring-brand focus:border-brand sm:text-sm bg-stone-50"
                  placeholder="admin@rajmandir.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-bold text-ink"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-line rounded-xl shadow-sm placeholder-stone-400 focus:outline-none focus:ring-brand focus:border-brand sm:text-sm bg-stone-50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {resolvedSearchParams?.error && (
              <div className="text-brand text-sm font-semibold bg-brand-wash p-3 rounded-lg">
                ⚠️ {resolvedSearchParams.error}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-brand hover:bg-brand-deep focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand transition-colors"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
