import type {
  SummitFuturescaping,
  SummitKioskAmbient,
  SummitMapLocations,
  SummitPossibility,
} from '@/app/(displays)/summit/_types';
import type { SummitTourSummary, ToursApiResponse } from '@/lib/internal/types';

// 1 type defined here for solutions. This is not a direct JSON mapping
export type SolutionItem = { readonly locations: SummitMapLocations; readonly title: string };

// Render functions
export const renderFuturescaping = (item: SummitFuturescaping) => <p>{item.body}</p>;

export const renderPossibility = (item: SummitPossibility) => (
  <>
    <p>{item.body1}</p>
    <p className="mt-2">{item.body2}</p>
    <p className="mt-2">{item.body3}</p>
  </>
);

export const renderSolution = (item: SolutionItem) => {
  const locations = item.locations;
  return (
    <>
      <p className="font-bold">{locations.mapLocation1.title}</p>
      <p> {locations.mapLocation1.body}</p>
      <p className="mt-2 font-bold">{locations.mapLocation2.title}</p>
      <p className="mt-2"> {locations.mapLocation2.body}</p>
      <p className="mt-2 font-bold"> {locations.mapLocation3.title}</p>
      <p className="mt-2"> {locations.mapLocation3.body}</p>
    </>
  );
};

export const renderStory = (item: SummitKioskAmbient) => (
  <>
    {item.headline && <p className="font-semibold">{item.headline}</p>}
    {item.body && <p className="mt-2">{item.body}</p>}
    {item.attribution && <p className="mt-2 italic">{item.attribution}</p>}
  </>
);

// Transforms ToursApiResponse to SummitTourSummary format
export const transformToSummitTours = (toursResponse: ToursApiResponse): readonly SummitTourSummary[] => {
  return toursResponse.tours.map(tour => ({
    date: tour.date, // Keep original ISO datetime string
    id: String(tour.id), // Convert number to string
    name: tour.name,
  }));
};
