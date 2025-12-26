export { default } from 'next-auth/middleware'

export const config = {
  matcher: ['/links/:path*', '/collections/:path*', '/tags/:path*']
}
