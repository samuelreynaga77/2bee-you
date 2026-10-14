import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/join")({
  component: () => <Navigate to="/login" />,
});
