import { Request, Response } from "express";

import { parkService } from "./park.service.js";


interface UpdateParkParams {
  id: string;
}
export class ParkController {
  createPark = async (
    req: Request,
    res: Response
  ) => {

    const park = await parkService.createPark(
      req.body,
      req.user.id
    );

    return res.status(201).json({
      success: true,
      message: "Park created successfully.",
      data: park,
    });
  };
  updatePark = async (
  req: Request,
  res: Response
) => {

  const park =
    await parkService.updatePark(
      req.params.id,
      req.body
    );

  return res.status(200).json({
    success: true,
    message: "Park updated successfully.",
    data: park,
  });
};
}

export const parkController = new ParkController();