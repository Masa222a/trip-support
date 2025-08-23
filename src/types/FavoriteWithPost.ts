export interface FavoriteWithPost {
  memo: string;
  Post: {
    id: number;
    departure_point: string;
    flight_time: string;
    departure_at: string;
    arrival_at: string;
    arrival_point: string;
    base_price: string;
    logo_url: string;
    tax_price: string;
    total_price: string;
  }
}