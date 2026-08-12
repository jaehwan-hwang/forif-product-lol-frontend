import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // 챔피언 초상화. 패치마다 버전 경로가 바뀌지만 CDN 자체는 안정적이고,
      // 160여 개를 리포에 넣을 수는 없으므로 원격 유지.
      {
        protocol: "https",
        hostname: "ddragon.leagueoflegends.com",
        pathname: "/cdn/**",
      },
    ],
  },
};

export default nextConfig;
