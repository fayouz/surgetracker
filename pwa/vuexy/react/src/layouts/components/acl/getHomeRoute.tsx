/**
 *  Set Home URL based on User Roles
 */
const getHomeRoute = (roles: string[]) => {
  if (roles.includes('USER_ROLE')) return '/acl'
  else return '/dashboards/analytics'
}

export default getHomeRoute
