import Link from "next/link";

export default function MySportPage() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
        Case study
      </p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900">
        Yue Sport (Husky Edition)
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-neutral-600">
        Research, IA, and the IMA heatmap prototype live on the full project page.
      </p>
      <Link
        href="/yuesport"
        className="mt-10 inline-flex min-w-[200px] items-center justify-center rounded-full bg-neutral-900 px-8 py-3 text-sm font-medium text-white shadow-md transition hover:bg-neutral-800"
      >
        Open case study
      </Link>
      <Link
        href="/"
        className="mt-6 text-sm text-neutral-500 underline-offset-4 hover:text-neutral-800 hover:underline"
      >
        Back to portfolio
      </Link>
    </div>
  );
}
