import { hierarchy } from "d3-hierarchy";

export const JSONToHierarchy = (data) => {

    return hierarchy(data);
};