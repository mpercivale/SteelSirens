import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { detectBestLanguage, resolveLanguage } from '@/lib/i18n'

export function proxy(request: NextRequest) {
  const withSecurityHeaders = (response: NextResponse) => {
    response.headers.set('X-Frame-Options', 'ALLOWALL')
    response.headers.set('Content-Security-Policy', 'frame-ancestors *')
    return response
  }

  const { nextUrl } = request
  const pathname = nextUrl.pathname

  if (pathname.startsWith('/zoer_proxy')) {
    return withSecurityHeaders(NextResponse.next())
  }

  const requestedLang = nextUrl.searchParams.get('lang')
  const normalizedRequestedLang = requestedLang ? resolveLanguage(requestedLang) : null

  if (request.method === 'GET' || request.method === 'HEAD') {
    const shouldRedirectMissingLang = !requestedLang
    const shouldRedirectInvalidLang = Boolean(requestedLang && requestedLang !== normalizedRequestedLang)

    if (shouldRedirectMissingLang || shouldRedirectInvalidLang) {
      const targetUrl = nextUrl.clone()
      const detectedLang = shouldRedirectMissingLang
        ? detectBestLanguage({
            userLanguage: request.cookies.get('lang')?.value ?? null,
            acceptLanguage: request.headers.get('accept-language'),
            countryCode: request.headers.get('x-vercel-ip-country'),
          })
        : normalizedRequestedLang ?? 'en'

      targetUrl.searchParams.set('lang', detectedLang)

      const redirectResponse = withSecurityHeaders(NextResponse.redirect(targetUrl))
      redirectResponse.cookies.set('lang', detectedLang, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
        sameSite: 'lax',
      })
      return redirectResponse
    }
  }

  const response = NextResponse.next()

  if (requestedLang) {
    response.cookies.set('lang', normalizedRequestedLang ?? 'en', {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    })
  }
  
  return withSecurityHeaders(response)
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}