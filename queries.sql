SELECT name
FROM sqlite_master
WHERE type = 'table';
-- ========================================
-- USUARIOS
-- ========================================
SELECT *
FROM User;
SELECT id,
    name,
    email,
    role,
    isActive
FROM User;
SELECT *
FROM User
WHERE role = 'admin';
SELECT *
FROM User
WHERE isActive = 1;
-- ========================================
-- PRODUCTOS
-- ========================================
SELECT *
FROM Product;
SELECT *
FROM Product
WHERE available = 1;
SELECT *
FROM Product
WHERE price > 10;
SELECT p.*,
    u.name AS vendedor
FROM Product p
    LEFT JOIN User u ON p.userId = u.id;
-- ========================================
-- ÓRDENES
-- ========================================
SELECT *
FROM "Order";
SELECT o.id,
    o.totalAmount,
    o.status,
    o.createdAt,
    u.name AS cliente
FROM "Order" o
    JOIN User u ON o.userId = u.id;
SELECT *
FROM "Order"
WHERE status = 'pending';
SELECT *
FROM "Order"
WHERE status = 'completed';
-- ========================================
-- ITEMS DE ÓRDENES
-- ========================================
SELECT *
FROM OrderItem;
SELECT oi.id,
    p.name AS producto,
    oi.quantity,
    oi.priceAtPurchase,
    o.id AS ordenId
FROM OrderItem oi
    JOIN Product p ON oi.productId = p.id
    JOIN "Order" o ON oi.orderId = o.id;
-- ========================================
-- CONVERSACIONES
-- ========================================
SELECT *
FROM Conversation;
SELECT c.*,
    u.name AS usuario
FROM Conversation c
    LEFT JOIN User u ON c.userId = u.id;
SELECT *
FROM Conversation
WHERE status = 'open';
-- ========================================
-- MENSAJES
-- ========================================
SELECT *
FROM Message;
SELECT m.id,
    m.content,
    m.senderRole,
    m.createdAt,
    u.name AS usuario,
    c.subject AS conversacion
FROM Message m
    LEFT JOIN User u ON m.userId = u.id
    JOIN Conversation c ON m.conversationId = c.id
ORDER BY m.createdAt DESC;
-- Mensajes de una conversación específica (cambiar el ID)
SELECT *
FROM Message
WHERE conversationId = 1
ORDER BY createdAt ASC;
-- ========================================
-- NOTIFICACIONES
-- ========================================
SELECT *
FROM Notification;
SELECT n.*,
    u.name AS usuario
FROM Notification n
    JOIN User u ON n.userId = u.id;
SELECT *
FROM Notification
WHERE read = 0;
-- ========================================
-- CONSULTAS ÚTILES (RESUMEN)
-- ========================================
-- Contar registros por tabla
SELECT 'User' AS tabla,
    COUNT(*) AS total
FROM User
UNION ALL
SELECT 'Product',
    COUNT(*)
FROM Product
UNION ALL
SELECT 'Order',
    COUNT(*)
FROM "Order"
UNION ALL
SELECT 'OrderItem',
    COUNT(*)
FROM OrderItem
UNION ALL
SELECT 'Conversation',
    COUNT(*)
FROM Conversation
UNION ALL
SELECT 'Message',
    COUNT(*)
FROM Message
UNION ALL
SELECT 'Notification',
    COUNT(*)
FROM Notification;
-- Total de ventas por usuario
SELECT u.name,
    COUNT(o.id) AS num_ordenes,
    SUM(o.totalAmount) AS total_gastado
FROM "Order" o
    JOIN User u ON o.userId = u.id
GROUP BY u.id;
-- Productos más vendidos
SELECT p.name,
    SUM(oi.quantity) AS total_vendido
FROM OrderItem oi
    JOIN Product p ON oi.productId = p.id
GROUP BY p.id
ORDER BY total_vendido DESC;