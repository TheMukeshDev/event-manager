/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      // Redirect /admin to /admin/dashboard if session exists (middleware logic)
      {
        source: '/admin',
        has: [{ type: 'cookie', key: 'admin_session' }],
        destination: '/admin/dashboard',
      },
      {
        source: '/admin',
        destination: '/admin/login',
      },
      // Redirect from login to dashboard if session exists
      {
        source: '/admin/login',
        has: [{ type: 'cookie', key: 'admin_session' }],
        destination: '/admin/dashboard',
      },
      // Protect admin routes: redirect to login if no session
      {
        source: '/admin/:path*',
        missing: [{ type: 'cookie', key: 'admin_session' }],
        destination: '/admin/login',
      },
      // Pass through if session exists
      {
        source: '/admin/:path*',
        has: [{ type: 'cookie', key: 'admin_session' }],
        destination: '/admin/:path*',
      },
    ]
  },
}

export default nextConfig
