import Link from 'next/link'

export default function AdminIndexPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-16">
      <div className="glass-dark rounded-3xl border border-cyan-500/20 p-10 max-w-xl w-full text-center">
        <h1 className="text-3xl font-bold gradient-cyan-green mb-4">Admin Console</h1>
        <p className="text-gray-400 mb-6">
          Welcome to the Tech Hub BBS admin panel. Please login to manage sponsors, certificates, settings, and more.
        </p>
        <Link
          href="/admin/login"
          className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-7 py-3 text-sm font-semibold text-black transition hover:bg-cyan-400"
        >
          Go to Login
        </Link>
        <div className="mt-8 text-left text-gray-400">
          <h2 className="text-lg font-semibold text-white mb-3">Quick Access</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <strong>Login:</strong> <span className="text-cyan-300">/admin/login</span>
            </li>
            <li>
              <strong>Settings:</strong> <span className="text-cyan-300">/admin/settings</span>
            </li>
            <li>
              <strong>Sponsors:</strong> <span className="text-cyan-300">/admin/sponsors</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
