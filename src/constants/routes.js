export const ROUTES = {
  home: '/',
  login: '/login',
  signup: '/signup',
  dashboard: '/dashboard',
  team: '/teams/:teamId',
  project: '/projects/:projectId',
  kanban: '/projects/:projectId/kanban',
}

export const routePaths = {
  login: () => ROUTES.login,
  signup: () => ROUTES.signup,
  dashboard: () => ROUTES.dashboard,
  team: (teamId) => `/teams/${teamId}`,
  project: (projectId) => `/projects/${projectId}`,
  kanban: (projectId) => `/projects/${projectId}/kanban`,
}
