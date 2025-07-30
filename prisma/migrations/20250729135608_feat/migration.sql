DROP FUNCTION IF EXISTS decrease_stock(UUID, integer);

CREATE FUNCTION decrease_stock(product_input_id UUID, dec_qty integer)
RETURNS lot_decrement[] -- type declared in the previous migration
AS $$
DECLARE 
  -- Single Product handling
  stock_id UUID default NULL;
  -- Composition handling
  decrements lot_decrement[] := '{}';
  child RECORD;
  found_any BOOLEAN := false;
BEGIN
  SELECT id
  INTO stock_id
  FROM "stocks"
  WHERE product_id = product_input_id
  FOR UPDATE;

  -- Single Product: has Stock.
  IF stock_id IS NOT NULL THEN
    UPDATE "stocks"
    SET 
      available_qty = available_qty - dec_qty,
      total_qty = total_qty - dec_qty
    WHERE id = stock_id;

    -- function declared in the previous migration
    RETURN decrease_lots(stock_id, dec_qty); 
  END IF;
  
  -- Composition Product: has Childs.
  FOR child IN
    SELECT pcm.child_id as id, pcm.total_qty as used_qty
    FROM "product_compositions" pcm
    WHERE parent_id = product_input_id
  LOOP
    found_any := true;

    decrements := array_cat(
      decrements,
      decrease_stock(child.id, (dec_qty * child.used_qty)::INTEGER)
    );
  END LOOP;

  -- A Composition must have at least one Child.
  IF NOT found_any THEN
    RAISE EXCEPTION 'Product % has no Childs.', product_input_id;
  END IF;

  RETURN decrements;
END;
$$ LANGUAGE plpgsql;
