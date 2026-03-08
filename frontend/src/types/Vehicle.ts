export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year?: number | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVehicleDto {
  make: string;
  model: string;
  year?: number;
  userId: string;
}
