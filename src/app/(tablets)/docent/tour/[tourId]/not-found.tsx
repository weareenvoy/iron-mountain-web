import Link from 'next/link';

const TourNotFound = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6 text-center">
      <h2 className="text-2xl font-semibold">Tour not found</h2>
      <p className="text-primary-im-dark-blue">The tour you’re looking for doesn’t exist or is no longer available.</p>
      <Link className="text-blue-600 underline" href="/docent/schedule">
        Back to schedule
      </Link>
    </div>
  );
};

export default TourNotFound;
