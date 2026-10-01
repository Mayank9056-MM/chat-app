import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://chat-app-e478-psha64o3j-mayank9056-mms-projects.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/sign-in"],
        disallow: ["/api/", "/chat/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
