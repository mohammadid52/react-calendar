import { map, omit } from "lodash";
import network from "../../lib/network";

export const loadDataFromServer = (latestKey) => async (dispatch) => {
  const data = await network.post("data");
  const miqaatsWithHtml2 = data.miqaatDayList;
  const miqaatsWithHtmlCopy = miqaatsWithHtml2;
  const miqaatsWithoutHtml = map(miqaatsWithHtmlCopy, (item) =>
    omit(item, [
      "_id",
      "important",
      "miqaatType",
      "monthNight",
      "phase",
      "priority",
      "startNight",
      "location",
      "html",
      "blogLink",
    ])
  );
  const modifiedData = { ...data, miqaatsWithoutHtml };

  return modifiedData;
};
