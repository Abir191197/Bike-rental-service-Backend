export default interface TBike {
  fullbike_name: string; // Renamed from 'name'
  PerHour: number; // Renamed from 'pricePerHour' and changed to number
  isAvailable?: boolean; // Optional, default is true
  isDelete: boolean; // Renamed from 'isDeleted', default is false
  imgSrc: string[]; // Renamed from 'imageLinks', default is empty array
  make: string;
  model: string;
  year: string; // Changed to string
  type: string;
  engine: {
    type: string;
    displacement: string;
    power: string;
  };
  brakes: {
    front_brakes: string;
    rear_brakes: string;
  };
  fuel_and_lubrication: {
    fuel_capacity: string;
  };
  additional_features: {
    gearbox: string;
    transmission: string;
    clutch: string;
    frame: string;
    cooling: string;
    starter: string;
    electronic_aids: string;
  };
  weight: string; // Changed to string
}
