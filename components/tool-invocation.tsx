"use client";

import React from "react";
import { View } from "react-native";
import type { ToolInvocation as ToolInvocationType } from "ai";
import { MapCard, MapSkeleton } from "./map/map-card";
import { MoviesCard, MoviesSkeleton } from "./movies/movie-card";
import { WeatherCard } from "./weather";
import Skeleton from "./ui/Skeleton";

export function ToolInvocation({
  toolInvocation,
}: {
  toolInvocation: ToolInvocationType;
}) {
  const { toolName, state, args, result } = toolInvocation;

  // Show loading state
  if (state === "call" || state === "partial-call") {
    if (toolName === "get_points_of_interest") {
      return <MapSkeleton />;
    }
    if (toolName === "get_media") {
      return <MoviesSkeleton />;
    }
    if (toolName === "get_weather") {
      return <WeatherCard city={args?.city as string} />;
    }
    return (
      <View>
        <Skeleton />
      </View>
    );
  }

  // Show result
  if (state === "result" && result) {
    if (toolName === "get_points_of_interest") {
      return (
        <MapCard
          city={(result as any).city}
          data={(result as any).data}
        />
      );
    }
    if (toolName === "get_media") {
      return (
        <MoviesCard
          data={(result as any).data}
          title={(result as any).title}
        />
      );
    }
    if (toolName === "get_weather") {
      return (
        <WeatherCard
          city={(result as any).city}
          data={(result as any).data}
        />
      );
    }
  }

  // Error state
  if (state === "error") {
    return (
      <View>
        <Skeleton />
      </View>
    );
  }

  return null;
}

