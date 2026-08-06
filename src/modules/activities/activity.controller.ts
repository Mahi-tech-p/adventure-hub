import { Request, Response } from "express";

import { CreateActivityDto } from "./activity.dto.js";
import { activityService } from "./activity.service.js";

export class ActivityController {

  // Create Activity
  createActivity = async (
    req: Request<{}, {}, CreateActivityDto>,
    res: Response
  ) => {

    const activity = await activityService.createActivity(
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Activity created successfully.",
      data: activity,
    });
  };

}

export const activityController = new ActivityController();