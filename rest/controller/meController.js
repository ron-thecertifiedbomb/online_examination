
import { getData } from "../../common/services/meService.js";

export const meData = async (req, res) => {
  try {
    const data = await getData();
    res.status(200).json(data);
  } catch (err) {
    console.error("❌ Error fetching data:", err);
    res.status(500).json({ message: "Server error fetching data" });
  }
};