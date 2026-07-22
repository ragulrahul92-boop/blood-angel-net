import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LifeLink – Emergency Blood Donor Network" },
      { name: "description", content: "LifeLink connects verified blood donors with patients during emergencies. Find donors, request blood, and save lives." },
      { property: "og:title", content: "LifeLink – Emergency Blood Donor Network" },
      { property: "og:description", content: "Every drop saves a life. Connect with verified donors instantly." },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    window.location.replace("/lifelink/index.html");
  }, []);
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FFF8F8", fontFamily: "system-ui" }}>
      <p>Loading LifeLink…</p>
    </div>
  );
}
