import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { getPlacesInfo } from "@/components/map/googleapis-maps";
import { getWeatherAsync } from "@/components/weather-data";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is required");
}

// Helper to get headers (for Expo Router)
async function getHeaders() {
  try {
    // In Expo Router, we can get headers from the request
    // For now, we'll use environment variables or defaults
    return {
      city: process.env.EXPO_IP_CITY || (__DEV__ ? "Austin" : "unknown"),
      country: process.env.EXPO_IP_COUNTRY || (__DEV__ ? "US" : "unknown"),
      region: process.env.EXPO_IP_REGION || (__DEV__ ? "TX" : "unknown"),
      platform: process.env.EXPO_OS || "unknown",
    };
  } catch {
    return {
      city: __DEV__ ? "Austin" : "unknown",
      country: __DEV__ ? "US" : "unknown",
      region: __DEV__ ? "TX" : "unknown",
      platform: "unknown",
    };
  }
}

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    const headers = await getHeaders();

    const tools: Record<string, any> = {};

    // The map feature is native only for now.
    if (process.env.EXPO_OS !== "web") {
      tools.get_points_of_interest = {
        description: "Get things to do for a point of interest or city",
        parameters: z
          .object({
            poi: z
              .string()
              .describe(
                'query to send to the Google Places API. e.g. "things to do in Amsterdam" or "casinos and hotels in Las Vegas"'
              ),
          })
          .required(),
        execute: async ({ poi }: { poi: string }) => {
          console.log("city", poi);
          const pointsOfInterest = await getPlacesInfo(poi);
          return {
            city: poi,
            data: pointsOfInterest,
          };
        },
      };
    }

    const result = streamText({
      model: openai("gpt-4o-mini-2024-07-18"),
      system: `\
You are a helpful chatbot assistant. You can provide weather info and movie recommendations. 
You have the following tools available:
- get_media: Lists or search movies and TV shows from TMDB.
- get_weather: Gets the weather for a city.

User info:
- city: ${headers.city}
- country: ${headers.country}
- region: ${headers.region}
- device platform: ${headers.platform}
`,
      messages,
      tools: {
        ...tools,
        get_media: {
          description: "List movies or TV shows today or this week from TMDB",
          parameters: z
            .object({
              time_window: z
                .enum(["day", "week"])
                .describe("time window to search for")
                .default("day"),
              media_type: z
                .enum(["tv", "movie"])
                .describe("type of media to search for")
                .default("movie"),
              generated_description: z
                .string()
                .describe("AI-generated description of the tool call"),
              query: z
                .string()
                .describe(
                  "The query to use for searching movies or TV shows. Set to undefined if looking for trending, new, or popular media."
                )
                .optional(),
            })
            .required(),
          execute: async ({
            generated_description,
            time_window,
            media_type,
            query,
          }: {
            generated_description: string;
            time_window: "day" | "week";
            media_type: "tv" | "movie";
            query?: string;
          }) => {
            let url: string;
            if (query) {
              url = `https://api.themoviedb.org/3/search/${media_type}?api_key=${
                process.env.TMDB_API_KEY
              }&query=${encodeURIComponent(query)}`;
            } else {
              url = `https://api.themoviedb.org/3/trending/${media_type}/${time_window}?api_key=${process.env.TMDB_API_KEY}`;
            }

            const response = await fetch(url);
            if (!response.ok) {
              throw new Error("Failed to fetch trending movies");
            }
            const data = await response.json();
            const movies = data.results.map((media: any) => {
              if (!media.media_type) {
                media.media_type = media_type;
              }
              return media;
            });
            return {
              data: movies,
              title: generated_description,
            };
          },
        },
        get_weather: {
          description: "Get the current weather for a city",
          parameters: z
            .object({
              city: z.string().describe("the city to get the weather for"),
            })
            .required(),
          execute: async ({ city }: { city: string }) => {
            const weatherInfo = await getWeatherAsync(city);
            console.log("weatherInfo", JSON.stringify(weatherInfo));
            return {
              city,
              data: weatherInfo,
            };
          },
        },
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

