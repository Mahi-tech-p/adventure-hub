import { Request, Response } from "express";

import { CreateActivitySlotDto } from "./activity-slot.dto.js";
import { activitySlotService } from "./activity-slot.service.js";

export class ActivitySlotController {

  createSlot = async (
    req: Request,
    res: Response
  ) => {

    const slot = await activitySlotService.createSlot(
      req.body as CreateActivitySlotDto
    );

    return res.status(201).json({
      success: true,
      message: "Activity slot created successfully.",
      data: slot,
    });
  };

}

export const activitySlotController =
  new ActivitySlotController();