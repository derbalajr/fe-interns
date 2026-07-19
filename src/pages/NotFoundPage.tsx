import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section className="py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
        404 error
      </p>

      <h1 className="mt-3 text-4xl font-bold text-slate-950">
        Page not found
      </h1>

      <p className="mt-3 text-slate-600">
        The page you requested does not exist.
      </p>

      <Link
        to="/"
        className="mt-6 inline-flex rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
      >
        Return to dashboard
      </Link>
    </section>
  );
}