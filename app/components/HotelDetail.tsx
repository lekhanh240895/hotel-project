import {
  requestGetHotelDetail,
  requestGetHotels
} from '../lib/services/hotels';
import { Card } from './ui/card';
import SelectHotel from './SelectHotel';
import { format } from 'date-fns';
import MoreRoomRates from './MoreRoomRates';

interface Props {
  searchParams: { [key: string]: string | string[] | undefined; _id: string };
}

const HotelDetail: React.FC<Props> = async ({ searchParams }) => {
  const { limit = '10', page = '1', query, _id } = searchParams;
  const offset = Number(limit) * (Number(page) - 1);

  if (!_id) return;

  const hotelsRes: FetchListResult<Hotel[]> = await requestGetHotels({
    offset,
    limit,
    query
  });

  const { items: hotels } = hotelsRes.data;

  const hotelRes: FetchResult<Hotel> = await requestGetHotelDetail(_id);
  const hotel = hotelRes.data;

  return (
    <div id={`#${hotel._id}}`} className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Hotel Details</h1>

      <div className="mx-auto">
        <SelectHotel items={hotels} current={hotel} />

        <Card className="mb-6 p-6">
          <h3 className="mb-4 text-xl font-bold">Contact</h3>
          <p className="text-lg">
            <strong>{hotel.country}: </strong> {hotel.phone}, {hotel.contact}
          </p>
        </Card>

        {hotel.offers.length > 0 && (
          <Card className="mb-6 p-6">
            <h3 className="mb-4 text-xl font-bold">Offers</h3>
            <ul className="list-inside list-disc">
              {hotel.offers.map((offer, index) => (
                <li key={index} className="text-lg">
                  {offer}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {hotel.terms_and_conditions.length > 0 && (
          <Card className="mb-6 p-6">
            <h3 className="mb-4 text-xl font-bold">Terms and Conditions</h3>
            <ul className="list-inside list-disc">
              {hotel.terms_and_conditions.map((term, index) => (
                <li key={index} className="text-lg">
                  {term}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {hotel.room_rate.length > 0 && (
          <Card className="overflow-x-auto p-6 scrollbar-hide">
            <h3 className="mb-4 text-xl font-bold">Room Rates</h3>

            <table className="min-w-full border-t border-gray-200 bg-white">
              <thead>
                <tr>
                  <th className="min-w-48 border-b border-gray-200 bg-gray-100 p-4">
                    Room Type
                  </th>
                  <th className="min-w-36 border-b border-gray-200 bg-gray-100 p-4">
                    Price
                  </th>
                  <th className="min-w-36 border-b border-gray-200 bg-gray-100 p-4">
                    Price Type
                  </th>
                  <th className="min-w-36 border-b border-gray-200 bg-gray-100 p-4">
                    Start Date
                  </th>
                  <th className="min-w-36 border-b border-gray-200 bg-gray-100 p-4">
                    End Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {hotel.room_rate.slice(0, 10).map((room, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="border-b border-gray-200 px-4 py-2">
                      {room.room_type}
                    </td>
                    <td className="border-b border-gray-200 px-4 py-2 text-center">
                      {room.price.toLocaleString()} {hotel.currency}
                    </td>
                    <td className="border-b border-gray-200 px-4 py-2 text-center">
                      {room.price_type}
                    </td>
                    <td className="border-b border-gray-200 px-4 py-2 text-center">
                      {format(room.period.start_date, 'yyyy-MM-dd')}
                    </td>
                    <td className="border-b border-gray-200 px-4 py-2 text-center">
                      {format(room.period.end_date, 'yyyy-MM-dd')}
                    </td>
                  </tr>
                ))}

                <MoreRoomRates
                  items={hotel.room_rate}
                  currency={hotel.currency}
                  limit={10}
                />
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HotelDetail;
