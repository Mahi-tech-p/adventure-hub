import { Request, Response } from "express";

import { CreateActivityDto, GetActivitiesQueryDto } from "./activity.dto.js";
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

  getActivities = async (
  req: Request<
    {},
    {},
    {},
    GetActivitiesQueryDto
  >,
  res: Response
) => {

  const result =
    await activityService.getActvities(
      req.query
    );

  return res.status(200).json({
    success: true,
    message:
      "Activities fetched successfully.",
    ...result,
  });
};

}

export const activityController = new ActivityController();