import { mongooseConnect } from '@/app/lib/mongoose';
import Hotel from '@/app/lib/models/Hotel';
import { ApiError, handleError } from '@/app/lib/exceptions';
import { generateConditions } from '@/app/lib/utils/common';

export async function GET(req: Request) {
  await mongooseConnect();

  const { searchParams } = new URL(req.url);
  const limit = searchParams.get('limit') || 10;
  const offset = searchParams.get('offset') || 0;
  const queryObject = Object.fromEntries(searchParams.entries());
  const conditions = generateConditions(queryObject);

  try {
    if (conditions.length > 0) {
      const totalHotels = await Hotel.find({ $or: conditions });

      const hotels = await Hotel.find({
        $or: conditions
      })
        .limit(Number(limit))
        .skip(Number(offset));

      return Response.json({
        status_code: 200,
        message: 'Success',
        data: {
          items: hotels,
          pagination: {
            total: totalHotels.length,
            limit,
            offset
          },
          link: {
            self: '',
            next: '',
            last: ''
          }
        }
      });
    }
    const totalHotels = await Hotel.find({});

    const hotels = await Hotel.find({})
      .limit(Number(limit))
      .skip(Number(offset));
    return Response.json({
      status_code: 200,
      message: 'Success',
      data: {
        items: hotels,
        pagination: {
          total: totalHotels.length,
          limit,
          offset
        },
        link: {
          self: '',
          next: '',
          last: ''
        }
      }
    });
  } catch (e) {
    const error = ApiError.fromNoutfound();
    return handleError(error, 404);
  }
}