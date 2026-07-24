import { GardenApp } from "@/components/garden-app";

export const metadata = {
  title: 'My Garden | Garden.io',
};

export default function MyGardenPage() {
  return <GardenApp view="property" />;
}
