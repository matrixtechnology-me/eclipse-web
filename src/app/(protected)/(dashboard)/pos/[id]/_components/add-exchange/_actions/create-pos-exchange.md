## [en] Use Case - POS Exchange

### 1. Retrieve the Sale
- Throw an error if it does not exist.

## 2. For each returned product
- If the returned quantity is **less than or equal to zero**, throw an error.
- Retrieve the related **Sale Product**; throw an error if it does not exist.
- Restore units in **Stock** according to **Lot Restorations**.
- For each **Restoration**, update the **Stock Lot Usages**:
  - Retrieve the **Stock Lot Usage**; throw an error if it does not exist.
  - Validate the returned quantity; throw an error if invalid.
  - Update the **Stock Lot Usage**:
    - **Decrease** if partially returned; or
    - **Delete** from the Sale Product if fully returned.
- Update the **Sale Product**:
  - **Decrease** if partially returned; or
  - **Delete** from the Sale if fully returned.

## 3. For each taken product
- If the taken quantity is **less than or equal to zero**, throw an error.
- Retrieve the **Product** in the **Tenant**; throw an error if it does not exist.
- Decrease units from **Stock**.
- Update the **Sale Product**:
  - If it is being **incremented** (already exists in the Sale):
    - Increase the quantity of the Sale Product.
    - Update the sale price of the Sale Product.
    - Create **Stock Lot Usages** and link them to the Sale Product.
  - If it is being **added**:
    - Create a new Sale Product.
    - Create **Stock Lot Usages** and link them to the Sale Product.

## 4. For each movement
- If the amount is **less than or equal to zero**, throw an error.
- Create a **Sale Movement**.

## 5. Update the Sale
- Calculate the new **total paid**.
- Calculate the new **gross total**.
- Calculate the new **estimated total**, applying the discount.
- Save the above fields and the discount fields.

## 6. Create a POS Event
- **Type:** `"exchange"`
- **Status:** `"processed"`

## 7. Create a POS Event Exchange
- Link it **1:1** with the created POS Event.
- Create child entities:
  - **Pos Event Exchange Returns**
    - **Lot Restorations**
  - **Pos Event Exchange Replacements**
  - **Pos Event Exchange Movements**

## [ End of Use Case ]
<br />

## [pt-BR] Caso de Uso - Troca de PDV

### 1. Buscar a Venda
- Lance erro se não existir.

### 2. Para cada produto retornado
- Se a quantidade retornada for **menor ou igual a zero**, lance erro.
- Obtenha o **Produto de Venda** relacionado; lance erro se não existir.
- Restaure as unidades no **Estoque** de acordo com as **Restaurações de Lote**.
- Para cada **Restauração**, atualize os **Usos de Lotes de Estoque**:
  - Busque o **Uso de Lote de Estoque**; lance erro se não existir.
  - Valide a quantidade devolvida; lance erro se for inválida.
  - Atualize o **Uso de Lote de Estoque**:
    - **Decremente** se for retornado parcialmente; ou
    - **Delete** o **Produto de Venda** se for retornado integralmente.
- Atualize o **Produto de Venda**:
  - **Decremente** se for retornado parcialmente; ou
  - **Delete** a **Venda** se for retornado integralmente.

### 3. Para cada produto levado
- Se a quantidade levada for **menor ou igual a zero**, lance erro.
- Busque o **Produto** no **Estabelecimento**; lance erro se não existir.
- Decremente as unidades do **Estoque**.
- Atualize o **Produto de Venda**:
  - Se estiver sendo **incrementado** (ou seja, já existe na Venda):
    - Incremente a quantidade do Produto de Venda.
    - Atualize o preço de venda do Produto de Venda.
    - Crie **Usos de Lotes de Estoque** e relacione-os ao Produto de Venda.
  - Se estiver sendo **adicionado**:
    - Crie um novo Produto de Venda.
    - Crie **Usos de Lotes de Estoque** e relacione-os ao Produto de Venda.

### 4. Para Cada Movimentação
- Se o valor for **menor ou igual a zero**, lance erro.
- Crie uma **Movimentação de Venda**.

### 5. Atualizar a Venda
- Calcule o novo **total pago**.
- Calcule o novo **total bruto**.
- Calcule o novo **total estimado**, com aplicação de desconto.
- Salve os campos acima e os de desconto.

### 6. Criar um Evento de PDV
- **Tipo:** `"troca"`
- **Status:** `"processado"`

### 7. Criar um Evento de Troca de PDV
- Relacione **1:1** com o Evento de PDV criado.
- Crie entidades filhas:
  - **Pos Event Exchange Returns**
    - **Lot Restorations**
  - **Pos Event Exchange Replacements**
  - **Pos Event Exchange Movements**

## [ Fim do Caso de Uso ]