# Data Model Draft

## Tenants

### Tenant

- `id`
- `name`
- `slug`
- `country`
- `city`
- `currency`
- `is_active`
- `created_at`
- `updated_at`

### StorefrontSettings

- `id`
- `tenant`
- `brand_name`
- `tagline`
- `primary_phone`
- `whatsapp_phone`
- `is_storefront_enabled`
- `responsible_drinking_message`
- `created_at`
- `updated_at`

### OperatingSchedule

- `id`
- `tenant`
- `weekday`
- `opens_at`
- `closes_at`
- `accepts_orders`
- `notes`

## Products

### Category

- `id`
- `tenant`
- `name`
- `slug`
- `description`
- `display_order`
- `is_active`
- `created_at`
- `updated_at`

### Product

- `id`
- `tenant`
- `category`
- `name`
- `slug`
- `description`
- `base_price`
- `image`
- `alcohol_percentage_note`
- `servings`
- `is_alcoholic`
- `is_active`
- `display_order`
- `created_at`
- `updated_at`

### ProductVariant

- `id`
- `product`
- `name`
- `servings`
- `price`
- `is_active`
- `display_order`
- `created_at`
- `updated_at`

## Customers And Orders

### Customer

- `id`
- `full_name`
- `phone`
- `email`
- `created_at`
- `updated_at`

### Address

- `id`
- `customer`
- `address_line`
- `building_details`
- `city`
- `delivery_notes`
- `created_at`
- `updated_at`

### Order

- `id`
- `tenant`
- `customer`
- `address`
- `order_code`
- `status`
- `scheduled_date`
- `scheduled_time_window`
- `delivery_zone`
- `subtotal`
- `delivery_fee`
- `total`
- `payment_method`
- `payment_status`
- `customer_notes`
- `age_confirmed_by_customer`
- `terms_accepted`
- `created_at`
- `updated_at`

### OrderItem

- `id`
- `order`
- `product`
- `variant`
- `quantity`
- `unit_price`
- `total_price`
- `created_at`

### OrderStatusHistory

- `id`
- `order`
- `previous_status`
- `new_status`
- `changed_by`
- `note`
- `created_at`

## Delivery

### DeliveryZone

- `id`
- `tenant`
- `name`
- `city`
- `base_fee`
- `minimum_order_amount`
- `is_active`
- `created_at`
- `updated_at`

## Payments

### PaymentRecord

- `id`
- `order`
- `method`
- `status`
- `amount`
- `reference`
- `notes`
- `confirmed_at`
- `created_at`
- `updated_at`

## Compliance

### DeliveryVerification

- `id`
- `order`
- `receiver_name`
- `receiver_document_checked`
- `receiver_is_adult`
- `verified_by`
- `verification_notes`
- `delivered_at`
- `created_at`

### ComplianceEvent

- `id`
- `order`
- `event_type`
- `notes`
- `created_at`

## Notifications

### NotificationLog

- `id`
- `order`
- `channel`
- `destination`
- `message_type`
- `status`
- `created_at`
