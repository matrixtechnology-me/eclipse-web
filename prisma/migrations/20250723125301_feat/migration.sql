-- DropFunction
DROP FUNCTION IF EXISTS get_available_qty(UUID);

-- CreateFunction
CREATE FUNCTION get_available_qty(product_input_id UUID)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  stock_qty integer;
  result integer;
BEGIN
  -- Normal Product
  SELECT available_qty
  INTO stock_qty
  FROM "stocks"
  WHERE stocks.product_id = product_input_id;

  -- Return available quantity on its Stock
  IF stock_qty IS NOT NULL THEN
    RETURN stock_qty;
  END IF;

  -- Composite Products, checks for childs
  SELECT MIN(possible_units)
  INTO result
  FROM (
    SELECT 
      FLOOR(get_available_qty(pcm.child_id) / pcm.total_qty) AS possible_units
    FROM product_compositions pcm
    WHERE pcm.parent_id = product_input_id
  ) AS child_results;

  RETURN result;
END;
$$;