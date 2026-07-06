import { MOCK_TEAMS } from './mockTeams'

export const MOCK_TEAM_DETAILS = {
  1: {
    ...MOCK_TEAMS[0],
    members: [
      { userId: 1, name: '김민수', email: 'minsu@flowmate.dev', teamRole: 'OWNER', joinedAt: '2025-01-10T09:00:00' },
      { userId: 2, name: '이서연', email: 'seoyeon@flowmate.dev', teamRole: 'MEMBER', joinedAt: '2025-02-01T09:00:00' },
      { userId: 3, name: '박준호', email: 'junho@flowmate.dev', teamRole: 'MEMBER', joinedAt: '2025-02-15T09:00:00' },
    ],
    projects: [
      { id: 1, name: 'Flowmate MVP', status: 'in_progress', progress: 42 },
      { id: 2, name: '온보딩 개선', status: 'planning', progress: 0 },
    ],
  },
  2: {
    ...MOCK_TEAMS[1],
    members: [
      { userId: 4, name: '최유진', email: 'yujin@flowmate.dev', teamRole: 'OWNER', joinedAt: '2025-01-05T09:00:00' },
      { userId: 5, name: '정하늘', email: 'haneul@flowmate.dev', teamRole: 'MEMBER', joinedAt: '2025-01-20T09:00:00' },
    ],
    projects: [
      { id: 3, name: '디자인 시스템 v2', status: 'in_progress', progress: 68 },
    ],
  },
  3: {
    ...MOCK_TEAMS[2],
    members: [
      { userId: 6, name: '한지훈', email: 'jihoon@flowmate.dev', teamRole: 'OWNER', joinedAt: '2025-01-08T09:00:00' },
      { userId: 7, name: '오수빈', email: 'subin@flowmate.dev', teamRole: 'MEMBER', joinedAt: '2025-03-01T09:00:00' },
    ],
    projects: [
      { id: 4, name: 'API Gateway', status: 'in_progress', progress: 25 },
    ],
  },
}

export function getMockTeamDetail(teamId) {
  return MOCK_TEAM_DETAILS[Number(teamId)] ?? null
}
