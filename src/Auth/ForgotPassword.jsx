import { useId, useState } from "react";
import { MdArrowBack, MdMailOutline } from "react-icons/md";
import { Link } from "react-router-dom";

const HERO_IMAGE_SRC =
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=85&w=1800";

export default function ForgotPassword() {
  const emailId = useId();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      setSent(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-dvh grid-cols-1 bg-white text-neutral-900 antialiased lg:grid-cols-2">
      <section className="order-2 flex flex-col justify-center bg-gradient-to-b from-neutral-100 to-neutral-50 px-5 py-10 sm:px-8 sm:py-14 lg:order-2 lg:px-12 lg:py-16 xl:px-16">
        <div className="mx-auto w-full max-w-[540px]">
          <div className="rounded-3xl border border-neutral-200/80 bg-white p-8 shadow-xl ring-1 ring-neutral-900/5 sm:p-10">
            <div className="text-center">
              <h1 className="font-display text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl">Jewellery ERP</h1>
              <p className="mt-2 text-sm font-medium text-neutral-500">Forgot your password?</p>
              <div className="mx-auto mt-5 h-px w-12 rounded-full bg-neutral-300" aria-hidden />
            </div>

            {sent ? (
              <div className="mt-9 space-y-5 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-900 ring-1 ring-neutral-200">
                  <MdMailOutline className="h-7 w-7" aria-hidden />
                </div>
                <p className="text-[15px] leading-relaxed text-neutral-600">
                  If an account exists for <span className="font-semibold text-neutral-900">{email}</span>, you will receive reset instructions shortly.
                </p>
                <p className="text-sm text-neutral-500">Check your spam folder if nothing arrives in a few minutes.</p>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold text-neutral-800 shadow-sm transition hover:bg-neutral-50"
                >
                  <MdArrowBack className="h-4 w-4 shrink-0" aria-hidden />
                  Back to login
                </Link>
              </div>
            ) : (
              <>
                <p className="mt-7 text-center text-sm leading-relaxed text-neutral-500">
                  Enter the email tied to your account. We will send you a link to choose a new password.
                </p>

                <form className="mt-8 space-y-5" onSubmit={onSubmit} aria-busy={isSubmitting}>
                  <div>
                    <label htmlFor={emailId} className="text-sm font-medium text-neutral-600">
                      Your Email
                    </label>
                    <div className="relative mt-2">
                      <MdMailOutline
                        className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-400"
                        aria-hidden
                      />
                      <input
                        id={emailId}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        placeholder="Enter your email"
                        className="h-12 w-full rounded-xl border border-neutral-200 bg-neutral-50 pl-11 pr-3 text-[15px] text-neutral-900 outline-none transition placeholder:text-neutral-400 hover:border-neutral-300 hover:bg-white focus:border-neutral-900 focus:bg-white focus:ring-2 focus:ring-neutral-900/15"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex h-[3.25rem] w-full items-center justify-center rounded-xl bg-black text-sm font-bold uppercase tracking-[0.14em] text-white shadow-lg transition hover:bg-neutral-900 hover:shadow-xl active:translate-y-px focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                  >
                    {isSubmitting ? "Sending…" : "Send reset link"}
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-600 underline-offset-2 hover:text-neutral-900 hover:underline"
                  >
                    <MdArrowBack className="h-4 w-4 shrink-0" aria-hidden />
                    Back to login
                  </Link>
                </div>
              </>
            )}

            <p className="mt-9 text-center text-xs font-medium text-neutral-400">© {new Date().getFullYear()} Jewellery ERP</p>
          </div>
        </div>
      </section>

      <aside className="relative order-1 min-h-[min(42vh,360px)] w-full overflow-hidden sm:min-h-[44vh] lg:order-1 lg:min-h-dvh">
        <img
          src={HERO_IMAGE_SRC}
          alt="Gold jewellery display"
          className="absolute inset-0 h-full w-full object-cover object-center"
          width={2400}
          height={1600}
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" aria-hidden />
      </aside>
    </main>
  );
}
