import pool from "../../database/pool";
import Category from "../../models/Category";

export const getUserCategories = async (
  userId: string
): Promise<Category[]> => {
  const categories = await pool.query<Category>(
    `SELECT c.id, c.image_url, c.name, COUNT(DISTINCT i) AS item_count FROM categories c FULL JOIN items i ON i.category_id = c.id WHERE c.user_id = $1 GROUP BY c.id ORDER BY item_count DESC
    `,
    [userId]
  );
  return categories.rows.map((category) => ({
    ...category,
    item_count: Number(category.item_count),
  }));
};
