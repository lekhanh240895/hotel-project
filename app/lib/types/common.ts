interface Base {
  createdAt: string;
  _id: string;
  updatedAt: string;
}

interface User extends Base {
  name: string;
  image: string;
  email: string;
  username: string;
  role: string;
}

interface AvailableToken extends Base {
  user_id: string;
  refresh_token: string;
}

interface RegisterToken extends Base {
  user_id: string;
  register_token: string;
}

interface ResetPasswordToken extends Base {
  user_id: string;
  reset_password_token: string;
}

interface IPlace {
  id: string;
  type: string;
  place_type: string[];
  relevance: number;
  properties: {
    mapbox_id: string;
    wikidata: string;
  };
  text: string;
  place_name: string;
  bbox: number[];
  center: number[];
  geometry: {
    type: string;
    coordinates: number[];
  };
  context: Array<{
    id: string;
    mapbox_id: string;
    wikidata: string;
    short_code: string;
    text: string;
  }>;
}

interface ILocation {
  text: string;
  place_name: string;
  center: number[];
  geometry: {
    type: string;
    coordinates: number[];
  };
  id: string;
  place_type: string[];
}
