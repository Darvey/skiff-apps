// List of routes that are allowed when not authenticated
export const ALLOWED_UNAUTHENTICATED_ROUTES = new Set(['/', '/signup']);

export const PROD_BASE_URL = 'https://app.skiff.com';

export enum EditorAppRoutes {
  HOME = '/',
  SIGNUP = '/signup',
  LOGIN = '/login'
}

export enum QueryParam {
  REFERRAL = 'referral',
  MAIL = 'mail'
}

export enum AppRoutes {
  HOME = '/',
  MAIL = '/mail',
  INBOX = '/inbox',
  SEARCH = '/search',
  LABEL = '/label'
}
