import { Suspense } from 'react';
import Pagination from './Pagination';
import Link from 'next/link';
import { LIST_ROUTER } from '../lib/constants/common';
import { requestGetHotels } from '../lib/services/hotels';
import { Card } from './ui/card';

interface HotelListProps {
  searchParams: { [key: string]: string | string[] | undefined; page?: string };
}

const HotelList: React.FC<HotelListProps> = async ({ searchParams }) => {
  const { limit = '10', page = '1', query } = searchParams;
  const offset = Number(limit) * (Number(page) - 1);
  const hotelsRes: FetchListResult<Hotel[]> = await requestGetHotels({
    offset,
    limit,
    query
  });

  const {
    items: hotels,
    pagination: { total }
  } = hotelsRes.data;

  const params = new URLSearchParams();
  page && params.set('page', page);

  const totalPages = Math.ceil(total / Number(limit));

  return (
    <>
      {hotels.length > 0 ? (
        <div className="container mx-auto px-4 pb-8">
          <h1 className="mb-6 text-3xl font-bold">Hotel Infomation</h1>

          <div className="mb-6 overflow-x-auto scrollbar-hide">
            <table className="min-w-full border border-gray-200 bg-white">
              <thead>
                <tr>
                  <th className="min-w-48 border-b border-gray-200 bg-gray-100 p-4">
                    Vietnamese Name
                  </th>
                  <th className="min-w-48 border-b border-gray-200 bg-gray-100 p-4">
                    English Name
                  </th>
                  <th className="min-w-48 border-b border-gray-200 bg-gray-100 p-4">
                    Address
                  </th>
                  <th className="min-w-48 border-b border-gray-200 bg-gray-100 p-4">
                    Contact
                  </th>
                  <th className="min-w-48 whitespace-nowrap border-b border-gray-200 bg-gray-100 p-4">
                    Phone
                  </th>
                  <th className="min-w-48 border-b border-gray-200 bg-gray-100 p-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {hotels.map((hotel) => (
                  <tr key={hotel._id}>
                    <td className="border-b border-gray-200 px-4 py-2">
                      {hotel.vietnamese_name}
                    </td>
                    <td className="border-b border-gray-200 px-4 py-2">
                      {hotel.english_name}
                    </td>
                    <td className="border-b border-gray-200 px-4 py-2">
                      {hotel.address}, {hotel.province}, {hotel.country}
                    </td>
                    <td className="border-b border-gray-200 px-4 py-2">
                      {hotel.contact}
                    </td>
                    <td className="whitespace-nowrap border-b border-gray-200 px-4 py-2">
                      {hotel.phone}
                    </td>
                    <td className="border-b border-gray-200 px-4 py-2 text-center">
                      <Link
                        href={`${LIST_ROUTER.HOTEL}?${params.toString()}&_id=${hotel._id}#${hotel._id}`}
                        className="hover:text-primary-foreground text-primary-foreground rounded bg-primary px-4 py-2 text-white hover:bg-primary/90"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between">
            <Card className="p-2">
              <p className="text-primary">
                Showing {hotels.length} of {total} entries
              </p>
            </Card>

            {hotels.length > 0 && (
              <Suspense>
                <Pagination totalPages={totalPages} />
              </Suspense>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <Card className="max-w-xl rounded-lg p-8 shadow-lg">
            <h2 className="mb-4 text-2xl font-bold text-primary">
              No Hotels Found
            </h2>
            <p className="mb-6 text-gray-600">
              We couldn&apos;t find any hotels that match your search criteria.
              Please try adjusting your search filters or check back later for
              updated availability.
            </p>
          </Card>
        </div>
      )}
    </>
  );
};

export default HotelList;
