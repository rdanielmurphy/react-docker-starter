import getDummyData from '../dummyData';
/**
 * Get all Data
 * @param req
 * @param res
 * @returns void
 */
export function getData(req, res) {
    return res.json(getDummyData());
}
