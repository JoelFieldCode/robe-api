import pool from "../../database/pool";
import Category from "../../models/Category";

export const getUserCategories = async (
  userId: string
): Promise<Category[]> => {
  const categories = await pool.query(
    `SELECT * from categories WHERE user_id = $1
    `,
    [userId]
  );
  return categories.rows;
};
