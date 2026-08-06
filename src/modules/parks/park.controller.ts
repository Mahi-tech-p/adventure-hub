import { Request, Response } from "express";

import { parkService } from "./park.service.js";
import { GetParkQueryDto } from "./park.dto.js";

interface UpdateParkParams {
  id: string;
}
export class ParkController {
  createPark = async (req: Request, res: Response) => {
    const park = await parkService.createPark(req.body, req.user.id);

    return res.status(201).json({
      success: true,
      message: "Park created successfully.",
      data: park,
    });
  };
  updatePark = async (req: Request, res: Response) => {
    const park = await parkService.updatePark(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Park updated successfully.",
      data: park,
    });
  };

  getparks =async (req :Request<{},{},{},GetParkQueryDto>, res: Response) =>{

    const parks = await parkService.getPark(req.query)

    return res.status(200).json({
      success :  true,
      message: "Parks fetched successfully",
      ...parks
    })

  }
}

export const parkController = new ParkController();
