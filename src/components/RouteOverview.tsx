import { getTranslations } from "next-intl/server";
import type { TourFacts } from "@/lib/tour-matching";
import { Arrow } from "./Icon";
import s from "./Journey.module.css";
export default async function RouteOverview({
  stops,
}: {
  stops: NonNullable<TourFacts["stops"]>;
}) {
  const t = await getTranslations();
  const minLng = Math.min(...stops.map((p) => p.lng)),
    maxLng = Math.max(...stops.map((p) => p.lng));
  const minLat = Math.min(...stops.map((p) => p.lat)),
    maxLat = Math.max(...stops.map((p) => p.lat));
  const scale = Math.min(
    520 / (maxLng - minLng || 1),
    165 / (maxLat - minLat || 1),
  );
  const points = stops.map((p) => ({
    x: 320 + (p.lng - (minLng + maxLng) / 2) * scale,
    y: 125 - (p.lat - (minLat + maxLat) / 2) * scale,
  }));
  const markers: { x: number; y: number }[] = [];
  points.forEach((point) => {
    const candidate = [
      [0, 0],
      [36, 0],
      [-36, 0],
      [0, 36],
      [0, -36],
      [36, 36],
      [-36, -36],
    ]
      .map(([x, y]) => ({
        x: Math.max(25, Math.min(615, point.x + x)),
        y: Math.max(25, Math.min(225, point.y + y)),
      }))
      .find((candidate) =>
        markers.every(
          (other) =>
            Math.hypot(candidate.x - other.x, candidate.y - other.y) > 34,
        ),
      );
    markers.push(candidate || point);
  });
  const params = new URLSearchParams({
    api: "1",
    origin: `${stops[0].lat},${stops[0].lng}`,
    destination: `${stops.at(-1)!.lat},${stops.at(-1)!.lng}`,
  });
  if (stops.length > 2)
    params.set(
      "waypoints",
      stops
        .slice(1, -1)
        .map((p) => `${p.lat},${p.lng}`)
        .join("|"),
    );
  return (
    <>
      <div className={s.route}>
        <svg
          viewBox="0 0 640 250"
          role="img"
          aria-label={stops.map((p, i) => `${i + 1}. ${p.name}`).join("; ")}
        >
          <defs>
            <pattern
              id="route-grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M40 0H0V40"
                fill="none"
                stroke="#d8ddce"
                strokeWidth=".6"
              />
            </pattern>
          </defs>
          <rect width="640" height="250" fill="url(#route-grid)" />
          <polyline
            points={points.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke="#8c9f90"
            strokeWidth="2"
            strokeDasharray="4 6"
          />
          {points.map((p, i) => (
            <g key={i}>
              <path
                d={`M${p.x} ${p.y}L${markers[i].x} ${markers[i].y}`}
                stroke="#536b5e"
              />
              <circle cx={p.x} cy={p.y} r="3" fill="#536b5e" />
              <circle
                cx={markers[i].x}
                cy={markers[i].y}
                r="17"
                fill="#1b3038"
                stroke="#f4f3eb"
                strokeWidth="4"
              />
              <text
                x={markers[i].x}
                y={markers[i].y + 4}
                textAnchor="middle"
                fill="white"
                fontSize="12"
                fontFamily="sans-serif"
              >
                {i + 1}
              </text>
            </g>
          ))}
          <path
            d="M600 48V22m-6 7 6-7 6 7"
            stroke="#536b5e"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
        <ol>
          {stops.map((stop) => (
            <li key={stop.name}>{stop.name}</li>
          ))}
        </ol>
        <a
          href={`https://www.google.com/maps/dir/?${params}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("tripMap")}
          <Arrow diagonal />
        </a>
      </div>
      <p className={s.mapNote}>{t("tripMapNote")}</p>
    </>
  );
}
