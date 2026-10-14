import type { HomeData } from "./homeTypes";

export const emptyHome: HomeData = {
  stats: { activeJobs: 0, companies: 0, todayJobs: 0, members: 0 },
  urgentJobs: [],
  recentJobs: [],
  categories: [],
  posts: [],
};

/**
 * 홈 요약 API 응답을 가져옵니다.
 * 실제 데이터가 없을 때 샘플 데이터를 만들어 보여주지 않습니다.
 * 백엔드에 GET /api/home 엔드포인트가 구현되어 있어야 합니다.
 */
export async function fetchHomeData(): Promise<HomeData> {
  const response = await fetch("/api/home", { credentials: "include" });
  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null && "message" in data
        ? String((data as { message: unknown }).message)
        : `홈 데이터를 불러오지 못했습니다. (${response.status})`;
    throw new Error(message);
  }

  return data as HomeData;
}
