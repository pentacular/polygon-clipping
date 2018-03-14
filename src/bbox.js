const { flpEQ, flpLT, flpLTE } = require('./flp')

/**
 * A bounding box has the format:
 *
 *  [ [ xmin, ymin ] , [ xmax, ymax ] ]
 *
 */

const isInBbox = (bbox, point) => {
  const xmin = bbox[0][0]
  const ymin = bbox[0][1]
  const xmax = bbox[1][0]
  const ymax = bbox[1][1]
  const xpt = point[0]
  const ypt = point[1]
  return (
    flpLTE(xmin, xpt) &&
    flpLTE(xpt, xmax) &&
    flpLTE(ymin, ypt) &&
    flpLTE(ypt, ymax)
  )
}

const doBboxesOverlap = (b1, b2) =>
  !(
    flpLT(b2[1][0], b1[0][0]) ||
    flpLT(b1[1][0], b2[0][0]) ||
    flpLT(b2[1][1], b1[0][1]) ||
    flpLT(b1[1][1], b2[0][1])
  )

/* Returns either null, or a bbox (aka an ordered pair of points)
 * If there is only one point of overlap, a bbox with identical points
 * will be returned */
const getBboxOverlap = (b1, b2) => {
  if (!doBboxesOverlap(b1, b2)) return null

  // find the middle two X values
  const lowerX = b1[0][0] < b2[0][0] ? b2[0][0] : b1[0][0]
  const upperX = b1[1][0] < b2[1][0] ? b1[1][0] : b2[1][0]

  // find the middle two Y values
  const lowerY = b1[0][1] < b2[0][1] ? b2[0][1] : b1[0][1]
  const upperY = b1[1][1] < b2[1][1] ? b1[1][1] : b2[1][1]

  // put those middle values together to get the overlap
  return [[lowerX, lowerY], [upperX, upperY]]
}

/* Returns a list of unique corners.
 * Will contain one, two or four points */
const getUniqueCorners = bbox => {
  const xmin = bbox[0][0]
  const ymin = bbox[0][1]
  const xmax = bbox[1][0]
  const ymax = bbox[1][1]
  if (flpEQ(xmin, xmax) && flpEQ(ymin, ymax)) return [[xmin, ymin]]
  if (flpEQ(xmin, xmax)) return [[xmin, ymin], [xmin, ymax]]
  if (flpEQ(ymin, ymax)) return [[xmin, ymin], [xmax, ymin]]
  return [[xmin, ymin], [xmin, ymax], [xmax, ymin], [xmax, ymax]]
}

module.exports = {
  doBboxesOverlap,
  getBboxOverlap,
  getUniqueCorners,
  isInBbox
}
