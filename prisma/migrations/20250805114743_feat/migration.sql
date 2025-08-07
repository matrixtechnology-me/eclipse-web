DROP TYPE IF EXISTS flat_composition_item;

CREATE TYPE flat_composition_item AS (
  product_id UUID,
  used_qty INTEGER
);

DROP FUNCTION IF EXISTS get_flat_composition(UUID);

CREATE FUNCTION get_flat_composition(product_input_id UUID)
RETURNS flat_composition_item[]
AS $$
DECLARE
  -- Normal Product variables
  stock_id UUID;
  -- Composite Product variables
  flats flat_composition_item[] := '{}';
  child RECORD;
  child_flat flat_composition_item;
  found_any BOOLEAN := false;
BEGIN
  SELECT id
  INTO stock_id
  FROM "stocks"
  WHERE product_id = product_input_id;

  -- Product has Stock.
  IF stock_id IS NOT NULL THEN
    flats := array_append(
      flats, 
      ROW(product_input_id, 1)::flat_composition_item
    );

    RETURN flats;
  END IF;

  -- Product is composite.
  FOR child IN
    SELECT pc.child_id AS id, pc.total_qty AS qty
    FROM "product_compositions" AS pc
    WHERE pc.parent_id = product_input_id
  LOOP
    found_any := true;

    FOR child_flat IN
      SELECT * FROM UNNEST(get_flat_composition(child.id))
    LOOP
      flats := array_append(
        flats,
        ROW(
          child_flat.product_id::UUID, 
          (child_flat.used_qty * child.qty)::INTEGER
        )::flat_composition_item
      );
    END LOOP;
  END LOOP;

  -- A Composition must have at least one Child.
  IF NOT found_any THEN
    RAISE EXCEPTION 'Product % has no Childs.', product_input_id;
  END IF;

  RETURN flats;
END;
$$ LANGUAGE plpgsql;